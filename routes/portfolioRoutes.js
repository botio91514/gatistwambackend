const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Public routes
router.get('/', portfolioController.getAllPortfolioItems);
router.get('/status/:status', portfolioController.getPortfolioItemsByStatus);
router.get('/category/:category', portfolioController.getPortfolioItemsByCategory);
router.get('/:id', portfolioController.getPortfolioItem);

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
      const filePath = `/uploads/portfolio/${req.file.filename}`;
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

// Protected routes (admin only)
router.post('/', authenticateToken, isAdmin, portfolioController.createPortfolioItem);
router.put('/:id', authenticateToken, isAdmin, portfolioController.updatePortfolioItem);
router.delete('/:id', authenticateToken, isAdmin, portfolioController.deletePortfolioItem);

module.exports = router; 