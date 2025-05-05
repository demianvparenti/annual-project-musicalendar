const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get all events (no authentication required)
router.get('/', eventsController.getAllEvents);

// Get an event by ID (no authentication required)
router.get('/:id', eventsController.getEventById);

// Get events by artist ID (no authentication required)
router.get('/artist/:artistId', eventsController.getEventsByArtistId);

// Create a new event (authentication required)
router.post('/', authenticateToken, eventsController.createEvent);

// Update an event (authentication required)
router.put('/:id', authenticateToken, eventsController.updateEvent);

// Delete an event (authentication required)
router.delete('/:id', authenticateToken, eventsController.deleteEvent);

module.exports = router;