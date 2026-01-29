const express = require('express');
const router = express.Router();

// Import routes
const contactRoutes = require('./contact');
const adminRoutes = require('./admin');

// Use routes
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

module.exports = router; 