const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Explicitly handle preflight
app.options('*', cors());

// Middleware
app.use(cors({
  origin: '*', // Allow ALL origins for now to fix access issues
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define upload directories
// Define upload directories
// On Vercel (Serverless), the filesystem is read-only except for /tmp
const isVercel = process.env.VERCEL === '1';
const uploadsBase = isVercel ? '/tmp' : __dirname;
const uploadsDir = path.join(uploadsBase, 'uploads');
const blogUploadsDir = path.join(uploadsDir, 'blog');
const portfolioUploadsDir = path.join(uploadsDir, 'portfolio');

// Ensure upload directories exist (only if possible)
try {
  [uploadsDir, blogUploadsDir, portfolioUploadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
} catch (error) {
  console.warn('Could not create upload directories (likely read-only FS):', error.message);
}

// Serve static files from uploads directory (standard) or ignore on Vercel
if (!isVercel) {
  app.use('/uploads', express.static(uploadsDir));
}

// Database connection
// Database connection
const connectDB = require('./config/db');
// Don't connect immediately at top level for Serverless

// Add root route for health check
app.get('/', (req, res) => {
  res.send('Gatistwam Backend is Running');
});

// Middleware to ensure DB connects for every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
const userRoutes = require('./routes/api/users');
const adminRoutes = require('./routes/api/admin');
const contactRoutes = require('./routes/api/contact');
const portfolioRoutes = require('./routes/portfolioRoutes');
const blogRoutes = require('./routes/api/blog');

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Start server
const PORT = process.env.PORT || 3000;

// Only listen if run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  });
}

module.exports = app; 