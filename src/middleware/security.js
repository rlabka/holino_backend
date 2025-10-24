const helmet = require('helmet');
const config = require('../config');
const { RateLimitError } = require('../utils/errors');

/**
 * Security headers configuration
 */
const securityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  });
};

/**
 * Simple rate limiter middleware
 * CURRENTLY DISABLED - Can be enabled later when needed
 */
const rateLimiter = () => {
  return (req, res, next) => {
    // Rate limiting is completely disabled for now
    // TODO: Enable rate limiting when ready for production
    next();
  };

  // Original rate limiting code (commented out for future use)
  /*
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowMs = config.rateLimit.windowMs;

    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = requests.get(key);

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= config.rateLimit.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter);
      throw new RateLimitError('Too many requests, please try again later');
    }

    record.count++;
    next();
  };
  */
};

/**
 * Request sanitization - prevent XSS and injection attacks
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitize object
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
};

/**
 * Sanitize single value
 */
const sanitizeValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  // Remove potentially dangerous characters
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * CORS configuration
 * CURRENTLY ALLOWS ALL ORIGINS - Can be restricted later when needed
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow all origins for now
    // TODO: Restrict to specific origins in production
    callback(null, true);
  },
  credentials: config.cors.credentials,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
};

// Original CORS configuration (commented out for future use)
/*
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = config.cors.origin.split(',');
    
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
};
*/

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logger = require('../utils/logger');
    logger.http(req, res, duration);
  });

  next();
};

module.exports = {
  securityHeaders,
  rateLimiter,
  sanitizeInput,
  corsOptions,
  requestLogger,
};
