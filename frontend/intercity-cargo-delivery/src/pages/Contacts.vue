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
Свяжитесь с нами
</div>
<h1 class="hero-title">
<span class="gradient-text">Контакты</span>
</h1>
<p class="hero-description">
Мы всегда на связи. Выберите удобный способ связи или оставьте заявку —
наш менеджер свяжется с вами в течение 15 минут.
</p>
</div>
</div>
</section>

<section class="contacts-section">
<div class="container">
<div class="contacts-grid">
<div class="contact-info">
<h2 class="contacts-title">Наши контакты</h2>
<div class="contact-items">
<div class="contact-item">
<div class="contact-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
</div>
<div>
<div class="contact-label">Телефон</div>
<a href="tel:+79188180890" class="contact-value">+7 (918) 818-08-90</a>
</div>
</div>
<div class="contact-item">
<div class="contact-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
</div>
<div>
<div class="contact-label">Email</div>
<a href="mailto:info@intercargo.ru" class="contact-value">info@intercargo.ru</a>
</div>
</div>
<div class="contact-item">
<div class="contact-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
</div>
<div>
<div class="contact-label">Главный офис</div>
<div class="contact-value">Москва, ул. Ленинская Слобода, 19</div>
</div>
</div>
<div class="contact-item">
<div class="contact-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
</div>
<div>
<div class="contact-label">Режим работы</div>
<div class="contact-value">Пн-Пт: 9:00 — 20:00<br>Сб-Вс: 10:00 — 18:00</div>
</div>
</div>
</div>
<div class="social-links">
<h3>Мы в соцсетях</h3>
<div class="socials">
<a href="#" class="social-btn">Telegram</a>
<a href="#" class="social-btn">WhatsApp</a>
<a href="#" class="social-btn">VK</a>
</div>
</div>
</div>
<div class="contact-form-card">
<h2 class="form-title">Оставить заявку</h2>
<p class="form-subtitle">Заполните форму и мы свяжемся с вами</p>
<form @submit.prevent="submitForm" class="form">
<div class="form-group">
<label>Имя *</label>
<input v-model="form.name" type="text" placeholder="Ваше имя" required />
</div>
<div class="form-group">
<label>Телефон *</label>
<input v-model="form.phone" type="tel" placeholder="+7 (___) ___-__-__" required />
</div>
<div class="form-group">
<label>Email</label>
<input v-model="form.email" type="email" placeholder="example@mail.ru" />
</div>
<div class="form-group">
<label>Тема обращения</label>
<select v-model="form.subject">
<option value="">Выберите тему</option>
<option value="order">Оформление заказа</option>
<option value="partnership">Партнёрство</option>
<option value="support">Техподдержка</option>
<option value="other">Другое</option>
</select>
</div>
<div class="form-group">
<label>Сообщение</label>
<textarea v-model="form.message" placeholder="Опишите ваш вопрос..." rows="4"></textarea>
</div>
<button type="submit" class="btn-submit" :disabled="submitting">
<span v-if="!submitting">Отправить заявку</span>
<span v-else>Отправка...</span>
</button>
</form>
</div>
</div>
</div>
</section>

<section class="map-section">
<div class="container">
<div class="section-header">
<span class="section-badge">Карта</span>
<h2 class="section-title">Наше <span class="gradient-text">расположение</span></h2>
</div>
<div class="map-placeholder">
<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
<h3>Главный офис InterCargo</h3>
<p>Москва, ул. Ленинская Слобода, 19</p>
<p class="map-hint">Интерактивная карта будет доступна позже</p>
</div>
</div>
</section>
</main>
<Footer />
</div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useToastStore } from '@/stores/toast';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const toast = useToastStore();
const submitting = ref(false);

const form = reactive({
name: '',
phone: '',
email: '',
subject: '',
message: ''
});

const submitForm = async () => {
if (!form.name || !form.phone) {
toast.error('Заполните обязательные поля');
return;
}
submitting.value = true;
try {
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const response = await fetch(`${apiUrl}/api/contact/offer-request`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
name: form.name,
phone: form.phone,
email: form.email
})
});
if (response.ok) {
toast.success('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
form.name = '';
form.phone = '';
form.email = '';
form.subject = '';
form.message = '';
} else {
toast.error('Ошибка отправки заявки');
}
} catch (error) {
toast.error('Ошибка соединения с сервером');
} finally {
submitting.value = false;
}
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
.hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); pointer-events: none; }
.hero-content-full { position: relative; z-index: 1; text-align: center; max-width: 800px; margin: 0 auto; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(45, 192, 113, 0.12); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.hero-title { font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; color: #ffffff; }
.hero-description { font-size: 18px; color: rgba(255, 255, 255, 0.8); line-height: 1.6; }

.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; padding: 6px 14px; background: rgba(45, 192, 113, 0.1); color: var(--accent-color); border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; border: 1px solid rgba(45, 192, 113, 0.15); }
.section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }

.contacts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.contacts-title { font-size: 28px; font-weight: 800; margin-bottom: 32px; }
.contact-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
.contact-item { display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; transition: all 0.3s ease; }
.contact-item:hover { border-color: rgba(45, 192, 113, 0.3); transform: translateX(4px); }
.contact-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(45, 192, 113, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent-color); flex-shrink: 0; }
.contact-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.contact-value { font-size: 16px; font-weight: 600; color: var(--text-primary); text-decoration: none; }
a.contact-value:hover { color: var(--accent-color); }

.social-links h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.socials { display: flex; gap: 12px; flex-wrap: wrap; }
.social-btn { padding: 10px 20px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-primary); text-decoration: none; font-size: 14px; font-weight: 600; transition: all 0.3s ease; }
.social-btn:hover { background: rgba(45, 192, 113, 0.1); border-color: var(--accent-color); color: var(--accent-color); transform: translateY(-2px); }

.contact-form-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; }
.form-title { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
.form-subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 28px; }
.form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-group input, .form-group select, .form-group textarea { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; color: var(--text-primary); font-size: 14px; outline: none; transition: all 0.2s ease; font-family: inherit; resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.form-group select { cursor: pointer; }
.form-group select option { background: var(--bg-card); color: var(--text-primary); }
.btn-submit { padding: 14px; background: linear-gradient(135deg, #2DC071, #28a45e); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); margin-top: 8px; }
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.map-placeholder { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 80px 40px; text-align: center; }
.map-placeholder svg { color: var(--accent-color); opacity: 0.5; margin-bottom: 20px; }
.map-placeholder h3 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.map-placeholder p { font-size: 15px; color: var(--text-secondary); margin-bottom: 4px; }
.map-hint { font-size: 13px; color: var(--text-muted); margin-top: 16px; }

@media (max-width: 1024px) { .contacts-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) { section { padding: 60px 0; } .hero { padding: 100px 0 60px; } .contact-form-card { padding: 24px; } }
</style>