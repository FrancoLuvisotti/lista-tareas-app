const db = require('../config/database');

const Task = {};

// Obtener todas las tareas de un usuario
Task.getByUserId = (userId, callback) => {
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

//crear una tarea
Task.create= (title, description, userId, callback) => {
    const query = 'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)';
    db.query(query, [title, description, userId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Marcar tarea como completada
Task.markAsCompleted = (taskId, callback) => {
    const query = 'UPDATE tasks SET completed = 1 WHERE id = ?';
    db.query(query, [taskId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Eliminar tarea
Task.delete = (taskId, callback) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [taskId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

module.exports = Task;