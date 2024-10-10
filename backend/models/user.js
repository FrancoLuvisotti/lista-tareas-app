const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {};

// Crear un nuevo usuario

User.create = (name, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) =>{
        if (err) return callback(err, null);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    });
};
    

// Buscar usuario por mail 

User.findByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result[0]);
    });
};

module.exports = User;