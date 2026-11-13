<template>
  <DashboardLayout>
        <div class="main-content">
      <header class="content-header">
        <div class="header-left">
          <h1>Мои заявки</h1>
          <p>История ваших заявок на заказы</p>
        </div>
        <div class="header-actions">
          <router-link to="/orders" class="btn-find-orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Найти новые заказы
          </router-link>
        </div>
      </header>

      <div class="filter-tabs">
        <button class="filter-tab" :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">
          Все заявки
          <span class="filter-count">{{ sourceApplications.length }}</span>
        </button>
        <button class="filter-tab" :class="{ active: statusFilter === 'pending' }" @click="statusFilter = 'pending'">
          Ожидают решения
          <span class="filter-count">{{ pendingCount }}</span>
        </button>
        <button class="filter-tab" :class="{ active: statusFilter === 'approved' }" @click="statusFilter = 'approved'">
          Одобрены
          <span class="filter-count">{{ approvedCount }}</span>
        </button>
        <button class="filter-tab" :class="{ active: statusFilter === 'rejected' }" @click="statusFilter = 'rejected'">
          Отклонены
          <span class="filter-count">{{ rejectedCount }}</span>
        </button>
      </div>

      <div v-if="exampleMode" class="example-banner">
        <span class="ex-chip">Пример</span>
        <span>Вы ещё не откликались на заказы — так будут выглядеть ваши заявки с разными статусами.</span>
        <router-link to="/orders" class="btn-find-orders">Найти заказы</router-link>
      </div>

      <div v-if="filteredApplications.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <h3>Заявок не найдено</h3>
        <p v-if="statusFilter === 'all'">Вы ещё не подавали заявки на заказы</p>
        <p v-else>Нет заявок с таким статусом</p>
        <router-link to="/orders" class="btn-find-orders">Найти заказы</router-link>
      </div>

      <div v-else class="applications-list">
        <div v-for="app in filteredApplications" :key="app.id + app.myApplication.id" class="application-card" :class="{ example: app.example }">
          <div class="app-header">
            <div class="app-status" :class="app.myApplication.status">
              {{ getApplicationStatusLabel(app.myApplication.status) }}
            </div>
            <div class="app-date">Подана: {{ formatDate(app.myApplication.appliedAt) }}</div>
          </div>

          <div class="app-route">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {{ app.route }}
          </div>

          <div class="app-details">
            <div class="detail-item">
              <span class="detail-label">Тип груза</span>
              <span class="detail-value">{{ app.type }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Объём</span>
              <span class="detail-value">{{ app.volume }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Период</span>
              <span class="detail-value">{{ formatDate(app.dateFrom) }} — {{ formatDate(app.dateTo) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Цена</span>
              <span class="detail-value price">{{ formatPrice(app.price) }}</span>
            </div>
          </div>

          <div class="app-footer">
            <div class="app-type-badge" :class="app.accessType">
              {{ app.accessType === 'public' ? 'Общий' : 'Личный' }}
            </div>
            <div class="app-order-status">
              Статус заказа: <strong :class="app.status">{{ getOrderStatusLabel(app.status) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/ui/DashboardLayout.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { exampleApplications } from '@/data/examples';

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();

const statusFilter = ref('all');

const roleLabel = computed(() => {
  if (userStore.isAdmin) return 'Администратор';
  if (userStore.user?.accountType === 'customer') return 'Заказчик';
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

const myApplications = computed(() => {
  if (!userStore.user) return [];
  return userStore.user ? orderStore.getUserApplications(userStore.user.id) : [];
});

const pendingCount = computed(() => sourceApplications.value.filter(a => a.myApplication.status === 'pending').length);
const approvedCount = computed(() => sourceApplications.value.filter(a => a.myApplication.status === 'approved').length);
const rejectedCount = computed(() => sourceApplications.value.filter(a => a.myApplication.status === 'rejected').length);

// Пока заявок нет — показываем образцы с пометкой «Пример»
const exampleMode = computed(() => !orderStore.loading && myApplications.value.length === 0);
const sourceApplications = computed(() => (exampleMode.value ? exampleApplications : myApplications.value));
const filteredApplications = computed(() => {
  if (statusFilter.value === 'all') return sourceApplications.value;
  return sourceApplications.value.filter(a => a.myApplication.status === statusFilter.value);
});

const getApplicationStatusLabel = (status) => {
  const labels = {
    pending: 'Ожидает решения',
    approved: 'Одобрена',
    rejected: 'Отклонена'
  };
  return labels[status] || status;
};

const getOrderStatusLabel = (status) => {
  const labels = {
    pending: 'Ожидает активации',
    active: 'Активный',
    rejected: 'Отклонён'
  };
  return labels[status] || status;
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

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

onMounted(() => {
  orderStore.fetchOrders();
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
.user-card:hover { border-color: rgba(var(--accent-rgb), 0.3); }
.user-avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 700; flex-shrink: 0; }
.user-info { overflow: hidden; flex: 1; }
.user-name-lg { font-size: 15px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 12px; color: var(--accent-color); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.user-email { font-size: 13px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s ease; cursor: pointer; position: relative; }
.nav-link svg { width: 20px; height: 20px; flex-shrink: 0; }
.nav-link span { flex: 1; }
.nav-link:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); transform: translateX(2px); }
.nav-link.active { background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); font-weight: 600; }
.nav-link.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent-color); border-radius: 0 3px 3px 0; }
.nav-link.logout { color: var(--danger); margin-top: auto; }
.nav-link.logout:hover { background: rgba(var(--danger-rgb), 0.1); color: var(--danger); }
.main-content { flex: 1; padding: 40px; max-width: 1200px; width: 100%; margin: 0 auto; }
.content-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.btn-find-orders { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-decoration: none; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.2); }
.btn-find-orders:hover { box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.3); }
.filter-tabs { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-tab { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-secondary); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.filter-tab:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.filter-tab.active { background: rgba(var(--accent-rgb), 0.1); border-color: var(--accent-color); color: var(--accent-color); }
.filter-count { background: rgba(255, 255, 255, 0.1); padding: 2px 8px; border-radius: 8px; font-size: 12px; }
.filter-tab.active .filter-count { background: rgba(var(--accent-rgb), 0.2); }
.example-banner { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 16px 20px; margin-bottom: 16px; border-radius: 16px; border: 1px dashed rgba(var(--accent-rgb), 0.45); background: rgba(var(--accent-rgb), 0.06); color: var(--text-secondary); font-size: 14px; }
.example-banner span:nth-child(2) { flex: 1; min-width: 220px; }
.ex-chip { padding: 4px 10px; border-radius: 999px; background: rgba(242, 184, 75, 0.16); color: var(--warm); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; }
.application-card.example { opacity: 0.92; border-style: dashed !important; }
.empty-state { text-align: center; padding: 80px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; }
.empty-state svg { color: var(--text-muted); opacity: 0.3; margin-bottom: 20px; }
.empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p { font-size: 15px; color: var(--text-muted); margin-bottom: 24px; }
.applications-list { display: flex; flex-direction: column; gap: 16px; }
.application-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; transition: all 0.3s ease; }
.application-card:hover { border-color: rgba(var(--accent-rgb), 0.3); box-shadow: 0 10px 30px var(--shadow-color); }
.app-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.app-status { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.app-status.pending { background: rgba(245, 158, 11, 0.15); color: var(--warm); border: 1px solid rgba(245, 158, 11, 0.3); }
.app-status.approved { background: rgba(var(--accent-rgb), 0.15); color: var(--accent-color); border: 1px solid rgba(var(--accent-rgb), 0.3); }
.app-status.rejected { background: rgba(var(--danger-rgb), 0.15); color: var(--danger); border: 1px solid rgba(var(--danger-rgb), 0.3); }
.app-date { font-size: 13px; color: var(--text-muted); }
.app-route { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; }
.app-route svg { color: var(--accent-color); flex-shrink: 0; }
.app-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.detail-value { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.detail-value.price { color: var(--accent-color); font-size: 18px; }
.app-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 12px; }
.app-type-badge { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; }
.app-type-badge.public { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
.app-type-badge.private { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.3); }
.app-order-status { font-size: 14px; color: var(--text-muted); }
.app-order-status strong.pending { color: var(--warm); }
.app-order-status strong.active { color: var(--accent-color); }
.app-order-status strong.rejected { color: var(--danger); }
@media (max-width: 1024px) { .sidebar { display: none; } .app-details { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .content-header h1 { font-size: 26px; } .filter-tabs { flex-direction: row; flex-wrap: wrap; } .app-details { grid-template-columns: 1fr 1fr; gap: 12px; padding: 14px; } .app-footer { flex-direction: column; align-items: flex-start; } }
</style>