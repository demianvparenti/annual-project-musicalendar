const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Get an artist by ID (no authentication required)
router.get('/:id', artistController.getArtistById);

// Create a new artist (admin role required)
router.post('/', authenticateToken, authorizeRole('admin'), artistController.createArtist);

// Update an artist by ID (admin role required)
router.put('/:id', authenticateToken, authorizeRole('admin'), artistController.updateArtist);

// Profile setup route
router.post('/profile', authenticateToken, artistController.setupProfile);

module.exports = router;