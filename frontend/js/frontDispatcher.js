addEventListener("DOMContentLoaded", function() {
    //document.getElementById('signin-form').addEventListener('submit', function(event) {
    //    event.preventDefault(); // Prevent form submission for demonstration
    //    const username = document.getElementById('username').value;
    //    const password = document.getElementById('password').value;

        // Simulate verification (replace with actual server-side validation)
    //    if (username === "validUser" && password === "validPassword") {
    //        document.getElementById('success-message').style.display = 'block';
    //    } else {
    //        alert('Nombre de usuario o contraseña incorrectos.');
    //    }
    //});

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


function validateUsername(username) {
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,16}$/;
    
    /* 
        Desglose de la Expresión Regular
        Mínimo de 2 caracteres
        Máximo de 15 caracteres
        Puede contener letras, espacios y puede llevar acentos.       
    */
           
    return regex.test(username);
}
function validatePassword(password) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
    /* 
        Desglose de la Expresión Regular
        Mínimo de 8 caracteres
        Debe contener al menos una letra y un número.
    */
    
    return regex.test(password);
}

function checkForm(event) {

    event.preventDefault();

    const USERNAME = document.getElementById("username");
    const PASSWORD = document.getElementById("password");
    const ERROR_USERNAME = document.getElementById("errorUsername");
    const ERROR_PASSWORD = document.getElementById("errorPassword");
    ERROR_USERNAME.innerHTML = '';
    ERROR_PASSWORD.innerHTML = '';

    let hasError = false;

    if (!validateUsername(USERNAME.value.trim()) && USERNAME.required) {
        ERROR_USERNAME.innerHTML = "Nombre debe tener entre 2 y 15 caracteres alfabéticos.<br>";
        hasError = true;
    }
    if (!validatePassword(PASSWORD.value.trim()) && PASSWORD.required) {
        ERROR_PASSWORD.innerHTML = "Contraseña incorrecta.<br>";
        hasError = true;
    }
    //if (!hasError) {
    //}
}