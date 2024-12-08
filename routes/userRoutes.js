const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword, updatePoints, getUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Edit password
router.put('/password', verifyToken, updatePassword);

// Update score
router.put('/points', verifyToken, updatePoints);

// Get user information
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
