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
<router-link to="/orders" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
<span>Заказы</span>
</router-link>
<router-link to="/carriers" class="nav-link">
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
<router-link to="/orders" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
<span>Мои заказы</span>
</router-link>
<router-link to="/carriers" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
<span>Перевозчики</span>
</router-link>
<router-link to="/documents" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
<span>Документы</span>
</router-link>
</template>
<template v-else>
<router-link to="/orders" class="nav-link active">
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
</template>
<router-link to="/chat" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
<span>Чат</span>
</router-link>
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
<h1>
<template v-if="userStore.isAdmin">Все заказы</template>
<template v-else-if="isCustomer">Мои заказы</template>
<template v-else>Доступные заказы</template>
</h1>
<p>
<template v-if="userStore.isAdmin">Управление заказами и заявками перевозчиков</template>
<template v-else-if="isCustomer">Заказы, созданные вами</template>
<template v-else>Заказы, доступные для подачи заявок</template>
</p>
</div>
<div class="header-actions">
<button v-if="isCustomer" class="btn-create" @click="$router.push('/transport-tender')">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
Создать заказ
</button>
</div>
</header>
<div class="search-bar">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="11" cy="11" r="8"></circle>
<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
<input v-model="search" type="text" placeholder="Поиск по маршруту..." />
</div>
<div class="orders-list">
<div v-if="filteredOrders.length === 0" class="empty-state">
<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path>
</svg>
<h3>Заказы не найдены</h3>
<p v-if="isCustomer">Создайте свой первый заказ</p>
<p v-else>Попробуйте изменить параметры поиска</p>
<button v-if="isCustomer" class="btn-create" @click="$router.push('/transport-tender')">Создать заказ</button>
</div>
<div v-for="order in filteredOrders" :key="order.id" class="order-card">
<div class="order-header">
<div class="order-status" :class="order.status">
{{ getStatusLabel(order.status) }}
</div>
<div class="order-type-badge" :class="order.accessType">
{{ order.accessType === 'public' ? 'Общий' : 'Личный' }}
</div>
</div>
<div class="order-route">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
<circle cx="12" cy="10" r="3"></circle>
</svg>
{{ order.route }}
</div>
<div class="order-details">
<div class="detail-item">
<span class="detail-label">Тип груза</span>
<span class="detail-value">{{ order.type }}</span>
</div>
<div class="detail-item">
<span class="detail-label">Объём</span>
<span class="detail-value">{{ order.volume }}</span>
</div>
<div class="detail-item">
<span class="detail-label">Период</span>
<span class="detail-value">{{ formatDate(order.dateFrom) }} — {{ formatDate(order.dateTo) }}</span>
</div>
<div class="detail-item">
<span class="detail-label">Цена</span>
<span class="detail-value price">{{ formatPrice(order.price) }}</span>
</div>
</div>
<div v-if="userStore.isAdmin && order.status === 'pending'" class="admin-order-actions">
<h4 class="admin-actions-title">Управление заказом</h4>
<div class="admin-actions-row">
<button class="btn-approve-order" @click="approveOrder(order.id)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
Активировать заказ
</button>
<button class="btn-reject-order" @click="rejectOrder(order.id)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
Отклонить заказ
</button>
<button class="btn-delete-order" @click="deleteOrder(order.id)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
Удалить
</button>
</div>
</div>
<div v-if="userStore.isAdmin && order.applicants && order.applicants.length > 0" class="applicants-section">
<h4 class="applicants-title">Заявки перевозчиков ({{ order.applicants.length }})</h4>
<div class="applicants-list">
<div v-for="applicant in order.applicants" :key="applicant.id" class="applicant-card">
<div class="applicant-info">
<div class="applicant-avatar">{{ getApplicantInitials(applicant) }}</div>
<div class="applicant-details">
<div class="applicant-name">{{ applicant.name || 'Перевозчик' }}</div>
<div class="applicant-company" v-if="applicant.company">{{ applicant.company }}</div>
<div class="applicant-phone" v-if="applicant.phone">{{ applicant.phone }}</div>
<div class="applicant-date">Заявка подана: {{ formatDate(applicant.appliedAt) }}</div>
</div>
</div>
<div class="applicant-status" :class="applicant.status">
{{ getApplicantStatusLabel(applicant.status) }}
</div>
<div v-if="applicant.status === 'pending'" class="applicant-actions">
<button class="btn-approve" @click="approveApplicant(order.id, applicant.id)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
Одобрить
</button>
<button class="btn-reject" @click="rejectApplicant(order.id, applicant.id)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
Отклонить
</button>
</div>
</div>
</div>
</div>
<div class="order-footer">
<div class="applicants-info">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
<circle cx="9" cy="7" r="4"></circle>
<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
</svg>
<span>{{ order.applicants?.length || 0 }} заявок</span>
</div>
<div class="order-actions">
<template v-if="isCarrier">
<button v-if="canApply(order)" class="btn-apply" @click="applyToOrder(order.id)">
Подать заявку
</button>
<span v-else-if="hasApplied(order.id)" class="applied-badge">Заявка подана</span>
</template>
<template v-else-if="isCustomer">
<span class="my-order-badge">Мой заказ</span>
</template>
</div>
</div>
</div>
</div>
</main>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useToastStore } from '@/stores/toast';
import { useChatStore } from '@/stores/chat';

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const toast = useToastStore();
const chatStore = useChatStore();

const search = ref('');

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

const orders = computed(() => {
	if (userStore.isAdmin) {
		return orderStore.orders;
	}
	if (isCarrier.value) {
		return orderStore.activeOrders;
	}
	if (isCustomer.value) {
		return orderStore.getUserOrders(userStore.user?.id);
	}
	return [];
});

const filteredOrders = computed(() => {
	const s = search.value.toLowerCase().trim();
	if (!s) return orders.value;
	return orders.value.filter(order =>
		order.route.toLowerCase().includes(s)
	);
});

const canApply = (order) => {
	if (!isCarrier.value) return false;
	if (order.status !== 'active') return false;
	return !hasApplied(order.id);
};

const hasApplied = (orderId) => {
	if (!userStore.user) return false;
	return orderStore.hasApplied(orderId, userStore.user.id);
};

const getStatusLabel = (status) => {
	const labels = {
		pending: 'Ожидает подтверждения',
		active: 'Активный',
		rejected: 'Отклонён'
	};
	return labels[status] || status;
};

const getApplicantStatusLabel = (status) => {
	const labels = {
		pending: 'Ожидает решения',
		approved: 'Одобрена',
		rejected: 'Отклонена'
	};
	return labels[status] || status;
};

const getApplicantInitials = (applicant) => {
	if (applicant.name) {
		const parts = applicant.name.split(' ');
		return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
	}
	return '?';
};

const formatPrice = (price) => {
	const num = parseInt(price);
	if (isNaN(num)) return price;
	return num.toLocaleString('ru-RU') + ' ₽';
};

const formatDate = (dateStr) => {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const approveOrder = (orderId) => {
	const result = orderStore.approveOrder(orderId);
	if (result.success) {
		toast.success('Заказ активирован и опубликован');
	} else {
		toast.error(result.message || 'Ошибка активации');
	}
};

const rejectOrder = (orderId) => {
	const result = orderStore.rejectOrder(orderId);
	if (result.success) {
		toast.success('Заказ отклонён');
	} else {
		toast.error(result.message || 'Ошибка отклонения');
	}
};

const deleteOrder = (orderId) => {
	if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;
	const result = orderStore.deleteOrder(orderId);
	if (result.success) {
		toast.success('Заказ успешно удалён');
	} else {
		toast.error(result.message || 'Ошибка удаления');
	}
};

const approveApplicant = async (orderId, applicantId) => {
	const result = await orderStore.approveApplicant(orderId, applicantId);
	if (result.success) {
		const order = orderStore.getOrderById(orderId);
		const applicant = order.applicants.find(a => a.id === applicantId);
		chatStore.createChat(orderId, order.createdBy, applicant.userId);
		toast.success('Заявка перевозчика одобрена, чат создан');
	} else {
		toast.error(result.message || 'Ошибка одобрения');
	}
};

const rejectApplicant = (orderId, applicantId) => {
	const result = orderStore.rejectApplicant(orderId, applicantId);
	if (result.success) {
		toast.success('Заявка перевозчика отклонена');
	} else {
		toast.error(result.message || 'Ошибка отклонения');
	}
};

const applyToOrder = (orderId) => {
	const applicantInfo = {
		userId: userStore.user.id,
		name: `${userStore.user?.firstName || ''} ${userStore.user?.lastName || ''}`.trim(),
		phone: userStore.user?.phone || '',
		company: userStore.user?.company || ''
	};
	const result = orderStore.applyToOrder(orderId, applicantInfo);
	if (result.success) {
		toast.success('Заявка отправлена');
	} else {
		toast.error(result.message || 'Ошибка подачи заявки');
	}
};

const handleLogout = () => {
	userStore.logout();
	router.push('/');
};

onMounted(() => {
	orderStore.fetchOrders();
	chatStore.fetchChats();
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
.content-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.btn-create { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-create:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.search-bar { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; margin-bottom: 24px; transition: all 0.2s ease; }
.search-bar:focus-within { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.search-bar svg { color: var(--text-muted); flex-shrink: 0; }
.search-bar input { flex: 1; background: none; border: none; color: var(--text-primary); font-size: 15px; outline: none; }
.search-bar input::placeholder { color: var(--text-muted); }
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; transition: all 0.3s ease; }
.order-card:hover { border-color: rgba(45, 192, 113, 0.3); transform: translateY(-2px); box-shadow: 0 10px 30px var(--shadow-color); }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.order-status { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.order-status.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
.order-status.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); }
.order-status.rejected { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.order-type-badge { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; }
.order-type-badge.public { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
.order-type-badge.private { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.3); }
.order-route { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; }
.order-route svg { color: var(--accent-color); flex-shrink: 0; }
.order-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.detail-value { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.detail-value.price { color: var(--accent-color); font-size: 18px; }
.admin-order-actions { margin-bottom: 20px; padding: 16px; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; }
.admin-actions-title { font-size: 14px; font-weight: 700; color: #f59e0b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.admin-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
.btn-approve-order, .btn-reject-order, .btn-delete-order { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; }
.btn-approve-order { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.btn-approve-order:hover { background: rgba(45, 192, 113, 0.25); transform: translateY(-2px); }
.btn-reject-order { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.btn-reject-order:hover { background: rgba(239, 68, 68, 0.25); transform: translateY(-2px); }
.btn-delete-order { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); border: 1px solid var(--border-color); }
.btn-delete-order:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; transform: translateY(-2px); }
.applicants-section { margin-bottom: 20px; padding: 16px; background: rgba(45, 192, 113, 0.05); border: 1px solid rgba(45, 192, 113, 0.2); border-radius: 12px; }
.applicants-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; }
.applicants-list { display: flex; flex-direction: column; gap: 12px; }
.applicant-card { display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; flex-wrap: wrap; }
.applicant-info { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 200px; }
.applicant-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; flex-shrink: 0; }
.applicant-details { flex: 1; }
.applicant-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.applicant-company { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.applicant-phone { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.applicant-date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.applicant-status { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.applicant-status.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.applicant-status.approved { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.applicant-status.rejected { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.applicant-actions { display: flex; gap: 8px; }
.order-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid var(--border-color); gap: 16px; flex-wrap: wrap; }
.applicants-info { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px; }
.order-actions { display: flex; gap: 10px; }
.btn-approve, .btn-reject, .btn-apply { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; }
.btn-approve { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.btn-approve:hover { background: rgba(45, 192, 113, 0.25); transform: translateY(-2px); }
.btn-reject { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.btn-reject:hover { background: rgba(239, 68, 68, 0.25); transform: translateY(-2px); }
.btn-apply { background: linear-gradient(135deg, #2DC071, #28a45e); color: white; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-apply:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.applied-badge { padding: 10px 18px; background: rgba(45, 192, 113, 0.15); color: var(--accent-color); border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid rgba(45, 192, 113, 0.3); }
.my-order-badge { padding: 10px 18px; background: rgba(59, 130, 246, 0.15); color: #3b82f6; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid rgba(59, 130, 246, 0.3); }
.empty-state { text-align: center; padding: 80px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; }
.empty-state svg { color: var(--text-muted); opacity: 0.3; margin-bottom: 20px; }
.empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p { font-size: 15px; color: var(--text-muted); margin-bottom: 24px; }
@media (max-width: 1024px) { .sidebar { display: none; } .order-details { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .content-header h1 { font-size: 26px; } .order-footer { flex-direction: column; align-items: flex-start; } .order-actions { width: 100%; flex-direction: column; } .btn-approve, .btn-reject, .btn-apply, .btn-approve-order, .btn-reject-order, .btn-delete-order { width: 100%; justify-content: center; } .applicant-card { flex-direction: column; align-items: flex-start; } .applicant-actions { width: 100%; } .admin-actions-row { flex-direction: column; } }
</style>