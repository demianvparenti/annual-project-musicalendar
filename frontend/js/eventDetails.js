document.addEventListener('DOMContentLoaded', async () => {
    // Load navbar and footer
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-include').innerHTML = data;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-include').innerHTML = data;
        });

    // Get the event ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    // Check if eventId is present
    if (!eventId) {
        document.getElementById('event-details-container').innerHTML = '<p>Error: No se proporcionó un ID de evento.</p>';
        return;
    }

    // Fetch event details
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/events/${eventId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }
        const event = await response.json();

        // Fetch artist details using artist_id
        const artistResponse = await fetch(`http://127.0.0.1:3000/api/artists/${event.artist_id}`);
        if (!artistResponse.ok) {
            throw new Error('Failed to fetch artist details');
        }
        const artist = await artistResponse.json();

        // Populate event details
        const eventDetailsContainer = document.getElementById('event-details-container');
        eventDetailsContainer.innerHTML = `
            <div class="event-details">
                <h1>${artist.name || 'Nombre no disponible'}</h1>
                <img src="./20250311204105-1.png" alt="${artist.name || 'Imagen no disponible'}" height="200px">
                <p><strong>Fecha:</strong> ${event.date_time ? new Date(event.date_time).toLocaleDateString() : 'Fecha no disponible'}</p>
                <p><strong>Ubicación:</strong> ${event.location || 'Ubicación no disponible'}</p>
                <p><strong>Género:</strong> ${artist.genre || 'Género no disponible'}</p>
                <p><strong>Descripción:</strong> ${event.description || 'No hay descripción disponible.'}</p>
            </div>
        `;
    } catch (err) {
        console.error('Error loading event details:', err);
        document.getElementById('event-details-container').innerHTML = '<p>Error al cargar los detalles del evento.</p>';
    }
});