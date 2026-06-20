import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);
  let nextId = 0;

  const show = (message, type = 'success') => {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 4000);
  };

  const success = (message) => show(message, 'success');
  const error = (message) => show(message, 'error');
  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    success,
    error,
    remove
  };
});