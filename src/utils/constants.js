/**
 * Application-wide constants
 */

// Account Types
const ACCOUNT_TYPES = {
  PRIVAT: 'PRIVAT',
  GEWERBLICH: 'GEWERBLICH',
};

// Booking Status
const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Service Categories
const SERVICE_CATEGORIES = {
  IT: 'IT',
  DESIGN: 'Design',
  HANDCRAFT: 'Handcraft',
  HOME: 'Home',
  EVENT: 'Event',
  TRANSPORT: 'Transport',
  MARKETING: 'Marketing',
  HEALTH: 'Health',
  PETS: 'Pets',
  ART: 'Art',
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Rating Range
const RATING = {
  MIN: 1,
  MAX: 5,
};

// File Types
const FILE_TYPES = {
  IMAGE: {
    JPEG: 'image/jpeg',
    JPG: 'image/jpg',
    PNG: 'image/png',
    WEBP: 'image/webp',
  },
  DOCUMENT: {
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Token Types
const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'reset_password',
  VERIFY_EMAIL: 'verify_email',
};

// Date Formats
const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  READABLE: 'DD.MM.YYYY HH:mm',
};

// Regex Patterns
const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  POSTCODE_DE: /^\d{5}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  EMAIL_EXISTS: 'Email already registered',
  USERNAME_EXISTS: 'Username already taken',
  RESOURCE_NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  FILE_UPLOAD_ERROR: 'File upload failed',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Registration successful',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  CREATED: 'Created successfully',
  EMAIL_SENT: 'Email sent successfully',
  PASSWORD_RESET: 'Password reset successful',
};

module.exports = {
  ACCOUNT_TYPES,
  BOOKING_STATUS,
  SERVICE_CATEGORIES,
  USER_ROLES,
  RATING,
  FILE_TYPES,
  HTTP_STATUS,
  PAGINATION,
  TOKEN_TYPES,
  DATE_FORMATS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
