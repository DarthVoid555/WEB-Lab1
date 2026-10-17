document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы по ID (самый надежный способ)
  const taskListEl = document.getElementById('task-list');
  const emptyStateEl = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-input');
  const modal = document.getElementById('modal');
  const form = document.getElementById('task-form');
  const taskInput = document.getElementById('task-title');
  const modalTitle = document.getElementById('modal-title');
  const addBtn = document.getElementById('add-btn');
  const closeBtn = document.getElementById('close-btn');
  const themeToggle = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');

  // Состояние
  let tasks = [];
  let currentSearch = '';
  let editingTaskId = null;

  // 1. Загрузка и сохранение
  function loadTasks() {
    try {
      const saved = localStorage.getItem('todo-tasks-tailwind');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem('todo-tasks-tailwind', JSON.stringify(tasks));
  }

  // 2. Рендер
  function renderTasks() {
    taskListEl.innerHTML = '';

    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(currentSearch.toLowerCase())
    );

    // Сортировка: невыполненные сверху
    filteredTasks.sort((a, b) => a.done - b.done);

    if (filteredTasks.length === 0) {
      emptyStateEl.classList.remove('hidden');
      emptyStateEl.textContent = currentSearch ? 'Ничего не найдено.' : 'Пока нет задач.';
    } else {
      emptyStateEl.classList.add('hidden');
    }

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors';
      if (task.done) li.classList.add('opacity-60');
      
      // Чекбокс и текст
      const label = document.createElement('label');
      label.className = 'flex items-center gap-3 cursor-pointer flex-1';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'w-5 h-5 cursor-pointer accent-blue-600 js-toggle';
      checkbox.checked = task.done;

      const title = document.createElement('span');
      title.className = task.done 
        ? 'text-base break-words line-through text-zinc-500 dark:text-zinc-400' 
        : 'text-base break-words';
      title.textContent = task.title;

      label.appendChild(checkbox);
      label.appendChild(title);

      // Кнопки
      const actions = document.createElement('div');
      actions.className = 'flex gap-2';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'js-edit w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors';
      editBtn.innerHTML = '✎';
      editBtn.setAttribute('aria-label', `Редактировать: ${task.title}`);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'js-delete w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors';
      delBtn.innerHTML = '✕';
      delBtn.setAttribute('aria-label', `Удалить: ${task.title}`);

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(label);
      li.appendChild(actions);
      li.dataset.id = task.id;
      taskListEl.appendChild(li);
    });
  }

  // 3. Добавление
  addBtn.addEventListener('click', () => {
    editingTaskId = null;
    modalTitle.textContent = 'Новая задача';
    taskInput.value = '';
    modal.showModal();
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    if (editingTaskId) {
      const task = tasks.find(t => t.id === editingTaskId);
      if (task) task.title = title;
    } else {
      tasks.push({ id: Date.now().toString(), title, done: false });
    }

    saveTasks();
    renderTasks();
    modal.close();
  });

  // 4. Удаление/Редактирование/Чекбокс (через делегирование)
  taskListEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    const task = tasks.find(t => t.id === id);

    if (e.target.closest('.js-delete')) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
      addBtn.focus(); // Фокус обратно на кнопку добавления
    }

    if (e.target.closest('.js-edit')) {
      editingTaskId = id;
      modalTitle.textContent = 'Редактировать';
      taskInput.value = task.title;
      modal.showModal();
    }
  });

  taskListEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('js-toggle')) {
      const li = e.target.closest('li');
      const id = li.dataset.id;
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.done = e.target.checked;
        saveTasks();
        renderTasks();
      }
    }
  });

  // 5. Поиск
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderTasks();
  });

  // 6. Тема
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('todo-theme-tailwind', theme);
    themeIcon.textContent = theme === 'dark' ? 'switch to light theme' : 'switch to dark theme';
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Инициализация
  tasks = loadTasks();
  renderTasks();
  
  const savedTheme = localStorage.getItem('todo-theme-tailwind') || 'dark';
  applyTheme(savedTheme);
});