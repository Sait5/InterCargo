<template>
  <div class="auth">
    <video class="scene" src="/video/highway-top.mp4" poster="/video/highway-top.jpg" autoplay muted loop playsinline aria-hidden="true"></video>
    <div class="veil" aria-hidden="true"></div>

    <header class="auth-top">
      <router-link to="/" class="brand" aria-label="InterCargo — на главную">
        <img src="@/assets/icons/logotip.webp" alt="" width="40" height="40">
        <span>Inter<b>Cargo</b></span>
      </router-link>
      <router-link to="/" class="back"><ArrowLeft /> На сайт</router-link>
    </header>

    <main class="auth-grid">
      <section class="intro">
        <span class="ic-eyebrow">{{ eyebrow }}</span>
        <h1><slot name="title" /></h1>
        <p class="lead"><slot name="lead" /></p>

        <ul class="perks">
          <li><span><ShieldCheck /></span><div><strong>Страхование каждого рейса</strong><small>до 100% стоимости груза</small></div></li>
          <li><span><MapPinned /></span><div><strong>Трекинг в реальном времени</strong><small>GPS-борта и статусы в кабинете</small></div></li>
          <li><span><Gavel /></span><div><strong>Тендеры и аукционы</strong><small>лучшая цена без звонков и почты</small></div></li>
        </ul>

        <!-- Слайдер отзывов -->
        <div class="quotes" @mouseenter="paused = true" @mouseleave="paused = false">
          <transition name="quote" mode="out-in">
            <figure :key="current" class="quote">
              <blockquote>«{{ quotes[current].text }}»</blockquote>
              <figcaption>
                <span class="q-avatar">{{ quotes[current].initials }}</span>
                <span><strong>{{ quotes[current].name }}</strong><small>{{ quotes[current].role }}</small></span>
              </figcaption>
            </figure>
          </transition>
          <div class="dots" role="tablist" aria-label="Отзывы">
            <button
              v-for="(q, i) in quotes"
              :key="q.name"
              :class="{ on: i === current }"
              :aria-label="`Отзыв ${i + 1}`"
              @click="current = i"
            ></button>
          </div>
        </div>
      </section>

      <section class="card">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowLeft, ShieldCheck, MapPinned, Gavel } from 'lucide-vue-next';

defineProps({
  eyebrow: { type: String, default: 'Личный кабинет' },
});

const quotes = [
  { initials: 'ОК', name: 'Ольга Кравец', role: 'логист, «СтройМаркет»', text: 'Перешли с почты и мессенджеров на аукционы InterCargo — горящие рейсы закрываем за 15 минут.' },
  { initials: 'ИВ', name: 'Игорь Волков', role: 'перевозчик, 6 машин', text: 'Загрузка стабильная, оплата приходит вовремя, а отзывы помогают получать заказы дороже.' },
  { initials: 'ДА', name: 'Денис Ахметов', role: 'руководитель склада', text: 'Видим каждую машину на карте и заранее знаем, когда открывать рампу.' },
];
const current = ref(0);
const paused = ref(false);
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value) current.value = (current.value + 1) % quotes.length;
  }, 5500);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.auth {
  /* Страница входа всегда тёмная — поверх ночной сцены */
  --text-primary: #EEF3F1;
  --text-secondary: #A9B5B0;
  --text-muted: #6E7B76;
  --border-color: rgba(255, 255, 255, 0.1);
  --border-strong: rgba(255, 255, 255, 0.18);
  --bg-input: rgba(255, 255, 255, 0.05);
  --bg-card: rgba(255, 255, 255, 0.04);
  --surface-hover: rgba(255, 255, 255, 0.06);
  --accent-color: #2DC071;
  --accent-rgb: 45, 192, 113;
  --text-on-accent: #04130A;

  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #04070B;
  color: var(--text-primary);
  isolation: isolate;
}

.scene {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(4, 7, 11, 0.9) 0%, rgba(4, 7, 11, 0.55) 45%, rgba(4, 7, 11, 0.75) 100%),
    linear-gradient(180deg, rgba(4, 7, 11, 0.4), transparent 30%, rgba(4, 7, 11, 0.6));
}

.auth-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 21px;
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

.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  backdrop-filter: blur(8px);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.back:hover {
  color: var(--accent-color);
  border-color: rgba(var(--accent-rgb), 0.6);
}

.back svg {
  width: 16px;
  height: 16px;
}

.auth-grid {
  display: grid;
  grid-template-columns: 1fr minmax(380px, 470px);
  gap: 64px;
  align-items: center;
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 24px 56px;
  min-height: calc(100vh - 90px);
}

.intro h1 {
  margin: 18px 0 14px;
  font-size: clamp(32px, 4vw, 54px);
  line-height: 1.05;
}

.intro .lead {
  max-width: 520px;
  color: var(--text-secondary);
  font-size: 17px;
}

.perks {
  display: grid;
  gap: 14px;
  margin: 34px 0;
  list-style: none;
}

.perks li {
  display: flex;
  align-items: center;
  gap: 14px;
}

.perks li > span {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 14px;
  background: rgba(var(--accent-rgb), 0.12);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  color: var(--accent-color);
}

.perks svg {
  width: 20px;
  height: 20px;
}

.perks strong {
  display: block;
  font-size: 15px;
}

.perks small {
  color: var(--text-muted);
  font-size: 13px;
}

.quotes {
  max-width: 520px;
  padding: 22px 24px 18px;
  border-radius: var(--radius-lg);
  background: rgba(8, 13, 18, 0.6);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
}

.quote blockquote {
  color: var(--text-primary);
  font-size: 15.5px;
  line-height: 1.6;
}

.quote figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.q-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: var(--text-on-accent);
  font-size: 13px;
  font-weight: 800;
}

.quote strong {
  display: block;
  font-size: 14px;
}

.quote small {
  color: var(--text-muted);
  font-size: 12.5px;
}

.dots {
  display: flex;
  gap: 6px;
  margin-top: 16px;
}

.dots button {
  width: 22px;
  height: 4px;
  border: 0;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  transition: width 0.3s ease, background 0.3s ease;
}

.dots button.on {
  width: 40px;
  background: var(--accent-color);
}

.quote-enter-active,
.quote-leave-active {
  transition: opacity 0.4s ease, transform 0.4s var(--motion-ease-out);
}

.quote-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.quote-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.card {
  padding: 34px 32px;
  border-radius: var(--radius-xl);
  background: rgba(9, 14, 20, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 40px 90px -40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px) saturate(1.3);
  -webkit-backdrop-filter: blur(22px) saturate(1.3);
  animation: card-in 0.7s var(--motion-ease-out) both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
}

@media (max-width: 960px) {
  .auth-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .intro {
    order: 2;
  }

  .quotes {
    display: none;
  }
}

@media (max-width: 560px) {
  .auth-top {
    padding: 16px;
  }

  .back span,
  .back {
    font-size: 13px;
  }

  .auth-grid {
    padding: 8px 16px 40px;
  }

  .card {
    padding: 24px 18px;
  }
}
</style>
