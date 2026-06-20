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
        <router-link to="/profile" class="nav-link active">
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
          <h1>Личный кабинет</h1>
          <p>Управляйте своим аккаунтом и перевозками</p>
        </div>
        <div class="header-actions">
          <div class="notif-wrapper" @click.stop="toggleNotif">
            <button class="icon-btn" title="Уведомления">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span v-if="unreadCount > 0" class="notif-dot"></span>
            </button>
            <div class="notif-dropdown" v-if="showNotif" @click.stop>
              <div class="notif-header">
                <h4>Уведомления</h4>
                <span class="notif-count">{{ notifications.length }}</span>
              </div>
              <div class="notif-list">
                <div v-if="notifications.length === 0" class="notif-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>
                  <p>Нет новых уведомлений</p>
                </div>
                <div v-for="notif in notifications" :key="notif.id" class="notif-item" :class="{ unread: !notif.read }" @click="markAsRead(notif.id)">
                  <div class="notif-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                  </div>
                  <div class="notif-content">
                    <div class="notif-title">{{ notif.title }}</div>
                    <div class="notif-text">{{ notif.text }}</div>
                    <div class="notif-date">{{ notif.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="content-grid">
        <div class="card personal-info">
          <div class="card-header">
            <div>
              <h2>Личная информация</h2>
              <p class="card-subtitle">Обновите свои персональные данные</p>
            </div>
            <div class="role-badge" :class="roleBadgeClass">
              {{ roleLabel }}
            </div>
          </div>
          <form @submit.prevent="saveProfile">
            <div class="form-row">
              <div class="form-group">
                <label>Имя</label>
                <input v-model="profileForm.firstName" type="text" />
              </div>
              <div class="form-group">
                <label>Фамилия</label>
                <input v-model="profileForm.lastName" type="text" />
              </div>
            </div>
            <div class="form-group">
              <label>Отчество</label>
              <input v-model="profileForm.patronymic" type="text" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input v-model="profileForm.email" type="email" autocomplete="email" />
              </div>
              <div class="form-group">
                <label>Телефон</label>
                <input v-model="profileForm.phone" type="tel" autocomplete="tel" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Тип аккаунта</label>
                <input :value="roleLabel" type="text" disabled class="readonly-input" />
              </div>
              <div class="form-group" v-if="userStore.user?.company">
                <label>Компания</label>
                <input :value="userStore.user.company" type="text" disabled class="readonly-input" />
              </div>
            </div>
            <button type="submit" class="btn-primary" :disabled="savingProfile">
              <span v-if="!savingProfile">Сохранить изменения</span>
              <span v-else>Сохранение...</span>
            </button>
          </form>
        </div>

        <div class="card security">
          <div class="card-header">
            <div>
              <h2>Безопасность</h2>
              <p class="card-subtitle">Защитите свой аккаунт</p>
            </div>
          </div>
          <div class="security-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <p>Ваши данные под надёжной защитой. Мы заботимся о безопасности вашего аккаунта.</p>
          </div>
          <form @submit.prevent="updatePassword">
            <div class="form-group">
              <label>Текущий пароль</label>
              <input v-model="passwordForm.currentPassword" type="password" placeholder="Введите текущий пароль" />
            </div>
            <div class="form-group">
              <label>Новый пароль</label>
              <input v-model="passwordForm.newPassword" type="password" placeholder="Минимум 8 символов" />
            </div>
            <div class="form-group">
              <label>Повторите пароль</label>
              <input v-model="passwordForm.confirmPassword" type="password" placeholder="Повторите пароль" />
            </div>
            <button type="submit" class="btn-secondary" :disabled="savingPassword">
              <span v-if="!savingPassword">Изменить пароль</span>
              <span v-else>Изменение...</span>
            </button>
          </form>
        </div>
      </div>

      <div v-if="userStore.isAdmin" class="quick-actions">
        <div class="quick-header">
          <h2>Управление</h2>
          <span class="quick-hint">Основные разделы админ-панели</span>
        </div>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/orders')">
            <div class="action-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
            </div>
            <h3>Все заказы</h3>
            <p>Управление заказами</p>
          </div>
          <div class="action-card" @click="$router.push('/carriers')">
            <div class="action-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <h3>Перевозчики</h3>
            <p>Управление перевозчиками</p>
          </div>
          <div class="action-card" @click="$router.push('/documents')">
            <div class="action-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <h3>Документы</h3>
            <p>Файлы и документы</p>
          </div>
          <div class="action-card" @click="$router.push('/settings')">
            <div class="action-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <h3>Настройки</h3>
            <p>Параметры системы</p>
          </div>
        </div>
      </div>

      <div v-else-if="isCustomer" class="quick-actions">
        <div class="quick-header">
          <h2>Быстрые действия</h2>
          <span class="quick-hint">Часто используемые функции</span>
        </div>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/transport-tender')">
            <div class="action-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <h3>Создать заказ</h3>
            <p>Оформить новую перевозку</p>
          </div>
          <div class="action-card" @click="$router.push('/orders')">
            <div class="action-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path></svg>
            </div>
            <h3>Мои заказы</h3>
            <p>Отследить статусы</p>
          </div>
          <div class="action-card" @click="$router.push('/carriers')">
            <div class="action-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <h3>Перевозчики</h3>
            <p>Список перевозчиков</p>
          </div>
          <div class="action-card">
            <div class="action-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3>Поддержка</h3>
            <p>Связаться с нами</p>
          </div>
        </div>
      </div>

      <div v-else class="quick-actions">
        <div class="quick-header">
          <h2>Быстрые действия</h2>
          <span class="quick-hint">Часто используемые функции</span>
        </div>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/orders')">
            <div class="action-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h3>Доступные заказы</h3>
            <p>Найти новые заказы</p>
          </div>
          <div class="action-card" @click="$router.push('/my-applications')">
            <div class="action-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3>Мои заявки</h3>
            <p>История заявок</p>
          </div>
          <div class="action-card" @click="$router.push('/reviews')">
            <div class="action-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h3>Отзывы</h3>
            <p>Отзывы заказчиков</p>
          </div>
          <div class="action-card">
            <div class="action-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3>Поддержка</h3>
            <p>Связаться с нами</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const userStore = useUserStore();
const toast = useToastStore();

const profileForm = reactive({
  firstName: '', lastName: '', patronymic: '', email: '', phone: ''
});
const passwordForm = reactive({
  currentPassword: '', newPassword: '', confirmPassword: ''
});

const savingProfile = ref(false);
const savingPassword = ref(false);
const showNotif = ref(false);
const notifications = ref([]);

const isCustomer = computed(() => userStore.user?.accountType === 'customer');
const isCarrier = computed(() => userStore.user?.accountType === 'carrier');

const roleLabel = computed(() => {
  if (userStore.isAdmin) return 'Администратор';
  if (isCustomer.value) return 'Заказчик';
  if (isCarrier.value) return 'Перевозчик';
  return 'Пользователь';
});

const roleBadgeClass = computed(() => {
  if (userStore.isAdmin) return 'role-admin';
  if (isCustomer.value) return 'role-customer';
  if (isCarrier.value) return 'role-carrier';
  return '';
});

const initials = computed(() => {
  if (!userStore.user) return '?';
  return (userStore.user.firstName?.[0] || '') + (userStore.user.lastName?.[0] || '');
});

const fullName = computed(() => {
  if (!userStore.user) return '';
  return `${userStore.user.firstName || ''} ${userStore.user.lastName || ''}`.trim();
});

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

onMounted(() => {
  if (userStore.user) {
    profileForm.firstName = userStore.user.firstName || '';
    profileForm.lastName = userStore.user.lastName || '';
    profileForm.patronymic = userStore.user.patronymic || '';
    profileForm.email = userStore.user.email || '';
    profileForm.phone = userStore.user.phone || '';
  }

  const saved = localStorage.getItem('user_notifications');
  if (saved) {
    notifications.value = JSON.parse(saved);
  } else {
    notifications.value = [
      { id: 1, title: 'Добро пожаловать!', text: 'Ваш аккаунт успешно создан.', date: 'Сегодня', read: false },
      { id: 2, title: 'Обновление системы', text: 'Добавлены новые функции.', date: 'Вчера', read: false }
    ];
    saveNotifications();
  }

  document.addEventListener('click', closeNotif);
});

onUnmounted(() => {
  document.removeEventListener('click', closeNotif);
});

const saveNotifications = () => {
  localStorage.setItem('user_notifications', JSON.stringify(notifications.value));
};

const toggleNotif = () => {
  showNotif.value = !showNotif.value;
};

const closeNotif = () => {
  showNotif.value = false;
};

const markAsRead = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
  saveNotifications();
};

const saveProfile = async () => {
  savingProfile.value = true;
  const result = await userStore.updateUser(profileForm);
  if (result.success) {
    toast.success('Данные успешно обновлены');
  } else {
    toast.error(result.message || 'Ошибка обновления');
  }
  savingProfile.value = false;
};

const updatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('Новые пароли не совпадают');
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    toast.error('Пароль должен содержать минимум 8 символов');
    return;
  }
  savingPassword.value = true;
  const result = await userStore.changePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  });
  if (result.success) {
    toast.success('Пароль успешно изменен');
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } else {
    toast.error(result.message || 'Ошибка смены пароля');
  }
  savingPassword.value = false;
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
.main-content { flex: 1; padding: 40px; max-width: 1200px; width: 100%; margin: 0 auto; }
.content-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.content-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.content-header p { font-size: 16px; color: var(--text-muted); }
.header-actions { display: flex; gap: 10px; }
.notif-wrapper { position: relative; }
.icon-btn { width: 44px; height: 44px; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; color: var(--text-secondary); position: relative; }
.icon-btn:hover { border-color: var(--accent-color); color: var(--accent-color); transform: translateY(-2px); }
.icon-btn svg { width: 20px; height: 20px; }
.notif-dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid var(--bg-card); }
.notif-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 360px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); z-index: 1000; animation: dropdownFade 0.2s ease; overflow: hidden; }
@keyframes dropdownFade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.notif-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border-color); }
.notif-header h4 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; }
.notif-count { background: rgba(45, 192, 113, 0.15); color: var(--accent-color); font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.notif-list { max-height: 400px; overflow-y: auto; }
.notif-empty { padding: 40px 20px; text-align: center; color: var(--text-muted); }
.notif-empty svg { width: 40px; height: 40px; margin-bottom: 12px; opacity: 0.5; }
.notif-empty p { font-size: 14px; margin: 0; }
.notif-item { display: flex; gap: 12px; padding: 14px 20px; cursor: pointer; transition: all 0.2s ease; border-bottom: 1px solid var(--border-color); }
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: rgba(255, 255, 255, 0.03); }
.notif-item.unread { background: rgba(45, 192, 113, 0.05); }
.notif-item.unread:hover { background: rgba(45, 192, 113, 0.08); }
.notif-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(45, 192, 113, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent-color); flex-shrink: 0; }
.notif-icon svg { width: 18px; height: 18px; }
.notif-content { flex: 1; min-width: 0; }
.notif-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.notif-text { font-size: 13px; color: var(--text-muted); line-height: 1.4; margin-bottom: 6px; }
.notif-date { font-size: 11px; color: var(--text-secondary); }
.content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; margin-bottom: 32px; }
.card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; backdrop-filter: blur(10px); transition: all 0.3s ease; }
.card:hover { border-color: rgba(45, 192, 113, 0.2); }
.card-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.card h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.card-subtitle { font-size: 14px; color: var(--text-muted); }
.role-badge { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.role-admin { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.role-customer { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
.role-carrier { background: rgba(45, 192, 113, 0.15); color: #2DC071; border: 1px solid rgba(45, 192, 113, 0.3); }
.security-notice { display: flex; gap: 10px; padding: 12px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 10px; margin-bottom: 20px; align-items: center; }
.security-notice svg { width: 20px; height: 20px; color: #3b82f6; flex-shrink: 0; }
.security-notice p { font-size: 12px; color: var(--text-muted); line-height: 1.4; margin: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-group input { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; color: var(--text-primary); font-size: 14px; outline: none; transition: all 0.2s ease; }
.form-group input::placeholder { color: var(--text-muted); opacity: 0.6; }
.form-group input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1); }
.form-group input:disabled, .form-group input.readonly-input { opacity: 0.7; cursor: not-allowed; background: rgba(255, 255, 255, 0.02); }
.btn-primary, .btn-secondary { width: 100%; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; border: none; margin-top: 8px; }
.btn-primary { background: linear-gradient(135deg, #2DC071, #28a45e); color: white; box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2); }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3); }
.btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); border: 1px solid var(--border-color); }
.btn-secondary:hover:not(:disabled) { background: rgba(255, 255, 255, 0.08); border-color: var(--accent-color); }
.btn-primary:disabled, .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
.quick-actions { margin-top: 8px; }
.quick-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
.quick-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0; }
.quick-hint { font-size: 13px; color: var(--text-muted); }
.actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.action-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; cursor: pointer; transition: all 0.3s ease; }
.action-card:hover { transform: translateY(-4px); border-color: rgba(45, 192, 113, 0.3); box-shadow: 0 10px 30px var(--shadow-color); }
.action-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.action-icon svg { width: 24px; height: 24px; }
.action-icon.green { background: rgba(45, 192, 113, 0.1); color: #2DC071; }
.action-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.action-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.action-icon.orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.action-card h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
.action-card p { font-size: 14px; color: var(--text-muted); }
@media (max-width: 1024px) { .sidebar { display: none; } .content-grid { grid-template-columns: 1fr; } .actions-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .main-content { padding: 24px 16px; } .form-row { grid-template-columns: 1fr; } .actions-grid { grid-template-columns: 1fr; } .card { padding: 24px; } .content-header h1 { font-size: 26px; } .notif-dropdown { width: 300px; } .card-header { flex-direction: column; } }
</style>