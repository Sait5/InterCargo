<template>
<div class="saas-landing">
<Header />
<main class="create-auction-main">
<div class="container">
<div class="page-header">
<h1 class="page-title">Создать <span class="gradient-text">аукцион</span></h1>
<p class="page-subtitle">Запустите торги и получите лучшие предложения от перевозчиков</p>
</div>

<div class="form-card">
<form @submit.prevent="submitAuction" class="auction-form">
<div class="form-section">
<h3>Основная информация</h3>
<div class="form-group">
<label>Название аукциона *</label>
<input v-model="form.title" type="text" placeholder="Например: Перевозка оборудования в Сибирь" required />
</div>
<div class="form-row">
<div class="form-group">
<label>Город отправления *</label>
<select v-model="form.from" required>
<option value="">Выберите город</option>
<option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
</select>
</div>
<div class="form-group">
<label>Город назначения *</label>
<select v-model="form.to" required>
<option value="">Выберите город</option>
<option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
</select>
</div>
</div>
</div>

<div class="form-section">
<h3>Параметры груза</h3>
<div class="form-row">
<div class="form-group">
<label>Тип груза *</label>
<select v-model="form.cargoType" required>
<option value="">Выберите тип</option>
<option value="Стандартные">Стандартные</option>
<option value="Сборные">Сборные</option>
<option value="Рефрижераторные">Рефрижераторные</option>
<option value="Негабарит">Негабарит</option>
</select>
</div>
<div class="form-group">
<label>Объём *</label>
<input v-model="form.volume" type="text" placeholder="Например: 20 тонн" required />
</div>
</div>
<div class="form-row">
<div class="form-group">
<label>Дата начала перевозки *</label>
<input v-model="form.dateFrom" type="date" required />
</div>
<div class="form-group">
<label>Дедлайн торгов *</label>
<input v-model="form.dateTo" type="date" required />
</div>
</div>
</div>

<div class="form-section">
<h3>Финансовые условия</h3>
<div class="form-group">
<label>Стартовая цена (максимальная) *</label>
<input v-model="form.startPrice" type="number" min="1" step="1" placeholder="Например: 150000" required @keydown="blockLetters" />
<p class="form-hint">Перевозчики будут предлагать цены ниже этой суммы. Побеждает минимальная ставка.</p>
</div>
</div>

<div class="form-section">
<h3>Доступ</h3>
<div class="access-type-selector">
<div class="access-type-card" :class="{ active: form.accessType === 'public' }" @click="form.accessType = 'public'">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
<div>
<div class="access-type-title">Общий аукцион</div>
<div class="access-type-desc">Все перевозчики могут участвовать</div>
</div>
</div>
<div class="access-type-card" :class="{ active: form.accessType === 'private' }" @click="form.accessType = 'private'">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
<div>
<div class="access-type-title">Закрытый аукцион</div>
<div class="access-type-desc">Только приглашённые перевозчики</div>
</div>
</div>
</div>
</div>

<div class="form-section">
<h3>Описание (необязательно)</h3>
<div class="form-group">
<textarea v-model="form.description" placeholder="Дополнительные требования к перевозке, условия, комментарии..." rows="4"></textarea>
</div>
</div>

<div class="form-actions">
<button type="button" class="btn-cancel" @click="$router.back()">Отмена</button>
<button type="submit" class="btn-submit" :disabled="auctionStore.loading">
<span v-if="!auctionStore.loading">Запустить аукцион</span>
<span v-else>Создание...</span>
</button>
</div>
</form>
</div>
</div>
</main>
<Footer />
</div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuctionStore } from '@/stores/auctions';
import { useToastStore } from '@/stores/toast';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';

const router = useRouter();
const userStore = useUserStore();
const auctionStore = useAuctionStore();
const toast = useToastStore();

const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Красноярск', 'Екатеринбург', 'Казань', 'Самара', 'Владивосток', 'Ростов-на-Дону', 'Нижний Новгород', 'Челябинск', 'Уфа', 'Пермь', 'Воронеж', 'Волгоград'];

const form = reactive({
title: '',
from: '',
to: '',
cargoType: '',
volume: '',
dateFrom: '',
dateTo: '',
startPrice: '',
accessType: 'public',
description: ''
});

const blockLetters = (event) => {
const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
if (allowed.includes(event.key)) return;
if (!/^\d$/.test(event.key)) event.preventDefault();
};

const submitAuction = async () => {
if (!form.title || !form.from || !form.to || !form.cargoType || !form.volume || !form.dateFrom || !form.dateTo || !form.startPrice) {
toast.error('Заполните все обязательные поля');
return;
}
if (form.from === form.to) {
toast.error('Города отправления и назначения должны отличаться');
return;
}
if (new Date(form.dateFrom) > new Date(form.dateTo)) {
toast.error('Дата окончания должна быть позже даты начала');
return;
}
if (new Date(form.dateTo) <= new Date()) {
toast.error('Дедлайн торгов должен быть в будущем');
return;
}
if (parseInt(form.startPrice) <= 0) {
toast.error('Укажите корректную стартовую цену');
return;
}
const data = {
title: form.title,
route: `${form.from} — ${form.to}`,
cargoType: form.cargoType,
volume: form.volume,
dateFrom: form.dateFrom,
dateTo: form.dateTo,
startPrice: parseInt(form.startPrice),
accessType: form.accessType,
description: form.description
};
const result = await auctionStore.create(data);
if (result.success) {
toast.success('Аукцион успешно создан и запущен!');
router.push(`/auction/${result.auction._id}`);
} else {
toast.error(result.message || 'Ошибка создания аукциона');
}
};

onMounted(() => {
window.scrollTo({ top: 0, behavior: 'instant' });
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (userStore.user?.accountType !== 'customer' && !userStore.isAdmin) {
toast.error('Только заказчики могут создавать аукционы');
router.push('/spot-auctions');
}
});
</script>

<style scoped>
.saas-landing { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; }
.create-auction-main { padding: 60px 0 100px; }
.container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
.gradient-text { background: linear-gradient(135deg, var(--accent-color) 0%, #4ECDC4 50%, var(--accent-color) 100%); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-header { text-align: center; margin-bottom: 48px; }
.page-title { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin-bottom: 12px; }
.page-subtitle { font-size: 17px; color: var(--text-muted); }
.form-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; }
.auction-form { display: flex; flex-direction: column; gap: 32px; }
.form-section { display: flex; flex-direction: column; gap: 16px; }
.form-section h3 { font-size: 18px; font-weight: 700; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-group input, .form-group select, .form-group textarea { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; color: var(--text-primary); font-size: 14px; outline: none; transition: all 0.2s ease; font-family: inherit; resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.form-group select { cursor: pointer; }
.form-group select option { background: var(--bg-card); color: var(--text-primary); }
.form-hint { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.access-type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.access-type-card { background: rgba(255, 255, 255, 0.03); border: 2px solid var(--border-color); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 12px; }
.access-type-card:hover { border-color: rgba(45, 192, 113, 0.3); }
.access-type-card.active { border-color: var(--accent-color); background: rgba(45, 192, 113, 0.05); }
.access-type-card svg { width: 24px; height: 24px; color: var(--accent-color); flex-shrink: 0; }
.access-type-title { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
.access-type-desc { font-size: 12px; color: var(--text-muted); }
.form-actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-cancel { flex: 1; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.btn-cancel:hover { background: rgba(255, 255, 255, 0.08); }
.btn-submit { flex: 1; padding: 14px; background: linear-gradient(135deg, #2DC071, #28a45e); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
@media (max-width: 768px) { .form-card { padding: 24px; } .form-row { grid-template-columns: 1fr; } .access-type-selector { grid-template-columns: 1fr; } }
</style>