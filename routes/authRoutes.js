// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Ensure all controller methods are correctly defined
router.post('/register', (req, res) => {
  if (typeof authController.register === 'function') {
    authController.register(req, res);
  } else {
    res.status(500).json({ message: 'Register method not found' });
  }
});

router.post('/login', (req, res) => {
  if (typeof authController.login === 'function') {
    authController.login(req, res);
  } else {
    res.status(500).json({ message: 'Login method not found' });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  if (typeof authController.logout === 'function') {
    authController.logout(req, res);
  } else {
    res.status(500).json({ message: 'Logout method not found' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  if (typeof authController.getCurrentUser === 'function') {
    authController.getCurrentUser(req, res);
  } else {
    res.status(500).json({ message: 'Get current user method not found' });
  }
});

module.exports = router;