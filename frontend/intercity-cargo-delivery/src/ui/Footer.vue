<template>
  <footer class="footer">
    <div class="ic-container">
      <div class="top">
        <div class="brand-col">
          <router-link to="/" class="brand">
            <img src="@/assets/icons/logotip.webp" alt="" width="40" height="40">
            <span>Inter<b>Cargo</b></span>
          </router-link>
          <p>Цифровая платформа для грузоперевозок, тендеров и управления логистикой в реальном времени.</p>
          <div class="stats">
            <div><strong>12K+</strong><span>перевозчиков</span></div>
            <div><strong>58K</strong><span>заказов в месяц</span></div>
            <div><strong>98%</strong><span>рейсов вовремя</span></div>
          </div>
        </div>

        <nav class="col" aria-label="Платформа">
          <h3>Платформа</h3>
          <router-link to="/transport-tender">Транспортные тендеры</router-link>
          <router-link to="/spot-auctions">Спот-аукционы</router-link>
          <router-link to="/tms">TMS-система</router-link>
          <router-link to="/tracking">Трекинг грузов</router-link>
          <router-link to="/feature/analytics">Аналитика</router-link>
        </nav>

        <nav class="col" aria-label="Компания">
          <h3>Компания</h3>
          <router-link to="/about">О компании</router-link>
          <router-link to="/services">Услуги</router-link>
          <router-link to="/news">Новости</router-link>
          <router-link :to="{ path: '/register', query: { type: 'carrier' } }">Перевозчикам</router-link>
          <router-link to="/contacts">Контакты</router-link>
        </nav>

        <div class="col subscribe">
          <h3>Новости платформы</h3>
          <p>Новые маршруты, функции и аналитика рынка — раз в месяц, без спама.</p>
          <form class="sub-form" @submit.prevent="subscribe">
            <label class="sr-only" for="footer-email">Email</label>
            <input id="footer-email" v-model.trim="email" class="ic-input" type="email" placeholder="you@company.ru" autocomplete="email">
            <button class="ic-btn ic-btn--primary" type="submit" :disabled="sending" aria-label="Подписаться">
              <Send />
            </button>
          </form>
          <div class="contacts">
            <a href="tel:+79188180890"><Phone /> +7 (918) 818-08-90</a>
            <a href="mailto:info@intercargo.ru"><Mail /> info@intercargo.ru</a>
          </div>
        </div>
      </div>

      <div class="bottom">
        <span>© {{ year }} InterCargo. Все права защищены.</span>
        <nav aria-label="Документы">
          <router-link to="/privacy">Политика конфиденциальности</router-link>
          <router-link :to="{ path: '/privacy', hash: '#cookies' }">Cookies</router-link>
          <router-link :to="{ path: '/privacy', hash: '#terms' }">Условия</router-link>
        </nav>
      </div>
    </div>
    <div class="glow" aria-hidden="true"></div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { Send, Phone, Mail } from 'lucide-vue-next';
import { api } from '@/api/client';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
const email = ref('');
const sending = ref(false);
const year = new Date().getFullYear();

const subscribe = async () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    toast.error('Введите корректный email');
    return;
  }
  sending.value = true;
  const res = await api('/contact/subscribe', { method: 'POST', auth: false, body: { email: email.value } });
  sending.value = false;
  if (res.ok) {
    toast.success(res.message);
    email.value = '';
  } else {
    toast.error(res.message);
  }
};
</script>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  padding: 80px 0 28px;
  background: var(--bg-deep);
  border-top: 1px solid var(--border-color);
  color: var(--text-primary);
}

.glow {
  position: absolute;
  left: 50%;
  bottom: -320px;
  width: 900px;
  height: 500px;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgba(var(--accent-rgb), 0.16), transparent);
  pointer-events: none;
}

.top {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.4fr;
  gap: 48px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  text-decoration: none;
}

.brand img {
  width: 40px;
  height: 40px;
}

.brand b {
  color: var(--accent-color);
  font-weight: 700;
}

.brand-col p,
.subscribe p {
  margin-top: 16px;
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.6;
}

.stats {
  display: flex;
  gap: 26px;
  margin-top: 28px;
}

.stats strong {
  display: block;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--accent-color);
}

.stats span {
  color: var(--text-muted);
  font-size: 12.5px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.col h3 {
  margin-bottom: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.col a {
  width: fit-content;
  color: var(--text-secondary);
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.col a:hover {
  color: var(--accent-color);
  transform: translateX(3px);
}

.subscribe p {
  margin-top: 0;
}

.sub-form {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.sub-form .ic-input {
  height: 48px;
  border-radius: 999px;
  padding: 0 18px;
}

.sub-form .ic-btn {
  width: 48px;
  padding: 0;
  flex-shrink: 0;
}

.contacts {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.contacts a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--text-primary);
}

.contacts svg {
  width: 16px;
  height: 16px;
  color: var(--accent-color);
}

.bottom {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 13.5px;
}

.bottom nav {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.bottom a {
  color: var(--text-muted);
  text-decoration: none;
}

.bottom a:hover {
  color: var(--accent-color);
}

@media (max-width: 1024px) {
  .top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer {
    padding-top: 56px;
  }

  .top {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .stats {
    gap: 20px;
  }
}
</style>
