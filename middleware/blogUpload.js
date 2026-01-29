const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
// Ensure upload directory exists
const isVercel = process.env.VERCEL === '1';
// If on Vercel, use /tmp which is writable. Otherwise use local uploads folder.
const uploadBase = isVercel ? '/tmp' : path.join(__dirname, '..');
const uploadDir = path.join(uploadBase, 'uploads', 'blog');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.warn('Failed to create blog upload directory:', error.message);
  // Continue execution; uploads might fail later but server won't crash on startup
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Ensure we use the blog- prefix
    const filename = 'blog-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Saving file as:', filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type using mimetype
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size should be less than 5MB' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = { upload, handleMulterError }; 