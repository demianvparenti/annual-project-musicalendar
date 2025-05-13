const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Register a new user (no authentication required)
router.post('/register', authController.createUser);

// Login a user (no authentication required)
router.post('/login', authController.loginUser);

// Get a user by ID (authentication and admin role required)
router.get('/:id', authenticateToken, authorizeRole('admin'), authController.getUserById);

// Update a user's password (authentication required)
router.put('/:id/password', authenticateToken, authController.updatePassword);

// Delete a user (authentication and admin role required)
router.delete('/:id', authenticateToken, authorizeRole('admin'), authController.deleteUser);

module.exports = router;