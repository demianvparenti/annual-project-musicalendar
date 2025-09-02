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
        { text: 'Contacto', id: 'contact-btn', href: 'contact.html' },
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
                localStorage.removeItem('token');
                window.location.reload();
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

    // Now load events
    loadEvents();

    // Initialize the calendar
    const calendarEl = document.getElementById('calendar-container');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        aspectRatio: 1.35,
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('http://127.0.0.1:3000/api/events');
                if (!response.ok) throw new Error('Failed to fetch events');
                const events = await response.json();

                // Map events to FullCalendar format
                const calendarEvents = events.map(event => ({
                    title: event.artist_name,
                    start: event.date_time,
                    url: `event-details.html?id=${event.id}`
                }));

                successCallback(calendarEvents);
            } catch (err) {
                console.error('Error loading calendar events:', err);
                failureCallback(err);
            }
        },
        eventClick: function (info) {
            info.jsEvent.preventDefault(); // Prevent default navigation
            window.location.href = info.event.url; // Navigate to event details
        }
    });

    calendar.render();
});

// Load footer (can be done in parallel)
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-include').innerHTML = data;
    });

// Define the event loading function
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    try {
        const response = await fetch('http://127.0.0.1:3000/api/events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.style.cursor = 'pointer';
            eventCard.innerHTML = `
                <img src="./20250311204105-1.png" height="100px" alt="${event.artist_name}">
                <div class="details">
                    <h3>${event.artist_name}</h3>
                    <p><strong>Fecha:</strong> ${new Date(event.date_time).toLocaleDateString()}</p>
                    <p><strong>Ubicación:</strong> ${event.location}</p>
                    <p><strong>Género:</strong> ${event.artist_genre}</p>
                </div>
            `;
            eventCard.addEventListener('click', () => {
                window.location.href = `event-details.html?id=${event.id}`;
            });
            eventsContainer.appendChild(eventCard);
        });
    } catch (err) {
        console.error('Error loading events:', err);
        eventsContainer.innerHTML = '<p>Error al cargar los eventos.</p>';
    }
}