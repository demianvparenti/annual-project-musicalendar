const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

// Ruta GET de prueba
router.get('/', artistController.getArtists);

module.exports = router;

// Ruta POST para crear un artista
router.post('/', artistController.createArtist);

// Ruta PUT para actualizar un artista por ID
router.put('/:id', artistController.updateArtist);

// Ruta DELETE para eliminar un artista por ID
router.delete('/:id', artistController.deleteArtist);