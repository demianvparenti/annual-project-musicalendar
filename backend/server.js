const express = require('express');
const cors = require('cors');
const path = require('path');
const artistsRoutes = require('./routes/artists');
const eventsRoutes = require('./routes/events'); // Import the events routes
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Musicalendar');
});

// Routes
app.use('/api/artists', artistsRoutes);
app.use('/api/events', eventsRoutes); // Add the events routes
app.use('/api/auth', authRoutes);

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));