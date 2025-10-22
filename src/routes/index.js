const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Holino API v1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      health: '/health'
    },
    documentation: 'https://github.com/yourusername/holino_backend'
  });
});

module.exports = router;
