<template>
<DashboardLayout flush>
<div class="main-content chat-layout">
<aside class="chat-sidebar">
<div class="chat-sidebar-header">
<h2>Диалоги</h2>
<span class="chat-count">{{ myChats.length }}</span>
</div>
<div class="chat-list">
<div v-if="myChats.length === 0" class="chat-empty">
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<p>У вас пока нет активных чатов</p>
</div>
<div v-for="chat in myChats" :key="chat.id" class="chat-item" :class="{ active: selectedChatId === chat.id }" @click="selectChat(chat.id)">
<div class="chat-item-header">
<div class="chat-item-avatar">{{ getInterlocutorInitials(chat) }}</div>
<div class="chat-item-info">
<div class="chat-item-name">{{ getInterlocutorName(chat) }}</div>
<div class="chat-item-route">{{ chat.orderId?.route || 'Заказ' }}</div>
</div>
</div>
<div class="chat-item-status" :class="chat.status">{{ chat.status === 'active' ? 'Активен' : 'Завершен' }}</div>
</div>
</div>
</aside>
<section class="chat-main" v-if="selectedChat">
<div class="chat-header">
<div class="chat-header-info">
<div class="chat-header-avatar">{{ getInterlocutorInitials(selectedChat) }}</div>
<div>
<div class="chat-header-name">{{ getInterlocutorName(selectedChat) }}</div>
<div class="chat-header-route">{{ selectedChat.orderId?.route }}</div>
</div>
</div>
<button v-if="selectedChat.status === 'active'" class="btn-close-chat" @click="closeCurrentChat">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
Завершить чат
</button>
<div v-else class="chat-closed-badge">Чат завершен</div>
</div>
<div class="chat-messages" ref="messagesContainer">
<div v-for="msg in selectedChat.messages" :key="msg.id" class="message-row" :class="{ own: msg.senderId === userStore.user?.id }">
<div class="message-bubble" :class="msg.type">
<div v-if="msg.type === 'text'" class="message-text">{{ msg.text }}</div>
<div v-else class="message-voice">
<button class="voice-play-btn" @click="togglePlay(msg)">
<svg v-if="playingMsgId !== msg.id" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
<svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
</button>
<div class="voice-wave">
<span v-for="i in 20" :key="i" :style="{ height: waveHeight(msg.id, i) + '%' }"></span>
</div>
<span class="voice-duration">{{ formatDuration(msg.duration) }}</span>
<audio :src="msg.text" :ref="el => setAudioRef(msg.id, el)" @ended="stopPlay"></audio>
</div>
<div class="message-time">{{ formatTime(msg.createdAt) }}</div>
</div>
</div>
<div v-if="selectedChat.status === 'closed'" class="chat-closed-notice">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
Переписка завершена. Отправка сообщений недоступна.
</div>
</div>
<div class="chat-input-area" v-if="selectedChat.status === 'active'">
<div v-if="!isRecording" class="input-row">
<button class="icon-btn mic-btn" @click="startRecording">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
</button>
<input v-model="newMessage" type="text" placeholder="Введите сообщение..." @keyup.enter="sendText" class="chat-input" />
<button class="icon-btn send-btn" @click="sendText" :disabled="!newMessage.trim()">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
</button>
</div>
<div v-else class="recording-row">
<div class="recording-indicator">
<div class="recording-dot"></div>
<span class="recording-time">{{ formatDuration(recordingTime) }}</span>
</div>
<div class="recording-actions">
<button class="btn-cancel-rec" @click="stopRecording(false)">Отмена</button>
<button class="btn-send-rec" @click="stopRecording(true)">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
Отправить
</button>
</div>
</div>
</div>
</section>
<section class="chat-main empty-chat" v-else>
<div class="empty-chat-content">
<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<h3>Выберите диалог</h3>
<p>Выберите чат из списка слева, чтобы начать общение</p>
</div>
</section>
</div>
</DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/ui/DashboardLayout.vue';
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();
const toast = useToastStore();

const newMessage = ref('');
const messagesContainer = ref(null);
const isRecording = ref(false);
const recordingTime = ref(0);
const playingMsgId = ref(null);
const audioRefs = ref({});
let mediaRecorder = null;
let audioChunks = [];
let timerInterval = null;

const myChats = computed(() => chatStore.chats);
const selectedChatId = ref(null);
const selectedChat = computed(() => myChats.value.find(c => c.id === selectedChatId.value));

const personName = (p) => p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.company || 'Пользователь' : 'Пользователь';
const isMeCustomer = (chat) => chat.customerId?.id === userStore.user?.id;
const getInterlocutorName = (chat) => personName(isMeCustomer(chat) ? chat.carrierId : chat.customerId);
const getInterlocutorInitials = (chat) => getInterlocutorName(chat).split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';

// Стабильная «волна» голосового сообщения вместо случайной при каждой перерисовке
const waveHeight = (id, i) => {
	const seed = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
	return 25 + Math.abs(Math.sin(seed * 0.37 + i * 1.7)) * 75;
};

const selectChat = (chatId) => {
	selectedChatId.value = chatId;
	nextTick(() => scrollToBottom());
};

const scrollToBottom = () => {
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

watch(() => selectedChat.value?.messages.length, () => {
	nextTick(() => scrollToBottom());
});

const sendText = async () => {
	const text = newMessage.value.trim();
	if (!text || !selectedChatId.value) return;
	newMessage.value = '';
	const res = await chatStore.sendMessage(selectedChatId.value, text, 'text');
	if (!res.success) {
		newMessage.value = text;
		toast.error(res.message || 'Не удалось отправить сообщение');
	}
};

const setAudioRef = (id, el) => {
	if (el) audioRefs.value[id] = el;
};

const togglePlay = (msg) => {
	if (playingMsgId.value === msg.id) {
		audioRefs.value[msg.id].pause();
		playingMsgId.value = null;
	} else {
		if (playingMsgId.value && audioRefs.value[playingMsgId.value]) {
			audioRefs.value[playingMsgId.value].pause();
		}
		audioRefs.value[msg.id].play();
		playingMsgId.value = msg.id;
	}
};

const stopPlay = () => {
	playingMsgId.value = null;
};

const startRecording = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder = new MediaRecorder(stream);
		audioChunks = [];
		mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
		mediaRecorder.onstop = () => {
			const blob = new Blob(audioChunks, { type: 'audio/webm' });
			const reader = new FileReader();
			reader.onloadend = () => {
				chatStore.sendMessage(selectedChatId.value, reader.result, 'voice', recordingTime.value).then((res) => { if (!res.success) toast.error(res.message || 'Не удалось отправить запись'); });
			};
			reader.readAsDataURL(blob);
			stream.getTracks().forEach(t => t.stop());
		};
		mediaRecorder.start();
		isRecording.value = true;
		recordingTime.value = 0;
		timerInterval = setInterval(() => recordingTime.value++, 1000);
	} catch (err) {
		toast.error('Нет доступа к микрофону');
	}
};

const stopRecording = (send) => {
	if (mediaRecorder && mediaRecorder.state !== 'inactive') {
		if (!send) {
			mediaRecorder.ondataavailable = null;
			mediaRecorder.onstop = null;
			mediaRecorder.stop();
			mediaRecorder.stream.getTracks().forEach(t => t.stop());
		} else {
			mediaRecorder.stop();
		}
	}
	clearInterval(timerInterval);
	isRecording.value = false;
};

const closeCurrentChat = async () => {
	if (!confirm('Вы уверены, что хотите завершить этот чат?')) return;
	const res = await chatStore.closeChat(selectedChatId.value);
	if (res.success) toast.success('Чат завершён');
	else toast.error(res.message);
};

const formatDuration = (sec) => {
	const m = Math.floor(sec / 60).toString().padStart(2, '0');
	const s = (sec % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
};

const formatTime = (dateStr) => {
	const d = new Date(dateStr);
	return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const handleLogout = () => {
	userStore.logout();
	router.push('/');
};

let pollTimer = null;
onMounted(async () => {
	await chatStore.fetchChats();
	if (!selectedChatId.value && myChats.value.length && window.innerWidth > 768) selectChat(myChats.value[0].id);
	pollTimer = setInterval(() => chatStore.fetchChats(), 5000);
});
onUnmounted(() => {
	clearInterval(pollTimer);
	clearInterval(timerInterval);
});
</script>

<style scoped>
.profile-layout { display: flex; min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); }
.sidebar { width: 280px; background: rgba(255, 255, 255, 0.02); border-right: 1px solid var(--border-color); padding: 24px 20px; display: flex; flex-direction: column; gap: 24px; position: sticky; top: 0; height: 100vh; overflow-y: auto; backdrop-filter: blur(10px); }
.sidebar-header { padding: 8px 12px; }
.logo-area { display: flex; align-items: center; gap: 20px; cursor: pointer; text-decoration: none; min-height: 90px; }
.logo-icon { width: 90px; height: 90px; flex-shrink: 0; }
.logo-icon img { width: 100%; height: 100%; object-fit: contain; }
.logo-text { display: flex; flex-direction: column; line-height: 1.1; margin-left: -30px; }
.logo-cargo { font-size: 28px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-primary); }
.logo-express { font-size: 28px; font-weight: 800; color: var(--accent-color); letter-spacing: 1.5px; }
.user-card { display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; transition: all 0.3s ease; }
.user-card:hover { border-color: rgba(var(--accent-rgb), 0.3); }
.user-avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 700; flex-shrink: 0; }
.user-info { overflow: hidden; flex: 1; }
.user-name-lg { font-size: 15px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 12px; color: var(--accent-color); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.user-email { font-size: 13px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s ease; cursor: pointer; position: relative; }
.nav-link svg { width: 20px; height: 20px; flex-shrink: 0; }
.nav-link span { flex: 1; }
.nav-link:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); transform: translateX(2px); }
.nav-link.active { background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); font-weight: 600; }
.nav-link.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent-color); border-radius: 0 3px 3px 0; }
.nav-link.logout { color: var(--danger); margin-top: auto; }
.nav-link.logout:hover { background: rgba(var(--danger-rgb), 0.1); color: var(--danger); }

.main-content { flex: 1; display: flex; height: calc(100vh - 64px); overflow: hidden; }
.chat-layout { padding: 0; max-width: 100%; }

.chat-sidebar { width: 340px; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: rgba(255, 255, 255, 0.01); }
.chat-sidebar-header { padding: 24px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }
.chat-sidebar-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
.chat-count { background: rgba(var(--accent-rgb), 0.15); color: var(--accent-color); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 10px; }
.chat-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.chat-empty { text-align: center; padding: 40px 20px; color: var(--text-muted); }
.chat-empty svg { opacity: 0.3; margin-bottom: 12px; }
.chat-item { padding: 16px; border-radius: 16px; cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.chat-item:hover { background: rgba(255, 255, 255, 0.03); }
.chat-item.active { background: rgba(var(--accent-rgb), 0.08); border-color: rgba(var(--accent-rgb), 0.3); }
.chat-item-header { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.chat-item-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; flex-shrink: 0; }
.chat-item-info { min-width: 0; }
.chat-item-name { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-item-route { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.chat-item-status { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; white-space: nowrap; }
.chat-item-status.active { background: rgba(var(--accent-rgb), 0.15); color: var(--accent-color); }
.chat-item-status.closed { background: rgba(var(--danger-rgb), 0.15); color: var(--danger); }

.chat-main { flex: 1; display: flex; flex-direction: column; background: var(--bg-primary); }
.empty-chat { align-items: center; justify-content: center; }
.empty-chat-content { text-align: center; color: var(--text-muted); }
.empty-chat-content svg { opacity: 0.2; margin-bottom: 20px; }
.empty-chat-content h3 { font-size: 22px; color: var(--text-primary); margin-bottom: 8px; }

.chat-header { padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); }
.chat-header-info { display: flex; align-items: center; gap: 14px; }
.chat-header-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 700; }
.chat-header-name { font-size: 17px; font-weight: 700; }
.chat-header-route { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.btn-close-chat { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; background: rgba(var(--danger-rgb), 0.1); color: var(--danger); border: 1px solid rgba(var(--danger-rgb), 0.2); border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.btn-close-chat:hover { background: rgba(var(--danger-rgb), 0.2); transform: translateY(-1px); }
.chat-closed-badge { padding: 8px 16px; background: rgba(var(--danger-rgb), 0.1); color: var(--danger); border-radius: 10px; font-size: 13px; font-weight: 600; }

.chat-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.message-row { display: flex; max-width: 75%; }
.message-row.own { align-self: flex-end; }
.message-bubble { padding: 12px 16px; border-radius: 18px; position: relative; }
.message-row:not(.own) .message-bubble { background: var(--bg-card); border: 1px solid var(--border-color); border-bottom-left-radius: 4px; }
.message-row.own .message-bubble { background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); color: white; border-bottom-right-radius: 4px; }
.message-text { font-size: 15px; line-height: 1.5; word-break: break-word; }
.message-time { font-size: 11px; opacity: 0.6; margin-top: 6px; text-align: right; }

.message-voice { display: flex; align-items: center; gap: 12px; min-width: 180px; }
.voice-play-btn { width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); border: none; color: inherit; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
.message-row:not(.own) .voice-play-btn { background: rgba(var(--accent-rgb), 0.15); color: var(--accent-color); }
.voice-play-btn:hover { transform: scale(1.1); }
.voice-wave { flex: 1; display: flex; align-items: center; gap: 2px; height: 24px; }
.voice-wave span { flex: 1; background: currentColor; opacity: 0.4; border-radius: 2px; min-width: 2px; }
.voice-duration { font-size: 12px; font-weight: 600; opacity: 0.8; white-space: nowrap; }
audio { display: none; }

.chat-closed-notice { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; background: rgba(var(--danger-rgb), 0.05); border: 1px dashed rgba(var(--danger-rgb), 0.2); border-radius: 12px; color: var(--danger); font-size: 14px; font-weight: 500; margin-top: auto; }

.chat-input-area { padding: 20px 24px; border-top: 1px solid var(--border-color); background: rgba(255, 255, 255, 0.02); }
.input-row { display: flex; align-items: center; gap: 12px; }
.icon-btn { width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
.icon-btn:hover { border-color: var(--accent-color); color: var(--accent-color); }
.mic-btn:hover { background: rgba(var(--danger-rgb), 0.1); border-color: var(--danger); color: var(--danger); }
.send-btn { background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); border: none; color: white; }
.send-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); color: white; }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.chat-input { flex: 1; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 16px; color: var(--text-primary); font-size: 15px; outline: none; transition: all 0.2s ease; }
.chat-input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1); }

.recording-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(var(--danger-rgb), 0.08); border: 1px solid rgba(var(--danger-rgb), 0.2); border-radius: 16px; animation: pulseRec 2s infinite; }
@keyframes pulseRec { 0%, 100% { border-color: rgba(var(--danger-rgb), 0.2); } 50% { border-color: rgba(var(--danger-rgb), 0.5); } }
.recording-indicator { display: flex; align-items: center; gap: 12px; }
.recording-dot { width: 12px; height: 12px; background: var(--danger); border-radius: 50%; animation: blink 1s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.recording-time { font-size: 20px; font-weight: 700; color: var(--danger); font-variant-numeric: tabular-nums; }
.recording-actions { display: flex; gap: 10px; }
.btn-cancel-rec { padding: 8px 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-secondary); font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-send-rec { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); border: none; border-radius: 10px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; }

@media (max-width: 1024px) {
	.sidebar { display: none; }
	.chat-sidebar { width: 280px; }
}
@media (max-width: 768px) {
	.chat-layout { flex-direction: column; }
	.chat-sidebar { width: 100%; height: 40vh; border-right: none; border-bottom: 1px solid var(--border-color); }
	.chat-main { height: 60vh; }
	.message-row { max-width: 90%; }
}
</style>