<template>
  <DashboardLayout flush>
    <div class="chat" :class="{ 'is-open': !!selectedChat }">
      <!-- ─── Список диалогов ─── -->
      <aside class="list">
        <div class="list__head">
          <h2>Сообщения</h2>
          <span v-if="totalUnread" class="list__unread">{{ totalUnread }}</span>
        </div>
        <label class="list__search">
          <Search />
          <input v-model.trim="query" type="search" placeholder="Поиск по имени или маршруту" aria-label="Поиск диалогов">
        </label>
        <div class="list__tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" :class="{ on: tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">
            {{ t.label }}<span v-if="t.count">{{ t.count }}</span>
          </button>
        </div>

        <div class="list__items">
          <p v-if="exampleMode" class="example-note">
            <span class="ex-chip">Пример</span>
            Так выглядит переписка с перевозчиком. Настоящий чат открывается, когда заказчик одобряет заявку.
          </p>
          <div v-if="!chatStore.loaded" class="skeletons">
            <div v-for="i in 4" :key="i" class="skeleton"></div>
          </div>
          <button
            v-for="chat in visibleChats"
            :key="chat.id"
            type="button"
            class="item"
            :class="{ on: selectedChatId === chat.id, unread: chat.unread }"
            @click="selectChat(chat.id)"
          >
            <span class="avatar" :style="avatarStyle(chat)">{{ initials(chat) }}</span>
            <span class="item__body">
              <span class="item__top">
                <b>{{ partnerName(chat) }}</b>
                <time v-if="chat.lastMessage">{{ shortDate(chat.lastMessage.createdAt) }}</time>
              </span>
              <span class="item__route">{{ chat.orderId?.route || 'Заказ' }}</span>
              <span class="item__bottom">
                <span class="item__preview">{{ previewText(chat) }}</span>
                <span v-if="chat.unread" class="item__badge">{{ chat.unread }}</span>
                <span v-else-if="chat.status === 'closed'" class="item__closed">Завершён</span>
              </span>
            </span>
          </button>
          <div v-if="chatStore.loaded && !visibleChats.length" class="list__empty">
            <MessagesSquare />
            <p>{{ query || tab !== 'all' ? 'Ничего не найдено' : 'Пока нет диалогов' }}</p>
          </div>
        </div>
      </aside>

      <!-- ─── Переписка ─── -->
      <section v-if="selectedChat" class="room">
        <header class="room__head">
          <button type="button" class="icon-btn room__back" aria-label="К списку диалогов" @click="selectedChatId = null"><ArrowLeft /></button>
          <span class="avatar" :style="avatarStyle(selectedChat)">{{ initials(selectedChat) }}</span>
          <div class="room__who">
            <b>{{ partnerName(selectedChat) }}</b>
            <span>{{ partnerRole(selectedChat) }}<template v-if="partnerCompany(selectedChat)"> · {{ partnerCompany(selectedChat) }}</template></span>
          </div>
          <div class="room__actions">
            <RouterLink v-if="!isExample" to="/orders" class="icon-btn" title="Открыть заказы" aria-label="Открыть заказы"><ClipboardList /></RouterLink>
            <div v-if="selectedChat.status === 'active'" class="close-wrap">
              <button type="button" class="ghost-danger" @click="confirmClose = !confirmClose">Завершить</button>
              <Transition name="pop">
                <div v-if="confirmClose" class="confirm" role="dialog" aria-label="Завершить чат">
                  <p>Завершить переписку? Писать в этот чат станет нельзя.</p>
                  <div>
                    <button type="button" class="confirm__no" @click="confirmClose = false">Отмена</button>
                    <button type="button" class="confirm__yes" @click="closeCurrentChat">Завершить</button>
                  </div>
                </div>
              </Transition>
            </div>
            <span v-else class="closed-chip">Чат завершён</span>
          </div>
        </header>

        <!-- Заказ, по которому идёт переписка -->
        <div v-if="selectedChat.orderId" class="order">
          <span class="order__icon"><Truck /></span>
          <div class="order__main">
            <b>{{ selectedChat.orderId.route }}</b>
            <span>
              <template v-if="selectedChat.orderId.type">{{ selectedChat.orderId.type }}</template>
              <template v-if="selectedChat.orderId.volume"> · {{ selectedChat.orderId.volume }}</template>
              <template v-if="selectedChat.orderId.dateFrom"> · {{ dayMonth(selectedChat.orderId.dateFrom) }} — {{ dayMonth(selectedChat.orderId.dateTo) }}</template>
            </span>
          </div>
          <strong v-if="selectedChat.orderId.price" class="order__price">{{ Number(selectedChat.orderId.price).toLocaleString('ru-RU') }} ₽</strong>
        </div>

        <div ref="scroller" class="feed" @scroll.passive="onFeedScroll">
          <div v-if="loadingRoom" class="feed__loading">Загружаем переписку…</div>
          <template v-for="group in grouped" :key="group.day">
            <div class="day"><span>{{ group.label }}</span></div>
            <div
              v-for="(msg, i) in group.items"
              :key="msg.id"
              class="msg"
              :class="{ own: isOwn(msg), chain: i > 0 && isOwn(group.items[i - 1]) === isOwn(msg) && closeInTime(group.items[i - 1], msg) }"
            >
              <div class="bubble" :class="msg.type">
                <p v-if="msg.type === 'text'" class="bubble__text">{{ msg.text }}</p>
                <div v-else class="voice">
                  <button type="button" class="voice__play" :aria-label="playingId === msg.id ? 'Пауза' : 'Слушать'" @click="togglePlay(msg)">
                    <Pause v-if="playingId === msg.id" /><Play v-else />
                  </button>
                  <div class="voice__wave" :style="{ '--p': playingId === msg.id ? progress : 0 }">
                    <span v-for="n in 26" :key="n" :style="{ height: waveHeight(msg.id, n) + '%' }"></span>
                  </div>
                  <span class="voice__time">{{ formatDuration(msg.duration) }}</span>
                </div>
                <span class="bubble__meta">
                  {{ timeOf(msg.createdAt) }}
                  <template v-if="isOwn(msg)">
                    <CheckCheck v-if="isRead(msg)" class="read" aria-label="Прочитано" />
                    <Check v-else aria-label="Отправлено" />
                  </template>
                </span>
              </div>
            </div>
          </template>
          <div v-if="selectedChat.status === 'closed'" class="feed__closed">
            <Lock /> Переписка завершена — отправка сообщений недоступна.
          </div>
        </div>

        <Transition name="pop">
          <button v-if="newBelow" type="button" class="to-bottom" @click="scrollToBottom(true)">
            <ArrowDown /> Новые сообщения
          </button>
        </Transition>

        <footer v-if="selectedChat.status === 'active'" class="composer">
          <div v-if="!message && !isRecording" class="quick">
            <button v-for="q in quickReplies" :key="q" type="button" @click="message = q; focusInput()">{{ q }}</button>
          </div>
          <div v-if="!isRecording" class="composer__row">
            <button type="button" class="icon-btn" aria-label="Записать голосовое" @click="startRecording"><Mic /></button>
            <textarea
              ref="input"
              v-model="message"
              rows="1"
              maxlength="4000"
              placeholder="Сообщение…"
              aria-label="Сообщение"
              @input="autosize"
              @keydown.enter.exact="onEnter"
            ></textarea>
            <button type="button" class="send" :disabled="!message.trim() || sending" aria-label="Отправить" @click="sendText"><SendHorizontal /></button>
          </div>
          <div v-else class="recording">
            <span class="recording__dot"></span>
            <span class="recording__time">{{ formatDuration(recordingTime) }}</span>
            <span class="recording__hint">Идёт запись…</span>
            <button type="button" class="recording__cancel" @click="stopRecording(false)">Отмена</button>
            <button type="button" class="send" aria-label="Отправить запись" @click="stopRecording(true)"><SendHorizontal /></button>
          </div>
          <p class="composer__hint">Enter — отправить · Shift + Enter — новая строка</p>
        </footer>
      </section>

      <section v-else class="room room--empty">
        <div>
          <MessagesSquare />
          <h3>Выберите диалог</h3>
          <p>Здесь будет переписка с {{ userStore.isCarrier ? 'заказчиком' : 'перевозчиком' }} по заказу.</p>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import {
  Search, MessagesSquare, ArrowLeft, ArrowDown, ClipboardList, Truck, Play, Pause, Check, CheckCheck, Lock, Mic, SendHorizontal,
} from 'lucide-vue-next';
import DashboardLayout from '@/ui/DashboardLayout.vue';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { useToastStore } from '@/stores/toast';
import { exampleChat } from '@/data/examples';

const userStore = useUserStore();
const chatStore = useChatStore();
const toast = useToastStore();
const myId = computed(() => userStore.user?.id);

// ─── Пример, пока своих диалогов нет ───
const exampleMode = computed(() => chatStore.loaded && chatStore.chats.length === 0);
const exampleMessages = computed(() => exampleChat.messages.map((m) => ({ ...m, senderId: m.fromOther ? 'other' : myId.value })));
const exampleItem = computed(() => {
  const last = exampleMessages.value[exampleMessages.value.length - 1];
  return { ...exampleChat, customerId: { ...exampleChat.customerId, id: myId.value }, lastMessage: last };
});
const allChats = computed(() => (exampleMode.value ? [exampleItem.value] : chatStore.chats));

// ─── Список ───
const query = ref('');
const tab = ref('all');
const totalUnread = computed(() => chatStore.unreadTotal);
const tabs = computed(() => [
  { id: 'all', label: 'Все' },
  { id: 'unread', label: 'Непрочитанные', count: allChats.value.filter((c) => c.unread).length },
  { id: 'closed', label: 'Завершённые' },
]);
const visibleChats = computed(() => {
  const q = query.value.toLowerCase();
  return allChats.value.filter((c) => {
    if (tab.value === 'unread' && !c.unread) return false;
    if (tab.value === 'closed' && c.status !== 'closed') return false;
    if (!q) return true;
    return `${partnerName(c)} ${partnerCompany(c)} ${c.orderId?.route || ''}`.toLowerCase().includes(q);
  });
});

const sameId = (a, b) => String(a?.id || a?._id || a) === String(b);
const iAmCustomer = (chat) => sameId(chat.customerId, myId.value);
const partner = (chat) => (iAmCustomer(chat) ? chat.carrierId : chat.customerId) || {};
const partnerName = (chat) => {
  const p = partner(chat);
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.company || 'Пользователь';
};
const partnerCompany = (chat) => partner(chat).company || '';
const partnerRole = (chat) => (iAmCustomer(chat) ? 'Перевозчик' : 'Заказчик');
const initials = (chat) => partnerName(chat).split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
// у каждого собеседника свой цвет аватара
const avatarStyle = (chat) => {
  const hue = [...partnerName(chat)].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
  return { background: `linear-gradient(135deg, hsl(${hue} 62% 52%), hsl(${(hue + 40) % 360} 62% 40%))` };
};
const previewText = (chat) => {
  const m = chat.lastMessage;
  if (!m) return 'Нет сообщений';
  const body = m.type === 'voice' ? 'Голосовое сообщение' : m.text;
  return sameId(m.senderId, myId.value) ? `Вы: ${body}` : body;
};

// ─── Даты ───
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const dayDiff = (iso) => Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 864e5);
const timeOf = (iso) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dayMonth = (iso) => (iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '');
const shortDate = (iso) => {
  const d = dayDiff(iso);
  if (d === 0) return timeOf(iso);
  if (d === 1) return 'вчера';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};
const dayLabel = (iso) => {
  const d = dayDiff(iso);
  if (d === 0) return 'Сегодня';
  if (d === 1) return 'Вчера';
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: new Date(iso).getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
};
const closeInTime = (a, b) => new Date(b.createdAt) - new Date(a.createdAt) < 5 * 60 * 1000;

// ─── Открытый диалог ───
const selectedChatId = ref(null);
const selectedChat = computed(() => allChats.value.find((c) => c.id === selectedChatId.value) || null);
const isExample = computed(() => selectedChatId.value === 'ex-chat');
const roomMessages = computed(() => (isExample.value ? exampleMessages.value : chatStore.messages[selectedChatId.value] || []));
const loadingRoom = ref(false);
const grouped = computed(() => {
  const out = [];
  for (const m of roomMessages.value) {
    const key = new Date(m.createdAt).toDateString();
    let g = out[out.length - 1];
    if (!g || g.day !== key) {
      g = { day: key, label: dayLabel(m.createdAt), items: [] };
      out.push(g);
    }
    g.items.push(m);
  }
  return out;
});
const isOwn = (m) => sameId(m.senderId, myId.value);
const isRead = (m) => {
  if (isExample.value) return true;
  const at = chatStore.otherReadAt[selectedChatId.value];
  return Boolean(at) && new Date(at) >= new Date(m.createdAt);
};

const scroller = ref(null);
const newBelow = ref(false);
const atBottom = () => {
  const el = scroller.value;
  return !el || el.scrollHeight - el.scrollTop - el.clientHeight < 80;
};
const scrollToBottom = (smooth = false) => {
  const el = scroller.value;
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  newBelow.value = false;
};
const onFeedScroll = () => { if (atBottom()) newBelow.value = false; };

const confirmClose = ref(false);
const selectChat = async (id) => {
  selectedChatId.value = id;
  confirmClose.value = false;
  if (id === 'ex-chat') {
    await nextTick();
    scrollToBottom();
    return;
  }
  const first = !chatStore.messages[id];
  loadingRoom.value = first;
  const res = await chatStore.loadMessages(id);
  loadingRoom.value = false;
  if (!res.success) toast.error(res.message || 'Не удалось загрузить переписку');
  await nextTick();
  scrollToBottom();
  chatStore.markRead(id);
};

// Новые сообщения: если пользователь внизу — докручиваем, иначе показываем кнопку
const refreshRoom = async () => {
  const id = selectedChatId.value;
  if (!id || isExample.value || document.hidden) return;
  const wasBottom = atBottom();
  const res = await chatStore.loadMessages(id);
  if (!res.success || !res.added || id !== selectedChatId.value) return;
  await nextTick();
  if (wasBottom) {
    scrollToBottom(true);
    chatStore.markRead(id);
  } else newBelow.value = true;
};
watch(newBelow, (v) => { if (!v && selectedChatId.value && !isExample.value) chatStore.markRead(selectedChatId.value); });

// ─── Отправка ───
const message = ref('');
const sending = ref(false);
const input = ref(null);
const quickReplies = computed(() => (userStore.isCarrier
  ? ['Машина на загрузке', 'Груз в пути', 'Груз доставлен, документы отправил']
  : ['Когда будете на загрузке?', 'Пришлите фото после погрузки', 'Спасибо, груз получен']));
const autosize = () => {
  const el = input.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
};
const focusInput = () => nextTick(() => { input.value?.focus(); autosize(); });
const exampleNotice = () => toast.success('Это пример — настоящий чат откроется, когда заказчик одобрит заявку');

const onEnter = (e) => {
  if (e.isComposing) return; // ввод через IME ещё не закончен
  e.preventDefault();
  sendText();
};
const sendText = async () => {
  if (isExample.value) return exampleNotice();
  const text = message.value.trim();
  if (!text || sending.value) return null;
  sending.value = true;
  message.value = '';
  await nextTick();
  autosize();
  const res = await chatStore.sendMessage(selectedChatId.value, text, 'text');
  sending.value = false;
  if (!res.success) {
    message.value = text;
    toast.error(res.message || 'Не удалось отправить сообщение');
    return null;
  }
  await nextTick();
  scrollToBottom(true);
  return null;
};

// ─── Голосовые ───
const isRecording = ref(false);
const recordingTime = ref(0);
let recorder = null;
let recordTimer = 0;
const stopStream = () => recorder?.stream?.getTracks().forEach((t) => t.stop());

const startRecording = async () => {
  if (isExample.value) return exampleNotice();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    const chunks = [];
    const chatId = selectedChatId.value;
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      stopStream();
      if (!recorder?.send) return;
      const reader = new FileReader();
      const duration = recordingTime.value;
      reader.onloadend = async () => {
        const res = await chatStore.sendMessage(chatId, reader.result, 'voice', duration);
        if (!res.success) toast.error(res.message || 'Не удалось отправить запись');
        else { await nextTick(); scrollToBottom(true); }
      };
      reader.readAsDataURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
    };
    recorder.start();
    isRecording.value = true;
    recordingTime.value = 0;
    recordTimer = setInterval(() => {
      recordingTime.value += 1;
      if (recordingTime.value >= 180) stopRecording(true); // не больше 3 минут
    }, 1000);
  } catch {
    toast.error('Нет доступа к микрофону');
  }
  return null;
};
const stopRecording = (send) => {
  clearInterval(recordTimer);
  isRecording.value = false;
  if (recorder && recorder.state !== 'inactive') {
    recorder.send = send;
    recorder.stop();
  } else stopStream();
};

const player = new Audio();
const playingId = ref(null);
const progress = ref(0);
player.addEventListener('timeupdate', () => { progress.value = player.duration ? player.currentTime / player.duration : 0; });
player.addEventListener('ended', () => { playingId.value = null; progress.value = 0; });
const togglePlay = (msg) => {
  if (playingId.value === msg.id) {
    player.pause();
    playingId.value = null;
    return;
  }
  if (!msg.text?.startsWith('data:audio/')) return exampleNotice();
  player.src = msg.text;
  progress.value = 0;
  player.play().then(() => { playingId.value = msg.id; }).catch(() => toast.error('Не удалось воспроизвести запись'));
};
const waveHeight = (id, i) => {
  const seed = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return 22 + Math.abs(Math.sin(seed * 0.37 + i * 1.7)) * 78;
};
const formatDuration = (sec = 0) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

// ─── Завершение ───
const closeCurrentChat = async () => {
  confirmClose.value = false;
  if (isExample.value) return exampleNotice();
  const res = await chatStore.closeChat(selectedChatId.value);
  if (res.success) toast.success('Чат завершён');
  else toast.error(res.message || 'Не удалось завершить чат');
  return null;
};

// ─── Опрос сервера ───
let listTimer = 0;
let roomTimer = 0;
onMounted(async () => {
  await chatStore.fetchChats();
  // на компьютере сразу открываем первый диалог, на телефоне — показываем список
  if (!selectedChatId.value && allChats.value.length && window.innerWidth > 900) selectChat(allChats.value[0].id);
  listTimer = setInterval(() => { if (!document.hidden) chatStore.fetchChats(); }, 10000);
  roomTimer = setInterval(refreshRoom, 3000);
});
onUnmounted(() => {
  clearInterval(listTimer);
  clearInterval(roomTimer);
  clearInterval(recordTimer);
  if (recorder && recorder.state !== 'inactive') { recorder.send = false; recorder.stop(); }
  stopStream();
  player.pause();
});
</script>

<style scoped>
.chat { --list-w: 360px; flex: 1; display: grid; grid-template-columns: var(--list-w) minmax(0, 1fr); height: calc(100dvh - 64px); min-height: 0; background: var(--bg-primary); color: var(--text-primary); }

/* ─── Список ─── */
.list { display: flex; flex-direction: column; min-height: 0; border-right: 1px solid var(--border-color); background: var(--bg-card); }
.list__head { display: flex; align-items: center; gap: 10px; padding: 22px 20px 14px; }
.list__head h2 { font-size: 22px; }
.list__unread { padding: 2px 9px; border-radius: 999px; background: var(--accent-color); color: var(--text-on-accent, #04120A); font-size: 12px; font-weight: 800; }
.list__search { display: flex; align-items: center; gap: 8px; margin: 0 16px; height: 42px; padding: 0 14px; border-radius: 14px; border: 1px solid var(--border-color); background: var(--bg-input, var(--bg-primary)); color: var(--text-muted); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.list__search:focus-within { border-color: rgba(var(--accent-rgb), 0.6); box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1); }
.list__search svg { width: 17px; height: 17px; flex-shrink: 0; }
.list__search input { flex: 1; min-width: 0; border: 0; outline: none; background: none; color: var(--text-primary); font-size: 14px; }
.list__tabs { display: flex; gap: 4px; margin: 12px 16px 6px; padding: 4px; border-radius: 12px; background: var(--bg-primary); }
.list__tabs button { flex: 1; display: inline-flex; justify-content: center; align-items: center; gap: 6px; height: 32px; border: 0; border-radius: 9px; background: none; color: var(--text-secondary); font-size: 12.5px; font-weight: 700; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.list__tabs button.on { background: var(--bg-card); color: var(--text-primary); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08); }
.list__tabs span { padding: 0 6px; border-radius: 999px; background: rgba(var(--accent-rgb), 0.15); color: var(--accent-color); font-size: 11px; }
.list__items { flex: 1; overflow-y: auto; padding: 8px 10px 16px; display: flex; flex-direction: column; gap: 2px; }
.example-note { margin: 4px 6px 8px; padding: 12px 14px; border-radius: 14px; border: 1px dashed rgba(var(--accent-rgb), 0.45); background: rgba(var(--accent-rgb), 0.06); color: var(--text-secondary); font-size: 13px; line-height: 1.5; }
.ex-chip { display: inline-block; margin-right: 6px; padding: 2px 8px; border-radius: 999px; background: rgba(242, 184, 75, 0.16); color: #C98A12; font-size: 11px; font-weight: 800; text-transform: uppercase; }
.skeleton { height: 72px; margin: 4px 6px; border-radius: 14px; background: linear-gradient(90deg, var(--bg-primary) 25%, rgba(var(--accent-rgb), 0.06) 50%, var(--bg-primary) 75%); background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
@keyframes shimmer { to { background-position: -200% 0; } }
.item { display: flex; gap: 12px; align-items: center; width: 100%; padding: 12px; border: 0; border-radius: 16px; background: none; color: inherit; text-align: left; cursor: pointer; transition: background 0.2s ease; }
.item:hover { background: var(--surface-hover, rgba(var(--accent-rgb), 0.05)); }
.item.on { background: rgba(var(--accent-rgb), 0.1); }
.avatar { display: grid; place-items: center; flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; color: #fff; font-weight: 800; font-size: 15px; letter-spacing: 0.02em; }
.item__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.item__top { display: flex; justify-content: space-between; gap: 8px; }
.item__top b { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item__top time { flex-shrink: 0; font-size: 12px; color: var(--text-muted); }
.item.unread .item__top time { color: var(--accent-color); font-weight: 700; }
.item__route { font-size: 12px; font-weight: 700; color: var(--accent-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item__bottom { display: flex; align-items: center; gap: 8px; }
.item__preview { flex: 1; min-width: 0; font-size: 13px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item.unread .item__preview { color: var(--text-primary); font-weight: 600; }
.item__badge { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; display: grid; place-items: center; background: var(--accent-color); color: var(--text-on-accent, #04120A); font-size: 11px; font-weight: 800; }
.item__closed { font-size: 11px; font-weight: 700; color: var(--text-muted); }
.list__empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 48px 16px; color: var(--text-muted); text-align: center; }
.list__empty svg { width: 36px; height: 36px; opacity: 0.5; }

/* ─── Переписка ─── */
.room { position: relative; display: flex; flex-direction: column; min-height: 0; min-width: 0; background:
  radial-gradient(60% 50% at 100% 0%, rgba(var(--accent-rgb), 0.06), transparent 70%),
  var(--bg-primary); }
.room__head { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--border-color); background: var(--bg-card); }
.room__back { display: none !important; }
.room__who { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.room__who b { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.room__who span { font-size: 12.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.room__actions { display: flex; align-items: center; gap: 8px; }
.icon-btn { display: grid; place-items: center; flex-shrink: 0; width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-secondary); cursor: pointer; transition: color 0.2s ease, border-color 0.2s ease; }
.icon-btn:hover { color: var(--accent-color); border-color: rgba(var(--accent-rgb), 0.45); }
.icon-btn svg { width: 19px; height: 19px; }
.ghost-danger { height: 40px; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(var(--danger-rgb), 0.25); background: rgba(var(--danger-rgb), 0.06); color: var(--danger); font-weight: 700; font-size: 13px; cursor: pointer; }
.ghost-danger:hover { background: rgba(var(--danger-rgb), 0.12); }
.close-wrap { position: relative; }
.confirm { position: absolute; right: 0; top: calc(100% + 8px); z-index: 5; width: 260px; padding: 14px; border-radius: 16px; background: var(--bg-card-solid, var(--bg-card)); border: 1px solid var(--border-color); box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.4); }
.confirm p { font-size: 13.5px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5; }
.confirm div { display: flex; justify-content: flex-end; gap: 8px; }
.confirm button { height: 34px; padding: 0 12px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; }
.confirm__no { border: 1px solid var(--border-color); background: none; color: var(--text-primary); }
.confirm__yes { border: 0; background: var(--danger); color: #fff; }
.closed-chip { padding: 8px 12px; border-radius: 10px; background: rgba(var(--danger-rgb), 0.08); color: var(--danger); font-size: 12.5px; font-weight: 700; }

.order { display: flex; align-items: center; gap: 12px; margin: 12px 20px 0; padding: 10px 14px; border-radius: 14px; border: 1px solid var(--border-color); background: var(--bg-card); }
.order__icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: rgba(var(--accent-rgb), 0.12); color: var(--accent-color); flex-shrink: 0; }
.order__icon svg { width: 18px; height: 18px; }
.order__main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.order__main b { font-size: 14px; }
.order__main span { font-size: 12.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.order__price { font-family: var(--font-display); color: var(--accent-color); white-space: nowrap; }

.feed { flex: 1; min-height: 0; overflow-y: auto; padding: 12px 20px 20px; display: flex; flex-direction: column; overscroll-behavior: contain; }
.feed__loading { margin: auto; color: var(--text-muted); font-size: 14px; }
.day { position: sticky; top: 6px; z-index: 1; display: flex; justify-content: center; margin: 14px 0 8px; pointer-events: none; }
.day span { padding: 5px 12px; border-radius: 999px; background: var(--bg-card); border: 1px solid var(--border-color); font-size: 12px; font-weight: 700; color: var(--text-secondary); box-shadow: 0 4px 12px -6px rgba(0, 0, 0, 0.15); }
.msg { display: flex; margin-top: 10px; }
.msg.chain { margin-top: 3px; }
.msg.own { justify-content: flex-end; }
.bubble { position: relative; max-width: min(560px, 78%); padding: 9px 12px 7px 14px; border-radius: 18px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04); animation: msg-in 0.35s ease; }
@keyframes msg-in { from { opacity: 0; } to { opacity: 1; } }
.msg:not(.own):not(.chain) .bubble { border-top-left-radius: 6px; }
.msg.own .bubble { background: linear-gradient(135deg, #22A862, #1A8C52); border-color: transparent; color: #fff; }
.msg.own:not(.chain) .bubble { border-top-right-radius: 6px; }
.bubble__text { display: inline; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.bubble__meta { float: right; display: inline-flex; align-items: center; gap: 3px; margin: 8px 0 -2px 12px; font-size: 11px; color: var(--text-muted); white-space: nowrap; }
.msg.own .bubble__meta { color: rgba(255, 255, 255, 0.75); }
.bubble__meta svg { width: 15px; height: 15px; }
.bubble__meta svg.read { color: #B8FFD9; }
.voice { display: flex; align-items: center; gap: 10px; min-width: 220px; padding-top: 2px; }
.voice__play { display: grid; place-items: center; flex-shrink: 0; width: 38px; height: 38px; border-radius: 50%; border: 0; background: rgba(var(--accent-rgb), 0.14); color: var(--accent-color); cursor: pointer; }
.msg.own .voice__play { background: rgba(255, 255, 255, 0.22); color: #fff; }
.voice__play svg { width: 16px; height: 16px; fill: currentColor; }
.voice__wave { --p: 0; flex: 1; display: flex; align-items: center; gap: 2px; height: 28px; -webkit-mask: linear-gradient(90deg, #000 calc(var(--p) * 100%), rgba(0, 0, 0, 0.45) calc(var(--p) * 100%)); mask: linear-gradient(90deg, #000 calc(var(--p) * 100%), rgba(0, 0, 0, 0.45) calc(var(--p) * 100%)); }
.voice__wave span { flex: 1; min-height: 3px; border-radius: 2px; background: currentColor; }
.msg:not(.own) .voice__wave { color: var(--accent-color); }
.voice__time { font-size: 12px; font-variant-numeric: tabular-nums; opacity: 0.8; }
.feed__closed { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 20px auto 0; padding: 10px 16px; border-radius: 12px; background: rgba(var(--danger-rgb), 0.07); color: var(--danger); font-size: 13px; font-weight: 600; }
.feed__closed svg { width: 16px; height: 16px; }
.to-bottom { position: absolute; left: 50%; bottom: 150px; transform: translateX(-50%); z-index: 3; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 999px; border: 0; background: var(--accent-color); color: var(--text-on-accent, #04120A); font-weight: 700; font-size: 13px; cursor: pointer; box-shadow: 0 10px 24px -10px rgba(var(--accent-rgb), 0.8); }
.to-bottom svg { width: 16px; height: 16px; }

.composer { padding: 10px 20px 14px; border-top: 1px solid var(--border-color); background: var(--bg-card); }
.quick { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
.quick::-webkit-scrollbar { display: none; }
.quick button { flex-shrink: 0; height: 30px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-secondary); font-size: 12.5px; font-weight: 600; cursor: pointer; transition: border-color 0.2s ease, color 0.2s ease; }
.quick button:hover { border-color: rgba(var(--accent-rgb), 0.5); color: var(--accent-color); }
.composer__row { display: flex; align-items: flex-end; gap: 8px; }
.composer textarea { flex: 1; min-height: 44px; max-height: 160px; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--border-color); background: var(--bg-input, var(--bg-primary)); color: var(--text-primary); font: inherit; font-size: 15px; line-height: 1.4; resize: none; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.composer textarea:focus { border-color: rgba(var(--accent-rgb), 0.6); box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1); }
.composer .icon-btn { width: 44px; height: 44px; border-radius: 14px; }
.send { display: grid; place-items: center; flex-shrink: 0; width: 44px; height: 44px; border-radius: 14px; border: 0; background: var(--accent-gradient, var(--accent-color)); color: var(--text-on-accent, #04120A); cursor: pointer; transition: opacity 0.2s ease, box-shadow 0.2s ease; }
.send:not(:disabled):hover { box-shadow: 0 10px 24px -10px rgba(var(--accent-rgb), 0.8); }
.send:disabled { opacity: 0.4; cursor: default; }
.send svg { width: 20px; height: 20px; }
.composer__hint { margin-top: 6px; font-size: 11.5px; color: var(--text-muted); }
.recording { display: flex; align-items: center; gap: 12px; height: 44px; }
.recording__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--danger); animation: rec 1.2s ease-in-out infinite; }
@keyframes rec { 50% { opacity: 0.3; } }
.recording__time { font-weight: 800; font-variant-numeric: tabular-nums; }
.recording__hint { flex: 1; color: var(--text-muted); font-size: 13px; }
.recording__cancel { height: 40px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); font-weight: 700; cursor: pointer; }

.room--empty { align-items: center; justify-content: center; text-align: center; color: var(--text-muted); }
.room--empty svg { width: 56px; height: 56px; opacity: 0.35; margin-bottom: 14px; }
.room--empty h3 { font-size: 20px; color: var(--text-primary); margin-bottom: 6px; }

.pop-enter-active, .pop-leave-active { transition: opacity 0.2s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; }

/* ─── Телефон и планшет: список и переписка по очереди ─── */
@media (max-width: 900px) {
  .chat { grid-template-columns: 1fr; height: calc(100dvh - 64px); }
  .chat.is-open .list { display: none; }
  .chat:not(.is-open) .room { display: none; }
  .room__back { display: grid !important; }
  .room__head { padding: 10px 12px; gap: 10px; }
  .room__head .avatar { width: 40px; height: 40px; font-size: 14px; }
  .order { margin: 10px 12px 0; }
  .feed { padding: 8px 12px 16px; }
  .bubble { max-width: 86%; }
  .composer { padding: 8px 12px calc(10px + env(safe-area-inset-bottom)); }
  .composer__hint { display: none; }
  .to-bottom { bottom: 120px; }
}
@media (max-width: 480px) {
  .ghost-danger { padding: 0 10px; }
  .room__actions .icon-btn { display: none; }
  .voice { min-width: 180px; }
}
</style>
