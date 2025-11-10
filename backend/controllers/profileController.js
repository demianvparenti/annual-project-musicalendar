document.addEventListener('DOMContentLoaded', async () => {
    const profileContainer = document.getElementById('profile-info');

    // Get the artist ID from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (!artistId) {
        profileContainer.innerHTML = '<p>Error: Artist ID is missing in the URL.</p>';
        return;
    }

    try {
        // Fetch profile data from the backend
        const response = await fetch(`http://127.0.0.1:3000/api/artists/public-profile?id=${artistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const profileData = await response.json();

        // Render profile photo
        const profilePhoto = document.getElementById('profile-photo');
        profilePhoto.src = profileData.photo || './default-profile.png'; // Use a default photo if none is provided
        profilePhoto.alt = `Foto de perfil de ${profileData.name}`;

        // Render genre
        const profileGenre = document.getElementById('profile-genre');
        profileGenre.textContent = `Género musical: ${profileData.genre}`;

        // Render links
        const profileLinks = document.getElementById('profile-links');
        profileLinks.innerHTML = '<h3>Enlaces:</h3>';
        profileData.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.type.charAt(0).toUpperCase() + link.type.slice(1); // Capitalize link type
            linkElement.target = '_blank'; // Open link in a new tab
            linkElement.className = 'w3-btn w3-black';
            profileLinks.appendChild(linkElement);
        });
    } catch (err) {
        console.error('Error loading profile data:', err);
        profileContainer.innerHTML = '<p>Error al cargar el perfil público.</p>';
    }
});