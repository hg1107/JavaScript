let toDo = [];

function renderTodoList() {
    const todoListContainer = document.querySelector(".js-todo-list");
    todoListContainer.innerHTML = "";

    for (let i = 0; i < toDo.length; i++) {
        todoListContainer.innerHTML += `
        <div>${toDo[i].task}</div>
        <div>${toDo[i].dueDate}</div>
        <button class = "delete-button"
            onclick = "
            toDo.splice(${i}, 1);
            renderTodoList();
        ">Delete</button>
        `;
    }
}

function AddTask () {
    const taskInput = document.querySelector(".js-input-field");
    const dateInput = document.querySelector(".js-date");
    
    toDo.push({
        task: taskInput.value,
        dueDate: dateInput.value
    });
    console.log(toDo);
    taskInput.value = "";
    dateInput.value = "";
    
    renderTodoList();
}

function OnEnter(event) {
    if (event.key === 'Enter') {
        AddTask();
    }
}
