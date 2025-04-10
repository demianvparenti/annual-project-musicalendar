// Temporal: Lista falsa de artistas
//let artists = [
 //   { id: 1, nombre: 'Artista Ejemplo', instagram: 'https://instagram.com/ejemplo' }
//  ];
  
 // exports.getArtists = (req, res) => {
 //   res.json(artists);
 // };
  
  const db = require('../config/db');

  exports.getArtists = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM artists'); // Updated table name to "artists"
      res.json(rows);
    } catch (err) {
      console.error('Error fetching artists:', err); // Updated error message
      res.status(500).json({ error: 'Internal server error' }); // Updated response message
    }
  };

  exports.createArtist = async (req, res) => {
    const { name, email, genre, photo, website, instagram, youtube } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO artists (name, email, genre, photo, website, instagram, youtube) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, genre, photo, website, instagram, youtube]
      );
      res.status(201).json({ id: result.insertId, name, email, genre, photo, website, instagram, youtube });
    } catch (err) {
      console.error('Error creating artist:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name, email, genre, photo, website, instagram, youtube } = req.body;
    try {
      await db.query(
        'UPDATE artists SET name = ?, email = ?, genre = ?, photo = ?, website = ?, instagram = ?, youtube = ? WHERE id = ?',
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
      await db.query('DELETE FROM artists WHERE id = ?', [id]);
      res.json({ message: 'Artist deleted successfully' });
    } catch (err) {
      console.error('Error deleting artist:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };