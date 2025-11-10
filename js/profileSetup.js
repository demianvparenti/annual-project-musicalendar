document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('links-container');

    // Add event listener for adding links
    document.getElementById('add-link-button').addEventListener('click', () => {
        console.log('Add Link button clicked');
        const linkGroup = document.createElement('div');
        linkGroup.classList.add('link-group');
    
        linkGroup.innerHTML = `
            <select name="link-type">
                <option value="spotify">Spotify</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
            </select>
            <input type="url" name="link-url" placeholder="Enter URL" required>
            <button type="button" class="remove-link-button">Remove</button>
        `;
    
        linksContainer.appendChild(linkGroup);
    
        // Add event listener to the "Remove" button
        linkGroup.querySelector('.remove-link-button').addEventListener('click', () => {
            console.log('Remove Link button clicked');
            linksContainer.removeChild(linkGroup);
        });
    });

    // Function to check if the token is expired
    function isTokenExpired(token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return payload.exp < currentTime; // Check if the token has expired
    }

    // Function to monitor token expiration
    function monitorTokenExpiration(token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
        const expirationTime = payload.exp * 1000; // Convert expiration time to milliseconds
        const timeUntilExpiration = expirationTime - Date.now();

        if (timeUntilExpiration > 0) {
            setTimeout(() => {
                alert('Your session has expired. Please log in again.');
                localStorage.removeItem('token'); // Remove the token
                window.location.href = './signin.html'; // Redirect to the login page
            }, timeUntilExpiration);
        } else {
            // Token is already expired
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = './signin.html';
        }
    }

    // Check token before making API requests
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token'); // Remove the token
        window.location.href = './signin.html'; // Redirect to the login page
        return;
    }

    // Monitor token expiration
    monitorTokenExpiration(token);

    // Handle form submission
    document.getElementById('profile-setup-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const genre = document.getElementById('genre').value; // Get the selected genre
        const profilePictureUrl = document.getElementById('photo').value;

        if (!genre) {
            alert('Please select a genre.');
            return;
        }

        if (!profilePictureUrl) {
            alert('Por favor, ingresa un enlace a tu foto de perfil.');
            return;
        }

        const linkGroups = document.querySelectorAll('.link-group');
        const links = Array.from(linkGroups).map(group => {
            const type = group.querySelector('select[name="link-type"]').value;
            const url = group.querySelector('input[name="link-url"]').value;
            return { type, url };
        });

        // Create a JSON object with the genre included
        const payload = {
            photo: profilePictureUrl,
            genre: genre, // Include the selected genre
            links: links,
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/api/artists/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content type
                    Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
                },
                body: JSON.stringify(payload), // Send the payload as a JSON string
            });

            if (response.ok) {
                document.getElementById('profile-success').style.display = 'block';
            } else {
                const errorData = await response.json();
                document.getElementById('profile-error').textContent = errorData.error || 'Error al configurar el perfil.';
                document.getElementById('profile-error').style.display = 'block';
            }
        } catch (err) {
            console.error('Error during profile setup:', err);
            document.getElementById('profile-error').textContent = 'Error de conexión.';
            document.getElementById('profile-error').style.display = 'block';
        }
    });

    // Logout button functionality
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token'); // Clear the token from localStorage
        window.location.href = './signin.html'; // Redirect to the login page
    });
});