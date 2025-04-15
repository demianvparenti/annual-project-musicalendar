const db = require('../config/db');

exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, artist_id, date_time, location, entry_mode, price, ticket_link AS ticket, flyer_link AS flyer FROM events');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createEvent = async (req, res) => {
  const { artist_id, date_time, location, entry_mode, price = null, ticket_link = null, flyer_link = null } = req.body;

  if (!artist_id || !date_time || !location || !entry_mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [artist] = await db.query('SELECT * FROM artists WHERE id = ?', [artist_id]);
    if (artist.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const result = await db.query(
      'INSERT INTO events (artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link]
    );
    res.status(201).json({ id: result.insertId, artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is missing or invalid' });
  }

  try {
    const [event] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (artist_id) {
      const [artist] = await db.query('SELECT * FROM artists WHERE id = ?', [artist_id]);
      if (artist.length === 0) {
        return res.status(404).json({ error: 'Artist not found' });
      }
    }

    await db.query(
      'UPDATE events SET artist_id = ?, date_time = ?, location = ?, entry_mode = ?, price = ?, ticket_link = ?, flyer_link = ? WHERE id = ?',
      [artist_id, date_time, location, entry_mode, price, ticket_link, flyer_link, id]
    );
    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [event] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await db.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};