const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  login,
  registerEmployee,
  applyEmployee,
  getPendingApplications,
  approveApplication,
  rejectApplication
} = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/apply-employee', applyEmployee);

// Protected routes (admin only)
router.post('/register-employee', protect, admin, registerEmployee);
router.get('/pending-applications', protect, admin, getPendingApplications);
router.post('/approve-application/:applicationId', protect, admin, approveApplication);
router.post('/reject-application/:applicationId', protect, admin, rejectApplication);

module.exports = router; 