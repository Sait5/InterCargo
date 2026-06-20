<template>
<div class="saas-landing">
<Header />
<main>
<section class="hero">
<div class="hero-glow"></div>
<div class="hero-grid-bg"></div>
<div class="container">
<div class="hero-grid">
<div class="hero-content">
<div class="hero-badge hero-enter" data-delay="1">
<span class="badge-dot"></span>
TMS Platform
</div>
<h1 class="hero-title hero-enter-title" data-delay="2">
Система управления<br />
<span class="gradient-text">перевозками</span>
</h1>
<p class="hero-description hero-enter" data-delay="3">
Полная автоматизация логистических процессов.
Интеграция с ERP, распределение заказов и аудит в едином окне.
</p>
<div class="hero-actions hero-enter" data-delay="4">
<button class="btn-primary btn-large btn-glow" @click="scrollToDemo">
Попробовать демо
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
<line x1="5" y1="12" x2="19" y2="12" />
<polyline points="12 5 19 12 12 19" />
</svg>
</button>
<button class="btn-secondary btn-large" @click="scrollToIntegrations">
Интеграции
</button>
</div>
<div class="hero-stats hero-enter" data-delay="5">
<div class="hero-stat">
<div class="hero-stat-value">98%</div>
<div class="hero-stat-label">автоматизация</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">24/7</div>
<div class="hero-stat-label">мониторинг</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">-35%</div>
<div class="hero-stat-label">затрат</div>
</div>
</div>
</div>
<div class="hero-visual hero-enter" data-delay="6">
<div class="dashboard-card">
<div class="dashboard-header">
<div class="dashboard-title-row">
<div class="dashboard-dot"></div>
<span>Панель управления TMS</span>
</div>
<div class="status-badge">
<span class="status-dot"></span>
Online
</div>
</div>
<div class="tms-preview">
<div class="tms-row" v-for="order in previewOrders" :key="order.id">
<div class="tms-order-id">#{{ order.id }}</div>
<div class="tms-route">{{ order.route }}</div>
<div class="tms-status" :class="order.status">{{ order.statusText }}</div>
<div class="tms-price">{{ order.price }}</div>
</div>
</div>
<div class="dashboard-footer">
<div class="footer-stats">
<div class="footer-stat">
<div class="footer-stat-value">{{ activeOrdersCount }}</div>
<div class="footer-stat-label">Активных</div>
</div>
<div class="footer-stat">
<div class="footer-stat-value">{{ completedTodayCount }}</div>
<div class="footer-stat-label">Завершено сегодня</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="demo-section" id="demo">
<div class="container">
<div class="section-header">
<span class="section-badge">Демо</span>
<h2 class="section-title">Попробуйте <span class="gradient-text">в действии</span></h2>
<p class="section-subtitle">Интерактивная панель управления заказами</p>
</div>
<div class="tms-dashboard">
<div class="dashboard-toolbar">
<div class="toolbar-filters">
<button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
Все <span class="filter-count">{{ orders.length }}</span>
</button>
<button class="filter-btn" :class="{ active: activeFilter === 'active' }" @click="activeFilter = 'active'">
Активные <span class="filter-count">{{ orders.filter(o => o.status === 'active').length }}</span>
</button>
<button class="filter-btn" :class="{ active: activeFilter === 'completed' }" @click="activeFilter = 'completed'">
Завершённые <span class="filter-count">{{ orders.filter(o => o.status === 'completed').length }}</span>
</button>
</div>
<button class="btn-create-order" @click="createOrder">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
<line x1="12" y1="5" x2="12" y2="19"></line>
<line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
Создать заказ
</button>
</div>
<div class="dashboard-table">
<div class="table-header">
<div class="th">№</div>
<div class="th">Маршрут</div>
<div class="th">Груз</div>
<div class="th">Перевозчик</div>
<div class="th">Статус</div>
<div class="th">Сумма</div>
<div class="th"></div>
</div>
<div class="table-body">
<div v-for="order in filteredOrders" :key="order.id" class="table-row">
<div class="td id-cell">#{{ order.id }}</div>
<div class="td route-cell">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
<circle cx="12" cy="10" r="3"></circle>
</svg>
{{ order.route }}
</div>
<div class="td">{{ order.cargo }}</div>
<div class="td">{{ order.carrier }}</div>
<div class="td">
<span class="status-badge-cell" :class="order.status">{{ getStatusText(order.status) }}</span>
</div>
<div class="td price-cell">{{ order.price }}</div>
<div class="td actions-cell">
<button class="action-btn" @click="changeStatus(order)" :title="getNextStatusAction(order.status)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<polyline points="20 6 9 17 4 12"></polyline>
</svg>
</button>
<button class="action-btn delete" @click="deleteOrder(order.id)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<polyline points="3 6 5 6 21 6"></polyline>
<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>
</button>
</div>
</div>
<div v-if="filteredOrders.length === 0" class="empty-table">
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
</svg>
<p>Заказов не найдено</p>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="integrations-section" id="integrations" ref="integrationsSection">
<div class="container">
<div class="section-header">
<span class="section-badge">Интеграции</span>
<h2 class="section-title">Работаем с <span class="gradient-text">вашими системами</span></h2>
</div>
<div class="integrations-grid">
<div v-for="integration in integrations" :key="integration.name" class="integration-card">
<div class="integration-logo">{{ integration.logo }}</div>
<div class="integration-name">{{ integration.name }}</div>
<div class="integration-desc">{{ integration.desc }}</div>
</div>
</div>
</div>
</section>

<section class="cta-section">
<div class="container">
<div class="cta-card">
<div class="cta-orb cta-orb-1"></div>
<div class="cta-orb cta-orb-2"></div>
<div class="cta-content">
<h2 class="cta-title">Готовы автоматизировать логистику?</h2>
<p class="cta-text">Начните использовать TMS InterCargo уже сегодня и сократите затраты на перевозки до 35%.</p>
<div class="cta-actions">
<button class="btn-primary btn-large" @click="$router.push('/register')">
Начать бесплатно
</button>
<button class="btn-secondary btn-large" @click="$router.push('/contacts')">
Получить демо
</button>
</div>
</div>
</div>
</div>
</section>
</main>
<Footer />
</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const integrationsSection = ref(null);
const activeFilter = ref('all');
const nextId = ref(1006);

const orders = ref([
{ id: 1001, route: 'Москва — Санкт-Петербург', cargo: 'Электроника, 5 т', carrier: 'ТрансЛогистик', status: 'active', price: '85 000 ₽' },
{ id: 1002, route: 'Казань — Екатеринбург', cargo: 'Продукты, 12 т', carrier: 'ГрузоТех', status: 'active', price: '120 000 ₽' },
{ id: 1003, route: 'Новосибирск — Красноярск', cargo: 'Оборудование, 8 т', carrier: 'МегаТранс', status: 'completed', price: '95 000 ₽' },
{ id: 1004, route: 'Ростов — Краснодар', cargo: 'Стройматериалы, 20 т', carrier: 'КаргоПро', status: 'active', price: '45 000 ₽' },
{ id: 1005, route: 'Самара — Уфа', cargo: 'Автозапчасти, 3 т', carrier: 'ЛогистикПлюс', status: 'completed', price: '38 000 ₽' }
]);

const previewOrders = computed(() => orders.value.slice(0, 3).map(o => ({
...o,
statusText: getStatusText(o.status)
})));

const activeOrdersCount = computed(() => orders.value.filter(o => o.status === 'active').length);
const completedTodayCount = computed(() => orders.value.filter(o => o.status === 'completed').length);

const filteredOrders = computed(() => {
if (activeFilter.value === 'all') return orders.value;
return orders.value.filter(o => o.status === activeFilter.value);
});

const getStatusText = (status) => {
const labels = { active: 'В работе', completed: 'Завершён', pending: 'Ожидает' };
return labels[status] || status;
};

const getNextStatusAction = (status) => {
if (status === 'active') return 'Завершить';
if (status === 'completed') return 'Вернуть в работу';
return 'Активировать';
};

const changeStatus = (order) => {
if (order.status === 'active') {
order.status = 'completed';
} else if (order.status === 'completed') {
order.status = 'active';
}
};

const deleteOrder = (id) => {
orders.value = orders.value.filter(o => o.id !== id);
};

const createOrder = () => {
const cities = ['Москва', 'СПб', 'Казань', 'Екатеринбург', 'Новосибирск', 'Ростов', 'Самара'];
const cargos = ['Электроника, 5 т', 'Продукты, 10 т', 'Оборудование, 8 т', 'Текстиль, 3 т'];
const carriers = ['ТрансЛогистик', 'ГрузоТех', 'МегаТранс', 'КаргоПро'];
const from = cities[Math.floor(Math.random() * cities.length)];
let to = cities[Math.floor(Math.random() * cities.length)];
while (to === from) to = cities[Math.floor(Math.random() * cities.length)];

orders.value.unshift({
id: nextId.value++,
route: `${from} — ${to}`,
cargo: cargos[Math.floor(Math.random() * cargos.length)],
carrier: carriers[Math.floor(Math.random() * carriers.length)],
status: 'active',
price: `${(Math.floor(Math.random() * 150) + 30) * 1000} ₽`
});
};

const scrollToDemo = () => {
document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToIntegrations = () => {
integrationsSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const integrations = [
{ logo: '1С', name: '1С:Предприятие', desc: 'Обмен данными в реальном времени' },
{ logo: 'SAP', name: 'SAP ERP', desc: 'Полная интеграция с SAP' },
{ logo: 'Б24', name: 'Bitrix24', desc: 'CRM и задачи в одной системе' },
{ logo: 'Амо', name: 'AmoCRM', desc: 'Синхронизация клиентов' },
{ logo: 'API', name: 'REST API', desc: 'Открытый API для интеграций' },
{ logo: 'XML', name: 'EDI / XML', desc: 'Электронный документооборот' }
];
</script>

<style scoped>
.saas-landing { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 100px 0; }
.gradient-text { background: linear-gradient(135deg, var(--accent-color) 0%, #4ECDC4 50%, var(--accent-color) 100%); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientShift 8s ease infinite; }
@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

.hero { padding: 140px 0 80px; position: relative; overflow: hidden; background: #000000; }
.hero-glow { position: absolute; top: -20%; left: 50%; transform: translateX(-50%); width: 800px; height: 600px; background: radial-gradient(ellipse at center, rgba(45, 192, 113, 0.15) 0%, transparent 70%); pointer-events: none; }
.hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); pointer-events: none; }
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; position: relative; z-index: 1; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(45, 192, 113, 0.12); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.hero-title { font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; color: #ffffff; }
.hero-description { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 36px; max-width: 500px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
.hero-stats { display: flex; gap: 20px; flex-wrap: wrap; }
.hero-stat { display: flex; flex-direction: column; padding: 16px 24px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; min-width: 120px; }
.hero-stat-value { font-size: 28px; font-weight: 800; color: var(--accent-color); line-height: 1; }
.hero-stat-label { font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 6px; }

.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.12); transform: translateY(-3px); }
.btn-large { padding: 16px 32px; font-size: 16px; border-radius: 14px; }

.hero-visual { position: relative; }
.dashboard-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 28px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); backdrop-filter: blur(20px); }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.dashboard-title-row { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; color: #ffffff; }
.dashboard-dot { width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%; box-shadow: 0 0 8px rgba(45, 192, 113, 0.5); }
.status-badge { display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(45, 192, 113, 0.15); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; }
.status-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }

.tms-preview { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.tms-row { display: grid; grid-template-columns: 60px 1fr 100px 90px; gap: 12px; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; font-size: 13px; color: rgba(255, 255, 255, 0.9); }
.tms-order-id { color: var(--accent-color); font-weight: 700; }
.tms-route { font-weight: 500; }
.tms-status { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-align: center; }
.tms-status.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.tms-status.completed { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.tms-price { font-weight: 700; color: var(--accent-color); text-align: right; }

.dashboard-footer { padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.footer-stats { display: flex; gap: 32px; }
.footer-stat-value { font-size: 24px; font-weight: 800; color: var(--accent-color); line-height: 1; }
.footer-stat-label { font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px; }

.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; padding: 6px 14px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; border: 1px solid rgba(45, 192, 113, 0.15); }
.section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
.section-subtitle { font-size: 17px; color: var(--text-secondary); line-height: 1.6; max-width: 560px; margin: 0 auto; }

.tms-dashboard { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; overflow: hidden; }
.dashboard-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.toolbar-filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-secondary); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.filter-btn:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.filter-btn.active { background: rgba(45, 192, 113, 0.1); border-color: var(--accent-color); color: var(--accent-color); }
.filter-count { background: rgba(255, 255, 255, 0.1); padding: 2px 8px; border-radius: 8px; font-size: 11px; }
.filter-btn.active .filter-count { background: rgba(45, 192, 113, 0.2); }
.btn-create-order { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-create-order:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }

.dashboard-table { overflow-x: auto; }
.table-header { display: grid; grid-template-columns: 70px 1.5fr 1fr 1fr 120px 120px 80px; gap: 12px; padding: 12px 16px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; margin-bottom: 8px; }
.th { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.table-body { display: flex; flex-direction: column; gap: 6px; }
.table-row { display: grid; grid-template-columns: 70px 1.5fr 1fr 1fr 120px 120px 80px; gap: 12px; padding: 14px 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 10px; align-items: center; transition: all 0.2s ease; font-size: 14px; }
.table-row:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(45, 192, 113, 0.2); }
.id-cell { color: var(--accent-color); font-weight: 700; font-size: 13px; }
.route-cell { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.route-cell svg { color: var(--accent-color); flex-shrink: 0; }
.status-badge-cell { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.status-badge-cell.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.status-badge-cell.completed { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.status-badge-cell.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.price-cell { font-weight: 700; color: var(--accent-color); }
.actions-cell { display: flex; gap: 6px; justify-content: flex-end; }
.action-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(45, 192, 113, 0.1); border: none; color: var(--accent-color); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
.action-btn:hover { background: rgba(45, 192, 113, 0.2); transform: translateY(-2px); }
.action-btn.delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.action-btn.delete:hover { background: rgba(239, 68, 68, 0.2); }
.empty-table { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-table svg { opacity: 0.3; margin-bottom: 16px; }

.integrations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.integration-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px 24px; text-align: center; transition: all 0.3s ease; }
.integration-card:hover { transform: translateY(-6px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.integration-logo { width: 64px; height: 64px; border-radius: 16px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; margin: 0 auto 16px; border: 1px solid rgba(45, 192, 113, 0.15); }
.integration-name { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
.integration-desc { font-size: 13px; color: var(--text-muted); }

.cta-section { padding: 80px 0; }
.cta-card { background: linear-gradient(135deg, #0a1929 0%, #1a2a3a 100%); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 32px; padding: 64px; text-align: center; position: relative; overflow: hidden; }
.cta-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.cta-orb-1 { top: -100px; left: -100px; width: 300px; height: 300px; background: rgba(45, 192, 113, 0.15); }
.cta-orb-2 { bottom: -100px; right: -100px; width: 400px; height: 400px; background: rgba(45, 192, 113, 0.1); }
.cta-content { position: relative; z-index: 2; }
.cta-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #ffffff; margin-bottom: 20px; }
.cta-text { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

.hero-enter { opacity: 0; animation: heroFadeUp 0.7s ease forwards; }
.hero-enter-title { opacity: 0; animation: heroTitlePop 0.7s ease forwards; }
@keyframes heroFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes heroTitlePop { 0% { opacity: 0; transform: translateY(24px) scale(0.96); } 60% { opacity: 1; transform: translateY(-2px) scale(1.01); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.hero-enter[data-delay="1"] { animation-delay: 0ms; }
.hero-enter[data-delay="2"], .hero-enter-title[data-delay="2"] { animation-delay: 120ms; }
.hero-enter[data-delay="3"] { animation-delay: 240ms; }
.hero-enter[data-delay="4"] { animation-delay: 380ms; }
.hero-enter[data-delay="5"] { animation-delay: 520ms; }
.hero-enter[data-delay="6"] { animation-delay: 680ms; }

@media (max-width: 1024px) {
.hero-grid { grid-template-columns: 1fr; gap: 40px; }
.integrations-grid { grid-template-columns: repeat(2, 1fr); }
.table-header, .table-row { grid-template-columns: 60px 1.5fr 1fr 120px 100px 80px; }
.table-header .th:nth-child(4), .table-row > :nth-child(4) { display: none; }
}
@media (max-width: 768px) {
section { padding: 60px 0; }
.hero { padding: 100px 0 60px; }
.integrations-grid { grid-template-columns: 1fr; }
.table-header, .table-row { grid-template-columns: 60px 1fr 100px 80px; font-size: 13px; }
.table-header .th:nth-child(3), .table-row > :nth-child(3),
.table-header .th:nth-child(4), .table-row > :nth-child(4),
.table-header .th:nth-child(5), .table-row > :nth-child(5) { display: none; }
.cta-card { padding: 40px 24px; }
.cta-actions { flex-direction: column; }
.hero-stats { flex-direction: column; }
}
</style>