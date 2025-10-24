const FavoriteService = require('../services/favorite.service');
const ApiResponse = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError } = require('../utils/errors');

/**
 * Favorite Controller
 */
class FavoriteController {
  /**
   * Add service to favorites
   * POST /api/v1/favorites/:serviceId
   */
  static addFavorite = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const userId = req.user.userId;

    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    const favorite = await FavoriteService.addFavorite(userId, serviceId);

    ApiResponse.created(res, { favorite }, 'Service added to favorites successfully');
  });

  /**
   * Remove service from favorites
   * DELETE /api/v1/favorites/:serviceId
   */
  static removeFavorite = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const userId = req.user.userId;

    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    await FavoriteService.removeFavorite(userId, serviceId);

    ApiResponse.success(res, {}, 'Service removed from favorites successfully');
  });

  /**
   * Get user's favorites
   * GET /api/v1/favorites?page=1&limit=10
   */
  static getUserFavorites = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const result = await FavoriteService.getUserFavorites(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    ApiResponse.success(res, result, 'Favorites retrieved successfully');
  });

  /**
   * Check if service is favorited
   * GET /api/v1/favorites/:serviceId/is-favorited
   */
  static isFavorited = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const userId = req.user.userId;

    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    const isFav = await FavoriteService.isFavorited(userId, serviceId);

    ApiResponse.success(res, { favorited: isFav }, 'Favorite status retrieved');
  });

  /**
   * Get favorites count for a service
   * GET /api/v1/favorites/:serviceId/count
   */
  static getServiceFavoritesCount = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;

    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    const count = await FavoriteService.getServiceFavoritesCount(serviceId);

    ApiResponse.success(res, { count }, 'Favorites count retrieved');
  });

  /**
   * Get top favorited services
   * GET /api/v1/favorites/top?limit=10
   */
  static getTopFavorited = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const services = await FavoriteService.getTopFavoritedServices(parseInt(limit));

    ApiResponse.success(res, { services }, 'Top favorited services retrieved');
  });

  /**
   * Toggle favorite status
   * POST /api/v1/favorites/:serviceId/toggle
   */
  static toggleFavorite = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const userId = req.user.userId;

    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    const result = await FavoriteService.toggleFavorite(userId, serviceId);

    const message =
      result.action === 'added'
        ? 'Service added to favorites successfully'
        : 'Service removed from favorites successfully';

    ApiResponse.success(res, result, message);
  });
}

module.exports = FavoriteController;
