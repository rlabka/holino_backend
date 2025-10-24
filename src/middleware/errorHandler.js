const { AppError } = require('../utils/errors');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Handle Prisma errors
  if (err.code) {
    return handlePrismaError(err, res);
  }

  // Handle operational errors
  if (err instanceof AppError && err.isOperational) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.errors || null
    );
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return ApiResponse.validationError(res, err.errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expired');
  }

  // Handle Multer errors (file upload)
  if (err.name === 'MulterError') {
    return handleMulterError(err, res);
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message =
    config.server.env === 'development'
      ? err.message
      : 'Internal server error';

  return ApiResponse.error(res, message, statusCode);
};

/**
 * Handle Prisma-specific errors
 */
const handlePrismaError = (err, res) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target?.[0] || 'field';
      return ApiResponse.error(
        res,
        `${field} already exists`,
        409
      );

    case 'P2025':
      // Record not found
      return ApiResponse.notFound(res, 'Record');

    case 'P2003':
      // Foreign key constraint violation
      return ApiResponse.error(
        res,
        'Related record not found',
        400
      );

    case 'P2014':
      // Required relation violation
      return ApiResponse.error(
        res,
        'Invalid relationship',
        400
      );

    default:
      logger.error('Unhandled Prisma error', { code: err.code, meta: err.meta });
      return ApiResponse.error(
        res,
        'Database operation failed',
        500
      );
  }
};

/**
 * Handle Multer-specific errors
 */
const handleMulterError = (err, res) => {
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      return ApiResponse.error(
        res,
        'File size exceeds the maximum allowed size',
        400
      );

    case 'LIMIT_FILE_COUNT':
      return ApiResponse.error(
        res,
        'Too many files uploaded',
        400
      );

    case 'LIMIT_UNEXPECTED_FILE':
      return ApiResponse.error(
        res,
        'Unexpected field in file upload',
        400
      );

    default:
      return ApiResponse.error(
        res,
        'File upload failed',
        400
      );
  }
};

/**
 * Handle 404 errors (route not found)
 */
const notFoundHandler = (req, res) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl}`);
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
