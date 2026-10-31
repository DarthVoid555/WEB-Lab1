<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  tasks: { type: Array, required: true }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>

<template>
  <ul class="flex flex-col gap-3 list-none">
    <TodoItem 
      v-for="task in tasks" 
      :key="task.id" 
      :task="task" 
      @toggle="$emit('toggle', task.id)"
      @edit="$emit('edit', task)"
      @delete="$emit('delete', task.id)"
    />
  </ul>
</template>