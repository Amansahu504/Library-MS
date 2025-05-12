const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.header('Authorization');
      
      if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header found' });
      }

      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format. Must be Bearer token' });
      }

      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      // Get user from database
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if user's role is authorized
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Not authorized to access this route',
          requiredRoles: roles,
          userRole: user.role
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      res.status(401).json({ message: 'Token validation failed', error: error.message });
    }
  };
}; 