const Artist = require('../models/artist');
const db = require('../config/db');

exports.createArtist = async (req, res) => {
    try {
        const { name, email, genre, photo, website, instagram, youtube } = req.body;
        const artistId = await Artist.create({ name, email, genre, photo, website, instagram, youtube });
        res.status(201).json({ id: artistId, name, email, genre, photo, website, instagram, youtube });
    } catch (err) {
        console.error('Error creating artist:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getArtistById = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json(artist);
    } catch (err) {
        console.error('Error fetching artist:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateArtist = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, genre, photo, website, instagram, youtube } = req.body;

      // Check if the artist exists
      const existingArtist = await Artist.findById(id);
      if (!existingArtist) {
          return res.status(404).json({ error: 'Artist not found' });
      }

      // Update the artist
      await Artist.update(id, { name, email, genre, photo, website, instagram, youtube });
      res.status(200).json({ message: 'Artist updated successfully' });
    } catch (err) {
      console.error('Error updating artist:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.setupProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        }

        // Fetch the correct artist ID based on the authenticated user
        const userId = req.user.id;
        const [rows] = await db.query('SELECT artist_id FROM auth WHERE id = ?', [userId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Artist not found for the authenticated user.' });
        }

        const authRecord = rows[0];
        const artistId = authRecord.artist_id;

        const { photo, genre, links } = req.body;

        if (!photo || !genre) {
            return res.status(400).json({ error: 'Photo and genre are required.' });
        }

        // Update the artist's profile
        await db.query(
            'UPDATE artists SET photo = ?, genre = ?, links = ? WHERE id = ?',
            [photo, genre, JSON.stringify(links), artistId] // Correct parameter order
        );

        res.status(200).json({ message: 'Perfil configurado con éxito.', photo, genre });
    } catch (err) {
        console.error('Error during profile setup:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};