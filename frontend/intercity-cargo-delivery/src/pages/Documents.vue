<template>
<div class="profile-layout">
<aside class="sidebar">
<div class="sidebar-header">
<router-link to="/" class="logo-area">
<div class="logo-icon">
<img src="@/assets/icons/logotip.png" alt="InterCargo">
</div>
<div class="logo-text">
<span class="logo-cargo">Inter</span>
<span class="logo-express">Cargo</span>
</div>
</router-link>
</div>
<div class="user-card">
<div class="user-avatar-lg">{{ initials }}</div>
<div class="user-info">
<div class="user-name-lg">{{ fullName }}</div>
<div class="user-role">{{ roleLabel }}</div>
<div class="user-email">{{ userStore.user?.email }}</div>
</div>
</div>
<nav class="sidebar-nav">
<router-link to="/profile" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
<span>Профиль</span>
</router-link>
<template v-if="userStore.isAdmin">
<router-link to="/orders" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
<span>Заказы</span>
</router-link>
<router-link to="/carriers" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
<span>Перевозчики</span>
</router-link>
<router-link to="/documents" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
<span>Документы</span>
</router-link>
<router-link to="/admin" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
<span>Админ-панель</span>
</router-link>
</template>
<template v-else-if="isCustomer">
<router-link to="/orders" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
<span>Мои заказы</span>
</router-link>
<router-link to="/carriers" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
<span>Перевозчики</span>
</router-link>
<router-link to="/documents" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
<span>Документы</span>
</router-link>
<router-link to="/chat" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<span>Чат</span>
</router-link>
</template>
<template v-else>
<router-link to="/orders" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
<span>Доступные заказы</span>
</router-link>
<router-link to="/my-applications" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
<span>Мои заявки</span>
</router-link>
<router-link to="/documents" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
<span>Документы</span>
</router-link>
<router-link to="/chat" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<span>Чат</span>
</router-link>
</template>
<router-link to="/settings" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
<span>Настройки</span>
</router-link>
<a class="nav-link logout" @click="handleLogout">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
<span>Выход</span>
</a>
</nav>
</aside>
<main class="main-content">
<header class="content-header">
<div class="header-left">
<h1>Документы</h1>
<p>Сертификаты, лицензии и разрешительная документация</p>
</div>
</header>
<div class="gallery">
<div
v-for="(doc, index) in documents"
:key="doc.id"
class="gallery-item"
:class="[`item-${index + 1}`]"
:style="{ '--delay': index * 0.1 + 's' }"
@click="openPreview(doc)"
>
<img :src="doc.image" :alt="doc.title" loading="lazy" />
<div class="gallery-overlay">
<div class="overlay-content">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
<polyline points="14 2 14 8 20 8"></polyline>
<line x1="16" y1="13" x2="8" y2="13"></line>
<line x1="16" y1="17" x2="8" y2="17"></line>
<polyline points="10 9 9 9 8 9"></polyline>
</svg>
<h3>{{ doc.title }}</h3>
<span class="overlay-hint">Нажмите для просмотра</span>
</div>
</div>
<div class="gallery-corner tl"></div>
<div class="gallery-corner tr"></div>
<div class="gallery-corner bl"></div>
<div class="gallery-corner br"></div>
</div>
</div>
</main>
<div class="preview-overlay" v-if="previewDoc" @click="closePreview">
<div class="preview-content" @click.stop>
<button class="preview-close" @click="closePreview">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<line x1="18" y1="6" x2="6" y2="18"></line>
<line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
</button>
<img :src="previewDoc.image" :alt="previewDoc.title" />
<div class="preview-caption">
<h3>{{ previewDoc.title }}</h3>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

import dokument2 from '@/assets/images/dokument2.jpg';
import dokument3 from '@/assets/images/dokument3.jpg';
import dokument4 from '@/assets/images/dokument4.jpg';
import dokument2 from '@/assets/images/dokument5.jpg';

const router = useRouter();
const userStore = useUserStore();

const documents = ref([
	{ id: 1, title: 'Сертификат соответствия ISO 9001', image: dokument5 },
	{ id: 2, title: 'Лицензия на международные перевозки', image: dokument2 },
	{ id: 3, title: 'Свидетельство о регистрации ИНН', image: dokument3 },
	{ id: 4, title: 'Полис страхования ответственности', image: dokument4 }
]);

const previewDoc = ref(null);

const isCustomer = computed(() => userStore.user?.accountType === 'customer');
const isCarrier = computed(() => userStore.user?.accountType === 'carrier');

const roleLabel = computed(() => {
	if (userStore.isAdmin) return 'Администратор';
	if (isCustomer.value) return 'Заказчик';
	if (isCarrier.value) return 'Перевозчик';
	return 'Пользователь';
});

const initials = computed(() => {
	if (!userStore.user) return '?';
	return (userStore.user.firstName?.[0] || '') + (userStore.user.lastName?.[0] || '');
});

const fullName = computed(() => {
	if (!userStore.user) return '';
	return `${userStore.user.firstName || ''} ${userStore.user.lastName || ''}`.trim();
});

const openPreview = (doc) => {
	previewDoc.value = doc;
	document.body.style.overflow = 'hidden';
};

const closePreview = () => {
	previewDoc.value = null;
	document.body.style.overflow = '';
};

const handleLogout = () => {
	userStore.logout();
	router.push('/');
};

onMounted(() => {});
</script>

<style scoped>
.profile-layout { display: flex; min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); }
.sidebar { width: 280px; background: rgba(255, 255, 255, 0.02); border-right: 1px solid var(--border-color); padding: 24px 20px; display: flex; flex-direction: column; gap: 24px; position: sticky; top: 0; height: 100vh; overflow-y: auto; backdrop-filter: blur(10px); }
.sidebar-header { padding: 8px 12px; }
.logo-area { display: flex; align-items: center; gap: 20px; cursor: pointer; text-decoration: none; min-height: 90px; }
.logo-icon { width: 90px; height: 90px; flex-shrink: 0; }
.logo-icon img { width: 100%; height: 100%; object-fit: contain; }
.logo-text { display: flex; flex-direction: column; line-height: 1.1; margin-left: -30px; }
.logo-cargo { font-size: 28px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-primary); }
.logo-express { font-size: 28px; font-weight: 800; color: var(--accent-color); letter-spacing: 1.5px; }
.user-card { display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; transition: all 0.3s ease; }
.user-card:hover { border-color: rgba(45, 192, 113, 0.3); }
.user-avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2DC071, #28a45e); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 700; flex-shrink: 0; }
.user-info { overflow: hidden; flex: 1; }
.user-name-lg { font-size: 15px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 12px; color: var(--accent-color); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.user-email { font-size: 13px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s ease; cursor: pointer; position: relative; }
.nav-link svg { width: 20px; height: 20px; flex-shrink: 0; }
.nav-link span { flex: 1; }
.nav-link:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); transform: translateX(2px); }
.nav-link.active { background: rgba(45, 192, 113, 0.1); color: var(--accent-color); font-weight: 600; }
.nav-link.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent-color); border-radius: 0 3px 3px 0; }
.nav-link.logout { color: #ef4444; margin-top: auto; }
.nav-link.logout:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.main-content { flex: 1; padding: 40px; max-width: 1200px; width: 100%; margin: 0 auto; }
.content-header { margin-bottom: 40px; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }

.gallery {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-auto-rows: 80px;
	gap: 20px;
}

.gallery-item {
	position: relative;
	border-radius: 20px;
	overflow: hidden;
	cursor: pointer;
	opacity: 0;
	transform: translateY(30px) scale(0.95);
	animation: galleryReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	animation-delay: var(--delay);
}

.gallery-item.item-1 {
	grid-column: 1 / 6;
	grid-row: 1 / 6;
}

.gallery-item.item-2 {
	grid-column: 6 / 13;
	grid-row: 1 / 4;
}

.gallery-item.item-3 {
	grid-column: 6 / 10;
	grid-row: 4 / 7;
}

.gallery-item.item-4 {
	grid-column: 10 / 13;
	grid-row: 4 / 7;
}

@keyframes galleryReveal {
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.gallery-item img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
}

.gallery-item:hover img {
	transform: scale(1.08);
	filter: brightness(0.7);
}

.gallery-overlay {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.85) 100%);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding: 24px;
	opacity: 0;
	transition: opacity 0.4s ease;
}

.gallery-item:hover .gallery-overlay {
	opacity: 1;
}

.overlay-content {
	text-align: center;
	transform: translateY(20px);
	transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-item:hover .overlay-content {
	transform: translateY(0);
}

.overlay-content svg {
	color: var(--accent-color);
	margin-bottom: 12px;
	filter: drop-shadow(0 0 10px rgba(45, 192, 113, 0.5));
}

.overlay-content h3 {
	font-size: 16px;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 8px;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.overlay-hint {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.7);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.gallery-corner {
	position: absolute;
	width: 24px;
	height: 24px;
	border-color: var(--accent-color);
	border-style: solid;
	border-width: 0;
	opacity: 0;
	transition: opacity 0.3s ease, transform 0.3s ease;
	z-index: 2;
}

.gallery-item:hover .gallery-corner {
	opacity: 1;
}

.gallery-corner.tl {
	top: 12px;
	left: 12px;
	border-top-width: 2px;
	border-left-width: 2px;
	border-top-left-radius: 8px;
	transform: translate(-5px, -5px);
}

.gallery-item:hover .gallery-corner.tl {
	transform: translate(0, 0);
}

.gallery-corner.tr {
	top: 12px;
	right: 12px;
	border-top-width: 2px;
	border-right-width: 2px;
	border-top-right-radius: 8px;
	transform: translate(5px, -5px);
}

.gallery-item:hover .gallery-corner.tr {
	transform: translate(0, 0);
}

.gallery-corner.bl {
	bottom: 12px;
	left: 12px;
	border-bottom-width: 2px;
	border-left-width: 2px;
	border-bottom-left-radius: 8px;
	transform: translate(-5px, 5px);
}

.gallery-item:hover .gallery-corner.bl {
	transform: translate(0, 0);
}

.gallery-corner.br {
	bottom: 12px;
	right: 12px;
	border-bottom-width: 2px;
	border-right-width: 2px;
	border-bottom-right-radius: 8px;
	transform: translate(5px, 5px);
}

.gallery-item:hover .gallery-corner.br {
	transform: translate(0, 0);
}

.gallery-item::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 20px;
	border: 2px solid transparent;
	transition: border-color 0.3s ease, box-shadow 0.3s ease;
	z-index: 1;
	pointer-events: none;
}

.gallery-item:hover::after {
	border-color: rgba(45, 192, 113, 0.4);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(45, 192, 113, 0.15);
}

.preview-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.92);
	backdrop-filter: blur(20px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 99999;
	animation: previewFadeIn 0.3s ease;
	padding: 40px;
}

@keyframes previewFadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

.preview-content {
	position: relative;
	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	animation: previewScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes previewScaleIn {
	from { transform: scale(0.85); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}

.preview-content img {
	max-width: 100%;
	max-height: 75vh;
	object-fit: contain;
	border-radius: 16px;
	box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.preview-caption {
	text-align: center;
}

.preview-caption h3 {
	font-size: 18px;
	font-weight: 700;
	color: #ffffff;
}

.preview-close {
	position: absolute;
	top: -50px;
	right: -10px;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #ffffff;
	transition: all 0.2s ease;
}

.preview-close:hover {
	background: rgba(239, 68, 68, 0.3);
	border-color: #ef4444;
	transform: rotate(90deg);
}

@media (max-width: 1024px) {
	.sidebar { display: none; }
	.gallery {
		grid-template-columns: repeat(6, 1fr);
		grid-auto-rows: 70px;
		gap: 16px;
	}
	.gallery-item.item-1 { grid-column: 1 / 4; grid-row: 1 / 5; }
	.gallery-item.item-2 { grid-column: 4 / 7; grid-row: 1 / 4; }
	.gallery-item.item-3 { grid-column: 4 / 6; grid-row: 4 / 7; }
	.gallery-item.item-4 { grid-column: 6 / 7; grid-row: 4 / 7; }
}

@media (max-width: 768px) {
	.main-content { padding: 24px 16px; }
	.content-header h1 { font-size: 26px; }
	.gallery {
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: 120px;
		gap: 12px;
	}
	.gallery-item.item-1 { grid-column: 1 / 2; grid-row: 1 / 3; }
	.gallery-item.item-2 { grid-column: 2 / 3; grid-row: 1 / 3; }
	.gallery-item.item-3 { grid-column: 1 / 2; grid-row: 3 / 5; }
	.gallery-item.item-4 { grid-column: 2 / 3; grid-row: 3 / 5; }
	.preview-overlay { padding: 20px; }
	.preview-close { top: -45px; right: 0; }
}

@media (max-width: 480px) {
	.gallery {
		grid-template-columns: 1fr;
		grid-auto-rows: 200px;
	}
	.gallery-item.item-1,
	.gallery-item.item-2,
	.gallery-item.item-3,
	.gallery-item.item-4 {
		grid-column: 1 / 2;
		grid-row: auto;
	}
}
</style>
