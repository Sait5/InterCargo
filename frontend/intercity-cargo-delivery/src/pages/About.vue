<template>
<div class="saas-landing">
<Header />
<main>
<section class="hero">
<div class="hero-glow"></div>
<div class="hero-grid-bg"></div>
<div class="container">
<div class="hero-content-full">
<div class="hero-badge">
<span class="badge-dot"></span>
InterCargo — с 2010 года
</div>
<h1 class="hero-title">
О <span class="gradient-text">компании</span>
</h1>
<p class="hero-description">
Ведущая логистическая платформа России. Объединяем заказчиков и перевозчиков
в единой цифровой экосистеме для эффективного управления грузоперевозками.
</p>
<div class="hero-stats">
<div class="hero-stat">
<div class="hero-stat-value">12+</div>
<div class="hero-stat-label">лет на рынке</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">5000+</div>
<div class="hero-stat-label">клиентов</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">150+</div>
<div class="hero-stat-label">единиц техники</div>
</div>
<div class="hero-stat">
<div class="hero-stat-value">9</div>
<div class="hero-stat-label">офисов по России</div>
</div>
</div>
</div>
</div>
</section>

<section class="mission-section">
<div class="container">
<div class="mission-grid">
<div class="mission-card">
<div class="mission-icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
</div>
<h3>Наша миссия</h3>
<p>Сделать грузоперевозки прозрачными, эффективными и доступными для каждого бизнеса через современные цифровые технологии.</p>
</div>
<div class="mission-card">
<div class="mission-icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
</div>
<h3>Наше видение</h3>
<p>Стать главной логистической платформой страны, где каждый рейс находится быстро, а каждый груз доставляется точно в срок.</p>
</div>
<div class="mission-card">
<div class="mission-icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
</div>
<h3>Наши ценности</h3>
<p>Надёжность, прозрачность, инновации. Мы строим долгосрочные партнёрства и ценим доверие каждого клиента.</p>
</div>
</div>
</div>
</section>

<section class="history-section">
<div class="container">
<div class="section-header">
<span class="section-badge">История</span>
<h2 class="section-title">Наш <span class="gradient-text">путь</span></h2>
</div>
<div class="timeline">
<div v-for="item in timeline" :key="item.year" class="timeline-item">
<div class="timeline-year">{{ item.year }}</div>
<div class="timeline-content">
<h3>{{ item.title }}</h3>
<p>{{ item.text }}</p>
</div>
</div>
</div>
</div>
</section>

<section class="team-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Команда</span>
<h2 class="section-title">Наши <span class="gradient-text">специалисты</span></h2>
<p class="section-subtitle">Профессионалы с многолетним опытом в логистике и IT</p>
</div>
<div class="team-grid">
<div v-for="member in team" :key="member.name" class="team-card">
<div class="team-avatar">{{ member.initials }}</div>
<h3 class="team-name">{{ member.name }}</h3>
<p class="team-role">{{ member.role }}</p>
<p class="team-desc">{{ member.desc }}</p>
</div>
</div>
</div>
</section>

<section class="offices-section">
<div class="container">
<div class="section-header">
<span class="section-badge">География</span>
<h2 class="section-title">Наши <span class="gradient-text">офисы</span></h2>
</div>
<div class="offices-grid">
<div v-for="office in offices" :key="office.city" class="office-card">
<div class="office-city">{{ office.city }}</div>
<div class="office-address">{{ office.address }}</div>
<div class="office-phone">{{ office.phone }}</div>
</div>
</div>
</div>
</section>

<section class="cta-section">
<div class="container">
<div class="cta-card">
<div class="cta-content">
<h2 class="cta-title">Готовы начать сотрудничество?</h2>
<p class="cta-text">Присоединяйтесь к 5000+ компаниям, которые уже оптимизировали свою логистику с InterCargo.</p>
<div class="cta-actions">
<button class="btn-primary btn-large" @click="$router.push('/register')">
Начать работу
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
import { onMounted } from 'vue';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const timeline = [
{ year: '2010', title: 'Основание компании', text: 'InterCargo начала работу как небольшой перевозчик в Москве с парком из 5 автомобилей.' },
{ year: '2013', title: 'Расширение географии', text: 'Открыты филиалы в Санкт-Петербурге и Казани. Парк вырос до 30 единиц техники.' },
{ year: '2016', title: 'Цифровая трансформация', text: 'Запущена собственная TMS-система для управления перевозками в реальном времени.' },
{ year: '2019', title: 'Платформа InterCargo', text: 'Запуск цифровой платформы, объединяющей заказчиков и перевозчиков.' },
{ year: '2022', title: 'Тендеры и аукционы', text: 'Внедрены модули транспортных тендеров и спот-аукционов для оптимизации затрат.' },
{ year: '2025', title: 'Лидер рынка', text: 'Более 5000 клиентов, 9 офисов по России, признание одним из топ-10 логистических операторов.' }
];

const team = [
{ initials: 'АБ', name: 'Алексей Балаев', role: 'Генеральный директор', desc: '15 лет опыта в логистике. Основатель компании.' },
{ initials: 'МК', name: 'Мария Козлова', role: 'Коммерческий директор', desc: 'Развитие партнёрской сети и работа с ключевыми клиентами.' },
{ initials: 'ДС', name: 'Дмитрий Соколов', role: 'Технический директор', desc: 'Архитектор платформы InterCargo. Эксперт в IT-логистике.' },
{ initials: 'ЕП', name: 'Елена Петрова', role: 'Директор по операциям', desc: 'Управление автопарком и контроль качества перевозок.' }
];

const offices = [
{ city: 'Москва', address: 'ул. Ленинская Слобода, 19', phone: '+7 (495) 123-45-67' },
{ city: 'Санкт-Петербург', address: 'Невский пр., 88', phone: '+7 (812) 234-56-78' },
{ city: 'Казань', address: 'ул. Баумана, 45', phone: '+7 (843) 345-67-89' },
{ city: 'Екатеринбург', address: 'ул. Ленина, 52', phone: '+7 (343) 456-78-90' },
{ city: 'Новосибирск', address: 'Красный пр., 100', phone: '+7 (383) 567-89-01' },
{ city: 'Краснодар', address: 'ул. Красная, 176', phone: '+7 (861) 678-90-12' }
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
.hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); pointer-events: none; }
.hero-content-full { position: relative; z-index: 1; text-align: center; max-width: 900px; margin: 0 auto; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(45, 192, 113, 0.12); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.hero-title { font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; color: #ffffff; }
.hero-description { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 48px; }
.hero-stats { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
.hero-stat { display: flex; flex-direction: column; padding: 20px 28px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; min-width: 140px; }
.hero-stat-value { font-size: 32px; font-weight: 800; color: var(--accent-color); line-height: 1; }
.hero-stat-label { font-size: 13px; color: rgba(255, 255, 255, 0.6); margin-top: 6px; }

.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; padding: 6px 14px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; border: 1px solid rgba(45, 192, 113, 0.15); }
.section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
.section-subtitle { font-size: 17px; color: var(--text-secondary); line-height: 1.6; max-width: 560px; margin: 0 auto; }

.mission-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.mission-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; transition: all 0.3s ease; }
.mission-card:hover { transform: translateY(-4px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.mission-icon { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: rgba(45, 192, 113, 0.1); border-radius: 16px; margin-bottom: 20px; color: var(--accent-color); border: 1px solid rgba(45, 192, 113, 0.15); }
.mission-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.mission-card p { font-size: 14px; line-height: 1.6; color: var(--text-secondary); }

.timeline { position: relative; max-width: 800px; margin: 0 auto; }
.timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--accent-color), rgba(45, 192, 113, 0.2)); transform: translateX(-50%); }
.timeline-item { display: flex; align-items: center; gap: 40px; margin-bottom: 40px; position: relative; }
.timeline-item:nth-child(even) { flex-direction: row-reverse; }
.timeline-year { flex: 0 0 120px; font-size: 32px; font-weight: 800; color: var(--accent-color); text-align: center; }
.timeline-content { flex: 1; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; }
.timeline-content h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.timeline-content p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }

.team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.team-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px 24px; text-align: center; transition: all 0.3s ease; }
.team-card:hover { transform: translateY(-4px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.team-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #2DC071, #28a45e); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; margin: 0 auto 16px; }
.team-name { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
.team-role { font-size: 13px; color: var(--accent-color); font-weight: 600; margin-bottom: 12px; }
.team-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

.offices-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.office-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; transition: all 0.3s ease; }
.office-card:hover { border-color: rgba(45, 192, 113, 0.3); transform: translateY(-2px); }
.office-city { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--accent-color); }
.office-address { font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; }
.office-phone { font-size: 14px; color: var(--text-muted); font-weight: 600; }

.cta-section { padding: 80px 0; }
.cta-card { background: linear-gradient(135deg, #0a1929 0%, #1a2a3a 100%); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 32px; padding: 64px; text-align: center; position: relative; overflow: hidden; }
.cta-content { position: relative; z-index: 2; }
.cta-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #ffffff; margin-bottom: 20px; }
.cta-text { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.12); transform: translateY(-3px); }
.btn-large { padding: 16px 32px; font-size: 16px; border-radius: 14px; }

@media (max-width: 1024px) { .mission-grid { grid-template-columns: 1fr; } .team-grid { grid-template-columns: repeat(2, 1fr); } .offices-grid { grid-template-columns: repeat(2, 1fr); } .timeline::before { left: 20px; } .timeline-item, .timeline-item:nth-child(even) { flex-direction: row; gap: 20px; } .timeline-year { flex: 0 0 80px; font-size: 24px; } }
@media (max-width: 768px) { section { padding: 60px 0; } .hero { padding: 100px 0 60px; } .hero-stats { flex-direction: column; align-items: center; } .team-grid { grid-template-columns: 1fr; } .offices-grid { grid-template-columns: 1fr; } .cta-card { padding: 40px 24px; } .cta-actions { flex-direction: column; } .btn-primary, .btn-secondary { width: 100%; } }
</style>