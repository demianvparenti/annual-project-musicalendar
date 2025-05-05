const Artist = require('../models/artist');

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