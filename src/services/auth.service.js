const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const config = require('../config');
const { 
  AuthenticationError, 
  ConflictError, 
  NotFoundError,
  ValidationError 
} = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Generate verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Normalize email address (especially for Gmail)
 * Gmail ignores dots in username part and anything after +
 * e.mail@gmail.com = email@gmail.com
 * email+test@gmail.com = email@gmail.com
 */
const normalizeEmail = (email) => {
  const [localPart, domain] = email.toLowerCase().trim().split('@');
  
  if (!domain) return email.toLowerCase().trim();
  
  // For Gmail, Googlemail - remove dots and + aliases
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Remove dots
    let normalized = localPart.replace(/\./g, '');
    // Remove everything after +
    normalized = normalized.split('+')[0];
    return `${normalized}@${domain}`;
  }
  
  // For other providers, just lowercase
  return email.toLowerCase().trim();
};

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Register new user
   */
  static async register(userData) {
    try {
      // Validate required fields
      if (!userData.email || !userData.username || !userData.name || !userData.password) {
        throw new ValidationError('Email, username, name, and password are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new ValidationError('Invalid email format');
      }

      // Normalize email (especially for Gmail)
      const normalizedEmail = normalizeEmail(userData.email);

      // Validate password strength
      if (userData.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
      }
      
      // Password must contain at least one uppercase, one lowercase, one number, and one special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]+$/;
      if (!passwordRegex.test(userData.password)) {
        throw new ValidationError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_-#)');
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(userData.username)) {
        throw new ValidationError('Username must be 3-30 characters and contain only letters, numbers, and underscores');
      }

      // Check if email already exists (using normalized email)
      const existingEmail = await User.findByEmail(normalizedEmail);
      if (existingEmail) {
        throw new ConflictError('Email already registered');
      }

      // Check if username already exists
      const existingUsername = await User.findByUsername(userData.username);
      if (existingUsername) {
        throw new ConflictError('Username already taken');
      }

      // Validate GEWERBLICH specific fields
      if (userData.accountType === 'GEWERBLICH') {
        if (!userData.legalForm) {
          throw new ValidationError('Legal form is required for business accounts');
        }
        if (!userData.industry) {
          throw new ValidationError('Industry is required for business accounts');
        }
      }

      // Generate verification token
      const verificationToken = generateVerificationToken();

      // Sanitize and prepare data
      const sanitizedData = {
        email: normalizedEmail,
        username: userData.username.trim(),
        name: userData.name.trim(),
        phone: userData.phone?.trim(),
        postcode: userData.postcode?.trim(),
        accountType: userData.accountType || 'PRIVAT',
        legalForm: userData.legalForm?.trim(),
        industry: userData.industry?.trim(),
        companyName: userData.companyName?.trim(),
        businessDocuments: userData.businessDocuments || [],
        password: userData.password,
        verificationToken: verificationToken,
      };

      // Create user
      const user = await User.create(sanitizedData);

      // Generate tokens
      const tokens = this.generateTokens(user);

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      // TODO: Send verification email
      // For now, we return the token in the response (in production, send via email)
      const verificationUrl = `${config.urls.frontend}/verify-email?token=${verificationToken}`;
      
      logger.info('Verification email would be sent', { 
        email: user.email, 
        verificationUrl 
      });

      return {
        user,
        ...tokens,
        verificationToken, // TODO: Remove this in production, send via email instead
        verificationUrl,   // TODO: Remove this in production
        message: 'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      logger.error('Registration error', { error: error.message });
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Normalize email (especially for Gmail)
      email = normalizeEmail(email);

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Check if user is banned
      if (user.isBanned) {
        throw new AuthenticationError('Account is banned');
      }

      // Verify password
      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      return {
        user: userWithoutPassword,
        ...tokens,
      };
    } catch (error) {
      logger.error('Login error', { error: error.message });
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('Invalid refresh token');
      }

      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      return tokens;
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Invalid or expired refresh token');
      }
      logger.error('Refresh token error', { error: error.message });
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not
        logger.info('Password reset requested for non-existent email', { email });
        return { message: 'If the email exists, a reset link has been sent' };
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, type: 'reset_password' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // TODO: Send email with reset link
      // await EmailService.sendPasswordResetEmail(user.email, resetToken);

      logger.info('Password reset requested', { userId: user.id, email: user.email });

      return {
        message: 'Password reset email sent',
        resetToken, // TODO: Remove this in production, only for development
      };
    } catch (error) {
      logger.error('Password reset request error', { error: error.message });
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(resetToken, newPassword) {
    try {
      // Verify reset token
      const decoded = jwt.verify(resetToken, config.jwt.secret);

      if (decoded.type !== 'reset_password') {
        throw new AuthenticationError('Invalid reset token');
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new NotFoundError('User');
      }

      // Update password (will be hashed in User model)
      await User.update(user.id, { password: newPassword });

      logger.info('Password reset successfully', { userId: user.id });

      return { message: 'Password reset successful' };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Invalid or expired reset token');
      }
      logger.error('Password reset error', { error: error.message });
      throw error;
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token) {
    try {
      // Find user by verification token
      const user = await User.findByVerificationToken(token);
      
      if (!user) {
        throw new NotFoundError('Invalid verification token');
      }

      // Check if already verified
      if (user.emailVerified && user.isActive) {
        return { 
          message: 'Email already verified',
          alreadyVerified: true,
          user 
        };
      }

      // Verify email and activate account
      const verifiedUser = await User.verifyEmail(token);

      logger.info('Email verified and account activated', { 
        userId: verifiedUser.id, 
        email: verifiedUser.email 
      });

      return {
        message: 'Email verified successfully. Your account is now active.',
        user: verifiedUser,
        alreadyVerified: false
      };
    } catch (error) {
      logger.error('Email verification error', { error: error.message });
      throw error;
    }
  }

  /**
   * Send verification email
   */
  static async sendVerificationEmail(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User');
      }

      // Generate verification token
      const verificationToken = jwt.sign(
        { userId: user.id, type: 'verify_email' },
        config.jwt.secret,
        { expiresIn: '24h' }
      );

      // TODO: Send email
      // await EmailService.sendVerificationEmail(user.email, verificationToken);

      logger.info('Verification email sent', { userId: user.id });

      return {
        message: 'Verification email sent',
        verificationToken, // TODO: Remove in production
      };
    } catch (error) {
      logger.error('Send verification email error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   */
  static generateTokens(user) {
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn,
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }
}

module.exports = AuthService;
