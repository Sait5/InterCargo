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
<div class="user-role">Администратор</div>
<div class="user-email">{{ userStore.user?.email }}</div>
</div>
</div>
<nav class="sidebar-nav">
<router-link to="/profile" class="nav-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
<span>Профиль</span>
</router-link>
<router-link to="/admin" class="nav-link active">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
<span>Админ-панель</span>
</router-link>
<router-link to="/orders" class="nav-link">
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
<h1>Админ-панель</h1>
<p>Управление пользователями системы</p>
</div>
</header>
<div class="search-bar">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
<input v-model="search" type="text" placeholder="Поиск по имени, email или телефону..." />
</div>
<div v-if="loading" class="loading-state">
<div class="spinner"></div>
<p>Загрузка пользователей...</p>
</div>
<div v-else class="users-grid">
<div v-if="filteredUsers.length === 0" class="empty-state">
<h3>Пользователи не найдены</h3>
</div>
<div v-for="user in filteredUsers" :key="user.id" class="user-card">
<div class="user-header">
<div class="user-avatar">{{ getInitials(user) }}</div>
<div class="user-status" :class="user.isBlocked ? 'blocked' : 'active'">
{{ user.isBlocked ? 'Заблокирован' : 'Активен' }}
</div>
</div>
<div class="user-info">
<h3>{{ user.lastName }} {{ user.firstName }}</h3>
<p class="user-role">{{ user.accountType === 'carrier' ? 'Перевозчик' : 'Заказчик' }}</p>
<p class="user-company">{{ user.company || 'Компания не указана' }}</p>
</div>
<div class="user-details">
<div class="detail-row">📧 {{ user.email }}</div>
<div class="detail-row">📞 {{ user.phone }}</div>
<div class="detail-row">📅 {{ formatDate(user.createdAt) }}</div>
</div>
<div class="user-actions">
<button class="btn-edit" @click="openEditModal(user)">Редактировать</button>
<button class="btn-block" :class="user.isBlocked ? 'unblock' : 'block'" @click="toggleBlock(user.id)">
{{ user.isBlocked ? 'Разблокировать' : 'Заблокировать' }}
</button>
</div>
</div>
</div>
</main>

<div class="modal-overlay" v-if="showEditModal" @click="closeEditModal">
<div class="modal-content" @click.stop>
<div class="modal-header">
<h2>Редактировать пользователя</h2>
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
<label>Email</label>
<input v-model="editForm.email" type="email" required />
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
<button type="submit" class="btn-submit">Сохранить</button>
</div>
</form>
</div>
</div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const userStore = useUserStore();
const toast = useToastStore();

const users = ref([]);
const loading = ref(true);
const search = ref('');
const showEditModal = ref(false);
const editingUser = ref(null);
const editForm = ref({
	firstName: '',
	lastName: '',
	patronymic: '',
	email: '',
	phone: '',
	company: ''
});

const initials = computed(() => {
	if (!userStore.user) return '?';
	return (userStore.user.firstName?.[0] || '') + (userStore.user.lastName?.[0] || '');
});

const fullName = computed(() => {
	if (!userStore.user) return '';
	return `${userStore.user.firstName || ''} ${userStore.user.lastName || ''}`.trim();
});

const filteredUsers = computed(() => {
	const s = search.value.toLowerCase().trim();
	if (!s) return users.value;
	return users.value.filter(u =>
		`${u.firstName} ${u.lastName}`.toLowerCase().includes(s) ||
		u.email.toLowerCase().includes(s) ||
		u.phone.includes(s) ||
		(u.company || '').toLowerCase().includes(s)
	);
});

const loadUsers = async () => {
	loading.value = true;
	const result = await userStore.fetchAllUsers();
	if (result.success) {
		users.value = result.users;
	} else {
		toast.error(result.message || 'Ошибка загрузки пользователей');
	}
	loading.value = false;
};

const toggleBlock = async (userId) => {
	const user = users.value.find(u => u.id === userId);
	const action = user?.isBlocked ? 'разблокировать' : 'заблокировать';
	if (!confirm(`Вы уверены, что хотите ${action} этого пользователя?`)) return;
	const result = await userStore.blockUser(userId);
	if (result.success) {
		toast.success(result.message);
		await loadUsers();
	} else {
		toast.error(result.message || 'Ошибка');
	}
};

const openEditModal = (user) => {
	editingUser.value = user;
	editForm.value = {
		firstName: user.firstName || '',
		lastName: user.lastName || '',
		patronymic: user.patronymic || '',
		email: user.email || '',
		phone: user.phone || '',
		company: user.company || ''
	};
	showEditModal.value = true;
};

const closeEditModal = () => {
	showEditModal.value = false;
	editingUser.value = null;
};

const saveUserEdit = async () => {
	const result = await userStore.updateUserById(editingUser.value.id, editForm.value);
	if (result.success) {
		toast.success('Данные пользователя обновлены');
		closeEditModal();
		await loadUsers();
	} else {
		toast.error(result.message || 'Ошибка обновления');
	}
};

const getInitials = (user) => {
	if (!user) return '?';
	return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
};

const formatDate = (dateStr) => {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const handleLogout = () => {
	userStore.logout();
	router.push('/');
};

onMounted(() => {
	loadUsers();
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
.users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.user-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; transition: all 0.3s ease; display: flex; flex-direction: column; }
.user-card:hover { border-color: rgba(45, 192, 113, 0.3); transform: translateY(-4px); box-shadow: 0 10px 30px var(--shadow-color); }
.user-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.user-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #2DC071, #28a45e); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; }
.user-status { padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.user-status.active { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); }
.user-status.blocked { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.user-info { text-align: center; margin-bottom: 16px; }
.user-info h3 { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.user-role { font-size: 14px; color: var(--accent-color); font-weight: 600; margin-bottom: 4px; }
.user-company { font-size: 14px; color: var(--text-muted); }
.user-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; flex: 1; }
.detail-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
.user-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-edit, .btn-block { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; width: 100%; }
.btn-edit { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.btn-edit:hover { background: rgba(59, 130, 246, 0.25); transform: translateY(-2px); }
.btn-block.block { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.btn-block.block:hover { background: rgba(239, 68, 68, 0.25); transform: translateY(-2px); }
.btn-block.unblock { background: rgba(45, 192, 113, 0.15); color: #2DC071; }
.btn-block.unblock:hover { background: rgba(45, 192, 113, 0.25); transform: translateY(-2px); }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 80px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; }
.empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }

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
.form-group input { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; color: var(--text-primary); font-size: 14px; outline: none; transition: all 0.2s ease; }
.form-group input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.form-actions { display: flex; gap: 12px; margin-top: 8px; }
.btn-cancel { flex: 1; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.btn-cancel:hover { background: rgba(255, 255, 255, 0.08); }
.btn-submit { flex: 1; padding: 14px; background: linear-gradient(135deg, #2DC071, #28a45e); border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }

@media (max-width: 1024px) { .sidebar { display: none; } .users-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .content-header h1 { font-size: 26px; } .users-grid { grid-template-columns: 1fr; } .modal-content { padding: 30px 20px; } .form-row { grid-template-columns: 1fr; } }
</style>