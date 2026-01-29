const Portfolio = require('../models/Portfolio');

// Get all portfolio items
exports.getAllPortfolioItems = async (req, res) => {
  try {
    console.log('Fetching all portfolio items');
    const portfolioItems = await Portfolio.find().sort({ createdAt: -1 });
    console.log(`Found ${portfolioItems.length} portfolio items`);
    res.json(portfolioItems);
  } catch (error) {
    console.error('Error in getAllPortfolioItems:', error);
    res.status(500).json({ message: 'Error fetching portfolio items', error: error.message });
  }
};

// Get a single portfolio item
exports.getPortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(portfolioItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio item', error: error.message });
  }
};

// Create a new portfolio item
exports.createPortfolioItem = async (req, res) => {
  try {
    const portfolioItem = new Portfolio(req.body);
    await portfolioItem.save();
    res.status(201).json(portfolioItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating portfolio item', error: error.message });
  }
};

// Update a portfolio item
exports.updatePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(portfolioItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating portfolio item', error: error.message });
  }
};

// Delete a portfolio item
exports.deletePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio item', error: error.message });
  }
};

// Get portfolio items by status
exports.getPortfolioItemsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    console.log(`Fetching portfolio items with status: ${status}`);
    
    if (!['published', 'draft'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be either "published" or "draft"' 
      });
    }

    const portfolioItems = await Portfolio.find({ status }).sort({ createdAt: -1 });
    console.log(`Found ${portfolioItems.length} portfolio items with status: ${status}`);
    
    res.json(portfolioItems);
  } catch (error) {
    console.error('Error in getPortfolioItemsByStatus:', error);
    res.status(500).json({ 
      message: 'Error fetching portfolio items by status', 
      error: error.message 
    });
  }
};

// Get portfolio items by category
exports.getPortfolioItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const portfolioItems = await Portfolio.find({ category }).sort({ createdAt: -1 });
    res.json(portfolioItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio items', error: error.message });
  }
}; 