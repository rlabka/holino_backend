const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/service.controller');
const { authenticate } = require('../middleware/auth');
const { checkSchema } = require('express-validator');
const { schemas, validate } = require('../middleware/validate');
const { uploadMultiple } = require('../middleware/upload');

/**
 * Service Validation Schema
 */
const serviceSchemas = {
  create: {
    title: {
      in: ['body'],
      trim: true,
      notEmpty: { errorMessage: 'Title is required' },
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: 'Title must be between 3 and 100 characters',
      },
    },
    description: {
      in: ['body'],
      trim: true,
      notEmpty: { errorMessage: 'Description is required' },
      isLength: {
        options: { min: 10, max: 2000 },
        errorMessage: 'Description must be between 10 and 2000 characters',
      },
    },
    category: {
      in: ['body'],
      trim: true,
      notEmpty: { errorMessage: 'Category is required' },
    },
    location: {
      in: ['body'],
      trim: true,
      notEmpty: { errorMessage: 'Location is required' },
    },
    price: {
      in: ['body'],
      isFloat: {
        options: { min: 0.01 },
        errorMessage: 'Price must be a positive number',
      },
    },
    priceType: {
      in: ['body'],
      optional: true,
      isIn: {
        options: [['FIXED', 'HOURLY']],
        errorMessage: 'Price type must be FIXED or HOURLY',
      },
    },
    distanceLimit: {
      in: ['body'],
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Distance limit must be a positive integer',
      },
    },
  },
  update: {
    title: {
      in: ['body'],
      optional: true,
      trim: true,
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: 'Title must be between 3 and 100 characters',
      },
    },
    description: {
      in: ['body'],
      optional: true,
      trim: true,
      isLength: {
        options: { min: 10, max: 2000 },
        errorMessage: 'Description must be between 10 and 2000 characters',
      },
    },
    price: {
      in: ['body'],
      optional: true,
      isFloat: {
        options: { min: 0.01 },
        errorMessage: 'Price must be a positive number',
      },
    },
  },
  availability: {
    dayOfWeek: {
      in: ['body'],
      isInt: {
        options: { min: 0, max: 6 },
        errorMessage: 'Day of week must be between 0 (Sunday) and 6 (Saturday)',
      },
    },
    startTime: {
      in: ['body'],
      custom: {
        options: (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
        errorMessage: 'Start time must be in HH:mm format',
      },
    },
    endTime: {
      in: ['body'],
      custom: {
        options: (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
        errorMessage: 'End time must be in HH:mm format',
      },
    },
  },
};

/**
 * @route   GET /api/v1/services/autocomplete/location
 * @desc    Get location autocomplete suggestions from Photon API
 * @access  Public
 */
router.get('/autocomplete/location', ServiceController.getLocationAutocomplete);

/**
 * @route   POST /api/v1/services
 * @desc    Create a new service
 * @access  Private (Authenticated users)
 */
router.post(
  '/',
  authenticate,
  uploadMultiple('images', 6), // Max 6 images
  checkSchema(serviceSchemas.create),
  validate,
  ServiceController.createService
);

/**
 * @route   GET /api/v1/services
 * @desc    Get all services (paginated)
 * @access  Public
 */
router.get('/', ServiceController.getAllServices);

/**
 * @route   GET /api/v1/services/search
 * @desc    Search services by keyword
 * @access  Public
 */
router.get('/search', ServiceController.searchServices);

/**
 * @route   GET /api/v1/services/nearby
 * @desc    Get services by distance/location
 * @access  Public
 */
router.get('/nearby', ServiceController.getServicesByDistance);

/**
 * @route   GET /api/v1/services/category/:category
 * @desc    Get services by category
 * @access  Public
 */
router.get('/category/:category', ServiceController.getServicesByCategory);

/**
 * @route   GET /api/v1/services/user/:userId
 * @desc    Get user's services
 * @access  Public
 */
router.get('/user/:userId', ServiceController.getUserServices);

/**
 * @route   GET /api/v1/services/:id
 * @desc    Get service by ID
 * @access  Public
 */
router.get('/:id', ServiceController.getService);

/**
 * @route   PUT /api/v1/services/:id
 * @desc    Update service
 * @access  Private (Service owner or admin)
 */
router.put(
  '/:id',
  authenticate,
  uploadMultiple('images', 6),
  checkSchema(serviceSchemas.update),
  validate,
  ServiceController.updateService
);

/**
 * @route   DELETE /api/v1/services/:id
 * @desc    Delete service
 * @access  Private (Service owner or admin)
 */
router.delete(
  '/:id',
  authenticate,
  checkSchema(schemas.id),
  validate,
  ServiceController.deleteService
);

/**
 * @route   POST /api/v1/services/:id/availability
 * @desc    Add availability to service
 * @access  Private (Service owner)
 */
router.post(
  '/:id/availability',
  authenticate,
  checkSchema({
    ...schemas.id,
    ...serviceSchemas.availability,
  }),
  validate,
  ServiceController.addAvailability
);

module.exports = router;
