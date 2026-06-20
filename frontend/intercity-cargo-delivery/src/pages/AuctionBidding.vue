<template>
<div class="saas-landing">
<Header />
<main class="bidding-main">
<div class="container">
<div v-if="auctionStore.loading && !auction" class="loading-state">
<div class="spinner"></div>
<p>Загрузка аукциона...</p>
</div>
<div v-else-if="auction" class="bidding-layout">
<div class="bidding-content">
<div class="auction-info-card">
<div class="auction-header">
<div class="auction-status" :class="auction.status">{{ getStatusLabel(auction.status) }}</div>
<div class="auction-timer" :class="{ urgent: getTimeLeft(auction.endsAt) < 3600 }">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
<span>{{ formatTimeLeft(auction.endsAt) }}</span>
</div>
</div>
<h1 class="auction-title">{{ auction.title }}</h1>
<div class="auction-route">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
{{ auction.route }}
</div>
<div class="info-grid">
<div class="info-item"><span class="info-label">Тип груза</span><span class="info-value">{{ auction.cargoType }}</span></div>
<div class="info-item"><span class="info-label">Объём</span><span class="info-value">{{ auction.volume }}</span></div>
<div class="info-item"><span class="info-label">Период</span><span class="info-value">{{ formatDate(auction.dateFrom) }} — {{ formatDate(auction.dateTo) }}</span></div>
<div class="info-item"><span class="info-label">Создатель</span><span class="info-value">{{ auction.creatorName }}</span></div>
</div>
<div v-if="auction.description" class="auction-description">
<h4>Описание</h4>
<p>{{ auction.description }}</p>
</div>
</div>

<div v-if="isCarrier && auction.status === 'active' && !isCreator" class="bid-card">
<h3>Сделать ставку</h3>
<p class="bid-hint">Предложите свою цену. Побеждает минимальная ставка.</p>
<div class="current-price-display">
<span class="price-label">Текущая лучшая цена</span>
<span class="price-value">{{ formatPrice(auction.currentPrice) }}</span>
</div>
<div class="bid-form">
<div class="form-group">
<label>Ваша цена (₽)</label>
<input v-model="bidAmount" type="number" :max="auction.currentPrice - 1" min="1" step="1" placeholder="Введите сумму" @keydown="blockLetters" />
<p class="form-hint">Ставка должна быть меньше {{ formatPrice(auction.currentPrice) }}</p>
</div>
<button class="btn-bid" @click="placeBid" :disabled="auctionStore.loading || !bidAmount || bidAmount >= auction.currentPrice">
<span v-if="!auctionStore.loading">Предложить цену</span>
<span v-else>Отправка...</span>
</button>
</div>
</div>

<div v-if="isCreator && auction.status === 'active'" class="creator-actions">
<h3>Управление аукционом</h3>
<div class="actions-row">
<button class="btn-complete" @click="completeAuction">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
Завершить аукцион
</button>
<button class="btn-cancel-auction" @click="cancelAuction">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
Отменить
</button>
</div>
</div>

<div v-if="auction.status === 'completed' && auction.winnerName" class="winner-card">
<h3>Победитель аукциона</h3>
<div class="winner-info">
<div class="winner-avatar">{{ getWinnerInitials() }}</div>
<div>
<div class="winner-name">{{ auction.winnerName }}</div>
<div class="winner-price">Итоговая цена: {{ formatPrice(auction.currentPrice) }}</div>
</div>
</div>
</div>
</div>

<aside class="bidding-sidebar">
<div class="bids-card">
<div class="bids-header">
<h3>История ставок</h3>
<span class="bids-count">{{ auction.bids?.length || 0 }}</span>
</div>
<div v-if="!auction.bids || auction.bids.length === 0" class="no-bids">
<p>Пока нет ставок</p>
</div>
<div v-else class="bids-list">
<div v-for="(bid, index) in sortedBids" :key="bid._id || index" class="bid-item" :class="{ best: index === 0 }">
<div class="bid-position">{{ index + 1 }}</div>
<div class="bid-info">
<div class="bid-name">{{ bid.bidderName }}</div>
<div class="bid-company" v-if="bid.bidderCompany">{{ bid.bidderCompany }}</div>
<div class="bid-time">{{ formatBidTime(bid.createdAt) }}</div>
</div>
<div class="bid-amount">{{ formatPrice(bid.amount) }}</div>
</div>
</div>
</div>
</aside>
</div>
</div>
</main>
<Footer />
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuctionStore } from '@/stores/auctions';
import { useToastStore } from '@/stores/toast';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const auctionStore = useAuctionStore();
const toast = useToastStore();

const bidAmount = ref('');
let refreshInterval = null;

const auction = computed(() => auctionStore.currentAuction);
const isCarrier = computed(() => userStore.user?.accountType === 'carrier');
const isCreator = computed(() => auction.value?.creatorId?._id === userStore.user?.id || auction.value?.creatorId === userStore.user?.id);

const sortedBids = computed(() => {
if (!auction.value?.bids) return [];
return [...auction.value.bids].sort((a, b) => a.amount - b.amount);
});

const loadAuction = async () => {
const id = route.params.id;
await auctionStore.fetchById(id);
};

const placeBid = async () => {
if (!bidAmount.value || bidAmount.value >= auction.value.currentPrice) {
toast.error(`Ставка должна быть меньше ${formatPrice(auction.value.currentPrice)}`);
return;
}
const result = await auctionStore.placeBid(auction.value._id, Number(bidAmount.value));
if (result.success) {
toast.success('Ставка принята! Вы лидируете.');
bidAmount.value = '';
} else {
toast.error(result.message || 'Ошибка ставки');
}
};

const completeAuction = async () => {
if (!confirm('Завершить аукцион? Текущий лидер станет победителем.')) return;
const result = await auctionStore.complete(auction.value._id);
if (result.success) toast.success('Аукцион завершён');
else toast.error(result.message || 'Ошибка');
};

const cancelAuction = async () => {
if (!confirm('Отменить аукцион? Все ставки будут аннулированы.')) return;
const result = await auctionStore.cancel(auction.value._id);
if (result.success) toast.success('Аукцион отменён');
else toast.error(result.message || 'Ошибка');
};

const blockLetters = (event) => {
const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
if (allowed.includes(event.key)) return;
if (!/^\d$/.test(event.key)) event.preventDefault();
};

const getStatusLabel = (status) => {
const labels = { draft: 'Черновик', active: 'Активен', completed: 'Завершён', cancelled: 'Отменён' };
return labels[status] || status;
};

const getTimeLeft = (endsAt) => {
if (!endsAt) return 0;
return Math.max(0, (new Date(endsAt) - new Date()) / 1000);
};

const formatTimeLeft = (endsAt) => {
const sec = getTimeLeft(endsAt);
if (sec <= 0) return 'Завершён';
const h = Math.floor(sec / 3600);
const m = Math.floor((sec % 3600) / 60);
const s = Math.floor(sec % 60);
if (h > 24) return `${Math.floor(h / 24)}д ${h % 24}ч`;
return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatPrice = (price) => {
const num = parseInt(price);
if (isNaN(num)) return price;
return num.toLocaleString('ru-RU') + ' ₽';
};

const formatDate = (dateStr) => {
if (!dateStr) return '';
return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatBidTime = (dateStr) => {
if (!dateStr) return '';
return new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const getWinnerInitials = () => {
if (!auction.value?.winnerName) return '?';
return auction.value.winnerName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
};

onMounted(async () => {
window.scrollTo({ top: 0, behavior: 'instant' });
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
await loadAuction();
refreshInterval = setInterval(() => {
if (auction.value?.status === 'active') loadAuction();
}, 5000);
});

onUnmounted(() => {
if (refreshInterval) clearInterval(refreshInterval);
});
</script>

<style scoped>
.saas-landing { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; }
.bidding-main { padding: 40px 0 80px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.loading-state { text-align: center; padding: 80px 20px; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(45, 192, 113, 0.2); border-top-color: #2DC071; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { color: var(--text-muted); }
.bidding-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
.bidding-content { display: flex; flex-direction: column; gap: 20px; }
.auction-info-card, .bid-card, .creator-actions, .winner-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 28px; }
.auction-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.auction-status { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.auction-status.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); }
.auction-status.completed { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
.auction-status.cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.auction-timer { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; padding: 8px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
.auction-timer.urgent { color: #ef4444; background: rgba(239, 68, 68, 0.1); animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
.auction-title { font-size: 24px; font-weight: 800; margin-bottom: 12px; }
.auction-route { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
.auction-route svg { color: var(--accent-color); }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 20px; }
.info-item { display: flex; flex-direction: column; gap: 4px; }
.info-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
.info-value { font-size: 14px; font-weight: 600; }
.auction-description { padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
.auction-description h4 { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
.auction-description p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
.bid-card h3, .creator-actions h3, .winner-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
.bid-hint { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
.current-price-display { padding: 16px; background: rgba(45, 192, 113, 0.08); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
.price-label { font-size: 13px; color: var(--text-muted); text-transform: uppercase; }
.price-value { font-size: 24px; font-weight: 800; color: var(--accent-color); }
.bid-form { display: flex; flex-direction: column; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-group input { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; color: var(--text-primary); font-size: 16px; font-weight: 700; outline: none; transition: all 0.2s ease; }
.form-group input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.form-hint { font-size: 12px; color: var(--text-muted); }
.btn-bid { padding: 14px; background: linear-gradient(135deg, #2DC071, #28a45e); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-bid:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-bid:disabled { opacity: 0.6; cursor: not-allowed; }
.actions-row { display: flex; gap: 10px; }
.btn-complete, .btn-cancel-auction { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; }
.btn-complete { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.btn-complete:hover { background: rgba(45, 192, 113, 0.25); }
.btn-cancel-auction { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.btn-cancel-auction:hover { background: rgba(239, 68, 68, 0.25); }
.winner-info { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(45, 192, 113, 0.08); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 12px; }
.winner-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #2DC071, #28a45e); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; }
.winner-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.winner-price { font-size: 15px; color: var(--accent-color); font-weight: 600; }
.bidding-sidebar { position: sticky; top: 24px; }
.bids-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; }
.bids-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.bids-header h3 { font-size: 18px; font-weight: 700; margin: 0; }
.bids-count { background: rgba(45, 192, 113, 0.15); color: var(--accent-color); font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 10px; }
.no-bids { text-align: center; padding: 40px 20px; color: var(--text-muted); }
.bids-list { display: flex; flex-direction: column; gap: 10px; max-height: 500px; overflow-y: auto; }
.bid-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 12px; transition: all 0.2s ease; }
.bid-item.best { background: rgba(45, 192, 113, 0.08); border-color: rgba(45, 192, 113, 0.3); }
.bid-position { width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.bid-item.best .bid-position { background: var(--accent-color); color: white; }
.bid-info { flex: 1; min-width: 0; }
.bid-name { font-size: 14px; font-weight: 600; }
.bid-company { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.bid-time { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.bid-amount { font-size: 16px; font-weight: 800; color: var(--accent-color); white-space: nowrap; }
@media (max-width: 1024px) { .bidding-layout { grid-template-columns: 1fr; } .bidding-sidebar { position: static; } }
@media (max-width: 768px) { .auction-info-card, .bid-card, .creator-actions, .winner-card, .bids-card { padding: 20px; } .info-grid { grid-template-columns: 1fr; } .actions-row { flex-direction: column; } }
</style>