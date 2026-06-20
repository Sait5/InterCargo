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
<router-link to="/carriers" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
<span>Перевозчики</span>
</router-link>
<router-link to="/documents" class="nav-link">
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
<router-link to="/carriers" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
<span>Перевозчики</span>
</router-link>
<router-link to="/documents" class="nav-link">
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
<router-link to="/reviews" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
<span>Отзывы</span>
</router-link>
<router-link to="/chat" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<span>Чат</span>
</router-link>
</template>
<router-link to="/settings" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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
<h1>Перевозчики</h1>
<p>Список зарегистрированных перевозчиков в системе</p>
</div>
</header>
<div class="search-bar">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="11" cy="11" r="8"></circle>
<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
<input v-model="search" type="text" placeholder="Поиск по имени или компании..." />
</div>
<div v-if="loading" class="loading-state">
<div class="spinner"></div>
<p>Загрузка перевозчиков...</p>
</div>
<div v-else class="carriers-grid">
<div v-if="filteredCarriers.length === 0" class="empty-state">
<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<rect x="1" y="3" width="15" height="13"></rect>
<polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
<circle cx="5.5" cy="18.5" r="2.5"></circle>
<circle cx="18.5" cy="18.5" r="2.5"></circle>
</svg>
<h3>Перевозчики не найдены</h3>
<p v-if="search">Попробуйте изменить параметры поиска</p>
<p v-else>Пока нет зарегистрированных перевозчиков</p>
</div>
<div v-for="carrier in filteredCarriers" :key="carrier.id" class="carrier-card">
<div class="carrier-header">
<div class="carrier-avatar">{{ getInitials(carrier) }}</div>
<div class="carrier-status-badge" :class="carrier.isBlocked ? 'blocked' : 'active'">
{{ carrier.isBlocked ? 'Заблокирован' : 'Активен' }}
</div>
</div>
<div class="carrier-info">
<h3 class="carrier-name">{{ carrier.lastName }} {{ carrier.firstName }}</h3>
<p class="carrier-company">{{ carrier.company || 'Компания не указана' }}</p>
</div>
<div class="carrier-details">
<div class="detail-row">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
</svg>
<span>{{ carrier.phone }}</span>
</div>
<div class="detail-row">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<rect x="1" y="3" width="15" height="13"></rect>
<polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
<circle cx="5.5" cy="18.5" r="2.5"></circle>
<circle cx="18.5" cy="18.5" r="2.5"></circle>
</svg>
<span>Перевозчик</span>
</div>
<div class="detail-row">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="12" cy="12" r="10"></circle>
<polyline points="12 6 12 12 16 14"></polyline>
</svg>
<span>Регистрация: {{ formatDate(carrier.createdAt) }}</span>
</div>
</div>
<div class="carrier-actions">
<button v-if="isCustomer && !carrier.hasReviewed" class="btn-review" @click="openReviewModal(carrier)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
</svg>
Оставить отзыв
</button>
<span v-else-if="isCustomer && carrier.hasReviewed" class="reviewed-badge">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<polyline points="20 6 9 17 4 12"></polyline>
</svg>
Отзыв уже оставлен
</span>
<template v-if="userStore.isAdmin">
<button class="btn-edit" @click="openEditModal(carrier)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
</svg>
Редактировать
</button>
<button
class="btn-block"
:class="carrier.isBlocked ? 'unblock' : 'block'"
@click="toggleBlockUser(carrier.id)"
>
<svg v-if="!carrier.isBlocked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</svg>
<svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
<path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
</svg>
{{ carrier.isBlocked ? 'Разблокировать' : 'Заблокировать' }}
</button>
</template>
</div>
</div>
</div>
</main>
<div class="modal-overlay" v-if="showEditModal" @click="closeEditModal">
<div class="modal-content" @click.stop>
<div class="modal-header">
<h2>Редактировать перевозчика</h2>
<button class="modal-close" @click="closeEditModal">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<line x1="18" y1="6" x2="6" y2="18"></line>
<line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
</button>
</div>
<form @submit.prevent="saveUserEdit" class="modal-form">
<div class="form-row">
<div class="form-group">
<label>Имя</label>
<input v-model="editForm.firstName" type="text" required />
</div>
<div class="form-group">
<label>Фамилия</label>
<input v-model="editForm.lastName" type="text" required />
</div>
</div>
<div class="form-group">
<label>Отчество</label>
<input v-model="editForm.patronymic" type="text" />
</div>
<div class="form-group">
<label>Телефон</label>
<input v-model="editForm.phone" type="tel" required />
</div>
<div class="form-group">
<label>Компания</label>
<input v-model="editForm.company" type="text" />
</div>
<div class="form-actions">
<button type="button" class="btn-cancel" @click="closeEditModal">Отмена</button>
<button type="submit" class="btn-submit" :disabled="savingUser">
<span v-if="!savingUser">Сохранить</span>
<span v-else>Сохранение...</span>
</button>
</div>
</form>
</div>
</div>
<div class="modal-overlay" v-if="showReviewModal" @click="closeReviewModal">
<div class="modal-content" @click.stop>
<div class="modal-header">
<h2>Оставить отзыв</h2>
<button class="modal-close" @click="closeReviewModal">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<line x1="18" y1="6" x2="6" y2="18"></line>
<line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
</button>
</div>
<div class="review-carrier-info">
<div class="review-carrier-avatar">{{ getInitials(reviewCarrier) }}</div>
<div>
<div class="review-carrier-name">{{ reviewCarrier?.lastName }} {{ reviewCarrier?.firstName }}</div>
<div class="review-carrier-company">{{ reviewCarrier?.company || 'Перевозчик' }}</div>
</div>
</div>
<form @submit.prevent="submitReview" class="modal-form">
<div class="form-group">
<label>Оценка</label>
<div class="star-rating">
<span
v-for="star in 5"
:key="star"
class="star"
:class="{ active: star <= reviewForm.rating }"
@click="reviewForm.rating = star"
>★</span>
</div>
</div>
<div class="form-group">
<label>Ваш отзыв</label>
<textarea v-model="reviewForm.text" placeholder="Расскажите о вашем опыте работы с перевозчиком..." rows="4" required></textarea>
</div>
<div class="form-actions">
<button type="button" class="btn-cancel" @click="closeReviewModal">Отмена</button>
<button type="submit" class="btn-submit" :disabled="reviewStore.loading">
<span v-if="!reviewStore.loading">Отправить отзыв</span>
<span v-else>Отправка...</span>
</button>
</div>
</form>
</div>
</div>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import { useReviewStore } from '@/stores/reviews';

const router = useRouter();
const userStore = useUserStore();
const toast = useToastStore();
const reviewStore = useReviewStore();

const search = ref('');
const carriers = ref([]);
const loading = ref(true);
const showEditModal = ref(false);
const showReviewModal = ref(false);
const savingUser = ref(false);
const editingUserId = ref(null);
const reviewCarrier = ref(null);

const editForm = reactive({
firstName: '',
lastName: '',
patronymic: '',
phone: '',
company: ''
});

const reviewForm = reactive({
rating: 5,
text: ''
});

const isCustomer = computed(() => userStore.user?.accountType === 'customer');
const roleLabel = computed(() => {
if (userStore.isAdmin) return 'Администратор';
if (isCustomer.value) return 'Заказчик';
return 'Перевозчик';
});

const initials = computed(() => {
if (!userStore.user) return '?';
return (userStore.user.firstName?.[0] || '') + (userStore.user.lastName?.[0] || '');
});

const fullName = computed(() => {
if (!userStore.user) return '';
return `${userStore.user.firstName || ''} ${userStore.user.lastName || ''}`.trim();
});

const filteredCarriers = computed(() => {
const s = search.value.toLowerCase().trim();
if (!s) return carriers.value;
return carriers.value.filter(carrier => {
const fullName = `${carrier.firstName} ${carrier.lastName}`.toLowerCase();
const company = (carrier.company || '').toLowerCase();
return fullName.includes(s) || company.includes(s);
});
});

const getInitials = (carrier) => {
if (!carrier) return '?';
return (carrier.firstName?.[0] || '') + (carrier.lastName?.[0] || '');
};

const formatDate = (dateStr) => {
if (!dateStr) return '';
const date = new Date(dateStr);
return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const loadCarriers = async () => {
loading.value = true;
const result = await userStore.fetchCarriers();
if (result.success) {
carriers.value = result.carriers;
} else {
toast.error(result.message || 'Ошибка загрузки перевозчиков');
}
loading.value = false;
};

const toggleBlockUser = async (userId) => {
const carrier = carriers.value.find(c => c.id === userId);
const action = carrier?.isBlocked ? 'разблокировать' : 'заблокировать';
if (!confirm(`Вы уверены, что хотите ${action} этого перевозчика?`)) return;
const result = await userStore.blockUser(userId);
if (result.success) {
toast.success(result.message);
await loadCarriers();
} else {
toast.error(result.message || 'Ошибка');
}
};

const openEditModal = (carrier) => {
editingUserId.value = carrier.id;
editForm.firstName = carrier.firstName || '';
editForm.lastName = carrier.lastName || '';
editForm.patronymic = carrier.patronymic || '';
editForm.phone = carrier.phone || '';
editForm.company = carrier.company || '';
showEditModal.value = true;
};

const closeEditModal = () => {
showEditModal.value = false;
editingUserId.value = null;
};

const saveUserEdit = async () => {
savingUser.value = true;
const result = await userStore.updateUserById(editingUserId.value, editForm);
if (result.success) {
toast.success('Данные перевозчика обновлены');
closeEditModal();
await loadCarriers();
} else {
toast.error(result.message || 'Ошибка обновления');
}
savingUser.value = false;
};

const openReviewModal = (carrier) => {
reviewCarrier.value = carrier;
reviewForm.rating = 5;
reviewForm.text = '';
showReviewModal.value = true;
};

const closeReviewModal = () => {
showReviewModal.value = false;
reviewCarrier.value = null;
};

const submitReview = async () => {
if (!reviewCarrier.value) return;
const result = await reviewStore.submitReview(reviewCarrier.value.id, reviewForm.rating, reviewForm.text);
if (result.success) {
toast.success(result.message || 'Отзыв успешно отправлен');
closeReviewModal();
await loadCarriers();
} else {
toast.error(result.message || 'Ошибка отправки отзыва');
}
};

const handleLogout = () => {
userStore.logout();
router.push('/');
};

onMounted(() => {
loadCarriers();
});
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
.content-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.search-bar { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; margin-bottom: 24px; transition: all 0.2s ease; }
.search-bar:focus-within { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.search-bar svg { color: var(--text-muted); flex-shrink: 0; }
.search-bar input { flex: 1; background: none; border: none; color: var(--text-primary); font-size: 15px; outline: none; }
.search-bar input::placeholder { color: var(--text-muted); }
.loading-state { text-align: center; padding: 80px 20px; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(45, 192, 113, 0.2); border-top-color: #2DC071; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { color: var(--text-muted); font-size: 15px; }
.carriers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.carrier-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; transition: all 0.3s ease; }
.carrier-card:hover { border-color: rgba(45, 192, 113, 0.3); transform: translateY(-4px); box-shadow: 0 10px 30px var(--shadow-color); }
.carrier-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.carrier-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #2DC071, #28a45e); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; }
.carrier-status-badge { padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.carrier-status-badge.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); }
.carrier-status-badge.blocked { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.carrier-info { text-align: center; margin-bottom: 20px; }
.carrier-name { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.carrier-company { font-size: 14px; color: var(--text-muted); }
.carrier-details { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
.detail-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
.detail-row svg { color: var(--accent-color); flex-shrink: 0; }
.carrier-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-review, .btn-edit, .btn-block, .reviewed-badge { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; width: 100%; }
.btn-review { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.btn-review:hover { background: rgba(245, 158, 11, 0.25); transform: translateY(-2px); }
.reviewed-badge { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); cursor: default; }
.btn-edit { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.btn-edit:hover { background: rgba(59, 130, 246, 0.25); transform: translateY(-2px); }
.btn-block.block { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.btn-block.block:hover { background: rgba(239, 68, 68, 0.25); transform: translateY(-2px); }
.btn-block.unblock { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.btn-block.unblock:hover { background: rgba(45, 192, 113, 0.25); transform: translateY(-2px); }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 80px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; }
.empty-state svg { color: var(--text-muted); opacity: 0.3; margin-bottom: 20px; }
.empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p { font-size: 15px; color: var(--text-muted); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-content { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.modal-header h2 { font-size: 24px; font-weight: 700; color: var(--text-primary); }
.modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s ease; }
.modal-close:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.modal-form { display: flex; flex-direction: column; gap: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-group input, .form-group textarea { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; color: var(--text-primary); font-size: 14px; outline: none; transition: all 0.2s ease; font-family: inherit; resize: vertical; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.form-actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-cancel { flex: 1; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.btn-cancel:hover { background: rgba(255, 255, 255, 0.08); }
.btn-submit { flex: 1; padding: 14px; background: linear-gradient(135deg, #2DC071, #28a45e); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.review-carrier-info { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
.review-carrier-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2DC071, #28a45e); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 700; flex-shrink: 0; }
.review-carrier-name { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.review-carrier-company { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.star-rating { display: flex; gap: 8px; }
.star { font-size: 32px; color: rgba(255, 255, 255, 0.2); cursor: pointer; transition: all 0.2s ease; }
.star:hover { transform: scale(1.2); }
.star.active { color: #f59e0b; }
@media (max-width: 1024px) { .sidebar { display: none; } .carriers-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .content-header h1 { font-size: 26px; } .carriers-grid { grid-template-columns: 1fr; } .modal-content { padding: 30px 20px; } .form-row { grid-template-columns: 1fr; } }
</style>