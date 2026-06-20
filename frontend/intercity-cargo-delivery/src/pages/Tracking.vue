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
Real-time Tracking
</div>
<h1 class="hero-title hero-enter-title" data-delay="2">
Трекинг <span class="gradient-text">грузов</span>
</h1>
<p class="hero-description hero-enter" data-delay="3">
Полный контроль доставки в реальном времени.
GPS-мониторинг, уведомления и мобильное приложение.
</p>
<div class="hero-actions hero-enter" data-delay="4">
<button class="btn-primary btn-large btn-glow" @click="scrollToTracking">
Отследить груз
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
<line x1="5" y1="12" x2="19" y2="12" />
<polyline points="12 5 19 12 12 19" />
</svg>
</button>
</div>
<div class="hero-stats hero-enter" data-delay="5">
<div class="hero-stat">
<div class="hero-stat-value">GPS</div>
<div class="hero-stat-label">мониторинг</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">99.9%</div>
<div class="hero-stat-label">точность</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">24/7</div>
<div class="hero-stat-label">поддержка</div>
</div>
</div>
</div>
<div class="hero-visual hero-enter" data-delay="6">
<div class="tracking-card">
<div class="tracking-header">
<div class="tracking-title-row">
<div class="tracking-dot"></div>
<span>Груз в пути</span>
</div>
<div class="status-badge">
<span class="status-dot"></span>
Live
</div>
</div>
<div class="tracking-map">
<div class="map-route">
<div class="map-point start">
<div class="point-label">Москва</div>
</div>
<div class="map-line">
<div class="map-progress" :style="{ width: currentProgress + '%' }"></div>
<div class="map-truck" :style="{ left: currentProgress + '%' }">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<rect x="1" y="3" width="15" height="13"></rect>
<polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
<circle cx="5.5" cy="18.5" r="2.5"></circle>
<circle cx="18.5" cy="18.5" r="2.5"></circle>
</svg>
</div>
</div>
<div class="map-point end">
<div class="point-label">СПб</div>
</div>
</div>
</div>
<div class="tracking-info">
<div class="info-row">
<span class="info-label">№ груза</span>
<span class="info-value">#TR-2847</span>
</div>
<div class="info-row">
<span class="info-label">Статус</span>
<span class="info-value status">В пути</span>
</div>
<div class="info-row">
<span class="info-label">Прибытие</span>
<span class="info-value">{{ eta }}</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="tracking-section" id="tracking" ref="trackingSection">
<div class="container">
<div class="section-header">
<span class="section-badge">Отслеживание</span>
<h2 class="section-title">Введите номер <span class="gradient-text">груза</span></h2>
<p class="section-subtitle">Получите информацию о местоположении и статусе доставки</p>
</div>
<div class="tracking-form-card">
<div class="tracking-input-wrap">
<input
type="text"
v-model="trackingNumber"
placeholder="Например: TR-2847"
class="tracking-input"
@keyup.enter="trackShipment"
/>
<button class="btn-track" @click="trackShipment">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="11" cy="11" r="8"></circle>
<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
Отследить
</button>
</div>
<div class="sample-numbers">
<span class="sample-label">Примеры:</span>
<button class="sample-btn" v-for="num in sampleNumbers" :key="num" @click="trackingNumber = num; trackShipment()">
{{ num }}
</button>
</div>
</div>

<div v-if="trackedShipment" class="tracking-result">
<div class="result-header">
<div class="result-info">
<div class="result-number">{{ trackedShipment.number }}</div>
<div class="result-route">{{ trackedShipment.route }}</div>
</div>
<div class="result-status" :class="trackedShipment.status">
{{ getStatusText(trackedShipment.status) }}
</div>
</div>
<div class="progress-timeline">
<div v-for="(step, idx) in trackedShipment.timeline" :key="idx" class="timeline-step" :class="{ active: step.active, current: step.current }">
<div class="step-dot"></div>
<div class="step-content">
<div class="step-title">{{ step.title }}</div>
<div class="step-time">{{ step.time }}</div>
<div class="step-location" v-if="step.location">{{ step.location }}</div>
</div>
</div>
</div>
<div class="result-details">
<div class="detail-card">
<div class="detail-label">Отправитель</div>
<div class="detail-value">{{ trackedShipment.sender }}</div>
</div>
<div class="detail-card">
<div class="detail-label">Получатель</div>
<div class="detail-value">{{ trackedShipment.receiver }}</div>
</div>
<div class="detail-card">
<div class="detail-label">Вес</div>
<div class="detail-value">{{ trackedShipment.weight }}</div>
</div>
<div class="detail-card">
<div class="detail-label">Прибытие</div>
<div class="detail-value">{{ trackedShipment.eta }}</div>
</div>
</div>
</div>
</div>
</section>

<section class="shipments-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Мониторинг</span>
<h2 class="section-title">Активные <span class="gradient-text">отправления</span></h2>
</div>
<div class="shipments-list">
<div v-for="shipment in activeShipments" :key="shipment.id" class="shipment-card">
<div class="shipment-header">
<div class="shipment-id">#{{ shipment.id }}</div>
<div class="shipment-status" :class="shipment.status">
{{ getStatusText(shipment.status) }}
</div>
</div>
<div class="shipment-route">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
<circle cx="12" cy="10" r="3"></circle>
</svg>
{{ shipment.route }}
</div>
<div class="shipment-progress">
<div class="progress-bar">
<div class="progress-fill" :style="{ width: shipment.progress + '%' }"></div>
</div>
<div class="progress-info">
<span>{{ shipment.progress }}%</span>
<span>{{ shipment.eta }}</span>
</div>
</div>
<div class="shipment-footer">
<div class="shipment-driver">
<div class="driver-avatar">{{ shipment.driverInitials }}</div>
<div class="driver-info">
<div class="driver-name">{{ shipment.driver }}</div>
<div class="driver-vehicle">{{ shipment.vehicle }}</div>
</div>
</div>
<div class="shipment-weight">{{ shipment.weight }}</div>
</div>
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
<h2 class="cta-title">Контролируйте каждый груз</h2>
<p class="cta-text">Подключите систему трекинга InterCargo и получайте уведомления о статусе доставки в реальном времени.</p>
<div class="cta-actions">
<button class="btn-primary btn-large" @click="$router.push('/register')">
Подключить
</button>
<button class="btn-secondary btn-large" @click="$router.push('/contacts')">
Связаться с нами
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const trackingSection = ref(null);

const trackingNumber = ref('');
const trackedShipment = ref(null);
const currentProgress = ref(65);
let progressInterval = null;

const sampleNumbers = ['TR-2847', 'TR-1593', 'TR-4721'];

const shipmentsData = {
'TR-2847': {
number: 'TR-2847',
route: 'Москва — Санкт-Петербург',
status: 'in-transit',
sender: 'ООО "ТехноПром"',
receiver: 'ИП Иванов А.С.',
weight: '5 200 кг',
eta: 'Сегодня, 18:00',
timeline: [
{ title: 'Заказ создан', time: '15 июня, 09:00', location: 'Москва', active: true },
{ title: 'Принят на складе', time: '15 июня, 11:30', location: 'Москва, склад №3', active: true },
{ title: 'Отправлен', time: '15 июня, 14:00', location: 'Москва', active: true },
{ title: 'В пути', time: 'Сейчас', location: 'Тверская обл.', active: true, current: true },
{ title: 'Прибытие', time: 'Сегодня, 18:00', location: 'Санкт-Петербург', active: false }
]
},
'TR-1593': {
number: 'TR-1593',
route: 'Казань — Екатеринбург',
status: 'delivered',
sender: 'ООО "ГрузСервис"',
receiver: 'ООО "УралТорг"',
weight: '12 400 кг',
eta: 'Доставлен',
timeline: [
{ title: 'Заказ создан', time: '13 июня, 10:00', location: 'Казань', active: true },
{ title: 'Принят на складе', time: '13 июня, 13:00', location: 'Казань', active: true },
{ title: 'Отправлен', time: '13 июня, 16:00', location: 'Казань', active: true },
{ title: 'В пути', time: '14 июня, 08:00', location: 'Челябинская обл.', active: true },
{ title: 'Доставлен', time: '14 июня, 19:30', location: 'Екатеринбург', active: true, current: true }
]
},
'TR-4721': {
number: 'TR-4721',
route: 'Новосибирск — Красноярск',
status: 'processing',
sender: 'ИП Петров В.И.',
receiver: 'ООО "СибирьЛогистик"',
weight: '8 100 кг',
eta: 'Завтра, 12:00',
timeline: [
{ title: 'Заказ создан', time: 'Сегодня, 08:00', location: 'Новосибирск', active: true },
{ title: 'Принят на складе', time: 'Сегодня, 10:30', location: 'Новосибирск', active: true, current: true },
{ title: 'Отправлен', time: 'Ожидается', location: '', active: false },
{ title: 'В пути', time: 'Ожидается', location: '', active: false },
{ title: 'Прибытие', time: 'Завтра, 12:00', location: 'Красноярск', active: false }
]
}
};

const activeShipments = ref([
{ id: 'TR-2847', route: 'Москва — Санкт-Петербург', status: 'in-transit', progress: 65, eta: '18:00 сегодня', driver: 'Смирнов А.В.', driverInitials: 'СА', vehicle: 'Volvo FH, А 123 ВС 77', weight: '5 200 кг' },
{ id: 'TR-1593', route: 'Казань — Екатеринбург', status: 'delivered', progress: 100, eta: 'Доставлен', driver: 'Козлов И.П.', driverInitials: 'КИ', vehicle: 'Scania R, В 456 ОР 16', weight: '12 400 кг' },
{ id: 'TR-4721', route: 'Новосибирск — Красноярск', status: 'processing', progress: 20, eta: 'Завтра 12:00', driver: 'Волков Д.С.', driverInitials: 'ВД', vehicle: 'MAN TGX, С 789 КТ 54', weight: '8 100 кг' }
]);

const eta = computed(() => {
const now = new Date();
const arrival = new Date(now.getTime() + 4 * 60 * 60 * 1000);
return `Сегодня, ${arrival.getHours().toString().padStart(2, '0')}:${arrival.getMinutes().toString().padStart(2, '0')}`;
});

const getStatusText = (status) => {
const labels = { 'in-transit': 'В пути', 'delivered': 'Доставлен', 'processing': 'Обработка' };
return labels[status] || status;
};

const trackShipment = () => {
if (!trackingNumber.value.trim()) return;
const num = trackingNumber.value.trim().toUpperCase();
if (shipmentsData[num]) {
trackedShipment.value = JSON.parse(JSON.stringify(shipmentsData[num]));
} else {
trackedShipment.value = null;
}
};

const scrollToTracking = () => {
trackingSection.value?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
progressInterval = setInterval(() => {
currentProgress.value = Math.min(100, currentProgress.value + 0.1);
if (currentProgress.value >= 100) currentProgress.value = 0;
}, 100);
});

onUnmounted(() => {
if (progressInterval) clearInterval(progressInterval);
});
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
.tracking-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 28px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); backdrop-filter: blur(20px); }
.tracking-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.tracking-title-row { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; color: #ffffff; }
.tracking-dot { width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%; box-shadow: 0 0 8px rgba(45, 192, 113, 0.5); }
.status-badge { display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(45, 192, 113, 0.15); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; }
.status-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }

.tracking-map { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 32px 24px; margin-bottom: 20px; }
.map-route { display: flex; align-items: center; gap: 16px; }
.map-point { position: relative; width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; }
.map-point.start { background: var(--accent-color); box-shadow: 0 0 12px rgba(45, 192, 113, 0.5); }
.map-point.end { background: #3b82f6; box-shadow: 0 0 12px rgba(59, 130, 246, 0.5); }
.point-label { position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.8); white-space: nowrap; }
.map-line { flex: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; position: relative; overflow: visible; }
.map-progress { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, var(--accent-color), #4ECDC4); border-radius: 2px; transition: width 0.3s ease; }
.map-truck { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 36px; height: 36px; background: var(--accent-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 0 20px rgba(45, 192, 113, 0.5); transition: left 0.3s ease; }

.tracking-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.info-row { padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
.info-label { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.info-value { font-size: 14px; font-weight: 700; color: #ffffff; }
.info-value.status { color: var(--accent-color); }

.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; padding: 6px 14px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; border: 1px solid rgba(45, 192, 113, 0.15); }
.section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
.section-subtitle { font-size: 17px; color: var(--text-secondary); line-height: 1.6; max-width: 560px; margin: 0 auto; }

.tracking-form-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; margin-bottom: 32px; }
.tracking-input-wrap { display: flex; gap: 12px; margin-bottom: 16px; }
.tracking-input { flex: 1; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px 18px; color: var(--text-primary); font-size: 16px; font-weight: 600; outline: none; transition: all 0.2s ease; letter-spacing: 1px; }
.tracking-input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.tracking-input::placeholder { color: var(--text-muted); font-weight: 400; letter-spacing: normal; }
.btn-track { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-track:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.sample-numbers { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.sample-label { font-size: 13px; color: var(--text-muted); }
.sample-btn { padding: 6px 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 8px; color: var(--accent-color); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: monospace; }
.sample-btn:hover { background: rgba(45, 192, 113, 0.1); border-color: var(--accent-color); }

.tracking-result { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.result-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); }
.result-number { font-size: 24px; font-weight: 800; color: var(--accent-color); margin-bottom: 4px; }
.result-route { font-size: 16px; color: var(--text-secondary); }
.result-status { padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.result-status.in-transit { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.result-status.delivered { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.result-status.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }

.progress-timeline { display: flex; justify-content: space-between; margin-bottom: 32px; position: relative; padding: 0 8px; }
.progress-timeline::before { content: ''; position: absolute; top: 12px; left: 24px; right: 24px; height: 2px; background: var(--border-color); z-index: 0; }
.timeline-step { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1; }
.step-dot { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-card); border: 2px solid var(--border-color); transition: all 0.3s ease; }
.timeline-step.active .step-dot { background: var(--accent-color); border-color: var(--accent-color); box-shadow: 0 0 12px rgba(45, 192, 113, 0.4); }
.timeline-step.current .step-dot { animation: currentPulse 2s ease-in-out infinite; }
@keyframes currentPulse { 0%, 100% { box-shadow: 0 0 12px rgba(45, 192, 113, 0.4); } 50% { box-shadow: 0 0 20px rgba(45, 192, 113, 0.7); } }
.step-content { text-align: center; }
.step-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.timeline-step:not(.active) .step-title { color: var(--text-muted); }
.step-time { font-size: 11px; color: var(--text-muted); }
.step-location { font-size: 11px; color: var(--accent-color); margin-top: 2px; }

.result-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.detail-card { padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 12px; }
.detail-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.detail-value { font-size: 14px; font-weight: 700; color: var(--text-primary); }

.shipments-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.shipment-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; transition: all 0.3s ease; }
.shipment-card:hover { transform: translateY(-4px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 10px 30px var(--shadow-color); }
.shipment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.shipment-id { font-size: 18px; font-weight: 800; color: var(--accent-color); }
.shipment-status { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.shipment-status.in-transit { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.shipment-status.delivered { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.shipment-status.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.shipment-route { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; margin-bottom: 16px; }
.shipment-route svg { color: var(--accent-color); flex-shrink: 0; }
.shipment-progress { margin-bottom: 16px; }
.progress-bar { height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-color), #4ECDC4); border-radius: 3px; transition: width 0.5s ease; }
.progress-info { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
.shipment-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-color); }
.shipment-driver { display: flex; align-items: center; gap: 10px; }
.driver-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; }
.driver-name { font-size: 13px; font-weight: 600; }
.driver-vehicle { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.shipment-weight { font-size: 13px; font-weight: 700; color: var(--accent-color); }

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
.shipments-list { grid-template-columns: repeat(2, 1fr); }
.result-details { grid-template-columns: repeat(2, 1fr); }
.tracking-info { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
section { padding: 60px 0; }
.hero { padding: 100px 0 60px; }
.shipments-list { grid-template-columns: 1fr; }
.result-details { grid-template-columns: 1fr; }
.progress-timeline { flex-direction: column; gap: 16px; align-items: flex-start; }
.progress-timeline::before { display: none; }
.timeline-step { flex-direction: row; align-items: flex-start; gap: 12px; }
.step-content { text-align: left; }
.tracking-input-wrap { flex-direction: column; }
.cta-card { padding: 40px 24px; }
.cta-actions { flex-direction: column; }
.hero-stats { flex-direction: column; }
}
</style>