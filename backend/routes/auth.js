const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/', authController.createAuth); // Registration
router.post('/login', authController.login); // Login

// Protected routes
//router.get('/', authenticateToken, authController.getAuth); // Fetch all users (admin-only)
//router.put('/:id', authenticateToken, authController.updateAuth); // Update user
//router.delete('/:id', authenticateToken, authController.deleteAuth); // Delete user

module.exports = router;