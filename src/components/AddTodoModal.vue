<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  initialTitle: { type: String, default: '' },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const title = ref(props.initialTitle)
const dialogRef = ref(null)
const inputRef = ref(null)

onMounted(() => {
  dialogRef.value.showModal()
  nextTick(() => inputRef.value?.focus())
})

onUnmounted(() => {
  dialogRef.value?.close()
})

function handleSubmit() {
  if (title.value.trim()) {
    emit('submit', title.value.trim())
  }
}

// Закрытие по клику на backdrop
function handleBackdropClick(e) {
  if (e.target === dialogRef.value) {
    emit('close')
  }
}
</script>

<template>
  <dialog 
    ref="dialogRef"
    @click="handleBackdropClick"
    @close="$emit('close')"
    class="m-auto p-0 rounded-xl border-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xl max-w-sm w-[90%] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
  >
    <form @submit.prevent="handleSubmit" class="p-6">
      <h2 class="text-xl font-bold mb-5">{{ isEditing ? 'Редактировать' : 'Новая задача' }}</h2>
      
      <div class="flex flex-col gap-2">
        <label for="task-title" class="text-sm font-medium">Название задачи</label>
        <input 
          id="task-title"
          ref="inputRef"
          v-model="title"
          type="text" 
          class="w-full px-3 py-2.5 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
          required 
          autocomplete="off"
        >
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-blue-500 transition-colors"
        >
          Отмена
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
        >
          Сохранить
        </button>
      </div>
    </form>
  </dialog>
</template>