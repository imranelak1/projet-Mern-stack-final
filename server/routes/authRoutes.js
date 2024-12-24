const express = require('express');
const router = express.Router();
const { test, registerUser, loginUser, getProfile, logout, getAllUsers } = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', requireAuth, getProfile);
router.post('/logout', requireAuth, logout);
router.get('/all-users', requireAuth, requireAdmin, getAllUsers);

module.exports = router;