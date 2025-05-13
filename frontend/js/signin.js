document.getElementById('signin-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the JWT in localStorage
            window.location.href = './index.html'; // Redirect to the profile setup page
        } else {
            const errorData = await response.json();
            document.getElementById('signin-error').textContent = errorData.error || 'Sign-in failed.';
            document.getElementById('signin-error').style.display = 'block';
        }
    } catch (err) {
        console.error('Error during sign-in:', err);
        document.getElementById('signin-error').textContent = 'Error de conexión.';
        document.getElementById('signin-error').style.display = 'block';
    }
});