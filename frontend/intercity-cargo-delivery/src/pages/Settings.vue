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
          <router-link to="/documents" class="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span>Документы</span>
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
        <router-link to="/settings" class="nav-link active">
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
        <div>
          <h1>Настройки</h1>
          <p>Персонализируйте свой аккаунт</p>
        </div>
      </header>

      <div class="settings-card">
        <div class="card-header">
          <div>
            <h2>Внешний вид</h2>
            <p class="card-subtitle">Выберите тему оформления</p>
          </div>
        </div>
        <div class="theme-settings">
          <div class="theme-option" :class="{ active: currentTheme === 'light' }" @click="setTheme('light')">
            <div class="theme-preview light-theme">
              <div class="preview-header"></div>
              <div class="preview-content"></div>
              <div class="preview-footer"></div>
            </div>
            <div class="theme-label">Светлая тема</div>
          </div>
          <div class="theme-option" :class="{ active: currentTheme === 'dark' }" @click="setTheme('dark')">
            <div class="theme-preview dark-theme">
              <div class="preview-header"></div>
              <div class="preview-content"></div>
              <div class="preview-footer"></div>
            </div>
            <div class="theme-label">Тёмная тема</div>
          </div>
          <div class="theme-option" :class="{ active: currentTheme === 'auto' }" @click="setTheme('auto')">
            <div class="theme-preview auto-theme">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="half-light"></div>
                <div class="half-dark"></div>
              </div>
              <div class="preview-footer"></div>
            </div>
            <div class="theme-label">Автоматически</div>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <div>
            <h2>Уведомления</h2>
            <p class="card-subtitle">Выберите, как получать важные сообщения</p>
          </div>
        </div>
        <div class="notification-settings">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Email уведомления</h3>
              <p>Получать уведомления о статусе доставки на email</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="emailNotifications">
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h3>SMS уведомления</h3>
              <p>Получать SMS о прибытии груза</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="smsNotifications">
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h3>Рекламные рассылки</h3>
              <p>Получать информацию об акциях и новых услугах</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="promoNotifications">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <div>
            <h2>Язык</h2>
            <p class="card-subtitle">Выберите язык интерфейса</p>
          </div>
        </div>
        <div class="language-settings">
          <select v-model="selectedLanguage" class="language-select">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <button class="save-btn" @click="saveSettings">Сохранить настройки</button>
    </main>
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

const currentTheme = ref('dark');
const emailNotifications = ref(true);
const smsNotifications = ref(true);
const promoNotifications = ref(false);
const selectedLanguage = ref('ru');

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

onMounted(() => {
  currentTheme.value = localStorage.getItem('theme') || 'dark';
  emailNotifications.value = localStorage.getItem('emailNotifications') !== 'false';
  smsNotifications.value = localStorage.getItem('smsNotifications') !== 'false';
  promoNotifications.value = localStorage.getItem('promoNotifications') === 'true';
  selectedLanguage.value = localStorage.getItem('language') || 'ru';
});

const setTheme = (theme) => {
  currentTheme.value = theme;
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

const saveSettings = () => {
  localStorage.setItem('theme', currentTheme.value);
  localStorage.setItem('emailNotifications', emailNotifications.value);
  localStorage.setItem('smsNotifications', smsNotifications.value);
  localStorage.setItem('promoNotifications', promoNotifications.value);
  localStorage.setItem('language', selectedLanguage.value);
  toast.success('Настройки сохранены!');
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
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
.main-content { flex: 1; padding: 40px; max-width: 900px; width: 100%; margin: 0 auto; }
.content-header { margin-bottom: 32px; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.settings-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease; }
.settings-card:hover { border-color: rgba(45, 192, 113, 0.2); }
.card-header { margin-bottom: 24px; }
.card-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.card-subtitle { font-size: 14px; color: var(--text-muted); }
.theme-settings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.theme-option { cursor: pointer; transition: all 0.3s ease; }
.theme-option:hover { transform: translateY(-5px); }
.theme-option.active .theme-preview { border-color: #2DC071; box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.3); }
.theme-preview { width: 100%; height: 120px; border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; margin-bottom: 10px; overflow: hidden; }
.light-theme { background: #F3FFFD; }
.light-theme .preview-header { height: 20px; background: #2DC071; }
.light-theme .preview-content { height: 60px; background: #ffffff; margin: 10px; border-radius: 6px; }
.light-theme .preview-footer { height: 20px; background: #e8f5f2; margin: 0 10px; border-radius: 4px; }
.dark-theme { background: #0a1929; }
.dark-theme .preview-header { height: 20px; background: #2DC071; }
.dark-theme .preview-content { height: 60px; background: #1a2a3a; margin: 10px; border-radius: 6px; }
.dark-theme .preview-footer { height: 20px; background: #0f1f2f; margin: 0 10px; border-radius: 4px; }
.auto-theme { background: #F3FFFD; }
.auto-theme .preview-header { height: 20px; background: linear-gradient(90deg, #2DC071 50%, #1a2a3a 50%); }
.auto-theme .preview-content { height: 60px; display: flex; margin: 10px; border-radius: 6px; overflow: hidden; }
.half-light { flex: 1; background: #ffffff; }
.half-dark { flex: 1; background: #1a2a3a; }
.auto-theme .preview-footer { height: 20px; background: linear-gradient(90deg, #e8f5f2 50%, #0f1f2f 50%); margin: 0 10px; border-radius: 4px; }
.theme-label { font-size: 14px; color: var(--text-secondary); text-align: center; font-weight: 500; }
.notification-settings { display: flex; flex-direction: column; gap: 0; }
.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid var(--border-color); gap: 16px; }
.setting-item:last-child { border-bottom: none; }
.setting-info h3 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.setting-info p { font-size: 13px; color: var(--text-muted); }
.switch { position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.1); transition: .3s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .3s; border-radius: 50%; }
input:checked + .slider { background-color: var(--accent-color); }
input:checked + .slider:before { transform: translateX(24px); }
.language-settings { display: flex; justify-content: center; }
.language-select { padding: 12px 24px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 16px; width: 200px; cursor: pointer; outline: none; }
.language-select option { background: var(--bg-card); color: var(--text-primary); }
.save-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #2DC071, #28a45e); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); margin-top: 8px; }
.save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
@media (max-width: 1024px) { .sidebar { display: none; } .theme-settings { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .settings-card { padding: 24px; } .content-header h1 { font-size: 26px; } .setting-item { flex-direction: column; align-items: flex-start; gap: 12px; } }
</style>