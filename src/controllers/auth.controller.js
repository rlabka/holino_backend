const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');
const { SUCCESS_MESSAGES } = require('../utils/constants');

/**
 * Auth Controller
 */
class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const {
      email,
      username,
      name,
      password,
      phone,
      postcode,
      accountType,
      legalForm,
      industry,
      companyName,
    } = req.body;

    // Get uploaded file paths
    const businessDocuments = req.files ? req.files.map(file => `/uploads/documents/${file.filename}`) : [];

    const result = await AuthService.register({
      email,
      username,
      name,
      password,
      phone,
      postcode,
      accountType,
      legalForm,
      industry,
      companyName,
      businessDocuments,
    });

    ApiResponse.created(res, result, SUCCESS_MESSAGES.REGISTER);
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    ApiResponse.success(res, result, SUCCESS_MESSAGES.LOGIN);
  });

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  static refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await AuthService.refreshToken(refreshToken);

    ApiResponse.success(res, result, 'Token refreshed successfully');
  });

  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await AuthService.requestPasswordReset(email);

    ApiResponse.success(res, result);
  });

  /**
   * Reset password with token
   * POST /api/v1/auth/reset-password
   */
  static resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const result = await AuthService.resetPassword(token, newPassword);

    ApiResponse.success(res, result, SUCCESS_MESSAGES.PASSWORD_RESET);
  });

  /**
   * Verify email
   * POST /api/v1/auth/verify-email
   */
  static verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const result = await AuthService.verifyEmail(token);

    ApiResponse.success(res, result);
  });

  /**
   * Resend verification email
   * POST /api/v1/auth/resend-verification
   */
  static resendVerification = asyncHandler(async (req, res) => {
    const userId = req.user.userId; // From auth middleware

    const result = await AuthService.sendVerificationEmail(userId);

    ApiResponse.success(res, result);
  });

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    // TODO: Implement token blacklist if needed
    // For now, logout is handled client-side by removing tokens

    ApiResponse.success(res, null, SUCCESS_MESSAGES.LOGOUT);
  });

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  static getMe = asyncHandler(async (req, res) => {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);

    if (!user) {
      return ApiResponse.notFound(res, 'User');
    }

    ApiResponse.success(res, { user });
  });
}

module.exports = AuthController;
