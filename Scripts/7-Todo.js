let toDo = [];
function AddTask () {
    const Task  = document.querySelector(".js-input-field");
    toDo.push(Task.value);
    console.log(toDo);
    Task.value = "";
    body = document.querySelector(".js-todo-list");
    body.innerHTML = "";
    for (let i = 0; i < toDo.length; i++) {
        body.innerHTML += `<p>${toDo[i]}</p>`;
    }
}

function OnEnter(event) {
    if (event.key === 'Enter') {
        AddTask();
    }
}
