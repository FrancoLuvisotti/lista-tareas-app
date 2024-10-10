const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Crear una nueva tarea
router.post('/tasks', authMiddleware, (req, res) => {
    const { title, description } = req.body;
    const userId = req.session.user.id;
    Task.create(title, description, userId, (err, result) => {
        if (err) return res.status(500).send('Error al crear la tarea');
        res.redirect('/');
    });
});

// Obtener todas las tareas del usuario
router.get('/', (req, res) => {
    const userId = req.session.user.id; // Obtener el ID del usuario de la sesión
    Task.getByUserId(userId, (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las tareas' });
        }
        res.json(tasks); // Devolver las tareas en formato JSON
    });
});

// Marcar tarea como completada
router.put('/:id/complete', (req, res) => {
    const taskId = req.params.id;
    Task.markAsCompleted(taskId, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al completar la tarea' });
        }
        res.sendStatus(200);
    });
});

// Eliminar una tarea
router.delete('/:id', (req, res) => {
    const taskId = req.params.id;
    Task.delete(taskId, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar la tarea' });
        }
        res.sendStatus(200);
    });
});

module.exports = router;