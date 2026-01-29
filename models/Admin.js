const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

// Generate auth token
adminSchema.methods.generateAuthToken = function() {
  const admin = this;
  const token = jwt.sign(
    { _id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return token;
};

// Find admin by credentials
adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Invalid login credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin; 