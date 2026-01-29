const express = require('express');
const router = express.Router();
const {
  getAllBlogPosts,
  getPublishedPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPost
} = require('../../controllers/blogController');
const { authenticateToken, isAdmin } = require('../../middleware/auth');
const { upload, handleMulterError } = require('../../middleware/blogUpload');

// Public routes
router.get('/status/published', getPublishedPosts);
router.get('/:id', getBlogPost);

// Protected routes (Admin only)
router.get('/', authenticateToken, isAdmin, getAllBlogPosts);
router.post('/', authenticateToken, isAdmin, createBlogPost);
router.put('/:id', authenticateToken, isAdmin, updateBlogPost);
router.delete('/:id', authenticateToken, isAdmin, deleteBlogPost);

// Upload route
router.post('/upload', 
  authenticateToken, 
  isAdmin, 
  upload.single('image'),
  handleMulterError,
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      // Return the file path relative to the uploads directory
      const filePath = `/uploads/blog/${req.file.filename}`;
      res.json({ 
        success: true,
        filePath: filePath
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  }
);

module.exports = router; 