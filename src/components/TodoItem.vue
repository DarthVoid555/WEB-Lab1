<script setup>
defineProps({
  task: { type: Object, required: true }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>

<template>
  <li class="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors" :class="{ 'opacity-60': task.done }">
    
    <label class="flex items-center gap-3 cursor-pointer flex-1">
      <input 
        type="checkbox" 
        :checked="task.done"
        @change="$emit('toggle')"
        class="w-5 h-5 cursor-pointer accent-blue-600"
      >
      <span 
        class="text-base break-words"
        :class="task.done ? 'line-through text-zinc-500 dark:text-zinc-400' : ''"
      >
        {{ task.title }}
      </span>
    </label>

    <div class="flex gap-2">
      <button 
        @click="$emit('edit')"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        :aria-label="`Редактировать задачу: ${task.title}`"
      >
        ✎
      </button>
      <button 
        @click="$emit('delete')"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        :aria-label="`Удалить задачу: ${task.title}`"
      >
        ✕
      </button>
    </div>
  </li>
</template>