document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const taskListEl = document.querySelector('.js-task-list');
  const emptyStateEl = document.querySelector('.js-empty-state');
  const searchInput = document.querySelector('.js-search');
  const modal = document.querySelector('.js-modal');
  const form = document.querySelector('.js-form');
  const taskInput = document.querySelector('.js-task-input');
  const modalTitle = document.getElementById('modal-title');
  const addBtn = document.querySelector('.js-add-btn');
  const closeBtn = document.querySelector('.js-close-btn');
  const themeToggle = document.querySelector('.js-theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-toggle__icon');

  // Состояние
  let tasks = [];
  let currentSearch = '';
  let editingTaskId = null;
  let lastFocusedElement = null;

  // --- 1. LOCAL STORAGE ---
  function loadTasks() {
    try {
      const saved = localStorage.getItem('todo-tasks');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(t => t && t.id && t.title) : [];
    } catch (e) {
      console.warn('Ошибка загрузки задач', e);
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }

  // --- 2. РЕНДЕР СПИСКА ---
  function renderTasks() {
    taskListEl.innerHTML = '';

    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(currentSearch.toLowerCase())
    );

    // Сортировка: невыполненные сверху
    filteredTasks.sort((a, b) => a.done - b.done);

    if (filteredTasks.length === 0) {
      emptyStateEl.style.display = 'block';
      emptyStateEl.textContent = currentSearch
        ? 'Ничего не найдено по запросу.'
        : 'Пока нет задач.';
    } else {
      emptyStateEl.style.display = 'none';
    }

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task ${task.done ? 'task--done' : ''}`;
      li.dataset.id = task.id;

      // Чекбокс + заголовок
      const label = document.createElement('label');
      label.className = 'task__label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task__checkbox js-toggle';
      checkbox.checked = task.done;
      checkbox.id = `task-${task.id}-done`;

      const title = document.createElement('span');
      title.className = 'task__title';
      title.id = `task-${task.id}-title`;
      title.textContent = task.title;

      label.appendChild(checkbox);
      label.appendChild(title);

      // Действия (редактировать, удалить)
      const actions = document.createElement('div');
      actions.className = 'task__actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn-icon js-edit';
      editBtn.innerHTML = '✎';
      editBtn.setAttribute('aria-label', `Редактировать задачу ${task.title}`);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-icon btn-icon--danger js-delete';
      deleteBtn.innerHTML = '✕';
      deleteBtn.setAttribute('aria-label', `Удалить задачу ${task.title}`);

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(label);
      li.appendChild(actions);
      taskListEl.appendChild(li);
    });
  }

  // --- 3. ДОБАВЛЕНИЕ И РЕДАКТИРОВАНИЕ ---
  addBtn.addEventListener('click', () => {
    editingTaskId = null;
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = 'Новая задача';
    taskInput.value = '';
    modal.showModal(); // Нативный метод сам управляет фокусом и Esc
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    if (editingTaskId) {
      // Редактирование
      const task = tasks.find(t => t.id === editingTaskId);
      if (task) task.title = title;
    } else {
      // Добавление
      tasks.push({
        id: Date.now().toString(),
        title: title,
        done: false
      });
    }

    saveTasks();
    renderTasks();
    modal.close();
  });

  // --- 4. УПРАВЛЕНИЕ ЗАДАЧАМИ (Делегирование событий) ---
  taskListEl.addEventListener('click', (e) => {
    const li = e.target.closest('.task');
    if (!li) return;
    const id = li.dataset.id;
    const task = tasks.find(t => t.id === id);

    // Удаление
    if (e.target.closest('.js-delete')) {
      // A5: Сохраняем фокус перед удалением
      const nextFocusTarget = findNextFocusable(li);

      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();

      // Возвращаем фокус
      if (nextFocusTarget) {
        nextFocusTarget.focus();
      } else {
        addBtn.focus(); // Если задач больше нет, фокус на кнопку "Добавить"
      }
    }

    // Редактирование
    if (e.target.closest('.js-edit')) {
      editingTaskId = id;
      lastFocusedElement = e.target.closest('.js-edit');
      modalTitle.textContent = 'Редактировать задачу';
      taskInput.value = task.title;
      modal.showModal();
    }
  });

  taskListEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('js-toggle')) {
      const li = e.target.closest('.task');
      const id = li.dataset.id;
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.done = e.target.checked;
        saveTasks();
        renderTasks(); // Перерендер, чтобы задача ушла вниз
      }
    }
  });

  // Вспомогательная функция для A5
  function findNextFocusable(currentLi) {
    const allLis = [...taskListEl.querySelectorAll('.task')];
    const index = allLis.indexOf(currentLi);

    // Ищем следующую видимую задачу
    for (let i = index + 1; i < allLis.length; i++) {
      if (allLis[i].style.display !== 'none') {
        return allLis[i].querySelector('.task__checkbox');
      }
    }
    // Если ниже нет, ищем выше
    for (let i = index - 1; i >= 0; i--) {
      if (allLis[i].style.display !== 'none') {
        return allLis[i].querySelector('.task__checkbox');
      }
    }
    return null;
  }

  // --- 5. ПОИСК ---
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderTasks();
  });

  // --- 6. ТЕМЫ ---
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('todo-theme', theme);
    themeIcon.textContent = theme === 'dark' ? 'switch to light theme' : 'switch to dark theme️';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Инициализация
  tasks = loadTasks();
  renderTasks();

  const savedTheme = localStorage.getItem('todo-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
});