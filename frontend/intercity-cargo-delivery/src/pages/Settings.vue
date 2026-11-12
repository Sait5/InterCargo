<template>
  <DashboardLayout>
        <div class="main-content">
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

      <button class="save-btn" @click="saveSettings">Сохранить настройки</button>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/ui/DashboardLayout.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import { useThemeStore } from '@/stores/theme';

const router = useRouter();
const userStore = useUserStore();
const toast = useToastStore();
const themeStore = useThemeStore();

const currentTheme = ref('dark');
const emailNotifications = ref(true);
const smsNotifications = ref(true);
const promoNotifications = ref(false);

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
  currentTheme.value = themeStore.preference;
  emailNotifications.value = localStorage.getItem('emailNotifications') !== 'false';
  smsNotifications.value = localStorage.getItem('smsNotifications') !== 'false';
  promoNotifications.value = localStorage.getItem('promoNotifications') === 'true';
});

const setTheme = (theme) => {
  currentTheme.value = theme;
  // Тема применяется и запоминается сразу, без кнопки «Сохранить»
  themeStore.setTheme(theme);
};

const saveSettings = () => {
  localStorage.setItem('emailNotifications', emailNotifications.value);
  localStorage.setItem('smsNotifications', smsNotifications.value);
  localStorage.setItem('promoNotifications', promoNotifications.value);
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
.main-content { flex: 1; padding: 40px; max-width: 900px; width: 100%; margin: 0 auto; }
.content-header { margin-bottom: 32px; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.settings-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease; }
.settings-card:hover { border-color: rgba(var(--accent-rgb), 0.2); }
.card-header { margin-bottom: 24px; }
.card-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.card-subtitle { font-size: 14px; color: var(--text-muted); }
.theme-settings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.theme-option { cursor: pointer; transition: all 0.3s ease; }
.theme-option:hover { transform: translateY(-5px); }
.theme-option.active .theme-preview { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.3); }
.theme-preview { width: 100%; height: 120px; border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; margin-bottom: 10px; overflow: hidden; }
.light-theme { background: #F3FFFD; }
.light-theme .preview-header { height: 20px; background: var(--accent-color); }
.light-theme .preview-content { height: 60px; background: #ffffff; margin: 10px; border-radius: 6px; }
.light-theme .preview-footer { height: 20px; background: #e8f5f2; margin: 0 10px; border-radius: 4px; }
.dark-theme { background: var(--bg-elevated); }
.dark-theme .preview-header { height: 20px; background: var(--accent-color); }
.dark-theme .preview-content { height: 60px; background: var(--bg-card-solid); margin: 10px; border-radius: 6px; }
.dark-theme .preview-footer { height: 20px; background: var(--bg-elevated); margin: 0 10px; border-radius: 4px; }
.auto-theme { background: #F3FFFD; }
.auto-theme .preview-header { height: 20px; background: linear-gradient(90deg, var(--accent-color) 50%, var(--bg-card-solid) 50%); }
.auto-theme .preview-content { height: 60px; display: flex; margin: 10px; border-radius: 6px; overflow: hidden; }
.half-light { flex: 1; background: #ffffff; }
.half-dark { flex: 1; background: var(--bg-card-solid); }
.auto-theme .preview-footer { height: 20px; background: linear-gradient(90deg, #e8f5f2 50%, var(--bg-elevated) 50%); margin: 0 10px; border-radius: 4px; }
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
.save-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent-color), var(--accent-strong)); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.2); margin-top: 8px; }
.save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.3); }
@media (max-width: 1024px) { .sidebar { display: none; } .theme-settings { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .settings-card { padding: 24px; } .content-header h1 { font-size: 26px; } .setting-item { flex-direction: column; align-items: flex-start; gap: 12px; } }
</style>