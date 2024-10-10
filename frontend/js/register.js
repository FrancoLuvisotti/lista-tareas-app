document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    // const confirmPassword = document.getElementById('confirm-password').value;

    // Validaciones básicas
    if (!name || !email || !password // || !confirmPassword
        ) {
        return alert('Por favor, complete todos los campos.');
    }

    //if (password !== confirmPassword) {
    //    return alert('Las contraseñas no coinciden.');
    //}

    try {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name, // : name.Value,
                email,// : email.Value, 
                password //: password.Value
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Registro exitoso, por favor inicie sesión.');
            window.location.href = '../views/login.html';
        } else {
            alert(data.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error, intente nuevamente.');
    }
});