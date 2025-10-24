const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');
const ApiResponse = require('../utils/response');

/**
 * Middleware to handle validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return ApiResponse.validationError(res, formattedErrors);
  }

  next();
};

/**
 * Common validation schemas
 */
const schemas = {
  // Pagination validation
  pagination: {
    page: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Page must be a positive integer',
      },
      toInt: true,
    },
    limit: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1, max: 100 },
        errorMessage: 'Limit must be between 1 and 100',
      },
      toInt: true,
    },
  },

  // Email validation
  email: {
    email: {
      in: ['body'],
      trim: true,
      isEmail: {
        errorMessage: 'Invalid email address',
      },
      normalizeEmail: true,
    },
  },

  // Password validation
  password: {
    password: {
      in: ['body'],
      isLength: {
        options: { min: 8 },
        errorMessage: 'Password must be at least 8 characters long',
      },
      matches: {
        options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      },
    },
  },

  // Username validation
  username: {
    username: {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 3, max: 30 },
        errorMessage: 'Username must be between 3 and 30 characters',
      },
      matches: {
        options: /^[a-zA-Z0-9_]+$/,
        errorMessage: 'Username can only contain letters, numbers, and underscores',
      },
    },
  },

  // Name validation
  name: {
    name: {
      in: ['body'],
      trim: true,
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Name must be between 2 and 50 characters',
      },
      notEmpty: {
        errorMessage: 'Name is required',
      },
    },
  },

  // Phone validation
  phone: {
    phone: {
      in: ['body'],
      optional: true,
      trim: true,
      matches: {
        options: /^\+?[1-9]\d{1,14}$/,
        errorMessage: 'Invalid phone number format',
      },
    },
  },

  // ID validation (CUID)
  id: {
    id: {
      in: ['params'],
      trim: true,
      notEmpty: {
        errorMessage: 'ID is required',
      },
      isLength: {
        options: { min: 20, max: 30 },
        errorMessage: 'Invalid ID format',
      },
    },
  },
};

module.exports = {
  validate,
  schemas,
};
