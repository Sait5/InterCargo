<template>
  <div class="dash">
    <aside class="side" :class="{ open: drawerOpen }">
      <router-link to="/" class="brand" aria-label="InterCargo — на главную">
        <img src="@/assets/icons/logotip.webp" alt="" width="36" height="36">
        <span>Inter<b>Cargo</b></span>
      </router-link>

      <div class="me">
        <span class="avatar">{{ initials }}</span>
        <div class="me-text">
          <strong>{{ fullName || 'Пользователь' }}</strong>
          <small>{{ roleLabel }}</small>
        </div>
      </div>

      <nav class="links" @click="onNavClick">
        <span class="group-label">Кабинет</span>
        <router-link v-for="link in links" :key="link.to" :to="link.to" class="link" active-class="is-active">
          <component :is="link.icon" />
          <span>{{ link.title }}</span>
          <em v-if="link.badge" class="badge">{{ link.badge }}</em>
        </router-link>

        <span class="group-label">Торги</span>
        <router-link to="/auctions" class="link" active-class="is-active">
          <Timer /><span>Аукционы</span>
        </router-link>
        <router-link to="/transport-tender" class="link" active-class="is-active">
          <Gavel /><span>Тендеры</span>
        </router-link>
      </nav>

      <div class="side-foot">
        <router-link to="/settings" class="link" active-class="is-active"><Settings /><span>Настройки</span></router-link>
        <button class="link danger" @click="logout"><LogOut /><span>Выйти</span></button>
      </div>
    </aside>

    <div v-if="drawerOpen" class="scrim" @click="drawerOpen = false"></div>

    <div class="body">
      <header class="topbar">
        <button class="menu-btn" aria-label="Меню кабинета" @click="drawerOpen = true"><Menu /></button>
        <div class="crumbs">
          <span>Личный кабинет</span>
          <strong>{{ route.meta.title }}</strong>
        </div>
        <div class="top-actions">
          <router-link to="/" class="top-link"><House /><span>На сайт</span></router-link>
          <button class="top-icon" :aria-label="themeStore.isDark ? 'Светлая тема' : 'Тёмная тема'" @click="themeStore.toggleTheme()">
            <Sun v-if="themeStore.isDark" /><Moon v-else />
          </button>
        </div>
      </header>

      <main class="main" :class="{ flush }">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  UserRound, ClipboardList, Truck, FileText, ShieldCheck, MessagesSquare, Settings, LogOut,
  Menu, House, Sun, Moon, Star, ListChecks, Timer, Gavel,
} from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { useToastStore } from '@/stores/toast';
import { useChatStore } from '@/stores/chat';

defineProps({
  // Без внутренних отступов (например, для чата на всю высоту)
  flush: { type: Boolean, default: false },
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();
const toast = useToastStore();
const chatStore = useChatStore();
const drawerOpen = ref(false);

const initials = computed(() => {
  const u = userStore.user;
  return u ? `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || '?' : '?';
});
const fullName = computed(() => `${userStore.user?.firstName || ''} ${userStore.user?.lastName || ''}`.trim());
const roleLabel = computed(() => {
  if (userStore.isAdmin) return 'Администратор';
  return userStore.isCarrier ? 'Перевозчик' : 'Заказчик';
});

// на пункте «Чат» — число непрочитанных сообщений
const unreadChats = computed(() => chatStore.unreadTotal);

const links = computed(() => {
  const list = [{ to: '/profile', title: 'Профиль', icon: UserRound }];
  if (userStore.isAdmin) {
    list.push(
      { to: '/orders', title: 'Все заказы', icon: ClipboardList },
      { to: '/carriers', title: 'Перевозчики', icon: Truck },
      { to: '/documents', title: 'Документы', icon: FileText },
      { to: '/admin', title: 'Админ-панель', icon: ShieldCheck },
    );
  } else if (userStore.isCarrier) {
    list.push(
      { to: '/orders', title: 'Доступные заказы', icon: ClipboardList },
      { to: '/my-applications', title: 'Мои заявки', icon: ListChecks },
      { to: '/reviews', title: 'Отзывы обо мне', icon: Star },
    );
  } else {
    list.push(
      { to: '/orders', title: 'Мои заказы', icon: ClipboardList },
      { to: '/carriers', title: 'Перевозчики', icon: Truck },
      { to: '/documents', title: 'Документы', icon: FileText },
    );
  }
  list.push({ to: '/chat', title: 'Чат', icon: MessagesSquare, badge: unreadChats.value || null });
  return list;
});

const onNavClick = (e) => {
  if (e.target.closest('a')) drawerOpen.value = false;
};

const logout = () => {
  userStore.logout();
  toast.success('Вы вышли из аккаунта');
  router.push('/');
};

watch(() => route.fullPath, () => { drawerOpen.value = false; });

onMounted(() => {
  if (!chatStore.chats.length) chatStore.fetchChats();
});
</script>

<style scoped>
.dash {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.side {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 264px;
  height: 100vh;
  flex-shrink: 0;
  padding: 22px 16px;
  border-right: 1px solid var(--border-color);
  background:
    radial-gradient(120% 50% at 0% 0%, rgba(var(--accent-rgb), 0.08), transparent 60%),
    var(--bg-elevated);
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
}

.brand img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand b {
  color: var(--accent-color);
  font-weight: 700;
}

.me {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
}

.avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: var(--text-on-accent);
  font-weight: 800;
}

.me-text {
  min-width: 0;
}

.me-text strong {
  display: block;
  font-size: 14.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.me-text small {
  color: var(--accent-color);
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.group-label {
  padding: 14px 12px 6px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-secondary);
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.link svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.link span {
  flex: 1;
}

.link:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.link.is-active {
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent-color);
}

.link.is-active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--accent-color);
  box-shadow: 0 0 12px var(--accent-color);
}

.link.danger {
  color: var(--danger);
}

.link.danger:hover {
  background: rgba(var(--danger-rgb), 0.08);
}

.badge {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 10px;
  background: rgba(var(--accent-rgb), 0.16);
  color: var(--accent-color);
  font-size: 11.5px;
  font-style: normal;
  font-weight: 800;
  text-align: center;
}

.side-foot {
  display: grid;
  gap: 2px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 64px;
  padding: 0 28px;
  border-bottom: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-primary) 82%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.crumbs {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.crumbs span {
  color: var(--text-muted);
  font-size: 13px;
}

.crumbs span::after {
  content: '/';
  margin-left: 10px;
}

.crumbs strong {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.top-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
}

.top-link:hover {
  color: var(--accent-color);
  border-color: rgba(var(--accent-rgb), 0.6);
}

.top-link svg,
.top-icon svg,
.menu-btn svg {
  width: 17px;
  height: 17px;
}

.top-icon,
.menu-btn {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: none;
  color: var(--text-primary);
  cursor: pointer;
}

.menu-btn {
  display: none;
}

.main {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  padding: 32px 28px 48px;
}

.main.flush {
  max-width: none;
  padding: 0;
  display: flex;
  min-height: 0;
}

.scrim {
  display: none;
}

/* Внутри страницы кабинета прячем старые копии бокового меню, если они остались */
.main :deep(> .sidebar) {
  display: none;
}

@media (max-width: 1024px) {
  .side {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 60;
    transform: translateX(-100%);
    visibility: hidden;
    /* закрытое меню не отбрасывает тень на экран и не ловит фокус клавиатуры */
    transition: transform 0.3s var(--motion-ease-out), box-shadow 0.3s ease, visibility 0s linear 0.3s;
  }

  .side.open {
    transform: none;
    visibility: visible;
    box-shadow: 30px 0 60px -30px rgba(0, 0, 0, 0.7);
    transition: transform 0.3s var(--motion-ease-out), box-shadow 0.3s ease, visibility 0s;
  }

  .scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .menu-btn {
    display: grid;
  }

  .topbar {
    padding: 0 16px;
  }

  .main {
    padding: 24px 16px 40px;
  }
}

@media (max-width: 560px) {
  .top-link span,
  .crumbs span {
    display: none;
  }
}
</style>
