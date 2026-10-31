<script setup>
defineProps({
  modelValue: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label for="search" class="sr-only">Поиск задач</label>
    <input 
      id="search"
      type="search"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
      placeholder="Поиск задач..."
    >
  </div>
</template>