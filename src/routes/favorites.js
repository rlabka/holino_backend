const express = require('express');
const { authenticate } = require('../middleware/auth');
const FavoriteController = require('../controllers/favorite.controller');

const router = express.Router();

/**
 * GET /api/v1/favorites/top?limit=10
 * Get top favorited services (public endpoint, no auth required)
 */
router.get('/top', FavoriteController.getTopFavorited);

/**
 * GET /api/v1/favorites/:serviceId/count
 * Get total favorites count for a specific service (public endpoint)
 */
router.get('/:serviceId/count', FavoriteController.getServiceFavoritesCount);

// Middleware: All routes below require authentication
router.use(authenticate);

/**
 * POST /api/v1/favorites/:serviceId
 * Add a service to user's favorites
 */
router.post('/:serviceId', FavoriteController.addFavorite);

/**
 * DELETE /api/v1/favorites/:serviceId
 * Remove a service from user's favorites
 */
router.delete('/:serviceId', FavoriteController.removeFavorite);

/**
 * POST /api/v1/favorites/:serviceId/toggle
 * Toggle favorite status (add if not favorited, remove if already favorited)
 */
router.post('/:serviceId/toggle', FavoriteController.toggleFavorite);

/**
 * GET /api/v1/favorites
 * Get user's all favorites with pagination
 */
router.get('/', FavoriteController.getUserFavorites);

/**
 * GET /api/v1/favorites/:serviceId/is-favorited
 * Check if a service is favorited by the current user
 */
router.get('/:serviceId/is-favorited', FavoriteController.isFavorited);


module.exports = router;
