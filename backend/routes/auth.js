const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Register a new user (no authentication required)
router.post('/register', authController.createUser);

// Login a user (no authentication required)
router.post('/login', authController.loginUser);

// Get a user by ID (authentication required)
router.get('/:id', authenticateToken, authController.getUserById);

// Update a user's password (authentication required)
router.put('/:id/password', authenticateToken, authController.updatePassword);

// Delete a user (authentication required)
router.delete('/:id', authenticateToken, authController.deleteUser);

module.exports = router;