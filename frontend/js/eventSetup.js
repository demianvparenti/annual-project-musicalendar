document.getElementById('create-event-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const date = document.getElementById('date').value; // Get the date value
    const time = document.getElementById('time').value; // Get the time value
    const location = document.getElementById('location').value;
    const entry_mode = document.getElementById('entry_mode').value;
    const price = document.getElementById('price').value || null;
    const ticketLink = document.getElementById('ticket_link').value || null;
    const flyerLink = document.getElementById('flyer_link').value || null;

    // Combine date and time into a single datetime string
    const dateTime = `${date}T${time}`;

    const payload = {
        date_time: dateTime, // Send the combined datetime to the backend
        location,
        entry_mode,
        price,
        ticket_link: ticketLink,
        flyer_link: flyerLink,
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert('Evento creado con éxito!');
            window.location.href = './index.html';
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al crear el evento.');
        }
    } catch (err) {
        console.error('Error creating event:', err);
        alert('Error de conexión.');
    }
});