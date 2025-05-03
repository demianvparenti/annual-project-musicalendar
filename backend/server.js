const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const artistsRoutes = require('./routes/artists');
const eventsRoutes = require('./routes/events'); // Import the events routes
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Musicalendar');
});

// Rutas
app.use('/api/artists', artistsRoutes);
app.use('/api/events', eventsRoutes); // Add the events routes
app.use('/api/auth', authRoutes);

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to serve "index.html" for unknown routes (optional, for SPA-like behavior)
//app.get('/frontend/*', (req, res) => {
//  console.log('Fallback route triggered for:', req.url);
//  res.sendFile(path.join(__dirname, '../frontend/index.html'));
//});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/index.html`);
});