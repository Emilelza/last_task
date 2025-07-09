window.onload = function() {
    loadTasks();
};

function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const container = document.createElement('div');
                container.className = 'cont-style';

                const label = document.createElement('span');
                label.textContent = task.name;
                if (task.completed) {
                    label.style.textDecoration= 'line-through';
                }

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteTask(task.id);


                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.className='task-checkbox';
                checkbox.onchange=() => toggleTask(task.id, checkbox.checked);


                container.appendChild(label);
                container.appendChild(deleteButton);
                container.appendChild(checkbox);
                taskList.appendChild(container);
            });
        })};


function toggleTask(id,isChecked){
    fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: isChecked })
    }).then(() => loadTasks());
}

function deleteTask(id) {
    fetch(`/tasks/${id}`, {
        method: 'DELETE'
    }).then(() => loadTasks());
}


function add(){
    const input=document.getElementById('task');
    const task= input.value.trim();
        if(task=== '') return;
            fetch('/tasks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ name: task, completed: false })
            }).then(() => {
                input.value = '';
                loadTasks();
                });
}
    
function save() {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.children).map(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        const label = container.querySelector('span');
        return {
            name: label.textContent,
            completed: checkbox.checked
        };
    });

    if (tasks.length === 0) {
        alert('No tasks to save.');
        return;
    }

    fetch('/tasks/save', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tasks)
    }).then(response => {
        if (response.ok) {
            alert('Tasks saved successfully!');
            loadTasks(); // Reload tasks to reflect any changes
        } else {
            alert('Failed to save tasks.');
        }
    }).catch(error => {
        console.error('Error saving tasks:', error);
        alert('Error saving tasks.');
    }
    );
}

    
