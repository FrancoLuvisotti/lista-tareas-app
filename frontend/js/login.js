document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return alert('Por favor, ingrese su correo electrónico y contraseña.');
    }

    try {
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email , password: password}),
        });

        // Verificar si la respuesta tiene contenido
        if (!res.ok) {
            const errorMessage = await res.json();  // Obtener el mensaje de error
            return alert(`Error: ${errorMessage.message}`); // Mostrar el mensaje de error
            // throw new Error(`Error: ${errorMessage.message}`);
        }

        const data = await res.json(); // Convertir la respuesta en JSON
        alert('Inicio de sesion exitoso');
        //Almacebar token en localstorage
        console.log('Token recibido:', data.token)
        localStorage.setItem('token', data.token);
        window.location.href = '../views/index.html';

    } catch (error) {
        console.error('Error:', error.message);
        alert('Ocurrió un error, intente nuevamente.' + error.message);
    }
});