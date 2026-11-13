<template>
  <AuthLayout eyebrow="Вход в кабинет">
    <template #title>С возвращением в <span class="ic-accent">InterCargo</span></template>
    <template #lead>Заказы, торги, документы и чат с перевозчиком — всё в одном кабинете.</template>

    <div class="af-head">
      <h2 class="af-title">Вход</h2>
      <span class="af-switch">Нет аккаунта? <router-link to="/register">Регистрация</router-link></span>
    </div>
    <p class="af-sub">Введите почту и пароль, указанные при регистрации.</p>

    <form class="af-form" novalidate @submit.prevent="handleLogin">
      <label class="af-field">
        <span>Email</span>
        <div class="af-control">
          <Mail />
          <input v-model.trim="form.email" class="ic-input" :class="{ error: errors.email }" type="email" autocomplete="email" placeholder="you@company.ru" :disabled="loading" @blur="validateEmail">
        </div>
        <small v-if="errors.email" class="af-error">{{ errors.email }}</small>
      </label>

      <label class="af-field">
        <span>Пароль</span>
        <div class="af-control">
          <LockKeyhole />
          <input v-model="form.password" class="ic-input" :class="{ error: errors.password }" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Ваш пароль" :disabled="loading" @blur="validatePassword">
          <button type="button" class="af-eye" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword">
            <EyeOff v-if="showPassword" /><Eye v-else />
          </button>
        </div>
        <small v-if="errors.password" class="af-error">{{ errors.password }}</small>
      </label>

      <div class="af-options">
        <label class="af-check"><input v-model="form.remember" type="checkbox"> Запомнить меня</label>
        <button type="button" class="af-link" @click="forgotPassword">Забыли пароль?</button>
      </div>

      <button class="ic-btn ic-btn--primary af-submit" type="submit" :disabled="loading">
        <span v-if="!loading">Войти <ArrowRight /></span>
        <span v-else class="af-spinner" aria-label="Вход"></span>
      </button>

      <template v-if="showDemo">
        <div class="af-divider">демо-доступ</div>
        <div class="af-demo">
          <button type="button" @click="fillDemo('anna@test.local')">Заказчик</button>
          <button type="button" @click="fillDemo('igor@test.local')">Перевозчик</button>
          <button type="button" @click="fillDemo('admin@test.local')">Админ</button>
        </div>
      </template>
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight } from 'lucide-vue-next';
import AuthLayout from '@/ui/AuthLayout.vue';
import { api } from '@/api/client';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import '@/styles/auth-form.css';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const toast = useToastStore();

// Кнопки демо-входа: в разработке или если включено переменной VITE_DEMO_LOGIN=1
const showDemo = import.meta.env.DEV || import.meta.env.VITE_DEMO_LOGIN === '1';

const form = reactive({ email: '', password: '', remember: false });
const errors = reactive({ email: '', password: '' });
const loading = ref(false);
const showPassword = ref(false);

const validateEmail = () => {
  errors.email = !form.email ? 'Введите email'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Проверьте email' : '';
  return !errors.email;
};

const validatePassword = () => {
  errors.password = form.password ? '' : 'Введите пароль';
  return !errors.password;
};

const fillDemo = (email) => {
  form.email = email;
  form.password = 'Test1234!';
  errors.email = '';
  errors.password = '';
};

const handleLogin = async () => {
  const ok = validateEmail() & validatePassword();
  if (!ok) return;
  loading.value = true;
  const res = await api('/auth/login', { method: 'POST', auth: false, body: { email: form.email, password: form.password } });
  loading.value = false;

  if (res.ok) {
    userStore.login(res.data.token, res.data.user);
    if (form.remember) localStorage.setItem('rememberMe', 'true');
    toast.success(`Здравствуйте, ${res.data.user.firstName}!`);
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/profile';
    router.push(redirect);
    return;
  }
  const message = res.message || 'Не удалось войти';
  if (/пароль/i.test(message)) errors.password = message;
  else errors.email = message;
  toast.error(message);
};

const forgotPassword = () => {
  toast.success('Напишите нам — восстановим доступ в течение часа');
  router.push({ path: '/contacts', query: { topic: 'password' } });
};
</script>
