document.addEventListener('DOMContentLoaded', async () => {
    const navList = document.getElementById('nav-list');
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    if (token) {
        // Decode the token to check the user's role (if your token contains role information)
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
        const isArtist = payload.role === 'user'; // Adjust based on your backend's token structure

        if (isArtist) {
            // Add "Create Event" link to the navigation menu
            const createEventLink = document.createElement('li');
            createEventLink.innerHTML = `<a id="setup-event" href="event-setup.html">Crear Evento</a>`;
            navList.appendChild(createEventLink);

            // Optionally, remove the "Iniciar sesión" link if the user is logged in
            const signinLink = document.getElementById('signin');
            if (signinLink) {
                signinLink.parentElement.removeChild(signinLink);
            }

            // Add "Sign out" link to the navigation menu
            const signoutLink = document.createElement('li');
            signoutLink.innerHTML = `<a id="signout" href="#">Cerrar sesión</a>`;
            navList.appendChild(signoutLink);
            signoutLink.addEventListener('click', () => {
                localStorage.removeItem('token'); // Remove the token from localStorage
                window.location.href = './index.html'; // Redirect to the home page
            });
        }
    }

    const eventsContainer = document.getElementById('events-container');

    try {
        const response = await fetch('http://127.0.0.1:3000/api/events'); // Adjust the API URL
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const events = await response.json();

        // Populate the events container
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');

            eventCard.innerHTML = `
                <img src="${event.flyer_link}" alt="${event.artist_name}">
                <div class="details">
                    <h3>${event.artist_name}</h3>
                    <p><strong>Fecha:</strong> ${new Date(event.date_time).toLocaleDateString()}</p>
                    <p><strong>Ubicación:</strong> ${event.location}</p>
                    <p><strong>Género:</strong> ${event.artist_genre}</p>
                    <a href="#">Más detalles</a>
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });
    } catch (err) {
        console.error('Error loading events:', err);
        eventsContainer.innerHTML = '<p>Error al cargar los eventos.</p>';
    }
});