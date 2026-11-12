<template>
  <div class="not-found">
    <Header />
    <main class="content">
      <div class="code" aria-hidden="true">
        <span>4</span>
        <span class="road"><span class="truck"><Truck /></span></span>
        <span>4</span>
      </div>
      <h1>Такого маршрута нет</h1>
      <p>Похоже, адрес изменился или страница переехала. Вернитесь на главную или найдите нужное в меню.</p>
      <div class="actions">
        <router-link to="/" class="ic-btn ic-btn--primary">На главную</router-link>
        <router-link to="/contacts" class="ic-btn ic-btn--ghost">Связаться с нами</router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Truck } from 'lucide-vue-next';
import Header from '@/ui/Header.vue';
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  background:
    radial-gradient(50% 50% at 50% 40%, rgba(var(--accent-rgb), 0.12), transparent 70%),
    var(--bg-primary);
  color: var(--text-primary);
}

.content {
  display: grid;
  justify-items: center;
  gap: 18px;
  max-width: 620px;
  margin: 0 auto;
  padding: 12vh 24px 80px;
  text-align: center;
}

.code {
  display: flex;
  align-items: center;
  gap: 18px;
  font-family: var(--font-display);
  font-size: clamp(90px, 16vw, 150px);
  font-weight: 700;
  line-height: 1;
  color: var(--accent-color);
}

.road {
  position: relative;
  width: clamp(90px, 16vw, 150px);
  height: 0.8em;
  border-radius: 50%;
  border: 3px dashed rgba(var(--accent-rgb), 0.45);
}

.truck {
  position: absolute;
  top: -18px;
  left: 50%;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: var(--text-on-accent);
  transform-origin: 20px calc(0.4em + 18px);
  animation: orbit 4s linear infinite;
}

.truck svg {
  width: 20px;
  height: 20px;
}

@keyframes orbit {
  to { transform: rotate(360deg); }
}

h1 {
  font-size: clamp(26px, 4vw, 38px);
}

p {
  color: var(--text-secondary);
  font-size: 17px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}
</style>
