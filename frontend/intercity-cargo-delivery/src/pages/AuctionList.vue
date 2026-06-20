<template>
<div class="saas-landing">
<Header />
<main class="auction-list-page">
<div class="container">
<div class="page-header">
<h1 class="page-title">Все <span class="gradient-text">аукционы</span></h1>
<p class="page-subtitle">Активные торги и завершённые аукционы</p>
</div>

<div class="filter-tabs">
<button class="filter-tab" :class="{ active: filter === 'active' }" @click="filter = 'active'">
Активные
<span class="tab-count">{{ activeAuctions.length }}</span>
</button>
<button class="filter-tab" :class="{ active: filter === 'completed' }" @click="filter = 'completed'">
Завершённые
<span class="tab-count">{{ completedAuctions.length }}</span>
</button>
<button class="filter-tab" :class="{ active: filter === 'all' }" @click="filter = 'all'">
Все
<span class="tab-count">{{ auctions.length }}</span>
</button>
</div>

<div v-if="auctionStore.loading" class="loading-state">
<div class="spinner"></div>
<p>Загрузка аукционов...</p>
</div>

<div v-else-if="filteredAuctions.length === 0" class="empty-state">
<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
</svg>
<h3>Аукционов не найдено</h3>
<p v-if="isCustomer">Создайте первый аукцион</p>
<p v-else>Пока нет активных торгов</p>
<button v-if="isCustomer" class="btn-primary" @click="$router.push('/create-auction')">
Создать аукцион
</button>
</div>

<div v-else class="auctions-grid">
<div v-for="auction in filteredAuctions" :key="auction._id" class="auction-card" @click="$router.push(`/auction/${auction._id}`)">
<div class="auction-card-header">
<div class="auction-status" :class="auction.status">{{ getStatusLabel(auction.status) }}</div>
<div class="auction-timer" :class="{ urgent: getTimeLeft(auction.endsAt) < 3600 }">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="12" cy="12" r="10"></circle>
<polyline points="12 6 12 12 16 14"></polyline>
</svg>
<span>{{ formatTimeLeft(auction.endsAt) }}</span>
</div>
</div>
<div class="auction-route">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
<circle cx="12" cy="10" r="3"></circle>
</svg>
{{ auction.route }}
</div>
<div class="auction-title">{{ auction.title }}</div>
<div class="auction-details">
<div class="detail-item">
<span class="detail-label">Тип груза</span>
<span class="detail-value">{{ auction.cargoType }}</span>
</div>
<div class="detail-item">
<span class="detail-label">Объём</span>
<span class="detail-value">{{ auction.volume }}</span>
</div>
<div class="detail-item">
<span class="detail-label">Период</span>
<span class="detail-value">{{ formatDate(auction.dateFrom) }} — {{ formatDate(auction.dateTo) }}</span>
</div>
</div>
<div class="auction-pricing">
<div class="price-block">
<span class="price-label">Стартовая</span>
<span class="price-value">{{ formatPrice(auction.startPrice) }}</span>
</div>
<div class="price-block current">
<span class="price-label">Текущая ставка</span>
<span class="price-value">{{ formatPrice(auction.currentPrice) }}</span>
</div>
</div>
<div class="auction-footer">
<div class="bids-count">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
<circle cx="9" cy="7" r="4"></circle>
</svg>
<span>{{ auction.bids?.length || 0 }} ставок</span>
</div>
<div class="auction-type" :class="auction.accessType">{{ auction.accessType === 'public' ? 'Общий' : 'Личный' }}</div>
</div>
</div>
</div>
</div>
</main>
<Footer />
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useAuctionStore } from '@/stores/auctions';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const userStore = useUserStore();
const auctionStore = useAuctionStore();

const filter = ref('active');

const isCustomer = computed(() => userStore.user?.accountType === 'customer');

const auctions = computed(() => auctionStore.auctions);
const activeAuctions = computed(() => auctions.value.filter(a => a.status === 'active'));
const completedAuctions = computed(() => auctions.value.filter(a => a.status === 'completed' || a.status === 'cancelled'));

const filteredAuctions = computed(() => {
if (filter.value === 'active') return activeAuctions.value;
if (filter.value === 'completed') return completedAuctions.value;
return auctions.value;
});

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

onMounted(async () => {
window.scrollTo({ top: 0, behavior: 'instant' });
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
await auctionStore.fetchAll();
});
</script>

<style scoped>
.saas-landing { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; }
.auction-list-page { padding: 60px 0 100px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.gradient-text { background: linear-gradient(135deg, var(--accent-color) 0%, #4ECDC4 50%, var(--accent-color) 100%); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-header { text-align: center; margin-bottom: 40px; }
.page-title { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin-bottom: 12px; }
.page-subtitle { font-size: 17px; color: var(--text-muted); }

.filter-tabs { display: flex; gap: 12px; margin-bottom: 32px; justify-content: center; flex-wrap: wrap; }
.filter-tab { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-secondary); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.filter-tab:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.filter-tab.active { background: rgba(45, 192, 113, 0.1); border-color: var(--accent-color); color: var(--accent-color); }
.tab-count { background: rgba(255, 255, 255, 0.1); padding: 2px 8px; border-radius: 8px; font-size: 12px; }
.filter-tab.active .tab-count { background: rgba(45, 192, 113, 0.2); }

.loading-state { text-align: center; padding: 80px 20px; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(45, 192, 113, 0.2); border-top-color: #2DC071; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { color: var(--text-muted); }

.empty-state { text-align: center; padding: 80px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; }
.empty-state svg { color: var(--text-muted); opacity: 0.3; margin-bottom: 20px; }
.empty-state h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.empty-state p { font-size: 15px; color: var(--text-muted); margin-bottom: 24px; }
.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s ease; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }

.auctions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
.auction-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; gap: 16px; }
.auction-card:hover { border-color: rgba(45, 192, 113, 0.3); transform: translateY(-4px); box-shadow: 0 10px 30px var(--shadow-color); }

.auction-card-header { display: flex; justify-content: space-between; align-items: center; }
.auction-status { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.auction-status.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); }
.auction-status.completed { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
.auction-status.cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.auction-timer { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; padding: 6px 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; }
.auction-timer.urgent { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.auction-route { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; }
.auction-route svg { color: var(--accent-color); flex-shrink: 0; }
.auction-title { font-size: 14px; color: var(--text-secondary); }

.auction-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
.detail-value { font-size: 13px; font-weight: 600; }

.auction-pricing { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.price-block { padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
.price-block.current { background: rgba(45, 192, 113, 0.08); border: 1px solid rgba(45, 192, 113, 0.2); }
.price-label { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
.price-value { font-size: 16px; font-weight: 800; }
.price-block.current .price-value { color: var(--accent-color); }

.auction-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-color); }
.bids-count { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); }
.auction-type { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.auction-type.public { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.auction-type.private { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }

@media (max-width: 1024px) { .auctions-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
@media (max-width: 768px) { .auction-list-page { padding: 40px 0 60px; } .page-title { font-size: 28px; } .auctions-grid { grid-template-columns: 1fr; } .auction-details { grid-template-columns: 1fr; } .auction-pricing { grid-template-columns: 1fr; } }
</style>