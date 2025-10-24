const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/location.controller');
const { checkSchema } = require('express-validator');
const { validate } = require('../middleware/validate');

/**
 * @route   GET /api/v1/location/postcode/:postcode
 * @desc    Get location info by postcode
 * @access  Public
 */
router.get('/postcode/:postcode', LocationController.getByPostcode);

/**
 * @route   POST /api/v1/location/geocode
 * @desc    Convert address to coordinates
 * @access  Public
 */
router.post(
  '/geocode',
  checkSchema({
    address: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Address is required',
      },
      trim: true,
    },
  }),
  validate,
  LocationController.geocode
);

/**
 * @route   POST /api/v1/location/reverse-geocode
 * @desc    Convert coordinates to address
 * @access  Public
 */
router.post(
  '/reverse-geocode',
  checkSchema({
    latitude: {
      in: ['body'],
      isFloat: {
        options: { min: -90, max: 90 },
        errorMessage: 'Invalid latitude',
      },
    },
    longitude: {
      in: ['body'],
      isFloat: {
        options: { min: -180, max: 180 },
        errorMessage: 'Invalid longitude',
      },
    },
  }),
  validate,
  LocationController.reverseGeocode
);

/**
 * @route   POST /api/v1/location/distance
 * @desc    Calculate distance between two points
 * @access  Public
 */
router.post(
  '/distance',
  checkSchema({
    lat1: {
      in: ['body'],
      isFloat: { errorMessage: 'Invalid latitude 1' },
    },
    lon1: {
      in: ['body'],
      isFloat: { errorMessage: 'Invalid longitude 1' },
    },
    lat2: {
      in: ['body'],
      isFloat: { errorMessage: 'Invalid latitude 2' },
    },
    lon2: {
      in: ['body'],
      isFloat: { errorMessage: 'Invalid longitude 2' },
    },
  }),
  validate,
  LocationController.calculateDistance
);

module.exports = router;
