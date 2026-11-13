import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/api/client';

// Чаты живут на сервере.
// Список диалогов приходит без переписки (только превью и счётчик непрочитанных),
// переписка открытого диалога грузится отдельно и дальше докачивается только новыми сообщениями.
export const useChatStore = defineStore('chat', () => {
  const chats = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  const messages = ref({}); // chatId → []
  const otherReadAt = ref({}); // chatId → дата, когда собеседник прочитал

  const unreadTotal = computed(() => chats.value.reduce((s, c) => s + (c.unread || 0), 0));

  const fetchChats = async () => {
    if (!localStorage.getItem('token')) {
      chats.value = [];
      loaded.value = true;
      return { success: true };
    }
    loading.value = true;
    const res = await api('/chats');
    loading.value = false;
    loaded.value = true;
    if (res.ok) chats.value = res.data;
    return { success: res.ok, message: res.message };
  };

  const listItem = (id) => chats.value.find((c) => c.id === id);

  const addMessages = (chatId, list) => {
    const current = messages.value[chatId] || [];
    const known = new Set(current.map((m) => m.id));
    const fresh = list.filter((m) => !known.has(m.id));
    if (!fresh.length && messages.value[chatId]) return 0;
    messages.value = { ...messages.value, [chatId]: [...current, ...fresh] };
    const last = fresh[fresh.length - 1];
    const item = listItem(chatId);
    if (item && last) {
      item.lastMessage = { senderId: last.senderId, type: last.type, text: last.type === 'voice' ? '' : last.text, createdAt: last.createdAt };
    }
    return fresh.length;
  };

  // Открыть диалог: вся переписка; при повторном вызове — только новые сообщения
  const loadMessages = async (chatId) => {
    const have = messages.value[chatId];
    const since = have && have.length ? have[have.length - 1].createdAt : null;
    const res = await api(`/chats/${chatId}${since ? `?since=${encodeURIComponent(since)}` : ''}`);
    if (!res.ok) return { success: false, message: res.message, added: 0 };
    const added = addMessages(chatId, res.data.messages || []);
    otherReadAt.value = { ...otherReadAt.value, [chatId]: res.data.otherReadAt };
    const item = listItem(chatId);
    if (item) item.status = res.data.status;
    return { success: true, added };
  };

  const markRead = async (chatId) => {
    const item = listItem(chatId);
    if (item) item.unread = 0;
    await api(`/chats/${chatId}/read`, { method: 'POST' });
  };

  const sendMessage = async (chatId, text, type = 'text', duration = 0) => {
    const res = await api(`/chats/${chatId}/messages`, { method: 'POST', body: { text, type, duration } });
    if (res.ok) {
      addMessages(chatId, [res.data]);
      // диалог с новым сообщением — наверх списка
      const i = chats.value.findIndex((c) => c.id === chatId);
      if (i > 0) chats.value.unshift(chats.value.splice(i, 1)[0]);
    }
    return { success: res.ok, message: res.message };
  };

  const closeChat = async (chatId) => {
    const res = await api(`/chats/${chatId}/close`, { method: 'POST' });
    if (res.ok) {
      const chat = listItem(chatId);
      if (chat) chat.status = 'closed';
    }
    return { success: res.ok, message: res.message };
  };

  return { chats, loading, loaded, messages, otherReadAt, unreadTotal, fetchChats, loadMessages, markRead, sendMessage, closeChat };
});
