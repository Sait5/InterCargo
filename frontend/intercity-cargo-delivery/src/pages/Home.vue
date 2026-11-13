<template>
  <div class="home" ref="page">
    <Header overlay />

    <!-- ═══ Герой с 3D-картой маршрутов ═══ -->
    <section class="hero">
      <RouteMap3D class="hero-map" :avoid="heroTextRects" @calc="calcFrom" />
      <div class="hero-shade" aria-hidden="true"></div>

      <div class="ic-container hero-inner">
        <div class="hero-copy" ref="heroCopy">
          <span class="ic-eyebrow">Логистическая платформа · с 2010 года</span>
          <h1 class="hero-title">
            Междугородние<br>
            <span class="accent">грузоперевозки</span><br>
            по всей России
          </h1>
          <p class="hero-lead">
            Собственный автопарк, тендеры и спот-аукционы, онлайн-трекинг и страхование
            каждого рейса — от Калининграда до Владивостока.
          </p>
          <div class="hero-cta">
            <a href="#offer" class="ic-btn ic-btn--primary">
              Рассчитать перевозку
              <ArrowRight />
            </a>
            <router-link to="/tracking" class="ic-btn ic-btn--ghost">
              <PackageSearch />
              Отследить груз
            </router-link>
          </div>
        </div>
      </div>

      <a href="#products" class="scroll-hint" aria-label="Прокрутить к продуктам">
        <span></span>
      </a>
    </section>

    <!-- Цифры компании -->
    <section class="stats-band">
      <dl class="ic-container stats">
        <div class="ic-reveal"><dt>{{ years }}</dt><dd>лет на рынке грузоперевозок</dd></div>
        <div class="ic-reveal"><dt>256</dt><dd>собственных тягачей в парке</dd></div>
        <div class="ic-reveal"><dt>5000+</dt><dd>компаний-клиентов</dd></div>
        <div class="ic-reveal"><dt>98%</dt><dd>рейсов доставлено вовремя</dd></div>
      </dl>
    </section>

    <!-- Бегущая строка направлений -->
    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        <span v-for="(r, i) in tickerRoutes.concat(tickerRoutes)" :key="i">{{ r }}</span>
      </div>
    </div>

    <!-- ═══ Продукты ═══ -->
    <section id="products" class="section">
      <div class="ic-container">
        <header class="section-head ic-reveal">
          <span class="ic-eyebrow">Продукты платформы</span>
          <h2>Всё для перевозки — <span class="accent">в одном окне</span></h2>
          <p>Закупайте перевозки, торгуйтесь за горящие рейсы и контролируйте каждую машину без почты и десятка чатов.</p>
        </header>

        <div class="products">
          <router-link v-for="(p, i) in products" :key="p.to" :to="p.to" class="product ic-card ic-reveal" :style="{ transitionDelay: `${i * 80}ms` }">
            <span class="product-icon"><component :is="p.icon" /></span>
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
            <ul>
              <li v-for="f in p.features" :key="f">{{ f }}</li>
            </ul>
            <span class="product-more">Подробнее <ArrowRight /></span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══ Как это работает ═══ -->
    <section class="section section-alt">
      <div class="ic-container">
        <header class="section-head ic-reveal">
          <span class="ic-eyebrow">Как это работает</span>
          <h2>От заявки до документов — <span class="accent">четыре шага</span></h2>
        </header>
        <ol class="steps">
          <li v-for="(s, i) in steps" :key="s.title" class="step ic-reveal" :style="{ transitionDelay: `${i * 90}ms` }">
            <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="step-icon"><component :is="s.icon" /></span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ═══ О компании ═══ -->
    <section class="section">
      <div class="ic-container about">
        <div class="about-copy ic-reveal">
          <span class="ic-eyebrow">О компании</span>
          <h2>Возим сами и <span class="accent">отвечаем за результат</span></h2>
          <p>
            InterCargo — логистическая компания и цифровая платформа. У нас собственный парк тягачей Volvo,
            Scania и MAN, девять офисов по стране и проверенная сеть партнёров-перевозчиков.
          </p>
          <div class="about-facts">
            <div><strong>9</strong><span>офисов: Москва, Санкт-Петербург, Казань и другие</span></div>
            <div><strong>1000+</strong><span>сотрудников и водителей</span></div>
            <div><strong>24/7</strong><span>диспетчерская и поддержка клиентов</span></div>
          </div>
          <router-link to="/about" class="ic-btn ic-btn--ghost">Подробнее о компании <ArrowRight /></router-link>
        </div>
        <div class="about-media ic-reveal">
          <figure class="photo photo-main">
            <img :src="truckRoad" alt="Тягач InterCargo на трассе" loading="lazy" width="1920" height="1280">
          </figure>
          <figure class="photo photo-side">
            <img :src="truckFog" alt="Грузовик в рейсе" loading="lazy" width="680" height="620">
          </figure>
          <div class="photo-badge">
            <ShieldCheck />
            <div><strong>Страхуем каждый рейс</strong><span>до 100% стоимости груза</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Для перевозчиков ═══ -->
    <section class="section carriers-wrap">
      <div class="ic-container">
        <div class="carriers ic-reveal">
          <div class="carriers-copy">
            <span class="ic-eyebrow">Для перевозчиков</span>
            <h2>Загрузка для ваших машин — <span class="accent">без простоев</span></h2>
            <ul>
              <li><Check /> Все грузовладельцы на одной платформе: тендеры, аукционы и прямые заказы</li>
              <li><Check /> Более 70 000 рейсов в год и оплата без задержек</li>
              <li><Check /> Рейтинг и отзывы помогают получать лучшие ставки</li>
            </ul>
          </div>
          <div class="carriers-cta">
            <strong>200 000 ₽+</strong>
            <span>в среднем зарабатывает за год каждая машина партнёра</span>
            <router-link :to="{ path: '/register', query: { type: 'carrier' } }" class="ic-btn ic-btn--primary">Стать перевозчиком <ArrowRight /></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Новости ═══ -->
    <section class="section">
      <div class="ic-container">
        <header class="section-head row ic-reveal">
          <div>
            <span class="ic-eyebrow">Новости</span>
            <h2>Что нового в <span class="accent">InterCargo</span></h2>
          </div>
          <router-link to="/news" class="ic-btn ic-btn--ghost">Все новости <ArrowRight /></router-link>
        </header>
        <div class="news">
          <router-link v-for="(n, i) in news" :key="n.id" :to="`/news#${n.id}`" class="news-card ic-card ic-reveal" :class="{ lead: i === 0 }" :style="{ transitionDelay: `${i * 80}ms` }">
            <div class="news-img">
              <img :src="n.image" :alt="n.title" loading="lazy">
              <span class="news-tag">{{ n.tag }}</span>
            </div>
            <div class="news-body">
              <time :datetime="n.date">{{ formatNewsDate(n.date) }}</time>
              <h3>{{ n.title }}</h3>
              <p>{{ n.excerpt }}</p>
              <span class="news-more">Читать <ArrowRight /></span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══ Калькулятор ═══ -->
    <section id="calc" class="section">
      <div class="ic-container">
        <header class="section-head ic-reveal">
          <span class="ic-eyebrow">Калькулятор</span>
          <h2>Сколько стоит <span class="accent">ваша перевозка</span></h2>
          <p>Выберите маршрут, двигайте ползунки — цена и срок пересчитываются сразу.</p>
        </header>
        <PriceCalculator class="ic-reveal" :preset-from="presetFrom" @request="toOffer" />
      </div>
    </section>

    <!-- ═══ Заявка ═══ -->
    <section id="offer" class="section offer-wrap">
      <div class="ic-container offer">
        <div class="offer-copy ic-reveal">
          <span class="ic-eyebrow">Расчёт за 15 минут</span>
          <h2>Получите <span class="accent">коммерческое предложение</span></h2>
          <p>Оставьте контакты — менеджер уточнит детали груза и пришлёт точную стоимость и сроки.</p>
          <ul class="offer-points">
            <li><Calculator /> Точный расчёт без скрытых платежей</li>
            <li><Clock /> Оптимальные сроки и маршрут</li>
            <li><Headset /> Персональный менеджер на связи 24/7</li>
          </ul>
          <div class="offer-contacts">
            <a href="tel:+79188180890"><Phone /> +7 (918) 818-08-90</a>
            <a href="mailto:info@intercargo.ru"><Mail /> info@intercargo.ru</a>
          </div>
        </div>
        <div class="offer-card ic-card ic-reveal">
          <OfferForm :prefill="offerText" />
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import {
  ArrowRight, PackageSearch, Gavel, Timer, Network, MapPinned, FilePlus2, Handshake, Truck, FileCheck2,
  ShieldCheck, Check, Calculator, Clock, Headset, Phone, Mail,
} from 'lucide-vue-next';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';
import OfferForm from '@/components/OfferForm.vue';
import PriceCalculator from '@/components/PriceCalculator.vue';
import { news, formatNewsDate } from '@/data/news';
import { useReveal } from '@/composables/useReveal';
import truckRoad from '@/assets/images/feedback.webp';
import truckFog from '@/assets/images/popular-truck.webp';

// three.js подгружается отдельным файлом, страница не ждёт его
const RouteMap3D = defineAsyncComponent(() => import('@/components/routeMap/RouteMap3D.vue'));

const page = ref(null);
const offerText = ref('');
const presetFrom = ref('');
// Кнопка в карточке города на карте: подставляем город в калькулятор
const calcFrom = (cityId) => {
  presetFrom.value = '';
  requestAnimationFrame(() => { presetFrom.value = cityId; });
  document.getElementById('calc')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
// Кнопка калькулятора: переносим расчёт в заявку и прокручиваем к форме
const toOffer = (text) => {
  offerText.value = text;
  document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
const heroCopy = ref(null);
useReveal(page);

// Блоки текста героя, под которыми карта не рисует подписи городов
const heroTextRects = () => (heroCopy.value
  ? [...heroCopy.value.querySelectorAll('.hero-title, .hero-lead, .hero-cta, .ic-eyebrow')].map((el) => el.getBoundingClientRect())
  : []);

const years = new Date().getFullYear() - 2010;

const tickerRoutes = [
  'Москва → Санкт-Петербург', 'Москва → Казань', 'Москва → Владивосток', 'Екатеринбург → Новосибирск',
  'Санкт-Петербург → Краснодар', 'Казань → Самара', 'Новосибирск → Красноярск', 'Хабаровск → Владивосток',
];

const products = [
  {
    to: '/transport-tender', icon: Gavel, title: 'Транспортные тендеры',
    text: 'Контроль бюджета и исполнения в TMS.',
    features: ['Аналитический модуль', 'Сквозной процесс «закупка — исполнение»', 'Только проверенные перевозчики'],
  },
  {
    to: '/spot-auctions', icon: Timer, title: 'Спот-аукционы',
    text: 'Закройте горящий рейс за пару кликов.',
    features: ['Все торги в одном окне', 'Закрытые аукционы по приглашению', 'Ставки в реальном времени'],
  },
  {
    to: '/tms', icon: Network, title: 'TMS-система',
    text: 'Интеграция с ERP и автоматизация заказов.',
    features: ['Распределение заказов', 'Отслеживание статусов', 'Аудит логистики'],
  },
  {
    to: '/tracking', icon: MapPinned, title: 'Трекинг грузов',
    text: 'Где ваш груз — в любой момент.',
    features: ['GPS-мониторинг бортов', 'Уведомления о статусе', 'Приложение для клиентов'],
  },
];

const steps = [
  { icon: FilePlus2, title: 'Заявка', text: 'Опишите груз и маршрут — в кабинете или через менеджера.' },
  { icon: Handshake, title: 'Торги', text: 'Перевозчики предлагают цену, вы выбираете лучшую.' },
  { icon: Truck, title: 'Перевозка', text: 'Машина в пути, вы видите её на карте и получаете статусы.' },
  { icon: FileCheck2, title: 'Документы', text: 'Акты и накладные с электронной подписью — сразу в кабинете.' },
];
</script>

<style scoped>
.home {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.accent {
  background: linear-gradient(100deg, var(--accent-color) 10%, var(--accent-2) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ─── Герой ─── */
.hero {
  position: relative;
  min-height: max(760px, 100svh);
  overflow: hidden;
  background:
    radial-gradient(80% 55% at 50% 72%, rgba(45, 192, 113, 0.09), transparent 70%),
    var(--hero-bg);
  color: var(--hero-text);
  isolation: isolate;
}

.hero-map {
  z-index: 0;
}

.hero-shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(60% 34% at 50% 18%, rgba(4, 7, 11, 0.86), transparent 75%),
    linear-gradient(180deg, rgba(4, 7, 11, 0.7) 0%, transparent 26%, transparent 95%, var(--bg-primary) 100%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  padding-top: calc(var(--header-h) + clamp(20px, 5vh, 56px));
  pointer-events: none;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1120px;
  text-align: center;
  pointer-events: auto;
}

.hero-copy > * {
  pointer-events: auto;
}

.hero-title {
  margin: 20px 0 16px;
  font-size: clamp(30px, 3.7vw, 54px);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.035em;
  color: var(--hero-text);
  text-shadow: 0 4px 40px rgba(4, 7, 11, 0.8);
}

.hero-lead {
  max-width: 620px;
  color: var(--hero-muted);
  font-size: 17px;
  line-height: 1.6;
  text-shadow: 0 2px 20px rgba(4, 7, 11, 0.9);
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 26px;
}

.hero .ic-btn--ghost {
  --text-primary: var(--hero-text);
  --border-strong: rgba(255, 255, 255, 0.2);
  background: rgba(4, 7, 11, 0.4);
  backdrop-filter: blur(6px);
}

/* Цифры под героем */
.stats-band {
  position: relative;
  z-index: 2;
  margin-top: -1px;
  background: var(--bg-primary);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  padding-top: 8px;
  padding-bottom: 56px;
}

.stats > div {
  padding: 8px 28px;
  border-left: 1px solid var(--border-color);
}

.stats > div:first-child {
  border-left: 0;
  padding-left: 0;
}

.stats dt {
  font-family: var(--font-display);
  font-size: clamp(32px, 3.6vw, 48px);
  font-weight: 600;
  line-height: 1;
  background: linear-gradient(100deg, var(--text-primary) 30%, var(--accent-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stats dd {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 14.5px;
}

.scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 26px;
  z-index: 3;
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  transform: translateX(-50%);
}

.scroll-hint span {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--accent-color);
  animation: wheel 1.8s ease-in-out infinite;
}

@keyframes wheel {
  0% { transform: translateY(0); opacity: 1; }
  70% { transform: translateY(14px); opacity: 0; }
  100% { opacity: 0; }
}

/* ─── Бегущая строка ─── */
.ticker {
  overflow: hidden;
  border-block: 1px solid var(--border-color);
  background: var(--bg-elevated);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.ticker-track {
  display: flex;
  gap: 48px;
  width: max-content;
  padding: 18px 0;
  animation: ticker 50s linear infinite;
}

.ticker-track span {
  display: inline-flex;
  align-items: center;
  gap: 48px;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.ticker-track span::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
}

@keyframes ticker {
  to { transform: translateX(-50%); }
}

/* ─── Секции ─── */
.section {
  padding: 110px 0;
}

.section-alt {
  background:
    radial-gradient(60% 80% at 50% 0%, rgba(var(--accent-rgb), 0.06), transparent 70%),
    var(--bg-elevated);
  border-block: 1px solid var(--border-color);
}

.section-head {
  max-width: 720px;
  margin-bottom: 56px;
}

.section-head.row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  max-width: none;
}

.section-head h2,
.about-copy h2,
.carriers h2,
.offer-copy h2 {
  margin: 18px 0 14px;
  font-size: clamp(28px, 3.6vw, 46px);
}

.section-head p,
.about-copy p,
.offer-copy p {
  color: var(--text-secondary);
  font-size: 17px;
  line-height: 1.65;
}

/* Продукты */
.products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.product {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.35s var(--motion-ease-out), border-color 0.35s ease, opacity 0.8s var(--motion-ease-out);
}

.product::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(80% 60% at 0% 0%, rgba(var(--accent-rgb), 0.14), transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.product:hover {
  border-color: rgba(var(--accent-rgb), 0.4);
}

.product:hover::before {
  opacity: 1;
}

.product > * {
  position: relative;
}

.product-icon,
.step-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  color: var(--accent-color);
  background: linear-gradient(145deg, rgba(var(--accent-rgb), 0.18), rgba(var(--accent-2-rgb), 0.06));
  border: 1px solid rgba(var(--accent-rgb), 0.25);
}

.product-icon svg,
.step-icon svg {
  width: 24px;
  height: 24px;
}

.product h3 {
  margin: 22px 0 8px;
  font-size: 19px;
}

.product p {
  color: var(--text-secondary);
  font-size: 14.5px;
}

.product ul {
  display: grid;
  gap: 8px;
  margin: 18px 0 24px;
  list-style: none;
}

.product li {
  position: relative;
  padding-left: 18px;
  color: var(--text-secondary);
  font-size: 14px;
}

.product li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: var(--accent-color);
  transform: rotate(45deg);
}

.product-more,
.news-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  color: var(--accent-color);
  font-size: 14px;
  font-weight: 700;
}

.product-more svg,
.news-more svg {
  width: 16px;
  height: 16px;
  transition: transform 0.25s ease;
}

.product:hover .product-more svg,
.news-card:hover .news-more svg {
  transform: translateX(4px);
}

/* Шаги */
.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  list-style: none;
}

.steps::before {
  content: '';
  position: absolute;
  top: 26px;
  left: 6%;
  right: 6%;
  height: 1px;
  background: repeating-linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 0 8px, transparent 8px 16px);
}

.step {
  position: relative;
}

.step-num {
  position: absolute;
  top: -6px;
  right: 0;
  color: var(--border-strong);
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
}

.step-icon {
  position: relative;
  background: var(--bg-elevated);
  box-shadow: 0 0 0 8px var(--bg-elevated);
}

.step h3 {
  margin: 24px 0 8px;
  font-size: 20px;
}

.step p {
  color: var(--text-secondary);
  font-size: 15px;
}

/* О компании */
.about {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 64px;
  align-items: center;
}

.about-facts {
  display: grid;
  gap: 14px;
  margin: 30px 0 34px;
}

.about-facts div {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.about-facts strong {
  min-width: 96px;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 600;
  color: var(--accent-color);
}

.about-facts span {
  color: var(--text-secondary);
}

.about-media {
  position: relative;
  min-height: 480px;
}

.photo {
  position: absolute;
  overflow: hidden;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.8);
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-main {
  inset: 0 18% 14% 0;
}

.photo-side {
  right: 0;
  bottom: 0;
  width: 44%;
  aspect-ratio: 1 / 1.05;
  border: 6px solid var(--bg-primary);
}

.photo-badge {
  position: absolute;
  left: 24px;
  bottom: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--bg-card-solid) 88%, transparent);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.photo-badge svg {
  width: 26px;
  height: 26px;
  color: var(--accent-color);
}

.photo-badge strong {
  display: block;
  font-size: 14.5px;
}

.photo-badge span {
  color: var(--text-muted);
  font-size: 13px;
}

/* Перевозчики */
.carriers-wrap {
  padding-top: 0;
}

.carriers {
  position: relative;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 56px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background:
    radial-gradient(70% 120% at 100% 50%, rgba(var(--accent-rgb), 0.22), transparent 60%),
    linear-gradient(135deg, #0B1A13, #06100C);
  border: 1px solid rgba(var(--accent-rgb), 0.25);
  color: var(--hero-text);
}

.carriers::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(60% 80% at 80% 50%, #000, transparent);
  pointer-events: none;
}

.carriers > * {
  position: relative;
  z-index: 1;
}

.carriers h2 {
  color: var(--hero-text);
}

.carriers ul {
  display: grid;
  gap: 14px;
  margin-top: 24px;
  list-style: none;
}

.carriers li {
  display: flex;
  gap: 12px;
  color: var(--hero-muted);
}

.carriers li svg {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  padding: 3px;
  border-radius: 50%;
  background: rgba(45, 192, 113, 0.18);
  color: #2DC071;
}

.carriers-cta {
  display: grid;
  gap: 10px;
  justify-items: start;
  padding: 32px;
  border-radius: var(--radius-lg);
  background: rgba(4, 7, 11, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.carriers-cta strong {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 600;
  color: #2DC071;
}

.carriers-cta span {
  margin-bottom: 14px;
  color: var(--hero-muted);
}

/* Новости — журнальная сетка: главная новость крупно */
.news {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.news-card {
  position: relative;
  display: grid;
  grid-template-columns: 200px 1fr;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  transition: transform 0.35s var(--motion-ease-out), border-color 0.35s ease, opacity 0.8s var(--motion-ease-out);
}

.news-card:hover {
  border-color: rgba(var(--accent-rgb), 0.45);
}

.news-img {
  position: relative;
  overflow: hidden;
  background: #05080C;
}

.news-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.8s var(--motion-ease-out);
}

.news-card:hover .news-img img {
  transform: scale(1.06);
}

.news-tag {
  position: absolute;
  left: 14px;
  top: 14px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(4, 7, 11, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #F2F6F4;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.news-body {
  display: flex;
  flex-direction: column;
  padding: 22px 24px;
}

.news-body time {
  color: var(--text-muted);
  font-size: 13px;
}

.news-body h3 {
  margin: 8px 0;
  font-size: 18px;
  line-height: 1.3;
}

.news-body p {
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 14.5px;
}

/* Главная новость: картинка на всю карточку, текст поверх */
.news-card.lead {
  grid-row: span 2;
  grid-template-columns: 1fr;
  align-content: end;
  min-height: 440px;
  border-color: rgba(var(--accent-rgb), 0.25);
}

.news-card.lead .news-img {
  position: absolute;
  inset: 0;
}

.news-card.lead .news-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(4, 7, 11, 0) 25%, rgba(4, 7, 11, 0.92) 100%);
}

.news-card.lead .news-body {
  position: relative;
  justify-content: flex-end;
  padding: 32px;
  color: #F2F6F4;
}

.news-card.lead .news-body h3 {
  font-size: clamp(22px, 2.4vw, 30px);
  color: #F2F6F4;
}

.news-card.lead .news-body p {
  max-width: 520px;
  color: rgba(242, 246, 244, 0.75);
  font-size: 16px;
}

.news-card.lead .news-body time {
  color: rgba(242, 246, 244, 0.6);
}

/* Заявка */
.offer-wrap {
  background:
    radial-gradient(50% 70% at 0% 50%, rgba(var(--accent-rgb), 0.08), transparent 70%),
    var(--bg-elevated);
  border-top: 1px solid var(--border-color);
}

.offer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.offer-points {
  display: grid;
  gap: 14px;
  margin: 28px 0;
  list-style: none;
}

.offer-points li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.offer-points svg {
  width: 20px;
  height: 20px;
  color: var(--accent-color);
}

.offer-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.offer-contacts a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 700;
  text-decoration: none;
}

.offer-contacts a:hover {
  color: var(--accent-color);
}

.offer-contacts svg {
  width: 18px;
  height: 18px;
  color: var(--accent-color);
}

.offer-card {
  padding: 32px;
  background: var(--bg-card-solid);
}

/* ─── Адаптив ─── */
@media (max-width: 1100px) {
  .products {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 44px;
  }

  .steps::before {
    display: none;
  }
}

@media (max-width: 960px) {
  .about,
  .offer,
  .carriers {
    grid-template-columns: 1fr;
  }

  .about-media {
    min-height: 420px;
  }

  .news {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .news-card.lead {
    grid-row: auto;
    min-height: 380px;
  }

  .carriers {
    padding: 40px 28px;
  }
}

@media (max-width: 760px) {
  .hero {
    min-height: max(640px, 100svh);
  }

  .stats {
    grid-template-columns: 1fr 1fr;
    row-gap: 28px;
  }

  .stats > div:nth-child(3) {
    border-left: 0;
    padding-left: 0;
  }

  .stats > div {
    padding: 4px 16px;
  }

  .scroll-hint {
    display: none;
  }

  .section {
    padding: 72px 0;
  }

  .section-head.row {
    flex-direction: column;
    align-items: flex-start;
  }

  .products,
  .news,
  .steps {
    grid-template-columns: 1fr;
  }

  .news-card:not(.lead) {
    grid-template-columns: 1fr;
  }

  .news-card:not(.lead) .news-img {
    aspect-ratio: 16 / 9;
  }

  .about-media {
    min-height: 340px;
  }

  .photo-badge {
    left: 12px;
    bottom: 20px;
  }

  .offer-card {
    padding: 22px;
  }
}
</style>
