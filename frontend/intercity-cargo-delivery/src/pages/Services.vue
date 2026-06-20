<template>
<div class="saas-landing">
<Header />
<main>
<section class="hero">
<div class="hero-glow"></div>
<div class="hero-grid-bg"></div>
<div class="container">
<div class="hero-content-full">
<div class="hero-badge hero-enter" data-delay="1">
<span class="badge-dot"></span>
Полный спектр логистических услуг
</div>
<h1 class="hero-title hero-enter-title" data-delay="2">
Наши <span class="gradient-text">услуги</span>
</h1>
<p class="hero-description hero-enter" data-delay="3">
Комплексные решения для грузоперевозок по всей России.
От разовых доставок до полного аутсорсинга логистики.
</p>
<div class="hero-stats hero-enter" data-delay="4">
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
<div class="hero-stat-value">24/7</div>
<div class="hero-stat-label">поддержка</div>
</div>
</div>
</div>
</div>
</section>

<section class="services-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Услуги</span>
<h2 class="section-title">Что мы <span class="gradient-text">предлагаем</span></h2>
<p class="section-subtitle">Полный спектр логистических услуг для бизнеса любого масштаба</p>
</div>
<div class="services-grid">
<div v-for="service in services" :key="service.id" class="service-card">
<div class="service-icon" v-html="service.icon"></div>
<h3 class="service-title">{{ service.title }}</h3>
<p class="service-text">{{ service.text }}</p>
<ul class="service-features">
<li v-for="(feature, idx) in service.features" :key="idx">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
{{ feature }}
</li>
</ul>
</div>
</div>
</div>
</section>

<section class="advantages-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Преимущества</span>
<h2 class="section-title">Почему выбирают <span class="gradient-text">InterCargo</span></h2>
</div>
<div class="advantages-grid">
<div v-for="adv in advantages" :key="adv.id" class="advantage-card">
<div class="advantage-number">{{ String(adv.id).padStart(2, '0') }}</div>
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
<h2 class="section-title">Как мы <span class="gradient-text">работаем</span></h2>
<p class="section-subtitle">Прозрачный и отлаженный процесс от заявки до доставки</p>
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

<section class="pricing-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Тарифы</span>
<h2 class="section-title">Прозрачное <span class="gradient-text">ценообразование</span></h2>
<p class="section-subtitle">Выберите подходящий тариф или получите индивидуальное предложение</p>
</div>
<div class="pricing-grid">
<div v-for="plan in pricing" :key="plan.id" class="pricing-card" :class="{ featured: plan.featured }">
<div v-if="plan.featured" class="pricing-badge">Популярный</div>
<h3 class="pricing-title">{{ plan.title }}</h3>
<div class="pricing-price">
<span class="price-value">{{ plan.price }}</span>
<span v-if="plan.period" class="price-period">{{ plan.period }}</span>
</div>
<p class="pricing-desc">{{ plan.desc }}</p>
<ul class="pricing-features">
<li v-for="(feature, idx) in plan.features" :key="idx">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
{{ feature }}
</li>
</ul>
<button class="pricing-btn" :class="{ featured: plan.featured }">
{{ plan.btnText }}
</button>
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
<h2 class="cta-title">Готовы начать сотрудничество?</h2>
<p class="cta-text">Получите индивидуальное коммерческое предложение с точным расчётом стоимости и сроков доставки вашего груза.</p>
<div class="cta-actions">
<button class="btn-primary btn-large" @click="$router.push('/transport-tender')">
Получить предложение
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
<line x1="5" y1="12" x2="19" y2="12" />
<polyline points="12 5 19 12 12 19" />
</svg>
</button>
<button class="btn-secondary btn-large" @click="scrollToContacts">
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

const services = [
{
id: 1,
icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
title: 'Междугородние грузоперевозки',
text: 'Доставка грузов любой сложности по всей России. Собственный автопарк из 150+ единиц техники.',
features: ['Доставка от 1 дня', 'Полное страхование груза', 'GPS-мониторинг в реальном времени', 'Доставка «от двери до двери»']
},
{
id: 2,
icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>',
title: 'Транспортные тендеры',
text: 'Организация и проведение тендеров для выбора оптимального перевозчика с лучшими условиями.',
features: ['Аналитический модуль', 'Сравнение предложений', 'Контроль бюджета', 'Работа с проверенными перевозчиками']
},
{
id: 3,
icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
title: 'Спот-аукционы',
text: 'Быстрое закрытие горящих рейсов через онлайн-аукционы. Ставки в реальном времени.',
features: ['Запуск за 5 минут', 'Контроль участников', 'Мгновенные ставки', 'Автоматический выбор победителя']
},
{
id: 4,
icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
title: 'Трекинг грузов',
text: 'Отслеживание местоположения груза в реальном времени через мобильное приложение и веб-панель.',
features: ['GPS-мониторинг', 'Уведомления о статусе', 'История перемещений', 'Мобильное приложение']
},
{
id: 5,
icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
title: 'Страхование грузов',
text: '100% гарантия сохранности вашего груза. Полное страхование на всю стоимость перевозки.',
features: ['Страхование от всех рисков', 'Быстрое оформление', 'Оперативные выплаты', 'Индивидуальные условия']
},
{
id: 6,
icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
title: 'Аналитика и отчётность',
text: 'Детальная аналитика перевозок, контроль KPI, прогнозирование затрат и оптимизация маршрутов.',
features: ['Дашборды в реальном времени', 'Прогнозирование ставок', 'Контроль KPI перевозчиков', 'Автоматические отчёты']
}
];

const advantages = [
{ id: 1, title: 'Собственный автопарк', text: 'Более 150 единиц современной техники: Volvo, Scania, MAN. Регулярное ТО и замена.' },
{ id: 2, title: 'Опытные водители', text: 'Все водители с опытом от 5 лет. Регулярное обучение и аттестация.' },
{ id: 3, title: 'Гарантия сроков', text: '99% доставок точно в срок. Компенсация при задержке по нашей вине.' },
{ id: 4, title: 'Прозрачные цены', text: 'Фиксированная стоимость без скрытых платежей. Никаких доплат после оформления.' },
{ id: 5, title: 'Поддержка 24/7', text: 'Персональный менеджер на связи круглосуточно. Решение вопросов за минуты.' },
{ id: 6, title: 'Цифровая платформа', text: 'Удобный личный кабинет, онлайн-заказы, трекинг и документооборот в одном месте.' }
];

const steps = [
{ id: 1, title: 'Заявка', text: 'Оставьте заявку на сайте или позвоните нам. Укажите параметры груза и маршрут.' },
{ id: 2, title: 'Расчёт', text: 'В течение 30 минут получите точный расчёт стоимости и сроков доставки.' },
{ id: 3, title: 'Договор', text: 'Подпишите договор онлайн. Все документы в электронном виде.' },
{ id: 4, title: 'Перевозка', text: 'Забираем груз в назначенное время. Отслеживайте доставку в реальном времени.' },
{ id: 5, title: 'Доставка', text: 'Доставляем груз точно в срок. Подписываем закрывающие документы.' }
];

const pricing = [
{
id: 1,
title: 'Разовая доставка',
price: 'от 15 ₽/км',
period: '',
desc: 'Для разовых перевозок',
features: ['Доставка по России', 'Страхование груза', 'GPS-трекинг', 'Документооборот', 'Поддержка в рабочее время'],
btnText: 'Оставить заявку',
featured: false
},
{
id: 2,
title: 'Постоянный клиент',
price: 'от 12 ₽/км',
period: '',
desc: 'Для регулярных перевозок',
features: ['Всё из тарифа «Разовая»', 'Персональный менеджер', 'Приоритетная обработка', 'Отсрочка платежа', 'Поддержка 24/7', 'Скидки до 20%'],
btnText: 'Получить предложение',
featured: true
},
{
id: 3,
title: 'Корпоративный',
price: 'Индивидуально',
period: '',
desc: 'Для крупного бизнеса',
features: ['Всё из тарифа «Постоянный»', 'Выделенный автопарк', 'Интеграция с ERP', 'API для автоматизации', 'SLA с гарантиями', 'Аналитический модуль'],
btnText: 'Связаться с нами',
featured: false
}
];

const scrollToContacts = () => {
window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

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
.hero-content-full { position: relative; z-index: 1; text-align: center; max-width: 800px; margin: 0 auto; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(45, 192, 113, 0.12); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.hero-title { font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; color: #ffffff; }
.hero-description { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 48px; }
.hero-stats { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
.hero-stat { display: flex; flex-direction: column; padding: 20px 28px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; min-width: 140px; }
.hero-stat-value { font-size: 32px; font-weight: 800; color: var(--accent-color); line-height: 1; }
.hero-stat-label { font-size: 13px; color: rgba(255, 255, 255, 0.6); margin-top: 6px; }

.hero-enter { opacity: 0; animation: heroFadeUp 0.7s ease forwards; }
.hero-enter-title { opacity: 0; animation: heroTitlePop 0.7s ease forwards; }
@keyframes heroFadeUp { from { opacity: 0; transform: translateY(28px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes heroTitlePop { 0% { opacity: 0; transform: translateY(24px) scale(0.96); } 60% { opacity: 1; transform: translateY(-2px) scale(1.01); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.hero-enter[data-delay="1"] { animation-delay: 0ms; }
.hero-enter[data-delay="2"], .hero-enter-title[data-delay="2"] { animation-delay: 120ms; }
.hero-enter[data-delay="3"] { animation-delay: 240ms; }
.hero-enter[data-delay="4"] { animation-delay: 380ms; }

.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; padding: 6px 14px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; border: 1px solid rgba(45, 192, 113, 0.15); }
.section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
.section-subtitle { font-size: 17px; color: var(--text-secondary); line-height: 1.6; max-width: 560px; margin: 0 auto; }

.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.service-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px 28px; transition: all 0.3s ease; display: flex; flex-direction: column; }
.service-card:hover { transform: translateY(-6px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.service-icon { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: rgba(45, 192, 113, 0.1); border-radius: 16px; margin-bottom: 20px; color: var(--accent-color); border: 1px solid rgba(45, 192, 113, 0.15); }
.service-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
.service-text { font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px; }
.service-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
.service-features li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
.service-features li svg { color: var(--accent-color); flex-shrink: 0; }

.advantages-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.advantage-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px 28px; transition: all 0.3s ease; position: relative; overflow: hidden; }
.advantage-card:hover { transform: translateY(-4px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.advantage-number { font-size: 48px; font-weight: 800; color: rgba(45, 192, 113, 0.15); position: absolute; top: 16px; right: 20px; line-height: 1; }
.advantage-title { font-size: 17px; font-weight: 700; margin-bottom: 10px; position: relative; }
.advantage-text { font-size: 14px; line-height: 1.6; color: var(--text-secondary); position: relative; }

.process-steps { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.process-step { flex: 1; text-align: center; }
.step-visual { margin-bottom: 24px; display: flex; justify-content: center; }
.step-number { width: 56px; height: 56px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; box-shadow: 0 4px 16px rgba(45, 192, 113, 0.3); }
.step-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.step-text { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
.pricing-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 36px 32px; transition: all 0.3s ease; position: relative; }
.pricing-card.featured { border-color: var(--accent-color); box-shadow: 0 0 0 1px var(--accent-color), 0 20px 60px rgba(45, 192, 113, 0.15); transform: scale(1.03); }
.pricing-card:hover { transform: translateY(-4px); }
.pricing-card.featured:hover { transform: scale(1.03) translateY(-4px); }
.pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent-color); color: white; padding: 4px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.pricing-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
.pricing-price { margin-bottom: 12px; }
.price-value { font-size: 32px; font-weight: 800; color: var(--accent-color); }
.price-period { font-size: 14px; color: var(--text-muted); margin-left: 4px; }
.pricing-desc { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
.pricing-features { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 12px; }
.pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
.pricing-features li svg { color: var(--accent-color); flex-shrink: 0; }
.pricing-btn { width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.pricing-btn:hover { background: rgba(255, 255, 255, 0.08); border-color: var(--accent-color); }
.pricing-btn.featured { background: linear-gradient(135deg, #2DC071, #28a45e); border: none; color: white; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.pricing-btn.featured:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }

.cta-section { padding: 80px 0; }
.cta-card { background: linear-gradient(135deg, #0a1929 0%, #1a2a3a 100%); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 32px; padding: 64px; text-align: center; position: relative; overflow: hidden; }
.cta-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.cta-orb-1 { top: -100px; left: -100px; width: 300px; height: 300px; background: rgba(45, 192, 113, 0.15); }
.cta-orb-2 { bottom: -100px; right: -100px; width: 400px; height: 400px; background: rgba(45, 192, 113, 0.1); }
.cta-content { position: relative; z-index: 2; }
.cta-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #ffffff; margin-bottom: 20px; }
.cta-text { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; padding: 12px 24px; transition: all 0.3s ease; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.3); transform: translateY(-3px); }
.btn-large { padding: 16px 32px; font-size: 16px; border-radius: 14px; }

@media (max-width: 1024px) {
.services-grid { grid-template-columns: repeat(2, 1fr); }
.advantages-grid { grid-template-columns: repeat(2, 1fr); }
.pricing-grid { grid-template-columns: 1fr; max-width: 450px; margin: 0 auto; }
.pricing-card.featured { transform: none; }
.pricing-card.featured:hover { transform: translateY(-4px); }
.process-steps { flex-wrap: wrap; }
.process-step { flex: 0 0 calc(50% - 8px); }
}
@media (max-width: 768px) {
section { padding: 60px 0; }
.hero { padding: 100px 0 60px; }
.services-grid { grid-template-columns: 1fr; }
.advantages-grid { grid-template-columns: 1fr; }
.process-step { flex: 0 0 100%; }
.hero-stats { flex-direction: column; align-items: center; }
.hero-stat { width: 100%; max-width: 280px; }
.cta-card { padding: 40px 24px; }
.cta-actions { flex-direction: column; }
.btn-primary, .btn-secondary { width: 100%; }
}
</style>