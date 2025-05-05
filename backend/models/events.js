const db = require('../config/db');

class Event {
    // Create a new event
    static async create({ name, date, location, description, artistId }) {
        const [result] = await db.query(
            'INSERT INTO events (name, date, location, description, artist_id) VALUES (?, ?, ?, ?, ?)',
            [name, date, location, description, artistId]
        );
        return result.insertId;
    }

    // Find an event by ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    }

    // Find all events
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM events');
        return rows;
    }

    // Find events by artist ID
    static async findByArtistId(artistId) {
        const [rows] = await db.query('SELECT * FROM events WHERE artist_id = ?', [artistId]);
        return rows;
    }

    // Update an event
    static async update(id, { name, date, location, description }) {
        await db.query(
            'UPDATE events SET name = ?, date = ?, location = ?, description = ? WHERE id = ?',
            [name, date, location, description, id]
        );
    }

    // Delete an event
    static async delete(id) {
        await db.query('DELETE FROM events WHERE id = ?', [id]);
    }
}

module.exports = Event;