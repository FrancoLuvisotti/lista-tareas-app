document.addEventListener('DOMContentLoaded', function () {
    // Evento para agregar una tarea
    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        if (title.trim() && description.trim()) {
            addTask({ title, description });
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
        }
    });

    // Función para agregar una tarea
    function addTask(task) {
        showLoadingModal();

        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
            .then(response => {
                if (response.ok) {
                    loadTasks();
                    showAlert('success');
                } else {
                    showAlert('error');
                }
                hideLoadingModal();
            })
            .catch(() => {
                showAlert('error');
                hideLoadingModal();
            });
    }
});