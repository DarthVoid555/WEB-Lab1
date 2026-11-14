<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  try {
    errorMsg.value = ''
    userStore.login(email.value, password.value)
    router.push('/todo')
  } catch (e) {
    errorMsg.value = e.message
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
    <h2 class="text-2xl font-bold mb-6 text-center">Вход</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 focus:outline-none focus:border-blue-500">
      </div>
      <div>
        <label class="block text-sm mb-1">Пароль</label>
        <input v-model="password" type="password" required class="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 focus:outline-none focus:border-blue-500">
      </div>
      <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
      <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Войти</button>
      <p class="text-center text-sm mt-2">
        Нет аккаунта? <RouterLink to="/register" class="text-blue-500 hover:underline">Зарегистрироваться</RouterLink>
      </p>
    </form>
  </div>
</template>