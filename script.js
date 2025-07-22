var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var model = document.getElementById('change-model');
var container = document.getElementsByClassName('container')[0];
var LOCAL_STORAGE_KEY = 'todo-app-tasks';
var input = document.getElementById('new-todo');
var list = document.getElementById('todo-list');
var allBtn = document.getElementById('all');
var activeBtn = document.getElementById('active');
var completedBtn = document.getElementById('completed');
var deleteAllcompleted = document.getElementById('clear-completed');
var currentFilter = "all";
var itemNum = document.getElementById("item-num");
model.addEventListener('click', function () {
    if (model.src.includes('./images/incon-sun.svg')) {
        model.src = './images/icon-moon.svg';
    }
    else {
        model.src = './images/icon-sun.svg';
    }
    ;
    container.classList.toggle('night');
});
function saveTasksToStorage(tasks) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}
function loadTasksFromStorage() {
    var data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}
function renderTask(task) {
    var item = document.createElement("div");
    item.setAttribute("data-id", task.id);
    item.className = "todo-item";
    if (task.completed) {
        item.classList.add("completed");
    }
    item.innerHTML = "\n        <span class=\"circle-back\">\n        <span class=\"circle\">\n            <span class=\"circle-img\">\n            <img alt=\"complete it!\" src=\"./images/icon-check.svg\">\n            </span>\n        </span>\n        </span>\n        <span class=\"text\">".concat(task.content, "</span>\n        <img class=\"delete\" alt=\"delete the item\" src=\"./images/icon-cross.svg\">\n    ");
    list.appendChild(item);
}
function addTask(content) {
    var tasks = loadTasksFromStorage();
    var newTask = {
        id: Date.now().toString(),
        content: content,
        completed: false,
    };
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    renderTask(newTask);
}
function deleteTask(id) {
    var tasks = loadTasksFromStorage().filter(function (task) { return task.id !== id; });
    saveTasksToStorage(tasks);
    refreshTaskList();
}
function toggleTaskCompleted(id) {
    var tasks = loadTasksFromStorage();
    var updatedTasks = tasks.map(function (task) {
        if (task.id === id) {
            return __assign(__assign({}, task), { completed: !task.completed });
        }
        return task;
    });
    saveTasksToStorage(updatedTasks);
    refreshTaskList();
}
function refreshTaskList() {
    list.innerHTML = "";
    var tasks = loadTasksFromStorage();
    tasks.forEach(renderTask);
    itemNum.textContent = "".concat(tasks.length, " items left");
}
window.addEventListener("DOMContentLoaded", function () {
    refreshTaskList();
});
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        var content = input.value.trim();
        if (content === "")
            return;
        var newTask = {
            id: Date.now().toString(),
            content: content,
            completed: false
        };
        var tasks = loadTasksFromStorage();
        tasks.push(newTask);
        saveTasksToStorage(tasks);
        renderTask(newTask);
        input.value = "";
    }
});
list.addEventListener('click', function (e) {
    var target = e.target;
    var deleteBtn = target.closest('.delete');
    var tick = target.closest('.circle');
    var item = target.closest('.todo-item');
    if (!item)
        return;
    var itemId = item.getAttribute("data-id");
    if (!itemId)
        return;
    if (tick) {
        toggleTaskCompleted(itemId);
        filterAndRenderTasks(currentFilter);
        return;
    }
    if (deleteBtn) {
        deleteTask(itemId);
        filterAndRenderTasks(currentFilter);
        return;
    }
});
function deleteAllCompletedTask() {
    var tasks = loadTasksFromStorage().filter(function (task) { return task.completed === false; });
    saveTasksToStorage(tasks);
    refreshTaskList();
}
deleteAllcompleted.addEventListener('click', function () {
    deleteAllCompletedTask();
    refreshTaskList();
});
function setSelected(buttonId) {
    document.querySelectorAll("#all, #active, #completed").forEach(function (btn) {
        btn.classList.remove("selected");
    });
    document.getElementById(buttonId).classList.add("selected");
}
function filterAndRenderTasks(filter) {
    var tasks = loadTasksFromStorage();
    var filteredTasks = [];
    if (filter === "all") {
        filteredTasks = tasks;
    }
    else if (filter === "active") {
        filteredTasks = tasks.filter(function (task) { return !task.completed; });
    }
    else if (filter === "completed") {
        filteredTasks = tasks.filter(function (task) { return task.completed; });
    }
    itemNum.textContent = "".concat(filteredTasks.length, " items left");
    var list = document.getElementById("todo-list");
    list.innerHTML = "";
    filteredTasks.forEach(renderTask);
}
allBtn.addEventListener("click", function () {
    setSelected("all");
    currentFilter = "all";
    filterAndRenderTasks("all");
});
activeBtn.addEventListener("click", function () {
    setSelected("active");
    currentFilter = "active";
    filterAndRenderTasks("active");
});
completedBtn.addEventListener("click", function () {
    setSelected("completed");
    currentFilter = "completed";
    filterAndRenderTasks("completed");
});
