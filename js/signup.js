addEventListener("DOMContentLoaded", function() {
    document.getElementById('signup-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
    
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, username, password }),
            });
    
            if (response.ok) {
                // Show success message
                document.getElementById('signup-success').style.display = 'block';
    
                // Redirect to profile setup page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'profile-setup.html';
                }, 2000);
            } else {
                const errorData = await response.json();
                document.getElementById('signup-error').textContent = errorData.error || 'Error al registrarse.';
                document.getElementById('signup-error').style.display = 'block';
            }
        } catch (err) {
            console.error('Error during signup:', err);
            document.getElementById('signup-error').textContent = 'Error de conexión.';
            document.getElementById('signup-error').style.display = 'block';
        }
    });

    const signupForm = document.getElementById('signup-form');
    if (!signupForm) {
        console.error('Signup form not found in the DOM');
        return;
    }

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log('Signup form submitted');
    
        // Retrieve values from the form
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const email = document.getElementById('email').value.trim();
        const name = document.getElementById('name').value.trim();
    
        try {
            // Send the data to the backend
            const response = await fetch('http://localhost:3000/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, name }),
            });
    
            const data = await response.json();
            if (response.ok) {
                document.getElementById('signup-success').style.display = 'block';
                document.getElementById('signup-success').textContent = 'Usuario creado con éxito.';
            } else {
                document.getElementById('signup-error').style.display = 'block';
                document.getElementById('signup-error').textContent = data.error || 'Error al crear el usuario.';
            }
        } catch (err) {
            console.error('Error:', err);
            document.getElementById('signup-error').style.display = 'block';
            document.getElementById('signup-error').textContent = 'Error al conectar con el servidor.';
        }
    });
});
