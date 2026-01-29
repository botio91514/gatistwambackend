require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    // Using direct connection string format for MongoDB Atlas
    const MONGODB_URI = 'mongodb+srv://ansh132002:piaMEdyq40de4Gtk@alphacluster.h1fav.mongodb.net/Gatistwam?retryWrites=true&w=majority&appName=AlphaCluster';
    
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
    });
    console.log('Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'asthavetcare@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'asthavetcare@gmail.com',
      password: 'admin@123',
      role: 'super-admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Password: admin@123');
    console.log('Please change this password after first login!');

  } catch (error) {
    console.error('Error creating admin:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB Atlas. Please check:');
      console.error('1. Your internet connection is working');
      console.error('2. Your IP address is whitelisted in MongoDB Atlas');
      console.error('3. The username and password are correct');
      console.error('4. The cluster is running and accessible');
      console.error('\nTo whitelist your IP:');
      console.error('1. Log in to MongoDB Atlas');
      console.error('2. Go to Network Access');
      console.error('3. Click "Add IP Address"');
      console.error('4. Add your current IP or use 0.0.0.0/0 for all IPs (not recommended for production)');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 