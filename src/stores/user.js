import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref([]) // Массив всех зарегистрированных пользователей
  const currentUserId = ref(null) // ID того, кто сейчас вошел

  const isAuthenticated = computed(() => currentUserId.value !== null)
  const currentUser = computed(() => users.value.find(u => u.id === currentUserId.value))

  function register(email, password) {
    if (users.value.some(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует')
    }
    const newUser = { id: Date.now().toString(), email, password }
    users.value.push(newUser)
    return newUser
  }

  function login(email, password) {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Неверный email или пароль')
    currentUserId.value = user.id
  }

  function logout() {
    currentUserId.value = null
  }

  return { users, currentUserId, isAuthenticated, currentUser, register, login, logout }
}, {
  persist: true // Сохраняем пользователей и сессию в localStorage
})