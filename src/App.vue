<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TodoList from './components/TodoList.vue'
import AddTodoModal from './components/AddTodoModal.vue'
import SearchBar from './components/SearchBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'

// --- Состояние ---
const tasks = ref([])
const searchQuery = ref('')
const isModalOpen = ref(false)
const editingTask = ref(null)

// --- Работа с LocalStorage ---
function loadTasks() {
  try {
    const saved = localStorage.getItem('vue-todo-tasks')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('Ошибка чтения задач', e)
    return []
  }
}

// WATCH: Сохраняем в LocalStorage при любом изменении задач
watch(tasks, (newTasks) => {
  localStorage.setItem('vue-todo-tasks', JSON.stringify(newTasks))
}, { deep: true })

// COMPUTED: Отфильтрованные и отсортированные задачи
const filteredTasks = computed(() => {
  let result = tasks.value.filter(task => 
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  // Сортировка: невыполненные (false) идут первыми (0), выполненные (true) внизу (1)
  return result.sort((a, b) => a.done - b.done)
})

// --- Действия ---
function handleAddTask(title) {
  tasks.value.push({
    id: Date.now().toString(),
    title: title,
    done: false
  })
  isModalOpen.value = false
}

function handleEditTask(id, newTitle) {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.title = newTitle
  }
  isModalOpen.value = false
}

function handleToggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

function handleDeleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function openAddModal() {
  editingTask.value = null
  isModalOpen.value = true
}

function openEditModal(task) {
  editingTask.value = { ...task }
  isModalOpen.value = true
}

function handleModalSubmit(title) {
  if (editingTask.value) {
    handleEditTask(editingTask.value.id, title)
  } else {
    handleAddTask(title)
  }
}

// --- Тема ---
const currentTheme = ref('dark')

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  applyTheme(currentTheme.value)
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('vue-todo-theme', theme)
}

// --- Жизненный цикл ---
onMounted(() => {
  tasks.value = loadTasks()
  const savedTheme = localStorage.getItem('vue-todo-theme') || 'dark'
  currentTheme.value = savedTheme
  applyTheme(savedTheme)
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased transition-colors duration-300">
    
    <header class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold">To-Do List</h1>
        
        <ThemeToggle :theme="currentTheme" @toggle="toggleTheme" />
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      
      <SearchBar v-model="searchQuery" />

      <div class="flex justify-end">
        <button 
          @click="openAddModal"
          class="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
        >
          Добавить задачу
        </button>
      </div>

      <TodoList 
        :tasks="filteredTasks" 
        @toggle="handleToggleTask" 
        @edit="openEditModal" 
        @delete="handleDeleteTask" 
      />
      
      <p v-if="filteredTasks.length === 0" class="text-center text-zinc-500 dark:text-zinc-400 py-8">
        {{ searchQuery ? 'Ничего не найдено.' : 'Пока нет задач.' }}
      </p>

    </main>

    <!-- модальное окно создается в DOM только когда нужно -->
    <AddTodoModal 
      v-if="isModalOpen" 
      :initial-title="editingTask?.title || ''"
      :is-editing="!!editingTask"
      @close="isModalOpen = false"
      @submit="handleModalSubmit"
    />

  </div>
</template>