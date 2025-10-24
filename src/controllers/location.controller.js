const LocationService = require('../services/location.service');
const ApiResponse = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Location Controller
 */
class LocationController {
  /**
   * Get location by postcode
   * GET /api/v1/location/postcode/:postcode
   */
  static getByPostcode = asyncHandler(async (req, res) => {
    const { postcode } = req.params;

    const location = await LocationService.getLocationByPostcode(postcode);

    ApiResponse.success(res, location);
  });

  /**
   * Geocode address
   * POST /api/v1/location/geocode
   */
  static geocode = asyncHandler(async (req, res) => {
    const { address } = req.body;

    const result = await LocationService.geocodeAddress(address);

    ApiResponse.success(res, result);
  });

  /**
   * Reverse geocode coordinates
   * POST /api/v1/location/reverse-geocode
   */
  static reverseGeocode = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    const result = await LocationService.reverseGeocode(latitude, longitude);

    ApiResponse.success(res, result);
  });

  /**
   * Calculate distance between two points
   * POST /api/v1/location/distance
   */
  static calculateDistance = asyncHandler(async (req, res) => {
    const { lat1, lon1, lat2, lon2 } = req.body;

    const distance = LocationService.calculateDistance(lat1, lon1, lat2, lon2);

    ApiResponse.success(res, { distance, unit: 'km' });
  });
}

module.exports = LocationController;
