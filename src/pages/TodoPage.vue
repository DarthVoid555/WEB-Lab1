<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todo'
import TodoList from '../components/TodoList.vue'
import AddTodoModal from '../components/AddTodoModal.vue'
import SearchBar from '../components/SearchBar.vue'

const todoStore = useTodoStore()
const isModalOpen = ref(false)
const editingTask = ref(null)

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
    todoStore.updateTask(editingTask.value.id, title)
  } else {
    todoStore.addTask(title)
  }
  isModalOpen.value = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
    <!-- Заголовок и кнопка добавления -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <h2 class="text-2xl font-bold">Мои задачи</h2>
      <button @click="openAddModal" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
        Добавить задачу
      </button>
    </div>

    <SearchBar v-model="todoStore.searchQuery" />

    <TodoList 
      :tasks="todoStore.filteredTasks" 
      @toggle="todoStore.toggleTask" 
      @edit="openEditModal" 
      @delete="todoStore.deleteTask" 
    />
    
    <p v-if="todoStore.filteredTasks.length === 0" class="text-center text-zinc-500 py-8">
      {{ todoStore.searchQuery ? 'Ничего не найдено.' : 'Пока нет задач.' }}
    </p>

    <AddTodoModal 
      v-if="isModalOpen" 
      :initial-title="editingTask?.title || ''"
      :is-editing="!!editingTask"
      @close="isModalOpen = false"
      @submit="handleModalSubmit"
    />
  </div>
</template>