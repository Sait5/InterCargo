<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled || !overlay, 'is-overlay': overlay, 'menu-open': mobileOpen }">
    <div class="bar ic-container">
      <router-link to="/" class="brand" aria-label="InterCargo — на главную">
        <img src="@/assets/icons/logotip.webp" alt="" class="brand-mark" width="40" height="40">
        <span class="brand-text">Inter<span>Cargo</span></span>
      </router-link>

      <nav class="nav" aria-label="Основное меню">
        <router-link to="/" class="nav-link" exact-active-class="is-active">Главная</router-link>
        <router-link to="/services" class="nav-link" active-class="is-active">Услуги</router-link>

        <div class="nav-drop" :class="{ open: platformOpen }" @mouseenter="platformOpen = true" @mouseleave="platformOpen = false">
          <button class="nav-link drop-trigger" :class="{ 'is-active': isPlatformRoute }" :aria-expanded="platformOpen" @click="platformOpen = !platformOpen">
            Платформа
            <ChevronDown class="chev" />
          </button>
          <div class="drop-panel" role="menu">
            <router-link v-for="item in platform" :key="item.to" :to="item.to" class="drop-item" role="menuitem" @click="platformOpen = false">
              <span class="drop-icon"><component :is="item.icon" /></span>
              <span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.text }}</small>
              </span>
            </router-link>
          </div>
        </div>

        <router-link to="/about" class="nav-link" active-class="is-active">О компании</router-link>
        <router-link to="/news" class="nav-link" active-class="is-active">Новости</router-link>
        <router-link to="/contacts" class="nav-link" active-class="is-active">Контакты</router-link>
      </nav>

      <div class="actions">
        <router-link to="/tracking" class="icon-btn hide-sm" title="Отследить груз" aria-label="Отследить груз">
          <PackageSearch />
        </router-link>
        <button class="icon-btn hide-sm" :title="themeStore.isDark ? 'Светлая тема' : 'Тёмная тема'" aria-label="Сменить тему" @click="themeStore.toggleTheme()">
          <Sun v-if="themeStore.isDark" />
          <Moon v-else />
        </button>

        <template v-if="userStore.isAuthenticated">
          <div class="menu-wrap" ref="notesWrap">
            <button class="icon-btn" aria-label="Уведомления" @click="toggleNotes">
              <Bell />
              <span v-if="notes.unreadCount" class="dot">{{ notes.unreadCount > 9 ? '9+' : notes.unreadCount }}</span>
            </button>
            <div v-if="notesOpen" class="pop notes-pop">
              <div class="pop-head">
                <strong>Уведомления</strong>
                <button v-if="notes.unreadCount" class="link-btn" @click="notes.markAllRead()">Прочитать все</button>
              </div>
              <div v-if="!notes.items.length" class="pop-empty">Пока ничего нового</div>
              <ul v-else class="notes-list">
                <li v-for="n in notes.items.slice(0, 6)" :key="n.id" :class="{ unread: !n.read }">
                  <strong>{{ n.title }}</strong>
                  <span>{{ n.text }}</span>
                  <time>{{ timeAgo(n.createdAt) }}</time>
                </li>
              </ul>
            </div>
          </div>

          <div class="menu-wrap" ref="userWrap">
            <button class="user-chip" :aria-expanded="userOpen" @click="userOpen = !userOpen">
              <span class="avatar">{{ initials }}</span>
              <span class="user-name">{{ userStore.user?.firstName || 'Профиль' }}</span>
              <ChevronDown class="chev hide-sm" />
            </button>
            <div v-if="userOpen" class="pop user-pop">
              <div class="pop-user">
                <strong>{{ fullName }}</strong>
                <small>{{ roleLabel }}</small>
              </div>
              <router-link to="/profile" class="pop-item" @click="userOpen = false"><UserRound /> Профиль</router-link>
              <router-link to="/orders" class="pop-item" @click="userOpen = false"><ClipboardList /> Заказы</router-link>
              <router-link to="/chat" class="pop-item" @click="userOpen = false"><MessagesSquare /> Чат</router-link>
              <router-link v-if="userStore.isAdmin" to="/admin" class="pop-item" @click="userOpen = false"><ShieldCheck /> Админ-панель</router-link>
              <router-link to="/settings" class="pop-item" @click="userOpen = false"><Settings /> Настройки</router-link>
              <button class="pop-item danger" @click="logout"><LogOut /> Выйти</button>
            </div>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="ic-btn ic-btn--ghost btn-sm hide-sm">Войти</router-link>
          <router-link to="/register" class="ic-btn ic-btn--primary btn-sm hide-sm">Регистрация</router-link>
        </template>

        <button class="icon-btn burger" :aria-expanded="mobileOpen" aria-label="Меню" @click="mobileOpen = !mobileOpen">
          <X v-if="mobileOpen" />
          <Menu v-else />
        </button>
      </div>
    </div>

    <transition name="drawer">
      <div v-if="mobileOpen" class="drawer">
        <nav class="drawer-nav" @click="onDrawerClick">
          <router-link to="/">Главная</router-link>
          <router-link to="/services">Услуги</router-link>
          <span class="drawer-label">Платформа</span>
          <router-link v-for="item in platform" :key="item.to" :to="item.to" class="sub">{{ item.title }}</router-link>
          <router-link to="/about">О компании</router-link>
          <router-link to="/news">Новости</router-link>
          <router-link to="/contacts">Контакты</router-link>
        </nav>
        <div v-if="!userStore.isAuthenticated" class="drawer-actions" @click="onDrawerClick">
          <router-link to="/login" class="ic-btn ic-btn--ghost">Войти</router-link>
          <router-link to="/register" class="ic-btn ic-btn--primary">Регистрация</router-link>
        </div>
        <div class="drawer-tools">
          <router-link to="/tracking" class="ic-btn ic-btn--ghost" @click="mobileOpen = false"><PackageSearch /> Отследить груз</router-link>
          <button class="ic-btn ic-btn--ghost" @click="themeStore.toggleTheme()">
            <Sun v-if="themeStore.isDark" /><Moon v-else />
            {{ themeStore.isDark ? 'Светлая тема' : 'Тёмная тема' }}
          </button>
        </div>
        <a href="tel:+79188180890" class="drawer-phone"><Phone /> +7 (918) 818-08-90</a>
      </div>
    </transition>
  </header>
  <div v-if="!overlay" class="header-spacer" aria-hidden="true"></div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChevronDown, Sun, Moon, Bell, Menu, X, Phone, PackageSearch, UserRound, ClipboardList,
  MessagesSquare, ShieldCheck, Settings, LogOut, Gavel, Timer, Network, MapPinned, ChartColumn,
} from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { useToastStore } from '@/stores/toast';
import { useNotificationStore } from '@/stores/notifications';

defineProps({
  // Прозрачная шапка поверх героя (главная). На остальных страницах — сплошная.
  overlay: { type: Boolean, default: false },
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();
const toast = useToastStore();
const notes = useNotificationStore();

const scrolled = ref(false);
const mobileOpen = ref(false);
const platformOpen = ref(false);
const userOpen = ref(false);
const notesOpen = ref(false);
const userWrap = ref(null);
const notesWrap = ref(null);

const platform = [
  { to: '/transport-tender', title: 'Транспортные тендеры', text: 'Закупка перевозок и контроль бюджета', icon: Gavel },
  { to: '/spot-auctions', title: 'Спот-аукционы', text: 'Горящие рейсы за пару кликов', icon: Timer },
  { to: '/tms', title: 'TMS-система', text: 'Управление перевозками и интеграции', icon: Network },
  { to: '/tracking', title: 'Трекинг грузов', text: 'Где груз — в реальном времени', icon: MapPinned },
  { to: '/feature/analytics', title: 'Аналитика', text: 'Отчёты, KPI и прогноз ставок', icon: ChartColumn },
];

const isPlatformRoute = computed(() => platform.some((p) => route.path.startsWith(p.to)));
const initials = computed(() => {
  const u = userStore.user;
  return u ? `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || '?' : '?';
});
const fullName = computed(() => `${userStore.user?.firstName || ''} ${userStore.user?.lastName || ''}`.trim());
const roleLabel = computed(() => {
  if (userStore.isAdmin) return 'Администратор';
  return userStore.isCarrier ? 'Перевозчик' : 'Заказчик';
});

const onScroll = () => { scrolled.value = window.scrollY > 24; };

const onDocClick = (e) => {
  if (userWrap.value && !userWrap.value.contains(e.target)) userOpen.value = false;
  if (notesWrap.value && !notesWrap.value.contains(e.target)) notesOpen.value = false;
};

const onDrawerClick = (e) => {
  if (e.target.closest('a')) mobileOpen.value = false;
};

const toggleNotes = () => {
  notesOpen.value = !notesOpen.value;
  if (notesOpen.value) notes.fetchNotifications();
};

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return new Date(date).toLocaleDateString('ru-RU');
};

const logout = () => {
  userStore.logout();
  userOpen.value = false;
  toast.success('Вы вышли из аккаунта');
  router.push('/');
};

watch(mobileOpen, (open) => { document.body.style.overflow = open ? 'hidden' : ''; });
watch(() => route.fullPath, () => {
  mobileOpen.value = false;
  platformOpen.value = false;
});
watch(() => userStore.isAuthenticated, (on) => { if (on) notes.fetchNotifications(); }, { immediate: true });

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', onDocClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('click', onDocClick);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--header-h);
  transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
  border-bottom: 1px solid transparent;
}

.site-header.is-scrolled,
.site-header.menu-open {
  background: color-mix(in srgb, var(--bg-primary) 78%, transparent);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border-bottom-color: var(--border-color);
}

/* Поверх тёмного героя текст всегда светлый, пока шапка прозрачная */
.site-header.is-overlay:not(.is-scrolled):not(.menu-open) {
  --text-primary: var(--hero-text);
  --text-secondary: var(--hero-muted);
  --border-strong: rgba(255, 255, 255, 0.18);
}

.header-spacer {
  height: var(--header-h);
}

.bar {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-mark {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.brand-text span {
  color: var(--accent-color);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0 auto;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--text-secondary);
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}

.nav-link.is-active {
  color: var(--text-primary);
}

.nav-link.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 3px;
  width: 16px;
  height: 2px;
  border-radius: 2px;
  transform: translateX(-50%);
  background: var(--accent-color);
  box-shadow: 0 0 10px var(--accent-color);
}

.chev {
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}

.nav-drop {
  position: relative;
}

.nav-drop.open .chev {
  transform: rotate(180deg);
}

.drop-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  width: 380px;
  padding: 8px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card-solid);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 6px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
}

.drop-panel::before {
  content: '';
  position: absolute;
  inset: -12px 0 auto;
  height: 12px;
}

.nav-drop.open .drop-panel {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

.drop-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: background 0.2s ease;
}

.drop-item:hover {
  background: var(--surface-hover);
}

.drop-item strong {
  display: block;
  font-size: 14.5px;
}

.drop-item small {
  display: block;
  color: var(--text-muted);
  font-size: 13px;
}

.drop-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.2);
}

.drop-icon svg {
  width: 19px;
  height: 19px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.icon-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.icon-btn:hover {
  border-color: rgba(var(--accent-rgb), 0.6);
  color: var(--accent-color);
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.dot {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background: var(--accent-color);
  color: var(--text-on-accent);
  font-size: 10.5px;
  font-weight: 800;
  line-height: 18px;
  text-align: center;
}

.btn-sm {
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
}

.menu-wrap {
  position: relative;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 10px 0 4px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}

.avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: var(--text-on-accent);
  font-size: 12.5px;
  font-weight: 800;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pop {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 240px;
  padding: 8px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card-solid);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
  animation: pop-in 0.18s var(--motion-ease-out);
}

@keyframes pop-in {
  from { opacity: 0; transform: translateY(6px); }
}

.pop-user {
  padding: 10px 12px 12px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

.pop-user small {
  display: block;
  color: var(--accent-color);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pop-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-primary);
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
}

.pop-item svg {
  width: 17px;
  height: 17px;
  color: var(--text-muted);
}

.pop-item:hover {
  background: var(--surface-hover);
}

.pop-item.danger,
.pop-item.danger svg {
  color: var(--danger);
}

.notes-pop {
  width: 340px;
}

.pop-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 10px;
}

.link-btn {
  border: 0;
  background: none;
  color: var(--accent-color);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.pop-empty {
  padding: 18px 10px;
  color: var(--text-muted);
  font-size: 14px;
}

.notes-list {
  list-style: none;
  max-height: 340px;
  overflow-y: auto;
}

.notes-list li {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
}

.notes-list li.unread {
  background: rgba(var(--accent-rgb), 0.07);
}

.notes-list strong {
  font-size: 14px;
}

.notes-list span {
  color: var(--text-secondary);
  font-size: 13px;
}

.notes-list time {
  color: var(--text-muted);
  font-size: 12px;
}

.burger {
  display: none;
}

.drawer {
  position: fixed;
  inset: var(--header-h) 0 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 16px 32px;
  background: var(--bg-primary);
  overflow-y: auto;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
}

.drawer-nav a {
  padding: 14px 4px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
}

.drawer-nav a.router-link-exact-active {
  color: var(--accent-color);
}

.drawer-nav a.sub {
  padding: 10px 4px 10px 18px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--text-secondary);
}

.drawer-label {
  padding: 18px 4px 6px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.drawer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.drawer-tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.drawer-tools .ic-btn {
  padding: 0 12px;
  font-size: 14px;
}

.drawer-phone {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-weight: 700;
  text-decoration: none;
}

.drawer-phone svg {
  width: 18px;
  color: var(--accent-color);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease, transform 0.25s var(--motion-ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1180px) {
  .nav-link {
    padding: 0 10px;
  }
}

@media (max-width: 1080px) {
  .nav {
    display: none;
  }

  .actions {
    margin-left: auto;
  }

  .burger {
    display: grid;
  }
}

@media (max-width: 640px) {
  .hide-sm,
  .user-name {
    display: none;
  }

  .actions {
    gap: 6px;
  }

  .bar {
    gap: 12px;
  }

  .brand-text {
    font-size: 17px;
  }

  .notes-pop {
    position: fixed;
    left: 12px;
    right: 12px;
    top: calc(var(--header-h) - 4px);
    width: auto;
  }
}
</style>
