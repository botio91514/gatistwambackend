const Admin = require('../models/Admin');

// Login admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByCredentials(email, password);
    const token = admin.generateAuthToken();

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      token
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Get current admin profile
const getProfile = async (req, res) => {
  try {
    const admin = req.admin;
    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout admin
const logout = async (req, res) => {
  try {
    // In a real application, you might want to invalidate the token
    // For now, we'll just send a success response
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  getProfile,
  logout
}; 