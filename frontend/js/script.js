document.addEventListener('DOMContentLoaded', () => {
    // Obtener y mostrar las tareas del usuario
    const taskContainer = document.getElementById('task-list');

    const loadTasks = () => {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskContainer.innerHTML = ''; // Limpiar contenedor de tareas

                tasks.forEach(task => {
                    const taskCard = document.createElement('div');
                    taskCard.classList.add('col-md-4', 'mb-4');
                    taskCard.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${task.title}</h5>
                                <p class="card-text">${task.description}</p>
                                <p class="card-text"><strong>Estado:</strong> ${task.completed ? 'Completada' : 'Pendiente'}</p>
                                <button class="btn btn-success btn-complete" data-id="${task.id}" ${task.completed ? 'disabled' : ''}>Marcar como Completada</button>
                                <button class="btn btn-primary btn-edit" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#editTaskModal">Editar</button>
                                <button class="btn btn-danger btn-delete" data-id="${task.id}">Eliminar</button>
                            </div>
                        </div>
                    `;
                    taskContainer.appendChild(taskCard);
                });

                // Agregar eventos a los botones de completar, editar y eliminar
                document.querySelectorAll('.btn-complete').forEach(button => {
                    button.addEventListener('click', markAsCompleted);
                });

                document.querySelectorAll('.btn-edit').forEach(button => {
                    button.addEventListener('click', openEditModal);
                });

                document.querySelectorAll('.btn-delete').forEach(button => {
                    button.addEventListener('click', deleteTask);
                });
            })
            .catch(error => {
                console.error('Error al cargar tareas:', error);
                alert('Error al cargar tareas. Intente nuevamente.');
            });
    };

    const markAsCompleted = (e) => {
        const taskId = e.target.getAttribute('data-id');
        showLoadingModal();

        fetch('/tasks/${taskId}/complete', {
            method: 'PUT'
        })
            .then(response => {
                if (response.ok) {
                    loadTasks(); // Recargar las tareas
                    showAlert('success');
                } else {
                    showAlert('error');
                }
                hideLoadingModal();
            })
            .catch(error => {
                console.error('Error al marcar como completada:', error);
                alert('Error al marcar la tarea como completada. Intente nuevamente.');
                hideLoadingModal();
            });
    };

    const openEditModal = (e) => {
        const taskId = e.target.getAttribute('data-id');

        // Obtener los detalles de la tarea
        fetch('/tasks/${taskId}')
            .then(response => response.json())
            .then(task => {
                document.getElementById('edit-task-title').value = task.title;
                document.getElementById('edit-task-description').value = task.description;

                // Al enviar el formulario, actualizar la tarea
                document.getElementById('edit-task-form').onsubmit = (event) => {
                    event.preventDefault();
                    updateTask(taskId);
                };

                // Mostrar el modal
                $('#editTaskModal').modal('show');
            })
            .catch(error => {
                console.error('Error al cargar la tarea:', error);
                alert('Error al cargar los detalles de la tarea. Intente nuevamente.');
            });
    };

    const updateTask = (taskId) => {
        const title = document.getElementById('edit-task-title').value;
        const description = document.getElementById('edit-task-description').value;

        fetch('/tasks/${taskId}', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
            .then(response => {
                if (response.ok) {
                    loadTasks(); // Recargar tareas
                    $('#editTaskModal').modal('hide'); // Cerrar modal
                    showAlert('success');
                } else {
                    alert('Error al actualizar la tarea. Intente nuevamente.');
                }
            })
            .catch(error => {
                console.error('Error al actualizar la tarea:', error);
                alert('Error al actualizar la tarea. Intente nuevamente.');
            });
    };

    const deleteTask = (e) => {
        const taskId = e.target.getAttribute('data-id');
        showLoadingModal();

        fetch('/tasks/${taskId}', {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    loadTasks(); // Recargar las tareas
                    showAlert('success');
                } else {
                    alert('Error al eliminar la tarea. Intente nuevamente.');
                }
                hideLoadingModal();
            })
            .catch(error => {
                console.error('Error al eliminar tarea:', error);
                alert('Error al eliminar la tarea. Intente nuevamente.');
                hideLoadingModal();
            });
    };

    // Cargar tareas al iniciar la página
    loadTasks();
});

// Funciones para mostrar y ocultar el modal de carga
const showLoadingModal = () => {
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
};

const hideLoadingModal = () => {
    const loadingModal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
    loadingModal.hide();
};

// Función para mostrar alertas de éxito y error
const showAlert = (type) => {
    const alert = document.getElementById('${type}Alert)');
    alert.classList.add('show');
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000); // Ocultar alerta después de 3 segundos
};