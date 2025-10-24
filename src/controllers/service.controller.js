const { ServiceService } = require('../services/service.service');
const Service = require('../models/Service');
const ApiResponse = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { getFileUrl, deleteFile } = require('../middleware/upload');
const path = require('path');
const config = require('../config');

/**
 * Service Controller
 */
class ServiceController {
  /**
   * Create a new service
   * POST /api/v1/services
   */
  static createService = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const serviceData = req.body;

    // Get uploaded images
    if (req.files && Array.isArray(req.files)) {
      serviceData.images = req.files.map(file => getFileUrl(file.path));
    }

    // Parse JSON arrays if they come as strings
    if (typeof serviceData.languages === 'string') {
      serviceData.languages = JSON.parse(serviceData.languages);
    }
    if (typeof serviceData.keywords === 'string') {
      serviceData.keywords = JSON.parse(serviceData.keywords);
    }
    if (typeof serviceData.availability === 'string') {
      serviceData.availability = JSON.parse(serviceData.availability);
    }

    const service = await ServiceService.createService(userId, serviceData);

    ApiResponse.created(res, { service }, 'Service created successfully');
  });

  /**
   * Get service by ID
   * GET /api/v1/services/:id
   */
  static getService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await ServiceService.getService(id);

    ApiResponse.success(res, { service });
  });

  /**
   * Get user's services
   * GET /api/v1/services/user/:userId
   */
  static getUserServices = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await ServiceService.getUserServices(userId, parseInt(page), parseInt(limit));

    ApiResponse.success(res, result);
  });

  /**
   * Get services by category
   * GET /api/v1/services/category/:category
   */
  static getServicesByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await ServiceService.getServicesByCategory(
      category,
      parseInt(page),
      parseInt(limit)
    );

    ApiResponse.success(res, result);
  });

  /**
   * Get services by distance
   * GET /api/v1/services/nearby?lat=X&lng=Y&radius=25
   */
  static getServicesByDistance = asyncHandler(async (req, res) => {
    const { lat, lng, radius = 25, page = 1, limit = 10 } = req.query;

    if (!lat || !lng) {
      throw new ValidationError('Latitude and longitude are required');
    }

    const result = await ServiceService.getServicesByDistance(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      parseInt(page),
      parseInt(limit)
    );

    ApiResponse.success(res, result);
  });

  /**
   * Search services
   * GET /api/v1/services/search?q=keyword
   */
  static searchServices = asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || !q.trim()) {
      throw new ValidationError('Search query is required');
    }

    const result = await ServiceService.searchServices(
      q.trim(),
      parseInt(page),
      parseInt(limit)
    );

    ApiResponse.success(res, result);
  });

  /**
   * Get all services (paginated)
   * GET /api/v1/services
   */
  static getAllServices = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await Service.findAll(parseInt(page), parseInt(limit));

    ApiResponse.success(res, result);
  });

  /**
   * Update service
   * PUT /api/v1/services/:id
   */
  static updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    // Handle new images
    if (req.files && Array.isArray(req.files)) {
      updateData.images = req.files.map(file => getFileUrl(file.path));
    }

    // Parse JSON arrays if they come as strings
    if (typeof updateData.languages === 'string') {
      updateData.languages = JSON.parse(updateData.languages);
    }
    if (typeof updateData.keywords === 'string') {
      updateData.keywords = JSON.parse(updateData.keywords);
    }

    const service = await ServiceService.updateService(id, userId, updateData);

    ApiResponse.success(res, { service }, 'Service updated successfully');
  });

  /**
   * Delete service
   * DELETE /api/v1/services/:id
   */
  static deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get service to delete images
    const service = await Service.findById(id);
    if (service && service.images) {
      for (const imageUrl of service.images) {
        const imagePath = path.join(config.upload.uploadPath, imageUrl.replace('/uploads/', ''));
        deleteFile(imagePath);
      }
    }

    await ServiceService.deleteService(id, userId);

    ApiResponse.success(res, null, 'Service deleted successfully');
  });

  /**
   * Add availability to service
   * POST /api/v1/services/:id/availability
   */
  static addAvailability = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const availabilityData = req.body;

    // Check service ownership
    const service = await Service.findById(id);
    if (!service) {
      throw new NotFoundError('Service');
    }

    if (service.userId !== userId) {
      throw new Error('Unauthorized: You can only modify your own services');
    }

    const availability = await Service.addAvailability(id, availabilityData);

    ApiResponse.created(res, { availability }, 'Availability added successfully');
  });

  /**
   * Get location autocomplete suggestions
   * GET /api/v1/services/autocomplete/location?q=Berlin&limit=10
   */
  static getLocationAutocomplete = asyncHandler(async (req, res) => {
    const { q, limit = 10 } = req.query;

    if (!q || !q.trim()) {
      throw new ValidationError('Location query (q) is required');
    }

    const suggestions = await ServiceService.getLocationAutocomplete(
      q.trim(),
      parseInt(limit)
    );

    ApiResponse.success(res, { suggestions }, 'Location suggestions');
  });

  /**
   * Get all unique values for filters
   * GET /api/v1/services/filters?type=categories
   */
  static getFilters = asyncHandler(async (req, res) => {
    const { type } = req.query;

    const filters = await ServiceService.getAllUniqueValues(type);

    ApiResponse.success(res, { filters }, 'Filter options');
  });
}

module.exports = ServiceController;
