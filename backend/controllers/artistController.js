const db = require('../config/db');

exports.getArtists = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, genre, photo, website_link AS website, instagram_link AS instagram, youtube_link AS youtube FROM artists'); // Updated table name to "artists"
    res.json(rows);
  } catch (err) {
    console.error('Error fetching artists:', err); // Updated error message
    res.status(500).json({ error: 'Internal server error' }); // Updated response message
  }
};

exports.createArtist = async (req, res) => {
  const {
    name,
    email,
    genre,
    photo = null, // Default to null if not provided
    website = null, // Default to null if not provided
    instagram = null, // Default to null if not provided
    youtube = null // Default to null if not provided
  } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO artists (name, email, genre, photo, website_link, instagram_link, youtube_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, genre, photo, website, instagram, youtube]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      genre,
      photo,
      website,
      instagram,
      youtube
    });
  } catch (err) {
    console.error('Error creating artist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateArtist = async (req, res) => {
  const { id } = req.params;
  const { name, email, genre, photo, website, instagram, youtube } = req.body;

  // Check if the request body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is missing or invalid' });
  }

  try {
    // Check if the artist exists
    const [artist] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
    if (artist.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Update the artist
    await db.query(
      'UPDATE artists SET name = ?, email = ?, genre = ?, photo = ?, website_link = ?, instagram_link = ?, youtube_link = ? WHERE id = ?',
      [name, email, genre, photo, website, instagram, youtube, id]
    );
    res.json({ message: 'Artist updated successfully' });
  } catch (err) {
    console.error('Error updating artist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteArtist = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the artist exists
    const [artist] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
    if (artist.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Delete the artist
    await db.query('DELETE FROM artists WHERE id = ?', [id]);
    res.json({ message: 'Artist deleted successfully' });
  } catch (err) {
    console.error('Error deleting artist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};