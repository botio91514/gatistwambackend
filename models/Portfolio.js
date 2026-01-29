const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  client: {
    type: String,
    trim: true
  },
  completionDate: {
    type: Date
  },
  technologies: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema); 