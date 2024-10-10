const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Puedes usar bcrypt o bcryptjs
const User = require('../models/user'); // Tu modelo de usuario
//const db = require('../config/database');


// Ruta de registro de usuario
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Buscar si el usuario ya existe
    User.findByEmail(email, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error del servidor' });
        }
        if (user) return res.status(400).json({ message: 'El usuario ya existe' });

        // Hashear la contraseña antes de guardarla
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error al hashear la contraseña' });
            }
            // Crear un nuevo usuario con la contraseña hasheada
            User.create(name, email, hashedPassword, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Error al crear el usuario' });
                }
                res.status(201).json({ message: 'Usuario creado exitosamente' });
            });
        });
    });
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    console.log('Solicitud recibida', req.body); //Verifica la solicitud
    const { email, password } = req.body;

// Verificación de inicio de sesión

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.log('Error al buscar al usuario', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }
        if (!user) return res.status(400).json({ message: 'Correo no encontrado' });

        console.log('Contraseña ingresada' , password); // contraseña del formulario
        console.log('Contraseña Hasheada' , user.password); //contraseña de la bd

        // Comparar la contraseña ingresada con la contraseña hasheada en la bd

        //verificaciones secundarias

////////////////////////////////////////////////////////////////////////////////////

        // const passwordIngresado= '12345';
        // const hashGuardado = '$2a$10$GZGf3ktke2EKIBTgQuRHWuDYo.9ndQnRZaZTdbXPVAR1I49cZ2REu';
        // bcrypt.compare(passwordIngresado, hashGuardado, (err, isMatch) =>{
        //     if(err) throw err;
        //     if (isMatch) {
        //         console.log('contraseña correcta');
        //     }else{
        //         console.log('contraseña incorrecta');
        //     }
        // });

        // bcrypt.hash('12345', 10, (err, hash) => {
        //     console.log('hash generado;', hash);
        // });

//////////////////////////////////////////////////////////////////////////////////////////////
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log('Error al comparar contraseñas' , err);
                return res.status(500).json({ message: 'Error del servidor' });
            }

            console.log('Coinciden las contraseñas?', isMatch);

            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }
                //Inicio exitoso
            console.log('Inicio de sesion exitoso', user.email);
            res.status(200).json({message: 'Inicio de sesion exitoso', user});
        });
    });
});

module.exports = router;