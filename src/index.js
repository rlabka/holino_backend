const express = require('express');
const cors = require('cors');

// Import configuration and utilities
const config = require('./config');
const logger = require('./utils/logger');
const { connectDB, disconnectDB } = require('./config/database');

// Import middleware
const { 
  securityHeaders, 
  rateLimiter, 
  sanitizeInput, 
  corsOptions, 
  requestLogger 
} = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Trust proxy (important for rate limiting and getting real IP)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders());
app.use(cors(corsOptions));
app.use(rateLimiter());

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static(config.upload.uploadPath));

// Custom middleware
app.use(requestLogger);
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    version: config.server.apiVersion,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Holino Backend API',
    version: config.server.apiVersion,
    status: 'running',
    timestamp: new Date().toISOString(),
    documentation: `${config.urls.backend}/api/${config.server.apiVersion}`,
  });
});

// API Routes
app.use(`/api/${config.server.apiVersion}`, require('./routes'));

// 404 handler (must be after all routes)
app.use('*', notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connection established');

    // Start HTTP server
    const server = app.listen(config.server.port, () => {
      logger.info(`🚀 Holino Backend server started`, {
        port: config.server.port,
        environment: config.server.env,
        apiVersion: config.server.apiVersion,
        url: `http://localhost:${config.server.port}`,
      });
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error', { error: error.message });
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  try {
    await disconnectDB();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error: error.message });
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();

module.exports = app;