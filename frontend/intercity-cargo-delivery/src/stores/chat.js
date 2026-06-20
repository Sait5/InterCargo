import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
	const chats = ref([]);

	const fetchChats = () => {
		const saved = localStorage.getItem('chats');
		chats.value = saved ? JSON.parse(saved) : [];
	};

	const saveChats = () => {
		localStorage.setItem('chats', JSON.stringify(chats.value));
	};

	const createChat = (orderId, customerId, carrierId) => {
		const exists = chats.value.find(c => c.orderId === orderId);
		if (exists) return;
		chats.value.push({
			orderId,
			customerId,
			carrierId,
			status: 'active',
			messages: [],
			createdAt: new Date().toISOString()
		});
		saveChats();
	};

	const sendMessage = (orderId, senderId, text, type = 'text', duration = 0) => {
		const chat = chats.value.find(c => c.orderId === orderId);
		if (!chat || chat.status === 'closed') return;
		chat.messages.push({
			id: Date.now(),
			senderId,
			text,
			type,
			duration,
			createdAt: new Date().toISOString()
		});
		saveChats();
	};

	const closeChat = (orderId) => {
		const chat = chats.value.find(c => c.orderId === orderId);
		if (chat) {
			chat.status = 'closed';
			saveChats();
		}
	};

	const getMyChats = (userId) => {
		return chats.value.filter(c => c.customerId === userId || c.carrierId === userId);
	};

	window.addEventListener('storage', (e) => {
		if (e.key === 'chats') {
			fetchChats();
		}
	});

	return {
		chats,
		fetchChats,
		createChat,
		sendMessage,
		closeChat,
		getMyChats
	};
});