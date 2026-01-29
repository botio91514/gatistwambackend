const Blog = require('../models/Blog');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Private (Admin)
exports.getAllBlogPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
};

// @desc    Get published blog posts
// @route   GET /api/blog/status/published
// @access  Public
exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await Blog.find({ status: 'published' }).sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching published posts:', error);
    res.status(500).json({ message: 'Error fetching published posts', error: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private (Admin)
exports.createBlogPost = async (req, res) => {
  try {
    const post = await Blog.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private (Admin)
exports.updateBlogPost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(400).json({ message: 'Error updating blog post', error: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private (Admin)
exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(400).json({ message: 'Error deleting blog post', error: error.message });
  }
};

// @desc    Get a single blog post
// @route   GET /api/blog/:id
// @access  Public
exports.getBlogPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(400).json({ message: 'Error fetching blog post', error: error.message });
  }
}; 