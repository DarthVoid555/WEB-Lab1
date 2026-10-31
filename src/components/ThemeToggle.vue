<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: { type: String, required: true }
})

defineEmits(['toggle'])

const buttonText = computed(() => {
  return props.theme === 'dark' ? 'switch to light theme' : 'switch to dark theme'
})
</script>

<template>
  <button 
    @click="$emit('toggle')"
    class="px-3 py-2 text-sm font-medium whitespace-nowrap flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-blue-500 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
    aria-label="Переключить тему"
  >
    {{ buttonText }}
  </button>
</template>