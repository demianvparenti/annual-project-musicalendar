const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get all artists (no authentication required)
router.get('/', artistController.getArtists);

// Get an artist by ID (no authentication required)
router.get('/:id', artistController.getArtistById);

// Create a new artist (authentication required)
router.post('/', authenticateToken, artistController.createArtist);

// Update an artist by ID (authentication required)
router.put('/:id', authenticateToken, artistController.updateArtist);

// Delete an artist by ID (authentication required)
router.delete('/:id', authenticateToken, artistController.deleteArtist);

module.exports = router;