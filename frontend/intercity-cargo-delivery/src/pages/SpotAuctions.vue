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
<div class="hero-badge">
<span class="badge-dot"></span>
Система управления торгами
</div>
<h1 class="hero-title">
Спот-<span class="gradient-text">аукционы</span>
</h1>
<p class="hero-subtitle">Заменяем почту и мессенджеры</p>
<p class="hero-description">
Все торги организации в одном окне. Закройте горящий рейс в пару кликов.
Четкий контроль круга участников. Разные типы аукционов под любую ситуацию.
</p>
<div class="hero-actions">
<button v-if="isCustomer" class="btn-primary btn-large" @click="$router.push('/create-auction')">
Создать аукцион
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
<line x1="12" y1="5" x2="12" y2="19"></line>
<line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
</button>
<button class="btn-secondary btn-large" @click="$router.push('/auctions')">
Смотреть все аукционы
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
<line x1="5" y1="12" x2="19" y2="12" />
<polyline points="12 5 19 12 12 19" />
</svg>
</button>
</div>
</div>
<div class="hero-visual">
<div class="dashboard-card">
<div class="dashboard-header">
<div class="dashboard-title-row">
<div class="dashboard-dot"></div>
<span>Активные торги</span>
</div>
<div class="status-badge">
<span class="status-dot"></span>
Live
</div>
</div>
<div class="dashboard-items">
<div v-for="auction in liveAuctions" :key="auction.id" class="dashboard-item">
<div class="dashboard-item-left">
<div class="dashboard-route">{{ auction.route }}</div>
<div class="dashboard-meta">
<span class="meta-tag">{{ auction.type }}</span>
<span class="meta-tag">{{ auction.volume }}</span>
</div>
</div>
<div class="dashboard-right">
<div class="dashboard-bids">{{ auction.bids }} ставок</div>
<div class="dashboard-timer">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="12" cy="12" r="10"></circle>
<polyline points="12 6 12 12 16 14"></polyline>
</svg>
{{ auction.timer }}
</div>
</div>
</div>
</div>
<div class="dashboard-footer">
<div class="footer-stats">
<div class="footer-stat">
<div class="footer-stat-value">24</div>
<div class="footer-stat-label">Активных торгов</div>
</div>
<div class="footer-stat">
<div class="footer-stat-value">156</div>
<div class="footer-stat-label">Участников</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="advantages-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Преимущества</span>
<h2 class="section-title">Почему <span class="gradient-text">спот-аукционы</span></h2>
<p class="section-subtitle">Современный подход к управлению закупками и торгами</p>
</div>
<div class="advantages-grid">
<div v-for="adv in advantages" :key="adv.id" class="advantage-card">
<div class="advantage-icon" v-html="adv.icon"></div>
<h3 class="advantage-title">{{ adv.title }}</h3>
<p class="advantage-text">{{ adv.text }}</p>
</div>
</div>
</div>
</section>

<section class="process-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Процесс</span>
<h2 class="section-title">Как это <span class="gradient-text">работает</span></h2>
<p class="section-subtitle">Пять шагов от создания торгов до завершения сделки</p>
</div>
<div class="process-steps">
<div v-for="step in steps" :key="step.id" class="process-step">
<div class="step-visual">
<div class="step-number">{{ String(step.id).padStart(2, '0') }}</div>
</div>
<div class="step-content">
<h3 class="step-title">{{ step.title }}</h3>
<p class="step-text">{{ step.text }}</p>
</div>
</div>
</div>
</div>
</section>

<section class="comparison-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Результат</span>
<h2 class="section-title">До и <span class="gradient-text">после</span></h2>
</div>
<div class="comparison-grid">
<div class="comparison-card before">
<div class="comparison-header">
<div class="comparison-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="12" cy="12" r="10"></circle>
<line x1="15" y1="9" x2="9" y2="15"></line>
<line x1="9" y1="9" x2="15" y2="15"></line>
</svg>
</div>
<h3 class="comparison-title">До</h3>
</div>
<div class="comparison-list">
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
<span>Почта</span>
</div>
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<span>Мессенджеры</span>
</div>
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
<span>Excel</span>
</div>
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
<span>Ручной контроль</span>
</div>
</div>
</div>
<div class="comparison-card after">
<div class="comparison-header">
<div class="comparison-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
<polyline points="22 4 12 14.01 9 11.01"></polyline>
</svg>
</div>
<h3 class="comparison-title">После</h3>
</div>
<div class="comparison-list">
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
<span>Единое окно управления</span>
</div>
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
<span>Онлайн-аукционы</span>
</div>
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
<span>Прозрачность процесса</span>
</div>
<div class="comparison-item">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
<span>Быстрое принятие решений</span>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="cta-section">
<div class="container">
<div class="cta-card">
<div class="cta-content">
<h2 class="cta-title">Запускайте торги быстрее</h2>
<p class="cta-text">Переведите закупочные процессы из почты и чатов в единую систему управления аукционами.</p>
<div class="cta-actions">
<button v-if="isCustomer" class="btn-primary btn-large" @click="$router.push('/create-auction')">
Создать аукцион
</button>
<button class="btn-secondary btn-large" @click="$router.push('/auctions')">
Смотреть все аукционы
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
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const userStore = useUserStore();
const isCustomer = computed(() => userStore.user?.accountType === 'customer');

const liveAuctions = [
{ id: 1, route: 'Москва — Санкт-Петербург', type: 'Стандартные', volume: '20 тонн', bids: 7, timer: '02:34:15' },
{ id: 2, route: 'Казань — Екатеринбург', type: 'Рефрижераторные', volume: '15 тонн', bids: 12, timer: '01:12:48' },
{ id: 3, route: 'Новосибирск — Красноярск', type: 'Негабарит', volume: '25 тонн', bids: 5, timer: '05:47:22' }
];

const advantages = [
{
id: 1,
icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
title: 'Все торги в одном окне',
text: 'Уберите переписки в почте и десятки рабочих чатов.'
},
{
id: 2,
icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
title: 'Горящие рейсы за минуты',
text: 'Создание и запуск торгов занимает считанные минуты.'
},
{
id: 3,
icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>',
title: 'Контроль участников',
text: 'Приглашайте только нужных поставщиков и управляйте доступом.'
},
{
id: 4,
icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9"></path></svg>',
title: 'Гибкие типы аукционов',
text: 'Поддержка различных сценариев закупок и переговоров.'
}
];

const steps = [
{ id: 1, title: 'Создание торгов', text: 'Укажите параметры груза и условия' },
{ id: 2, title: 'Приглашение участников', text: 'Выберите поставщиков для торгов' },
{ id: 3, title: 'Получение ставок', text: 'Участники делают предложения в реальном времени' },
{ id: 4, title: 'Выбор победителя', text: 'Определите лучшего участника' },
{ id: 5, title: 'Завершение', text: 'Сохранение истории и результатов' }
];

onMounted(() => {
window.scrollTo({ top: 0, behavior: 'instant' });
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
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
.hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); pointer-events: none; }
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; position: relative; z-index: 1; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(45, 192, 113, 0.12); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.hero-title { font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 16px; color: #ffffff; }
.hero-subtitle { font-size: 20px; font-weight: 600; color: var(--accent-color); margin-bottom: 16px; }
.hero-description { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 36px; max-width: 500px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.3); transform: translateY(-3px); }
.btn-large { padding: 16px 32px; font-size: 16px; border-radius: 14px; }
.hero-visual { position: relative; }
.dashboard-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 28px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); backdrop-filter: blur(20px); }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.dashboard-title-row { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; color: #ffffff; }
.dashboard-dot { width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%; }
.status-badge { display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(45, 192, 113, 0.15); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; }
.status-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
.dashboard-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.dashboard-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; }
.dashboard-item-left { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.dashboard-route { font-weight: 600; font-size: 14px; color: #ffffff; }
.dashboard-meta { display: flex; gap: 6px; flex-wrap: wrap; }
.meta-tag { font-size: 11px; padding: 3px 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; color: rgba(255, 255, 255, 0.7); }
.dashboard-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.dashboard-bids { font-size: 14px; font-weight: 700; color: var(--accent-color); }
.dashboard-timer { display: flex; align-items: center; gap: 4px; font-size: 12px; color: rgba(255, 255, 255, 0.6); }
.dashboard-footer { padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.footer-stats { display: flex; gap: 32px; }
.footer-stat-value { font-size: 24px; font-weight: 800; color: var(--accent-color); }
.footer-stat-label { font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px; }

.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; padding: 6px 14px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; border: 1px solid rgba(45, 192, 113, 0.15); }
.section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
.section-subtitle { font-size: 17px; color: var(--text-secondary); line-height: 1.6; max-width: 560px; margin: 0 auto; }

.advantages-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.advantage-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px 24px; transition: all 0.3s ease; }
.advantage-card:hover { transform: translateY(-4px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.advantage-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(45, 192, 113, 0.1); border-radius: 14px; margin-bottom: 20px; color: var(--accent-color); border: 1px solid rgba(45, 192, 113, 0.15); }
.advantage-icon :deep(svg) { width: 24px; height: 24px; }
.advantage-title { font-size: 17px; font-weight: 700; margin-bottom: 10px; }
.advantage-text { font-size: 14px; line-height: 1.6; color: var(--text-secondary); }

.process-steps { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.process-step { flex: 1; text-align: center; }
.step-visual { margin-bottom: 24px; display: flex; justify-content: center; }
.step-number { width: 56px; height: 56px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; box-shadow: 0 4px 16px rgba(45, 192, 113, 0.3); }
.step-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.step-text { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

.comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.comparison-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; }
.comparison-card.before { border-color: rgba(239, 68, 68, 0.2); }
.comparison-card.after { border-color: rgba(45, 192, 113, 0.3); }
.comparison-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
.comparison-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 14px; }
.comparison-card.before .comparison-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.comparison-card.after .comparison-icon { background: rgba(45, 192, 113, 0.1); color: var(--accent-color); }
.comparison-icon svg { width: 24px; height: 24px; }
.comparison-title { font-size: 20px; font-weight: 700; }
.comparison-list { display: flex; flex-direction: column; gap: 12px; }
.comparison-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; }
.comparison-item svg { width: 20px; height: 20px; color: var(--text-secondary); flex-shrink: 0; }
.comparison-item span { font-size: 15px; color: var(--text-primary); }

.cta-section { padding: 80px 0; }
.cta-card { background: linear-gradient(135deg, #0a1929 0%, #1a2a3a 100%); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 32px; padding: 64px; text-align: center; position: relative; overflow: hidden; }
.cta-content { position: relative; z-index: 2; }
.cta-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #ffffff; margin-bottom: 20px; }
.cta-text { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

@media (max-width: 1024px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } .hero-visual { max-width: 500px; margin: 0 auto; } .advantages-grid { grid-template-columns: repeat(2, 1fr); } .comparison-grid { grid-template-columns: 1fr; } .process-steps { flex-direction: column; } }
@media (max-width: 768px) { .hero { padding: 100px 0 60px; } .advantages-grid { grid-template-columns: 1fr; } .cta-card { padding: 40px 24px; } section { padding: 60px 0; } .hero-actions { flex-direction: column; } .btn-primary, .btn-secondary { width: 100%; } .cta-actions { flex-direction: column; } }
</style>