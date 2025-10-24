const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/response');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const { asyncHandler } = require('./errorHandler');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Verify token
  const decoded = AuthService.verifyAccessToken(token);

  // Attach user info to request
  req.user = decoded;

  next();
});

/**
 * Check if user is authenticated (optional - doesn't throw error)
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = AuthService.verifyAccessToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }

  next();
});

/**
 * Check if user has specific account type
 */
const requireAccountType = (...accountTypes) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!accountTypes.includes(req.user.accountType)) {
      throw new AuthorizationError(
        `This action requires ${accountTypes.join(' or ')} account`
      );
    }

    next();
  });
};

/**
 * Check if user owns the resource
 */
const requireOwnership = (userIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const resourceUserId = req.params[userIdParam] || req.body.userId;

    if (resourceUserId !== req.user.userId) {
      throw new AuthorizationError('You can only access your own resources');
    }

    next();
  });
};

/**
 * Check if user is admin
 */
const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.role !== 'ADMIN') {
    throw new AuthorizationError('Admin access required');
  }

  next();
});

/**
 * Check if user is admin or moderator
 */
const requireModerator = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
    throw new AuthorizationError('Moderator or admin access required');
  }

  next();
});

/**
 * Check if user is owner or admin
 */
const requireOwnerOrAdmin = (userIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const resourceUserId = req.params[userIdParam] || req.body.userId;

    // Allow if admin or owner
    if (req.user.role === 'ADMIN' || resourceUserId === req.user.userId) {
      return next();
    }

    throw new AuthorizationError('You can only access your own resources');
  });
};

module.exports = {
  authenticate,
  optionalAuth,
  requireAccountType,
  requireOwnership,
  requireAdmin,
  requireModerator,
  requireOwnerOrAdmin,
};
