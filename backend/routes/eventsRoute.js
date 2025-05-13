const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Get all events (no authentication required)
router.get('/', eventsController.getAllEvents);

// Get an event by ID (no authentication required)
router.get('/:id', eventsController.getEventById);

// Get events by artist ID (no authentication required)
router.get('/artist/:artistId', eventsController.getEventsByArtistId);

// Create a new event (admin or artist role required)
router.post('/', authenticateToken, authorizeRole('admin', 'user'), eventsController.createEvent);

// Update an event (admin or artist role required)
router.put('/:id', authenticateToken, authorizeRole('admin', 'user'), eventsController.updateEvent);

// Delete an event (admin role required)
router.delete('/:id', authenticateToken, authorizeRole('admin', 'user'), eventsController.deleteEvent);

module.exports = router;