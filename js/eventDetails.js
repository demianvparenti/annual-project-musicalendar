document.addEventListener('DOMContentLoaded', async () => {
    // Create the navbar dynamically
    const navbar = document.getElementById('navbar-include');

    // Create the page title
    const pageTitle = document.createElement('h1');
    pageTitle.id = 'page-title';
    pageTitle.textContent = 'Musicalendar'; // Set the title text
    navbar.appendChild(pageTitle);

    // Create the hamburger menu button
    const hamburgerMenu = document.createElement('button');
    hamburgerMenu.id = 'hamburger-menu';
    hamburgerMenu.className = 'w3-btn w3-black';
    hamburgerMenu.innerHTML = '&#9776;'; // Hamburger icon
    navbar.appendChild(hamburgerMenu);

    // Create the menu items container
    const menuItems = document.createElement('div');
    menuItems.id = 'menu-items';
    navbar.appendChild(menuItems);

    // Add menu buttons dynamically
    const buttons = [
        { text: 'Inicio', id: 'home-btn', href: 'index.html' },
        { text: 'Mi perfil', id: 'profile-btn', href: 'profile-setup.html' },
        { text: 'Crear evento', id: 'create-event-btn', href: 'event-setup.html' },
        { text: 'Cerrar sesión', id: 'logout-btn', href: '#' },
    ];

    buttons.forEach((buttonData) => {
        const button = document.createElement('a');
        button.className = 'w3-btn w3-black';
        button.id = buttonData.id;
        button.href = buttonData.href;
        button.textContent = buttonData.text;

        // Add logout functionality for "Cerrar sesión"
        if (buttonData.id === 'logout-btn') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const token = localStorage.getItem('token');
                if (token) {
                    localStorage.removeItem('token');
                    console.log('Token removed.');
                } else {
                    console.warn('No token found in localStorage.');
                }
                // Redirect to login page or reload the page
                window.location.href = 'signin.html'; // Redirect to main page
            });
        }

        menuItems.appendChild(button);
    });

    // Add functionality to toggle the menu visibility
    hamburgerMenu.addEventListener('click', () => {
        menuItems.classList.toggle('active'); // Toggle the "active" class
    });  

    // Append the navbar to the document body or a specific container
    document.body.prepend(navbar);

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