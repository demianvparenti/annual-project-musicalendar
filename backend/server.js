const express = require('express');
const app = express();
const artistsRoutes = require('./routes/artists');

app.use(express.json());

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Musicalendar');
});

// Rutas
app.use('/api/artists', artistsRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});