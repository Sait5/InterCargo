import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/api/client';

// Чаты живут на сервере; страница чата опрашивает их раз в несколько секунд
export const useChatStore = defineStore('chat', () => {
  const chats = ref([]);
  const loading = ref(false);

  const fetchChats = async () => {
    if (!localStorage.getItem('token')) {
      chats.value = [];
      return { success: true };
    }
    loading.value = true;
    const res = await api('/chats');
    loading.value = false;
    if (res.ok) chats.value = res.data;
    return { success: res.ok, message: res.message };
  };

  const sendMessage = async (chatId, text, type = 'text', duration = 0) => {
    const res = await api(`/chats/${chatId}/messages`, { method: 'POST', body: { text, type, duration } });
    if (res.ok) {
      const chat = chats.value.find((c) => c.id === chatId);
      if (chat) chat.messages.push(res.data);
    }
    return { success: res.ok, message: res.message };
  };

  const closeChat = async (chatId) => {
    const res = await api(`/chats/${chatId}/close`, { method: 'POST' });
    if (res.ok) {
      const chat = chats.value.find((c) => c.id === chatId);
      if (chat) chat.status = 'closed';
    }
    return { success: res.ok, message: res.message };
  };

  return { chats, loading, fetchChats, sendMessage, closeChat };
});
