<template>
  <form class="offer-form" novalidate @submit.prevent="submit">
    <div class="row">
      <label class="field">
        <span>Имя</span>
        <input v-model.trim="form.name" class="ic-input" :class="{ error: errors.name }" type="text" autocomplete="name" placeholder="Как к вам обращаться" maxlength="80">
        <small v-if="errors.name">{{ errors.name }}</small>
      </label>
      <label class="field">
        <span>Телефон</span>
        <input :value="form.phone" class="ic-input" :class="{ error: errors.phone }" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" @input="onPhone">
        <small v-if="errors.phone">{{ errors.phone }}</small>
      </label>
    </div>
    <label class="field">
      <span>Email <em>— необязательно</em></span>
      <input v-model.trim="form.email" class="ic-input" :class="{ error: errors.email }" type="email" autocomplete="email" placeholder="you@company.ru" maxlength="80">
      <small v-if="errors.email">{{ errors.email }}</small>
    </label>
    <label v-if="withMessage" class="field">
      <span>Что везём?</span>
      <textarea v-model.trim="form.message" class="ic-input" rows="3" maxlength="1000" placeholder="Например: 20 т стройматериалов, Москва → Казань, на следующей неделе"></textarea>
    </label>

    <button class="ic-btn ic-btn--primary submit" type="submit" :disabled="sending">
      <span v-if="!sending">{{ submitText }}</span>
      <span v-else class="spinner" aria-label="Отправка"></span>
    </button>
    <p class="note">Нажимая кнопку, вы соглашаетесь с <router-link to="/privacy">политикой конфиденциальности</router-link>.</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { api } from '@/api/client';
import { useToastStore } from '@/stores/toast';

defineProps({
  withMessage: { type: Boolean, default: true },
  submitText: { type: String, default: 'Получить расчёт' },
});

const toast = useToastStore();
const sending = ref(false);
const form = reactive({ name: '', phone: '', email: '', message: '' });
const errors = reactive({ name: '', phone: '', email: '' });

// Маска +7 (XXX) XXX-XX-XX
const onPhone = (e) => {
  let d = e.target.value.replace(/\D/g, '');
  if (d.startsWith('8')) d = `7${d.slice(1)}`;
  if (!d.startsWith('7')) d = `7${d}`;
  d = d.slice(0, 11);
  let out = '+7';
  if (d.length > 1) out += ` (${d.slice(1, 4)}`;
  if (d.length >= 4) out += `) ${d.slice(4, 7)}`;
  if (d.length >= 7) out += `-${d.slice(7, 9)}`;
  if (d.length >= 9) out += `-${d.slice(9, 11)}`;
  form.phone = d.length > 1 ? out : '';
  e.target.value = form.phone;
};

const validate = () => {
  errors.name = form.name.length >= 2 ? '' : 'Укажите имя';
  errors.phone = form.phone.replace(/\D/g, '').length === 11 ? '' : 'Нужен номер из 11 цифр';
  errors.email = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Проверьте email';
  return !errors.name && !errors.phone && !errors.email;
};

const submit = async () => {
  if (!validate()) return;
  sending.value = true;
  const res = await api('/contact/offer-request', {
    method: 'POST',
    auth: false,
    body: { name: form.name, phone: form.phone, email: form.email, message: form.message },
  });
  sending.value = false;
  if (res.ok) {
    toast.success('Заявка принята! Менеджер свяжется с вами в течение 15 минут.');
    Object.assign(form, { name: '', phone: '', email: '', message: '' });
  } else {
    toast.error(res.message);
  }
};
</script>

<style scoped>
.offer-form {
  display: grid;
  gap: 14px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
}

.field > span {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.field em {
  color: var(--text-muted);
  font-style: normal;
  font-weight: 500;
}

.field small {
  color: var(--danger);
  font-size: 12.5px;
}

.submit {
  width: 100%;
  height: 52px;
  margin-top: 4px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.note {
  color: var(--text-muted);
  font-size: 12.5px;
  text-align: center;
}

.note a {
  color: var(--accent-color);
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
