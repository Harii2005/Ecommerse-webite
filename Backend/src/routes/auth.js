const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
