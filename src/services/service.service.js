const axios = require('axios');
const Service = require('../models/Service');
const { ValidationError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');
const { containsProhibitedWords } = require('../config/wordlist');

// Initialize bad-words Filter with dynamic import wrapper
let Filter = null;

/**
 * Get Filter instance - initialize on first use
 */
async function getFilter() {
  if (Filter) {
    return Filter;
  }
  try {
    const BadWordsModule = await import('bad-words');
    Filter = new BadWordsModule.Filter();
    logger.info('bad-words Filter initialized');
  } catch (error) {
    logger.warn('bad-words Filter not available, using custom filter only', {
      error: error.message,
    });
    Filter = null; // Mark as tried but failed
  }
  return Filter;
}

// Initialize on module load
getFilter().catch(err => {
  logger.warn('Failed to initialize bad-words Filter on startup', { error: err.message });
});

/**
 * Photon API Service for Geocoding
 */
class PhotonService {
  static API_URL = 'https://photon.komoot.io';

  /**
   * Geocode address to coordinates
   */
  static async geocode(address) {
    try {
      const response = await axios.get(`${this.API_URL}/api`, {
        params: {
          q: address,
          limit: 1,
        },
      });

      if (!response.data.features || response.data.features.length === 0) {
        throw new ValidationError('Address not found');
      }

      const feature = response.data.features[0];
      const coordinates = feature.geometry.coordinates;

      return {
        latitude: coordinates[1],
        longitude: coordinates[0],
        address: feature.properties.name || address,
        fullAddress: this.formatAddress(feature.properties),
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ValidationError('Address not found');
      }
      logger.error('Photon geocoding error', { error: error.message });
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  static async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get(`${this.API_URL}/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          limit: 1,
        },
      });

      if (!response.data.features || response.data.features.length === 0) {
        return {
          latitude,
          longitude,
          address: `${latitude}, ${longitude}`,
        };
      }

      const feature = response.data.features[0];
      return {
        latitude,
        longitude,
        address: feature.properties.name || `${latitude}, ${longitude}`,
        fullAddress: this.formatAddress(feature.properties),
      };
    } catch (error) {
      logger.error('Photon reverse geocoding error', { error: error.message });
      throw new Error(`Reverse geocoding failed: ${error.message}`);
    }
  }

  /**
   * Format address from Photon properties
   */
  static formatAddress(properties) {
    const parts = [];
    if (properties.name) parts.push(properties.name);
    if (properties.street) parts.push(properties.street);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);
    if (properties.country) parts.push(properties.country);
    return parts.filter(Boolean).join(', ');
  }
}

/**
 * Service Business Logic
 */
class ServiceService {
  /**
   * Create a new service
   */
  static async createService(userId, serviceData) {
    try {
      // Validate required fields
      await this.validateServiceData(serviceData);

      // Geocode the address
      const coordinates = await PhotonService.geocode(serviceData.location);

      // Create service with coordinates
      const servicePayload = {
        ...serviceData,
        userId,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        location: coordinates.fullAddress,
      };

      const service = await Service.create(servicePayload);

      // Add availability if provided
      if (serviceData.availability && Array.isArray(serviceData.availability)) {
        for (const avail of serviceData.availability) {
          await Service.addAvailability(service.id, avail);
        }
      }

      logger.info('Service created successfully', { serviceId: service.id, userId });
      return service;
    } catch (error) {
      logger.error('Service creation error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get service details
   */
  static async getService(serviceId) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new NotFoundError('Service');
      }
      return service;
    } catch (error) {
      logger.error('Get service error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get user services
   */
  static async getUserServices(userId, page = 1, limit = 10) {
    try {
      return await Service.findByUserId(userId, page, limit);
    } catch (error) {
      logger.error('Get user services error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get services by category
   */
  static async getServicesByCategory(category, page = 1, limit = 10) {
    try {
      return await Service.findByCategory(category, page, limit);
    } catch (error) {
      logger.error('Get services by category error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get services by distance (within radius)
   */
  static async getServicesByDistance(latitude, longitude, radiusKm = 25, page = 1, limit = 10) {
    try {
      const R = 6371; // Earth's radius in km
      const lat1 = latitude * (Math.PI / 180);
      const lon1 = longitude * (Math.PI / 180);

      // Get all active services
      const allServices = await Service.findAll(1, 1000);

      // Filter by distance
      const nearbyServices = allServices.services.filter(service => {
        if (!service.latitude || !service.longitude) return false;

        const lat2 = service.latitude * (Math.PI / 180);
        const lon2 = service.longitude * (Math.PI / 180);
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance <= radiusKm;
      });

      // Paginate results
      const skip = (page - 1) * limit;
      const paginatedServices = nearbyServices.slice(skip, skip + limit);

      return {
        services: paginatedServices,
        pagination: {
          page,
          limit,
          total: nearbyServices.length,
          totalPages: Math.ceil(nearbyServices.length / limit),
        },
      };
    } catch (error) {
      logger.error('Get services by distance error', { error: error.message });
      throw error;
    }
  }

  /**
   * Update service
   */
  static async updateService(serviceId, userId, updateData) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new NotFoundError('Service');
      }

      // Check ownership
      if (service.userId !== userId) {
        throw new Error('Unauthorized: You can only update your own services');
      }

      // If location changed, re-geocode
      if (updateData.location && updateData.location !== service.location) {
        const coordinates = await PhotonService.geocode(updateData.location);
        updateData.latitude = coordinates.latitude;
        updateData.longitude = coordinates.longitude;
        updateData.location = coordinates.fullAddress;
      }

      const updatedService = await Service.update(serviceId, updateData);
      logger.info('Service updated successfully', { serviceId });
      return updatedService;
    } catch (error) {
      logger.error('Update service error', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete service
   */
  static async deleteService(serviceId, userId) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new NotFoundError('Service');
      }

      // Check ownership
      if (service.userId !== userId) {
        throw new Error('Unauthorized: You can only delete your own services');
      }

      await Service.delete(serviceId);
      logger.info('Service deleted successfully', { serviceId });
    } catch (error) {
      logger.error('Delete service error', { error: error.message });
      throw error;
    }
  }

  /**
   * Search services by keyword or language
   */
  static async searchServices(query, page = 1, limit = 10) {
    try {
      const filters = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { keywords: { has: query } },
        ],
      };

      return await Service.findAll(page, limit, filters);
    } catch (error) {
      logger.error('Search services error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get location autocomplete suggestions from Photon API
   */
  static async getLocationAutocomplete(query, limit = 10) {
    try {
      if (!query || !query.trim()) {
        throw new ValidationError('Location query is required');
      }

      const response = await axios.get(`${PhotonService.API_URL}/api`, {
        params: {
          q: query.trim(),
          limit: Math.min(limit, 10),
        },
      });

      if (!response.data.features) {
        return [];
      }

      // Extract and format suggestions
      const suggestions = response.data.features.map(feature => ({
        name: feature.properties.name || query,
        city: feature.properties.city || '',
        state: feature.properties.state || '',
        country: feature.properties.country || '',
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        fullAddress: PhotonService.formatAddress(feature.properties),
      }));

      return suggestions;
    } catch (error) {
      logger.error('Location autocomplete error', { error: error.message });
      throw new Error(`Location autocomplete failed: ${error.message}`);
    }
  }

  /**
   * Validate service data
   */
  static async validateServiceData(data) {
    if (!data.title || !data.title.trim()) {
      throw new ValidationError('Service title is required');
    }

    if (!data.description || !data.description.trim()) {
      throw new ValidationError('Service description is required');
    }

    // Content filter: Check for inappropriate language or illegal content
    const hasProhibited = await this.containsProhibitedContent(data.description);
    if (hasProhibited) {
      throw new ValidationError('Description contains prohibited content or inappropriate language');
    }

    if (!data.category || !data.category.trim()) {
      throw new ValidationError('Service category is required');
    }

    if (!data.location || !data.location.trim()) {
      throw new ValidationError('Service location is required');
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new ValidationError('Service price must be a positive number');
    }

    if (data.distanceLimit && (typeof data.distanceLimit !== 'number' || data.distanceLimit <= 0)) {
      throw new ValidationError('Distance limit must be a positive number');
    }

    if (!Array.isArray(data.languages) || data.languages.length === 0) {
      throw new ValidationError('At least one language is required');
    }

    if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
      throw new ValidationError('At least one keyword is required');
    }
  }

  /**
   * Check if text contains prohibited content
   */
  static async containsProhibitedContent(text) {
    try {
      const filter = await getFilter();
      // Check 1: Profanity and inappropriate language using bad-words library
      if (filter && filter.isProfane(text)) {
        return true;
      }

      // Check 2: Custom blacklist for illegal services and content
      if (containsProhibitedWords(text)) {
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error in content filter', { error: error.message });
      // If filtering fails, allow the content through but log the error
      return false;
    }
  }
}

module.exports = {
  ServiceService,
  PhotonService,
};
