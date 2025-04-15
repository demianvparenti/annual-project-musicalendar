const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Define routes
router.get('/', eventsController.getEvents); // GET /api/events
router.post('/', eventsController.createEvent); // POST /api/events
router.put('/:id', eventsController.updateEvent); // PUT /api/events/:id
router.delete('/:id', eventsController.deleteEvent); // DELETE /api/events/:id

module.exports = router;