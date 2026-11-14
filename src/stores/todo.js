import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref([]) // Все задачи всех пользователей
  const searchQuery = ref('')

  const userStore = useUserStore()

  // COMPUTED: Отфильтрованные задачи ТОЛЬКО текущего пользователя
  const filteredTasks = computed(() => {
    if (!userStore.currentUserId) return []
    
    let result = tasks.value.filter(t => 
      t.userId === userStore.currentUserId && 
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    return result.sort((a, b) => a.done - b.done)
  })

  // Действия
  function addTask(title) {
    tasks.value.push({
      id: Date.now().toString(),
      userId: userStore.currentUserId, // Привязка к пользователю
      title,
      done: false
    })
  }

  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.done = !task.done
  }

  function updateTask(id, newTitle) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.title = newTitle
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return { tasks, searchQuery, filteredTasks, addTask, toggleTask, updateTask, deleteTask }
}, {
  persist: true // Сохраняем задачи в localStorage
})