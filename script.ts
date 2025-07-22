const model = document.getElementById('change-model') as HTMLImageElement;
const container = document.getElementsByClassName('container')[0] as HTMLImageElement;
const LOCAL_STORAGE_KEY = 'todo-app-tasks';
const input = document.getElementById('new-todo') as HTMLInputElement;
const list = document.getElementById('todo-list')!;
const allBtn = document.getElementById('all')!;
const activeBtn = document.getElementById('active')!;
const completedBtn = document.getElementById('completed')!;
const deleteAllcompleted = document.getElementById('clear-completed')!;
let currentFilter: "all" | "active" | "completed" = "all";
const itemNum = document.getElementById("item-num")!;

type Task = {
  id: string;
  content: string;
  completed: boolean;
};

model.addEventListener('click', ()=>{
    if (model.src.includes('icon-sun.svg')) {
        model.src = './images/icon-moon.svg';
    } else {
        model.src = './images/icon-sun.svg';
    };
    container.classList.toggle('night');
});

function saveTasksToStorage(tasks: Task[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromStorage(): Task[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function renderTask(task: Task): void {
    const item = document.createElement("div");
    item.setAttribute("data-id", task.id);
    item.className = "todo-item";
    if(task.completed){item.classList.add("completed");}

    item.innerHTML = `
        <span class="circle-back">
        <span class="circle">
            <span class="circle-img">
            <img alt="complete it!" src="./images/icon-check.svg">
            </span>
        </span>
        </span>
        <span class="text">${task.content}</span>
        <img class="delete" alt="delete the item" src="./images/icon-cross.svg">
    `
    list.appendChild(item);
}

function addTask(content: string): void {
  const tasks = loadTasksFromStorage();
  const newTask: Task = {
    id: Date.now().toString(),
    content,
    completed: false,
  };
  tasks.push(newTask);
  saveTasksToStorage(tasks);
  renderTask(newTask);
}

function deleteTask(id: string): void {
  const tasks = loadTasksFromStorage().filter(task => task.id !== id);
  saveTasksToStorage(tasks);
  refreshTaskList();
}

function toggleTaskCompleted(id: string): void {
  const tasks = loadTasksFromStorage();
  const updatedTasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasksToStorage(updatedTasks);
  refreshTaskList();
}

function refreshTaskList(): void {
  list.innerHTML = "";
  const tasks = loadTasksFromStorage();
  tasks.forEach(renderTask);
  itemNum.textContent = `${tasks.length} items left`;
}

window.addEventListener("DOMContentLoaded", () => {
  refreshTaskList();
});

input.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const content = input.value.trim();
    if (content === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      content,
      completed: false
    };

    const tasks = loadTasksFromStorage();
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    renderTask(newTask);

    input.value = "";
  }
});

list.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const deleteBtn = target.closest('.delete');
  const tick = target.closest('.circle');
  const item = target.closest('.todo-item') as HTMLElement | null;
  if (!item) return;

  const itemId = item.getAttribute("data-id");
  if (!itemId) return;

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

function deleteAllCompletedTask(): void {
  const tasks = loadTasksFromStorage().filter(task => task.completed === false);
  saveTasksToStorage(tasks);
  refreshTaskList();
}

deleteAllcompleted.addEventListener('click', () =>{
    deleteAllCompletedTask();
    refreshTaskList();
});

function setSelected(buttonId: string): void {
  document.querySelectorAll("#all, #active, #completed").forEach(btn => {
    btn.classList.remove("selected");
  });
  document.getElementById(buttonId)!.classList.add("selected");
}

function filterAndRenderTasks(filter: "all" | "active" | "completed"): void {
  const tasks = loadTasksFromStorage();
  let filteredTasks: Task[] = [];

  if (filter === "all") {
    filteredTasks = tasks;
  } else if (filter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  itemNum.textContent = `${filteredTasks.length} items left`;

  const list = document.getElementById("todo-list")!;
  list.innerHTML = "";
  filteredTasks.forEach(renderTask);
}

allBtn.addEventListener("click", () => {
  setSelected("all");
  currentFilter = "all";
  filterAndRenderTasks("all");
});

activeBtn.addEventListener("click", () => {
  setSelected("active");
  currentFilter = "active";
  filterAndRenderTasks("active");
});

completedBtn.addEventListener("click", () => {
  setSelected("completed");
  currentFilter = "completed";
  filterAndRenderTasks("completed");
});
