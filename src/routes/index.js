const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const locationRoutes = require('./location');
const serviceRoutes = require('./services');
const favoriteRoutes = require('./favorites');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/location', locationRoutes);
router.use('/services', serviceRoutes);
router.use('/favorites', favoriteRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Holino API v1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      location: '/api/v1/location',
      services: '/api/v1/services',
      favorites: '/api/v1/favorites',
      health: '/health'
    },
    features: {
      authentication: 'Login, Register, Password Reset, Email Verification',
      accountTypes: 'PRIVAT, GEWERBLICH',
      location: 'Geocoding, Reverse Geocoding, Distance Calculation',
      services: 'Create, Update, Delete, Search, Nearby Services with Photon Geocoding',
      favorites: 'Add/Remove Favorites, Get User Favorites, Toggle Favorite Status'
    },
    documentation: 'https://github.com/yourusername/holino_backend'
  });
});

module.exports = router;
