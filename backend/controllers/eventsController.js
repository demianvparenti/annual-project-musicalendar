const Event = require('../models/events');

exports.createEvent = async (req, res) => {
    try {
        const { name, date, location, description, artistId } = req.body;

        // Create the event
        const eventId = await Event.create({ name, date, location, description, artistId });
        res.status(201).json({ id: eventId, name, date, location, description, artistId });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event by ID
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        // Find all events
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getEventsByArtistId = async (req, res) => {
    try {
        const { artistId } = req.params;

        // Find events by artist ID
        const events = await Event.findByArtistId(artistId);
        if (events.length === 0) {
            return res.status(404).json({ error: 'No events found for this artist' });
        }

        res.json(events);
    } catch (err) {
        console.error('Error fetching events by artist ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, location, description } = req.body;

        // Check if the event exists
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Update the event
        await Event.update(id, { name, date, location, description });
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the event exists
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete the event
        await Event.delete(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};