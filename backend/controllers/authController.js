const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmployeeApplication = require('../models/EmployeeApplication');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Please provide email, password and user type' });
    }

    // Find user by email and role
    const user = await User.findOne({ email, role: userType }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register employee (admin only)
exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'employee'
    });

    await user.save();

    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    console.error('Register employee error:', error);
    res.status(500).json({ message: error.message || 'Error registering employee' });
  }
};

// Submit employee application
exports.applyEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if email already exists in applications or users
    const existingApplication = await EmployeeApplication.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingApplication || existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new application with plain password (will be hashed in pre-save)
    const application = new EmployeeApplication({
      name,
      email,
      password
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply employee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending applications (admin only)
exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await EmployeeApplication.find({ status: 'pending' })
      .select('-password');
    res.json(applications);
  } catch (error) {
    console.error('Get pending applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve employee application (admin only)
exports.approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await EmployeeApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Create new user from application
    const user = new User({
      name: application.name,
      email: application.email,
      password: application.password, // Will be handled by pre-save hook
      role: 'employee'
    });

    await user.save();
    application.status = 'approved';
    await application.save();

    res.json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject employee application (admin only)
exports.rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await EmployeeApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    await application.save();

    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 