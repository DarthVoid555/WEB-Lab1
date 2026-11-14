<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const router = useRouter()

// --- Тема ---
const currentTheme = ref('dark')

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('vue-todo-theme', currentTheme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('vue-todo-theme') || 'dark'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// --- Выход ---
function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased transition-colors duration-300">
    
    <header class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        <RouterLink to="/" class="text-2xl font-bold">To-Do</RouterLink>
        
        <nav class="flex items-center gap-4 text-sm font-medium">
          <RouterLink to="/todo" class="hover:text-blue-500 transition-colors">Задачи</RouterLink>
          <RouterLink to="/about" class="hover:text-blue-500 transition-colors">О приложении</RouterLink>
          
          <!-- Показываем кнопку Выйти только авторизованным -->
          <button 
            v-if="userStore.isAuthenticated" 
            @click="handleLogout"
            class="text-red-500 hover:text-red-600 transition-colors"
          >
            Выйти
          </button>
          
          <button @click="toggleTheme" class="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            {{ currentTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}
          </button>
        </nav>
      </div>
    </header>

    <main>
      <!-- Сюда Vue Router будет вставлять страницы (Login, Todo и т.д.) -->
      <RouterView />
    </main>

  </div>
</template>