const Favorite = require('../models/Favorite');
const logger = require('../utils/logger');
const { ValidationError, NotFoundError } = require('../utils/errors');

/**
 * Favorite Service - Business Logic
 */
class FavoriteService {
  /**
   * Add a service to user's favorites
   */
  static async addFavorite(userId, serviceId) {
    try {
      if (!userId || !serviceId) {
        throw new ValidationError('User ID and Service ID are required');
      }

      const favorite = await Favorite.add(userId, serviceId);

      logger.info('Service added to favorites', {
        userId,
        serviceId,
        favoriteId: favorite.id,
      });

      return favorite;
    } catch (error) {
      logger.error('Add favorite error', { error: error.message, userId, serviceId });
      throw error;
    }
  }

  /**
   * Remove a service from user's favorites
   */
  static async removeFavorite(userId, serviceId) {
    try {
      if (!userId || !serviceId) {
        throw new ValidationError('User ID and Service ID are required');
      }

      await Favorite.remove(userId, serviceId);

      logger.info('Service removed from favorites', { userId, serviceId });

      return { message: 'Service removed from favorites successfully' };
    } catch (error) {
      logger.error('Remove favorite error', { error: error.message, userId, serviceId });
      throw error;
    }
  }

  /**
   * Get all favorites for a user
   */
  static async getUserFavorites(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const result = await Favorite.findByUserId(userId, page, limit);

      logger.info('Favorites retrieved', { userId, count: result.favorites.length });

      return result;
    } catch (error) {
      logger.error('Get user favorites error', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Check if a service is favorited by a user
   */
  static async isFavorited(userId, serviceId) {
    try {
      if (!userId || !serviceId) {
        throw new ValidationError('User ID and Service ID are required');
      }

      return await Favorite.isFavorited(userId, serviceId);
    } catch (error) {
      logger.error('Check favorite error', { error: error.message, userId, serviceId });
      throw error;
    }
  }

  /**
   * Get favorites count for a service
   */
  static async getServiceFavoritesCount(serviceId) {
    try {
      if (!serviceId) {
        throw new ValidationError('Service ID is required');
      }

      return await Favorite.getServiceFavoritesCount(serviceId);
    } catch (error) {
      logger.error('Get service favorites count error', { error: error.message, serviceId });
      throw error;
    }
  }

  /**
   * Get top favorited services
   */
  static async getTopFavoritedServices(limit = 10) {
    try {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const services = await Favorite.getTopFavorited(limit);

      logger.info('Top favorited services retrieved', { count: services.length });

      return services;
    } catch (error) {
      logger.error('Get top favorited services error', { error: error.message });
      throw error;
    }
  }

  /**
   * Toggle favorite status - add if not favorited, remove if already favorited
   */
  static async toggleFavorite(userId, serviceId) {
    try {
      if (!userId || !serviceId) {
        throw new ValidationError('User ID and Service ID are required');
      }

      const isFav = await Favorite.isFavorited(userId, serviceId);

      if (isFav) {
        await Favorite.remove(userId, serviceId);
        logger.info('Service removed from favorites (toggle)', { userId, serviceId });
        return { action: 'removed', favorited: false };
      } else {
        const favorite = await Favorite.add(userId, serviceId);
        logger.info('Service added to favorites (toggle)', { userId, serviceId });
        return { action: 'added', favorited: true, favorite };
      }
    } catch (error) {
      logger.error('Toggle favorite error', { error: error.message, userId, serviceId });
      throw error;
    }
  }
}

module.exports = FavoriteService;
