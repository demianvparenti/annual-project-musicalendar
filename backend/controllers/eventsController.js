const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const db = require('../config/db'); // Assuming you have a database connection setup
const Event = require('../models/events');

exports.createEvent = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const artistId = decoded.artistId;

        if (!artistId) {
            return res.status(403).json({ error: 'Access denied: Artist ID not found in token' });
        }

        const { date_time, location, entry_mode, price, ticket_link, flyer_link, description } = req.body;

        console.log('Description:', description); // Debugging line

        if (!date_time || !location || !description || typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ error: 'All required fields must be filled, including a valid description.' });
        }

        const allowedEntryModes = ['gorra', 'gratuito', 'beneficio', 'arancelado'];
        if (!allowedEntryModes.includes(entry_mode)) {
            return res.status(400).json({ error: 'Invalid entry mode.' });
        }

        const query = `
            INSERT INTO events (artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [
            artistId,
            date_time,
            location,
            entry_mode,
            price || null,
            ticket_link || null,
            flyer_link || null,
            description.trim() // Ensure description is trimmed and valid
        ]);

        res.status(201).json({ message: 'Event created successfully!' });
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
        const query = `
            SELECT 
                events.id,
                events.date_time,
                events.location,
                events.entry_mode,
                events.price,
                events.ticket_link,
                events.flyer_link,
                events.description,
                artists.name AS artist_name,
                artists.genre AS artist_genre
            FROM events
            JOIN artists ON events.artist_id = artists.id
        `;
        const [events] = await db.query(query); // Use your database connection
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