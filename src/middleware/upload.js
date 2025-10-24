const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { ValidationError } = require('../utils/errors');

// Ensure upload directory exists
const uploadDir = config.upload.uploadPath;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subdirectories based on file type
    let subDir = 'documents';
    
    if (file.mimetype.startsWith('image/')) {
      subDir = 'images';
    }

    const fullPath = path.join(uploadDir, subDir);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
    
    cb(null, `${sanitizedBasename}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ...config.upload.allowedTypes,
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 5, // Maximum 5 files at once
  },
});

/**
 * Upload single file
 */
const uploadSingle = (fieldName = 'file') => {
  return upload.single(fieldName);
};

/**
 * Upload multiple files
 */
const uploadMultiple = (fieldName = 'files', maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Upload multiple fields
 */
const uploadFields = (fields) => {
  return upload.fields(fields);
};

/**
 * Delete file from filesystem
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file URL
 */
const getFileUrl = (filePath) => {
  // Get only the path after 'uploads/'
  const parts = filePath.split('uploads');
  if (parts.length > 1) {
    return `/uploads${parts[parts.length - 1]}`;
  }
  // Fallback
  return `/uploads/${path.basename(filePath)}`;
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  deleteFile,
  getFileUrl,
};
