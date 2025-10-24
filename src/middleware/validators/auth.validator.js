const { checkSchema } = require('express-validator');
const { schemas } = require('../validate');

/**
 * Validation schemas for authentication
 */

// Register validation
const registerSchema = checkSchema({
  email: {
    in: ['body'],
    trim: true,
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    normalizeEmail: true,
  },
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
  password: {
    in: ['body'],
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]+$/,
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_-#)',
    },
  },
  phone: {
    in: ['body'],
    optional: true,
    trim: true,
    matches: {
      options: /^\+?[1-9]\d{1,14}$/,
      errorMessage: 'Invalid phone number format',
    },
  },
  
  postcode: {
    in: ['body'],
    optional: true,
    trim: true,
    matches: {
      options: /^\d{5}$/,
      errorMessage: 'Postcode must be 5 digits',
    },
  },

  accountType: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['PRIVAT', 'GEWERBLICH']],
      errorMessage: 'Account type must be PRIVAT or GEWERBLICH',
    },
  },

  legalForm: {
    in: ['body'],
    optional: true,
    trim: true,
    custom: {
      options: (value, { req }) => {
        // Legal form is required for GEWERBLICH accounts
        if (req.body.accountType === 'GEWERBLICH' && !value) {
          throw new Error('Legal form is required for business accounts');
        }
        return true;
      },
    },
  },

  industry: {
    in: ['body'],
    optional: true,
    trim: true,
    custom: {
      options: (value, { req }) => {
        // Industry is required for GEWERBLICH accounts
        if (req.body.accountType === 'GEWERBLICH' && !value) {
          throw new Error('Industry is required for business accounts');
        }
        return true;
      },
    },
  },

  companyName: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Company name must be between 2 and 100 characters',
    },
  },

  termsAccepted: {
    in: ['body'],
    custom: {
      options: (value) => {
        const val = value === 'true' || value === true;
        if (!val) {
          throw new Error('You must accept the terms and conditions');
        }
        return true;
      },
    },
  },

  privacyAccepted: {
    in: ['body'],
    custom: {
      options: (value) => {
        const val = value === 'true' || value === true;
        if (!val) {
          throw new Error('You must accept the privacy policy');
        }
        return true;
      },
    },
  },
});

// Login validation
const loginSchema = checkSchema({
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Email is required',
    },
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    normalizeEmail: true,
  },

  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
});

// Forgot password validation
const forgotPasswordSchema = checkSchema({
  ...schemas.email,
});

// Reset password validation
const resetPasswordSchema = checkSchema({
  token: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Reset token is required',
    },
    trim: true,
  },

  newPassword: {
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

  confirmPassword: {
    in: ['body'],
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      },
    },
  },
});

// Verify email validation
const verifyEmailSchema = checkSchema({
  token: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Verification token is required',
    },
    trim: true,
  },
});

// Refresh token validation
const refreshTokenSchema = checkSchema({
  refreshToken: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Refresh token is required',
    },
    trim: true,
  },
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  refreshTokenSchema,
};
