import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/api/client';

export const useNotificationStore = defineStore('notifications', () => {
  const items = ref([]);
  const unreadCount = computed(() => items.value.filter((n) => !n.read).length);

  const fetchNotifications = async () => {
    if (!localStorage.getItem('token')) {
      items.value = [];
      return;
    }
    const res = await api('/notifications');
    if (res.ok) items.value = res.data;
  };

  const markAllRead = async () => {
    const res = await api('/notifications/read-all', { method: 'POST' });
    if (res.ok) items.value.forEach((n) => { n.read = true; });
  };

  const clearAll = async () => {
    const res = await api('/notifications', { method: 'DELETE' });
    if (res.ok) items.value = [];
  };

  return { items, unreadCount, fetchNotifications, markAllRead, clearAll };
});
