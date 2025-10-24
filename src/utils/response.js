/**
 * Standardized API Response Handler
 */

class ApiResponse {
  /**
   * Success Response
   */
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Created Response (for POST requests)
   */
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * Error Response
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validation Error Response
   */
  static validationError(res, errors) {
    return this.error(res, 'Validation failed', 400, errors);
  }

  /**
   * Not Found Response
   */
  static notFound(res, resource = 'Resource') {
    return this.error(res, `${resource} not found`, 404);
  }

  /**
   * Unauthorized Response
   */
  static unauthorized(res, message = 'Authentication required') {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden Response
   */
  static forbidden(res, message = 'Access denied') {
    return this.error(res, message, 403);
  }

  /**
   * Paginated Response
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.pages,
        hasNext: pagination.page < pagination.pages,
        hasPrev: pagination.page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = ApiResponse;
