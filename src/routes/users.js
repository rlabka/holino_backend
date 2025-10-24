const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { 
  authenticate, 
  requireOwnership, 
  requireAdmin,
  requireOwnerOrAdmin 
} = require('../middleware/auth');
const { schemas, validate } = require('../middleware/validate');
const { checkSchema } = require('express-validator');
const { uploadSingle } = require('../middleware/upload');

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated)
 * @access  Private (Admin only)
 */
router.get(
  '/',
  authenticate,
  requireAdmin,
  checkSchema(schemas.pagination),
  validate,
  UserController.getAllUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  checkSchema(schemas.id),
  validate,
  UserController.getUser
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Owner or Admin)
 */
router.put(
  '/:id',
  authenticate,
  requireOwnerOrAdmin('id'),
  checkSchema(schemas.id),
  validate,
  UserController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  checkSchema(schemas.id),
  validate,
  UserController.deleteUser
);

/**
 * @route   POST /api/v1/users/:id/ban
 * @desc    Ban user
 * @access  Private (Admin only)
 */
router.post(
  '/:id/ban',
  authenticate,
  requireAdmin,
  checkSchema(schemas.id),
  validate,
  UserController.banUser
);

/**
 * @route   POST /api/v1/users/:id/unban
 * @desc    Unban user
 * @access  Private (Admin only)
 */
router.post(
  '/:id/unban',
  authenticate,
  requireAdmin,
  checkSchema(schemas.id),
  validate,
  UserController.unbanUser
);

/**
 * @route   POST /api/v1/users/:id/deactivate
 * @desc    Deactivate user account
 * @access  Private (Owner or Admin)
 */
router.post(
  '/:id/deactivate',
  authenticate,
  requireOwnerOrAdmin('id'),
  checkSchema(schemas.id),
  validate,
  UserController.deactivateUser
);

/**
 * @route   POST /api/v1/users/:id/activate
 * @desc    Activate user account
 * @access  Private (Admin only)
 */
router.post(
  '/:id/activate',
  authenticate,
  requireAdmin,
  checkSchema(schemas.id),
  validate,
  UserController.activateUser
);

/**
 * @route   GET /api/v1/users/:id/profile-image
 * @desc    Get user's profile image (public)
 * @access  Public
 */
router.get(
  '/:id/profile-image',
  checkSchema(schemas.id),
  validate,
  UserController.getProfileImage
);

/**
 * @route   POST /api/v1/users/:id/profile-image
 * @desc    Upload profile image
 * @access  Private (Owner or Admin)
 */
router.post(
  '/:id/profile-image',
  authenticate,
  requireOwnerOrAdmin('id'),
  uploadSingle('profileImage'),
  checkSchema(schemas.id),
  validate,
  UserController.uploadProfileImage
);

/**
 * @route   DELETE /api/v1/users/:id/profile-image
 * @desc    Delete profile image
 * @access  Private (Owner or Admin)
 */
router.delete(
  '/:id/profile-image',
  authenticate,
  requireOwnerOrAdmin('id'),
  checkSchema(schemas.id),
  validate,
  UserController.deleteProfileImage
);

module.exports = router;