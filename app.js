document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('todo-input');
  const addButton = document.getElementById('add-btn');
  const todoList = document.getElementById('todo-list');
  const filterAll = document.getElementById('filter-all');
  const filterActive = document.getElementById('filter-active');
  const filterCompleted = document.getElementById('filter-completed');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-btn');
  const sortDate = document.getElementById('sort-date');
  const sortAlphaAsc = document.getElementById('sort-alpha-asc');

  let tasks = getTasksFromLocalStorage();

  // Load tasks from localStorage
  loadTasks();

  // Add task
  addButton.addEventListener('click', () => {
    if (input.value.trim() !== '') {
      const task = {
        text: input.value.trim(),
        completed: false,
        date: new Date().toISOString(),
      };
      tasks.push(task);
      addTaskToDOM(task);
      saveTasksToLocalStorage();
      input.value = '';
    }
  });

  // Mark task as complete or incomplete
  todoList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const taskText = li.querySelector('.todo-item').textContent;
    const task = tasks.find((task) => task.text === taskText);

    if (
      e.target.classList.contains('complete-btn') ||
      e.target.closest('.complete-btn')
    ) {
      task.completed = !task.completed;
      updateTaskInDOM(li, task);
      saveTasksToLocalStorage();
    } else if (
      e.target.classList.contains('delete-btn') ||
      e.target.closest('.delete-btn')
    ) {
      tasks = tasks.filter((task) => task.text !== taskText);
      li.remove();
      saveTasksToLocalStorage();
    } else if (
      e.target.classList.contains('edit-btn') ||
      e.target.closest('.edit-btn')
    ) {
      const newText = prompt('Edit task:', task.text);
      if (newText && newText.trim() !== '') {
        task.text = newText.trim();
        updateTaskInDOM(li, task);
        saveTasksToLocalStorage();
      }
    }
  });

  // Filter tasks
  filterAll.addEventListener('click', () => filterTasks('all'));
  filterActive.addEventListener('click', () => filterTasks('active'));
  filterCompleted.addEventListener('click', () => filterTasks('completed'));

  // Search tasks
  searchButton.addEventListener('click', () =>
    searchTasks(searchInput.value.trim())
  );

  // Sort by date
  sortDate.addEventListener('click', () => {
    tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    updateTodoList();
    saveTasksToLocalStorage();
  });

  // Sort alphabetically A-Z
  sortAlphaAsc.addEventListener('click', () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    updateTodoList();
    saveTasksToLocalStorage();
  });

  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span class="todo-item">${task.text}</span>
      <button class="complete-btn"><i class="fas fa-check"></i></button>
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
    `;
    todoList.appendChild(li);
  }

  function updateTaskInDOM(li, task) {
    li.className = task.completed ? 'completed' : '';
    li.querySelector('.todo-item').textContent = task.text;
  }

  function filterTasks(filter) {
    todoList.innerHTML = '';
    tasks
      .filter((task) => {
        switch (filter) {
          case 'active':
            return !task.completed;
          case 'completed':
            return task.completed;
          default:
            return true;
        }
      })
      .forEach((task) => addTaskToDOM(task));
  }

  function searchTasks(query) {
    todoList.innerHTML = '';
    tasks
      .filter((task) => task.text.toLowerCase().includes(query.toLowerCase()))
      .forEach((task) => addTaskToDOM(task));
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  function loadTasks() {
    tasks.forEach((task) => addTaskToDOM(task));
  }

  function updateTodoList() {
    todoList.innerHTML = '';
    tasks.forEach((task) => addTaskToDOM(task));
  }
});
