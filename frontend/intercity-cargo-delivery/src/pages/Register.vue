<template>
  <AuthLayout eyebrow="Регистрация">
    <template #title>Присоединяйтесь к <span class="ic-accent">InterCargo</span></template>
    <template #lead>Пара минут — и можно публиковать заказы или брать рейсы. Без абонентской платы.</template>

    <div class="af-head">
      <h2 class="af-title">Создать аккаунт</h2>
      <span class="af-switch">Уже есть? <router-link to="/login">Войти</router-link></span>
    </div>

    <ol class="steps" aria-label="Шаги регистрации">
      <li v-for="(s, i) in steps" :key="s" :class="{ done: i < step, on: i === step }">
        <span class="dot"><Check v-if="i < step" /><template v-else>{{ i + 1 }}</template></span>
        <small>{{ s }}</small>
      </li>
    </ol>

    <form class="af-form" novalidate @submit.prevent="next">
      <transition :name="dir" mode="out-in">
        <!-- Шаг 1: о себе -->
        <div v-if="step === 0" key="s0" class="af-form">
          <div class="af-row">
            <label class="af-field">
              <span>Имя</span>
              <div class="af-control"><UserRound /><input v-model.trim="form.firstName" class="ic-input" :class="{ error: errors.firstName }" autocomplete="given-name" placeholder="Анна"></div>
              <small v-if="errors.firstName" class="af-error">{{ errors.firstName }}</small>
            </label>
            <label class="af-field">
              <span>Фамилия</span>
              <div class="af-control"><UserRound /><input v-model.trim="form.lastName" class="ic-input" :class="{ error: errors.lastName }" autocomplete="family-name" placeholder="Смирнова"></div>
              <small v-if="errors.lastName" class="af-error">{{ errors.lastName }}</small>
            </label>
          </div>
          <label class="af-field">
            <span>Email</span>
            <div class="af-control"><Mail /><input v-model.trim="form.email" class="ic-input" :class="{ error: errors.email }" type="email" autocomplete="email" placeholder="you@company.ru"></div>
            <small v-if="errors.email" class="af-error">{{ errors.email }}</small>
          </label>
          <label class="af-field">
            <span>Телефон</span>
            <div class="af-control"><Phone /><input :value="form.phone" class="ic-input" :class="{ error: errors.phone }" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" @input="onPhone"></div>
            <small v-if="errors.phone" class="af-error">{{ errors.phone }}</small>
          </label>
        </div>

        <!-- Шаг 2: роль и компания -->
        <div v-else-if="step === 1" key="s1" class="af-form">
          <div class="roles">
            <button type="button" class="role" :class="{ on: form.accountType === 'customer' }" @click="form.accountType = 'customer'">
              <span class="role-icon"><Package /></span>
              <strong>Заказчик</strong>
              <small>Публикую заказы и аукционы, выбираю перевозчика</small>
            </button>
            <button type="button" class="role" :class="{ on: form.accountType === 'carrier' }" @click="form.accountType = 'carrier'">
              <span class="role-icon"><Truck /></span>
              <strong>Перевозчик</strong>
              <small>Есть транспорт, беру рейсы и участвую в торгах</small>
            </button>
          </div>
          <label class="af-field">
            <span>Компания <em class="opt">— необязательно</em></span>
            <div class="af-control"><Building2 /><input v-model.trim="form.company" class="ic-input" placeholder="ООО «Ромашка» или ИП"></div>
          </label>
        </div>

        <!-- Шаг 3: пароль -->
        <div v-else key="s2" class="af-form">
          <label class="af-field">
            <span>Пароль</span>
            <div class="af-control">
              <LockKeyhole />
              <input v-model="form.password" class="ic-input" :class="{ error: errors.password }" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Придумайте пароль">
              <button type="button" class="af-eye" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" /><Eye v-else /></button>
            </div>
          </label>
          <div class="strength" :data-level="strength">
            <div class="bars"><i v-for="n in 4" :key="n" :class="{ on: n <= strength }"></i></div>
            <ul>
              <li v-for="r in rules" :key="r.label" :class="{ ok: r.ok }"><Check /> {{ r.label }}</li>
            </ul>
          </div>
          <label class="af-field">
            <span>Повторите пароль</span>
            <div class="af-control"><LockKeyhole /><input v-model="form.confirmPassword" class="ic-input" :class="{ error: errors.confirmPassword }" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Ещё раз"></div>
            <small v-if="errors.confirmPassword" class="af-error">{{ errors.confirmPassword }}</small>
          </label>
          <label class="af-check">
            <input v-model="form.agreeTerms" type="checkbox">
            <span>Принимаю <router-link :to="{ path: '/privacy', hash: '#terms' }" target="_blank">условия использования</router-link> и <router-link to="/privacy" target="_blank">политику конфиденциальности</router-link></span>
          </label>
          <small v-if="errors.agreeTerms" class="af-error">{{ errors.agreeTerms }}</small>
        </div>
      </transition>

      <div class="nav">
        <button v-if="step > 0" type="button" class="ic-btn ic-btn--ghost" @click="back"><ArrowLeft /> Назад</button>
        <button class="ic-btn ic-btn--primary af-submit" type="submit" :disabled="loading">
          <span v-if="loading" class="af-spinner" aria-label="Регистрация"></span>
          <span v-else-if="step < 2">Дальше <ArrowRight /></span>
          <span v-else>Создать аккаунт <ArrowRight /></span>
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  UserRound, Mail, Phone, Package, Truck, Building2, LockKeyhole, Eye, EyeOff, Check, ArrowRight, ArrowLeft,
} from 'lucide-vue-next';
import AuthLayout from '@/ui/AuthLayout.vue';
import { api } from '@/api/client';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import '@/styles/auth-form.css';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const toast = useToastStore();

const steps = ['О себе', 'Роль', 'Пароль'];
const step = ref(0);
const dir = ref('step-next');
const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  // ?type=carrier с главной сразу выбирает «Перевозчик»
  accountType: route.query.type === 'carrier' ? 'carrier' : 'customer',
  company: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
});
const errors = reactive({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: '' });

// Те же правила, что проверяет сервер
const rules = computed(() => [
  { label: '8+ символов', ok: form.password.length >= 8 },
  { label: 'заглавная и строчная', ok: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password) },
  { label: 'цифра', ok: /\d/.test(form.password) },
  { label: 'спецсимвол @$!%*?&_-', ok: /[@$!%*?&_-]/.test(form.password) },
]);
const strength = computed(() => rules.value.filter((r) => r.ok).length);
const latinOnly = computed(() => /^[A-Za-z\d@$!%*?&_-]*$/.test(form.password));

const onPhone = (e) => {
  let d = e.target.value.replace(/\D/g, '');
  if (d.startsWith('8')) d = `7${d.slice(1)}`;
  if (d && !d.startsWith('7')) d = `7${d}`;
  d = d.slice(0, 11);
  let out = d ? '+7' : '';
  if (d.length > 1) out += ` (${d.slice(1, 4)}`;
  if (d.length >= 4) out += `) ${d.slice(4, 7)}`;
  if (d.length >= 7) out += `-${d.slice(7, 9)}`;
  if (d.length >= 9) out += `-${d.slice(9, 11)}`;
  form.phone = out;
  e.target.value = out;
};

const nameOk = (v) => /^[А-Яа-яЁёA-Za-z-]{2,50}$/.test(v);

function validateStep(i) {
  if (i === 0) {
    errors.firstName = nameOk(form.firstName) ? '' : 'Только буквы и дефис, от 2 символов';
    errors.lastName = nameOk(form.lastName) ? '' : 'Только буквы и дефис, от 2 символов';
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Проверьте email';
    errors.phone = form.phone.replace(/\D/g, '').length === 11 ? '' : 'Нужен номер из 11 цифр';
    return !errors.firstName && !errors.lastName && !errors.email && !errors.phone;
  }
  if (i === 2) {
    errors.password = strength.value === 4 && latinOnly.value ? '' : 'Пароль не соответствует требованиям';
    errors.confirmPassword = form.password === form.confirmPassword ? '' : 'Пароли не совпадают';
    errors.agreeTerms = form.agreeTerms ? '' : 'Нужно принять условия';
    if (errors.password) toast.error(latinOnly.value ? errors.password : 'Пароль — только латиница, цифры и @$!%*?&_-');
    return !errors.password && !errors.confirmPassword && !errors.agreeTerms;
  }
  return true;
}

const back = () => {
  dir.value = 'step-back';
  step.value -= 1;
};

async function next() {
  if (!validateStep(step.value)) return;
  if (step.value < 2) {
    dir.value = 'step-next';
    step.value += 1;
    return;
  }
  loading.value = true;
  const res = await api('/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      firstName: form.firstName,
      lastName: form.lastName,
      patronymic: '',
      email: form.email,
      phone: form.phone.replace(/[^\d+]/g, ''),
      password: form.password,
      confirmPassword: form.confirmPassword,
      accountType: form.accountType,
      company: form.company,
    },
  });
  loading.value = false;

  if (res.ok) {
    userStore.login(res.data.token, res.data.user);
    toast.success('Аккаунт создан. Добро пожаловать!');
    router.push('/profile');
    return;
  }
  const message = res.message || 'Не удалось зарегистрироваться';
  toast.error(message);
  // вернуть на шаг с ошибкой
  if (/email|телефон|имя|фамил/i.test(message)) {
    dir.value = 'step-back';
    step.value = 0;
    if (/email/i.test(message)) errors.email = message;
    else if (/телефон/i.test(message)) errors.phone = message;
  }
}
</script>

<style scoped>
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 18px 0 24px;
  list-style: none;
}

.steps li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12.5px;
  font-weight: 700;
}

.steps li::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.4s ease;
}

.steps li.on::after,
.steps li.done::after {
  background: var(--accent-color);
}

.dot {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid var(--border-strong);
  font-size: 12px;
}

.dot svg {
  width: 14px;
  height: 14px;
}

.steps li.on {
  color: var(--text-primary);
}

.steps li.on .dot {
  border-color: var(--accent-color);
  color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.15);
}

.steps li.done .dot {
  border-color: var(--accent-color);
  background: var(--accent-color);
  color: #04130A;
}

.roles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role {
  display: grid;
  gap: 6px;
  justify-items: start;
  padding: 18px;
  border: 1.5px solid var(--border-color);
  border-radius: 18px;
  background: var(--bg-card);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.role:hover {
  border-color: rgba(var(--accent-rgb), 0.45);
}

.role.on {
  border-color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.08);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12);
}

.role-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 4px;
  border-radius: 12px;
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent-color);
}

.role-icon svg {
  width: 20px;
  height: 20px;
}

.role strong {
  font-family: var(--font-display);
  font-size: 17px;
}

.role small {
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.4;
}

.opt {
  color: var(--text-muted);
  font-style: normal;
  font-weight: 500;
}

.strength .bars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.strength .bars i {
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.strength[data-level="1"] .bars i.on { background: #FF6B6B; }
.strength[data-level="2"] .bars i.on { background: #F2B84B; }
.strength[data-level="3"] .bars i.on { background: #9BE15D; }
.strength[data-level="4"] .bars i.on { background: var(--accent-color); }

.strength ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
  margin-top: 10px;
  list-style: none;
}

.strength li {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 12.5px;
  transition: color 0.2s ease;
}

.strength li svg {
  width: 14px;
  height: 14px;
  opacity: 0.3;
}

.strength li.ok {
  color: var(--accent-color);
}

.strength li.ok svg {
  opacity: 1;
}

.nav {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.nav .af-submit {
  flex: 1;
  margin-top: 0;
}

.nav .ic-btn--ghost {
  height: 52px;
}

.step-next-enter-active,
.step-next-leave-active,
.step-back-enter-active,
.step-back-leave-active {
  transition: opacity 0.25s ease, transform 0.25s var(--motion-ease-out);
}

.step-next-enter-from,
.step-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.step-next-leave-to,
.step-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

@media (max-width: 560px) {
  .roles {
    grid-template-columns: 1fr;
  }

  .steps small {
    display: none;
  }
}
</style>
