const db = require('../config/db');

class Event {
    // Create a new event
    static async create({ id, artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, description}) {
        const [result] = await db.query(
            'INSERT INTO events (id, artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, description) VALUES (?, ?, ?, ?, ?)',
            [id, artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, description]
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
    static async findByArtistId(aritst_id) {
        const [rows] = await db.query('SELECT * FROM events WHERE artist_id = ?', [artist_id]);
        return rows;
    }

    // Update an event
    static async update({id, artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, description }) {
        await db.query(
            'UPDATE events SET artist_id = ?, date_time = ?, location = ?, entry_mode = ?, price = ?, ticket_link = ?, flyer_link = ?, description = ? WHERE id = ?',
            [id, artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, description]
        );
    }

    // Delete an event
    static async delete(id) {
        await db.query('DELETE FROM events WHERE id = ?', [id]);
    }
}

module.exports = Event;