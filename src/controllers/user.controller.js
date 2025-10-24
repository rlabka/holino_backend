const User = require('../models/User');
const ApiResponse = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { getFileUrl, deleteFile } = require('../middleware/upload');
const path = require('path');
const config = require('../config');

/**
 * User Controller
 */
class UserController {
  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  static getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      throw new NotFoundError('User');
    }

    ApiResponse.success(res, { user });
  });

  /**
   * Get all users (paginated)
   * GET /api/v1/users
   */
  static getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await User.findAll(page, limit);

    ApiResponse.paginated(res, result.users, result.pagination);
  });

  /**
   * Update user
   * PUT /api/v1/users/:id
   */
  static updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow updating sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.id;

    const user = await User.update(id, updateData);

    ApiResponse.success(res, { user }, 'User updated successfully');
  });

  /**
   * Delete user
   * DELETE /api/v1/users/:id
   */
  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await User.delete(id);

    ApiResponse.success(res, null, 'User deleted successfully');
  });

  /**
   * Ban user
   * POST /api/v1/users/:id/ban
   */
  static banUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.update(id, {
      isBanned: true,
    });

    ApiResponse.success(res, { user }, 'User banned successfully');
  });

  /**
   * Unban user
   * POST /api/v1/users/:id/unban
   */
  static unbanUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.update(id, {
      isBanned: false,
    });

    ApiResponse.success(res, { user }, 'User unbanned successfully');
  });

  /**
   * Deactivate user account
   * POST /api/v1/users/:id/deactivate
   */
  static deactivateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.update(id, {
      isActive: false,
    });

    ApiResponse.success(res, { user }, 'User deactivated successfully');
  });

  /**
   * Activate user account
   * POST /api/v1/users/:id/activate
   */
  static activateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.update(id, {
      isActive: true,
    });

    ApiResponse.success(res, { user }, 'User activated successfully');
  });

  /**
   * Upload profile image
   * POST /api/v1/users/:id/profile-image
   */
  static uploadProfileImage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      throw new ValidationError('No image file provided');
    }

    // Get current user to check for existing profile image
    const currentUser = await User.findById(id);
    if (!currentUser) {
      throw new NotFoundError('User');
    }

    // Delete old profile image if exists
    if (currentUser.profileImage) {
      const oldImagePath = path.join(config.upload.uploadPath, currentUser.profileImage.replace('/uploads/', ''));
      deleteFile(oldImagePath);
    }

    // Generate file URL
    const imageUrl = getFileUrl(req.file.path);

    // Update user with new profile image
    const user = await User.update(id, {
      profileImage: imageUrl,
    });

    ApiResponse.success(res, { user, imageUrl }, 'Profile image uploaded successfully');
  });

  /**
   * Get profile image (public endpoint)
   * GET /api/v1/users/:id/profile-image
   */
  static getProfileImage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      throw new NotFoundError('User');
    }

    // Return profile image URL or null if no image
    ApiResponse.success(res, { 
      profileImage: user.profileImage || null,
      userId: user.id 
    }, 'Profile image retrieved successfully');
  });

  /**
   * Delete profile image
   * DELETE /api/v1/users/:id/profile-image
   */
  static deleteProfileImage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get current user to check for existing profile image
    const currentUser = await User.findById(id);
    if (!currentUser) {
      throw new NotFoundError('User');
    }

    // Delete profile image file from server if exists
    if (currentUser.profileImage) {
      const imagePath = path.join(config.upload.uploadPath, currentUser.profileImage.replace('/uploads/', ''));
      deleteFile(imagePath);
    }

    // Update user to remove profile image
    const user = await User.update(id, {
      profileImage: null,
    });

    ApiResponse.success(res, { user }, 'Profile image deleted successfully');
  });
}

module.exports = UserController;
