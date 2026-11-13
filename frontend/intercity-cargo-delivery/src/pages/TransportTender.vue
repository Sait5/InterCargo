<template>
  <div class="saas-landing tnd">
    <Header />

    <main>
      <!-- ─── Шапка: живые торги ─── -->
      <section class="hero tnd-hero">
        <HeroBackdrop view="tender-ship" side="left" />
        <div class="container tnd-hero__grid">
          <div class="tnd-hero__text">
            <span class="ic-eyebrow tnd-in" style="--d: 0ms">Транспортные тендеры</span>
            <h1 class="tnd-in" style="--d: 90ms">Перевозчики <span class="ic-accent">соревнуются</span> — вы экономите</h1>
            <p class="tnd-hero__lead tnd-in" style="--d: 180ms">
              Выставьте направление и объём — проверенные перевозчики предложат цены, а вы выберете лучшее предложение
              по цене, срокам и рейтингу. Без звонков и таблиц в почте.
            </p>
            <div class="tnd-hero__actions tnd-in" style="--d: 270ms">
              <button v-if="!userStore.isAdmin" type="button" class="ic-btn ic-btn--primary" @click="openCreateOrder">
                Создать тендер <ArrowRight />
              </button>
              <RouterLink v-else to="/orders" class="ic-btn ic-btn--primary">Управление заказами <ArrowRight /></RouterLink>
              <button type="button" class="ic-btn ic-btn--ghost tnd-ghost" @click="scrollToOrders">Смотреть лоты</button>
            </div>
            <dl class="tnd-stats tnd-in" style="--d: 360ms">
              <div v-for="st in stats" :key="st.label" class="hero-stat">
                <dt><strong>{{ st.value }}</strong></dt>
                <dd>{{ st.label }}</dd>
              </div>
            </dl>
          </div>

          <!-- Живой лот: ставки приходят сами, цена снижается -->
          <aside class="live tnd-in" style="--d: 300ms" aria-label="Пример торгов">
            <div class="live__head">
              <span class="live__dot"></span>
              <span>Идут торги</span>
              <span class="live__timer"><Timer />{{ timerText }}</span>
            </div>
            <div class="live__lot">
              <div class="live__route">{{ lot.route }}</div>
              <div class="live__meta">{{ lot.cargo }} · старт {{ formatPrice(lot.start) }}</div>
            </div>
            <div class="live__price">
              <div>
                <span class="live__label">Лучшая ставка</span>
                <strong :key="best">{{ formatPrice(best) }}</strong>
              </div>
              <div class="live__save">
                <span class="live__label">Экономия</span>
                <strong>−{{ savedPct }}%</strong>
              </div>
            </div>
            <div class="live__bar"><i :style="{ width: Math.min(100, savedPct * 4) + '%' }"></i></div>
            <TransitionGroup name="bid" tag="ul" class="live__bids">
              <li v-for="(b, i) in bids" :key="b.id" :class="{ top: i === 0 }">
                <span class="live__avatar">{{ b.name[0] }}</span>
                <span class="live__who">{{ b.name }}<small>рейтинг {{ b.rating }}</small></span>
                <span class="live__bid">{{ formatPrice(b.price) }}</span>
              </li>
            </TransitionGroup>
            <p class="live__note">Пример торгов — так выглядит ваш лот в системе</p>
          </aside>
        </div>
      </section>

      <!-- ─── Как устроен тендер ─── -->
      <section class="tnd-steps">
        <div class="container">
          <div class="section-head">
            <span class="ic-eyebrow">Как это работает</span>
            <h2>Четыре шага от лота <span class="ic-accent">до договора</span></h2>
          </div>
          <ol class="steps-grid">
            <li v-for="(s, i) in steps" :key="s.title" class="step-card">
              <div class="step-card__top">
                <span class="step-card__icon"><component :is="s.icon" /></span>
                <span class="step-card__num">0{{ i + 1 }}</span>
              </div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- ─── Лоты ─── -->
      <section id="orders" ref="ordersSection" class="tnd-board">
        <div class="container">
          <div class="board-head">
            <div>
              <span class="ic-eyebrow">Лоты</span>
              <h2>{{ userStore.isAdmin ? 'Все заказы' : 'Открытые лоты' }}</h2>
              <p v-if="showingExamples" class="board-hint">
                Сейчас здесь <b>примеры</b>.
                <template v-if="!userStore.isAuthenticated">Войдите как перевозчик, чтобы видеть реальные лоты и подавать заявки.</template>
                <template v-else>Как только заказчики опубликуют лоты, они появятся здесь.</template>
              </p>
            </div>
            <div class="board-tools">
              <label class="board-search">
                <Search />
                <input v-model.trim="search" type="text" placeholder="Поиск по направлению" aria-label="Поиск по направлению">
              </label>
            </div>
          </div>

          <div class="chips" role="tablist" aria-label="Тип груза">
            <button
              v-for="f in filters"
              :key="f.label"
              type="button"
              class="chip"
              :class="{ on: type === f.value }"
              @click="type = f.value"
            >{{ f.label }}</button>
          </div>

          <TransitionGroup name="lot" tag="div" class="lots">
            <article v-for="order in filteredOrders" :key="order.id" class="lot">
              <div class="lot__route">
                <span class="lot__pin"><MapPin /></span>
                <div>
                  <h3>{{ order.route }}</h3>
                  <span class="lot__sub">
                    <span class="badge" :class="badgeClass(order.type)">{{ order.type }}</span>
                    <span v-if="order.example" class="badge badge--example">Пример</span>
                    <span class="lot__access"><component :is="order.accessType === 'private' ? Lock : Globe" />{{ order.accessType === 'private' ? 'Личный' : 'Общий' }}</span>
                  </span>
                </div>
              </div>
              <dl class="lot__facts">
                <div><dt>Объём</dt><dd>{{ order.volume }}</dd></div>
                <div><dt>Период</dt><dd>{{ formatDate(order.dateFrom) }} — {{ formatDate(order.dateTo) }}</dd></div>
                <div><dt>Участники</dt><dd>{{ order.applicants?.length || 0 }}</dd></div>
              </dl>
              <div class="lot__price">
                <span>Начальная цена</span>
                <strong>{{ formatPrice(order.price) }}</strong>
              </div>
              <div class="lot__action">
                <span v-if="hasApplied(order.id)" class="applied"><Check />Заявка подана</span>
                <button v-else type="button" class="ic-btn ic-btn--primary lot__btn" @click="applyToOrder(order)">
                  Участвовать
                </button>
              </div>
            </article>
          </TransitionGroup>

          <div v-if="filteredOrders.length === 0" class="empty">
            <Search />
            <p class="empty__title">Ничего не нашлось</p>
            <p>Измените фильтр или поиск{{ userStore.isAdmin ? '' : ' — или создайте свой лот' }}.</p>
            <button v-if="!userStore.isAdmin" type="button" class="ic-btn ic-btn--ghost" @click="openCreateOrder">Создать тендер</button>
          </div>
        </div>
      </section>

      <!-- ─── Калькулятор экономии ─── -->
      <section class="tnd-save is-dark">
        <div class="container save-grid">
          <div>
            <span class="ic-eyebrow">Экономия</span>
            <h2>Сколько вы сэкономите <span class="ic-accent">за год</span></h2>
            <p class="save-lead">
              В среднем тендеры InterCargo снижают расходы на перевозки на 12–25%. Передвиньте ползунок — посчитаем для вашего бюджета.
            </p>
          </div>
          <div class="save-card">
            <label class="save-card__label" for="budget">Бюджет на перевозки в год</label>
            <div class="save-card__budget">{{ budget }} млн ₽</div>
            <input id="budget" v-model.number="budget" type="range" min="1" max="300" step="1" class="range" :style="{ '--fill': ((budget - 1) / 299) * 100 + '%' }">
            <div class="save-card__scale"><span>1 млн</span><span>300 млн</span></div>
            <div class="save-card__result">
              <div>
                <span>Ожидаемая экономия</span>
                <strong>≈ {{ savingText }}</strong>
              </div>
              <div>
                <span>Диапазон</span>
                <b>{{ rangeText }}</b>
              </div>
            </div>
            <button v-if="!userStore.isAdmin" type="button" class="ic-btn ic-btn--primary save-card__btn" @click="openCreateOrder">
              Запустить первый тендер <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      <!-- ─── Возможности ─── -->
      <section class="tnd-features">
        <div class="container">
          <div class="section-head">
            <span class="ic-eyebrow">Возможности</span>
            <h2>Почему тендеры через <span class="ic-accent">InterCargo</span></h2>
          </div>
          <div class="feature-grid">
            <RouterLink v-for="f in features" :key="f.slug" :to="`/feature/${f.slug}`" class="feature-card">
              <div class="feature-card__img"><img :src="photo(f.photo)" alt="" loading="lazy" decoding="async"></div>
              <div class="feature-card__body">
                <h3>{{ f.title }}</h3>
                <p>{{ f.text }}</p>
                <span class="feature-card__more">Подробнее <ArrowRight /></span>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- ─── Вопросы ─── -->
      <section class="tnd-faq">
        <div class="container faq-wrap">
          <div class="section-head section-head--left">
            <span class="ic-eyebrow">Вопросы</span>
            <h2>Часто <span class="ic-accent">спрашивают</span></h2>
          </div>
          <div class="faq-list">
            <div v-for="(q, i) in faq" :key="q.q" class="faq-item" :class="{ open: openFaq === i }">
              <button type="button" class="faq-item__q" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? -1 : i">
                {{ q.q }}<Plus class="faq-item__icon" />
              </button>
              <div class="faq-item__a"><div><p>{{ q.a }}</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Призыв ─── -->
      <section class="tnd-cta-wrap">
        <div class="container">
          <div class="cta-card tnd-cta">
            <div>
              <h2>Готовы снизить расходы на логистику?</h2>
              <p>Первый тендер — бесплатно. Создайте лот за 5 минут, предложения начнут приходить в тот же день.</p>
            </div>
            <div class="tnd-cta__actions">
              <button v-if="!userStore.isAdmin" type="button" class="ic-btn ic-btn--primary" @click="openCreateOrder">Создать тендер <ArrowRight /></button>
              <RouterLink to="/contacts?topic=partnership" class="ic-btn ic-btn--ghost">Обсудить с менеджером</RouterLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ─── Создание заказа ─── -->
    <Transition name="modal">
      <div v-if="showCreateOrderModal" class="modal" @click.self="closeCreateOrder">
        <form class="modal__card" @submit.prevent="submitOrder">
          <div class="modal__head">
            <h2>Новый тендер</h2>
            <button type="button" class="modal__close" aria-label="Закрыть" @click="closeCreateOrder"><X /></button>
          </div>

          <div class="access">
            <button type="button" class="access__opt" :class="{ on: newOrder.accessType === 'public' }" @click="newOrder.accessType = 'public'">
              <Globe />
              <span><b>Общий</b><small>Видят все перевозчики</small></span>
            </button>
            <button type="button" class="access__opt" :class="{ on: newOrder.accessType === 'private' }" @click="newOrder.accessType = 'private'">
              <Lock />
              <span><b>Личный</b><small>Только выбранные перевозчики</small></span>
            </button>
          </div>

          <div class="form-row">
            <label class="field">
              <span>Откуда</span>
              <select v-model="newOrder.from" class="ic-input" required>
                <option value="">Город отправления</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </label>
            <label class="field">
              <span>Куда</span>
              <select v-model="newOrder.to" class="ic-input" required>
                <option value="">Город назначения</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </label>
          </div>
          <div class="form-row">
            <label class="field">
              <span>Тип груза</span>
              <select v-model="newOrder.type" class="ic-input" required>
                <option value="">Выберите тип</option>
                <option v-for="f in filters.slice(1)" :key="f.value" :value="f.value">{{ f.value }}</option>
              </select>
            </label>
            <label class="field">
              <span>Объём</span>
              <input v-model="newOrder.volume" class="ic-input" type="text" placeholder="Например: 120 т/мес" required>
            </label>
          </div>
          <div class="form-row">
            <label class="field">
              <span>Начало</span>
              <input v-model="newOrder.dateFrom" class="ic-input" type="date" :min="today" required>
            </label>
            <label class="field">
              <span>Окончание</span>
              <input v-model="newOrder.dateTo" class="ic-input" type="date" :min="newOrder.dateFrom || today" required>
            </label>
          </div>
          <label class="field">
            <span>Начальная цена, ₽</span>
            <input v-model="newOrder.price" class="ic-input" type="number" inputmode="numeric" min="1" step="1" placeholder="Например: 85000" required @keydown="blockLetters">
          </label>

          <div class="modal__actions">
            <button type="button" class="ic-btn ic-btn--ghost" @click="closeCreateOrder">Отмена</button>
            <button type="submit" class="ic-btn ic-btn--primary" :disabled="saving">{{ saving ? 'Создаём…' : 'Опубликовать' }}</button>
          </div>
        </form>
      </div>
    </Transition>

    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowRight, Timer, Search, MapPin, Lock, Globe, Check, Plus, X, FilePlus2, ShieldCheck, Users, FileSignature,
} from 'lucide-vue-next';
import HeroBackdrop from '@/ui/HeroBackdrop.vue';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';
import { exampleOrders } from '@/data/examples';

const orderStore = useOrderStore();
const userStore = useUserStore();
const toast = useToastStore();
const route = useRoute();
const router = useRouter();

// Фото (Pexels, см. docs/CREDITS.md)
const photos = Object.fromEntries(
  Object.entries(import.meta.glob('@/assets/photos/*.webp', { eager: true, import: 'default' }))
    .map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url]),
);
const photo = (name) => photos[name];

const formatPrice = (price) => {
  const num = Number.parseInt(price, 10);
  return Number.isNaN(num) ? price : `${num.toLocaleString('ru-RU')} ₽`;
};
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : '');

const stats = [
  { value: '1 200+', label: 'тендеров проведено' },
  { value: '18%', label: 'средняя экономия' },
  { value: '500+', label: 'перевозчиков' },
];

// ─── Живой лот в шапке ───
const lot = { route: 'Москва — Казань', cargo: 'Стройматериалы, 20 т', start: 85000 };
const carriers = [
  ['ВолковТранс', 4.9], ['СибЛогистик', 4.8], ['РефЛайн', 4.7], ['ГрузоТех', 4.9], ['АвтоФрахт', 4.6],
  ['КаргоПро', 4.8], ['МегаТранс', 4.7], ['ЛогистикПлюс', 4.5],
];
let bidId = 0;
const bid = ([name, rating], price) => {
  bidId += 1;
  return { id: bidId, name, rating, price };
};
const bids = ref([bid(carriers[3], 81500), bid(carriers[1], 83000), bid(carriers[0], 84200)]);
// новая ставка — всегда от другого перевозчика, чем предыдущая
const makeBid = (price) => {
  const pool = carriers.filter(([n]) => n !== bids.value[0]?.name);
  return bid(pool[Math.floor(Math.random() * pool.length)], price);
};
const best = computed(() => bids.value[0]?.price || lot.start);
const savedPct = computed(() => Math.round((1 - best.value / lot.start) * 100));
const timerLeft = ref(14 * 60 + 32);
const timerText = computed(() => `${String(Math.floor(timerLeft.value / 60)).padStart(2, '0')}:${String(timerLeft.value % 60).padStart(2, '0')}`);
let bidTimer = 0;
let clockTimer = 0;
const tickBid = () => {
  if (document.hidden) return;
  // торги «перезапускаются», когда цена упала на ~22%
  if (best.value < lot.start * 0.78) {
    bids.value = [makeBid(82000 + Math.round(Math.random() * 2000))];
    return;
  }
  const step = 300 + Math.round(Math.random() * 1400);
  bids.value = [makeBid(Math.round((best.value - step) / 100) * 100), ...bids.value].slice(0, 4);
};

// ─── Шаги ───
const steps = [
  { icon: FilePlus2, title: 'Создайте лот', text: 'Направление, объём, сроки и стартовая цена — форма заполняется за 5 минут.' },
  { icon: ShieldCheck, title: 'Проверка', text: 'Модератор проверяет лот, общий публикуется для всех перевозчиков, личный — сразу.' },
  { icon: Users, title: 'Предложения', text: 'Перевозчики подают заявки, вы сравниваете цены, сроки и рейтинги в одном окне.' },
  { icon: FileSignature, title: 'Договор', text: 'Выбираете победителя, открывается чат и документы — дальше контроль исполнения.' },
];

// ─── Лоты ───
const filters = [
  { label: 'Все', value: '' },
  { label: 'Сборные', value: 'Сборные' },
  { label: 'Рефрижераторные', value: 'Рефрижераторные' },
  { label: 'Негабарит', value: 'Негабарит' },
  { label: 'Стандартные', value: 'Стандартные' },
];
const search = ref('');
const type = ref('');
const ordersSection = ref(null);

// Показательные лоты с типами из фильтра
const examples = exampleOrders.map((o, i) => ({ ...o, type: ['Стандартные', 'Сборные', 'Рефрижераторные'][i] || 'Стандартные' }));
const realOrders = computed(() => orderStore.activeOrders);
const showingExamples = computed(() => realOrders.value.length === 0);
const orders = computed(() => (showingExamples.value ? examples : realOrders.value));
const filteredOrders = computed(() => {
  const s = search.value.toLowerCase();
  return orders.value.filter((o) => (!s || o.route.toLowerCase().includes(s)) && (!type.value || o.type === type.value));
});
const badgeClass = (t) => ({ Негабарит: 'badge--hot', Рефрижераторные: 'badge--cold' }[t] || 'badge--std');
const hasApplied = (id) => Boolean(userStore.user) && orderStore.hasApplied(id, userStore.user.id);

const applyToOrder = async (order) => {
  if (order.example) {
    toast.success('Это пример лота. Реальные лоты появятся здесь после публикации заказчиками.');
    return;
  }
  if (!userStore.isAuthenticated) {
    toast.error('Войдите как перевозчик, чтобы участвовать');
    router.push({ path: '/login', query: { redirect: '/transport-tender' } });
    return;
  }
  if (!userStore.isCarrier) {
    toast.error('Подавать заявки могут только перевозчики');
    return;
  }
  const res = await orderStore.applyToOrder(order.id);
  if (res.success) toast.success('Заявка отправлена — ответ придёт в уведомления');
  else toast.error(res.message || 'Не удалось отправить заявку');
};

const scrollToOrders = () => ordersSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });

// ─── Экономия ───
const budget = ref(40);
const fmtMln = (v) => (v >= 1 ? `${v.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} млн ₽` : `${Math.round(v * 1000).toLocaleString('ru-RU')} тыс. ₽`);
const shown = ref(budget.value * 0.18);
let tween = 0;
watch(budget, (v) => {
  cancelAnimationFrame(tween);
  const from = shown.value;
  const to = v * 0.18;
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 450);
    shown.value = from + (to - from) * (1 - (1 - k) ** 3);
    if (k < 1) tween = requestAnimationFrame(step);
  };
  tween = requestAnimationFrame(step);
});
const savingText = computed(() => `${fmtMln(shown.value)} в год`);
const rangeText = computed(() => `${fmtMln(budget.value * 0.12)} — ${fmtMln(budget.value * 0.25)}`);

// ─── Возможности ───
const features = [
  { slug: 'analytics', photo: 'analytics-office', title: 'Аналитика ставок', text: 'Сравнительные отчёты, прогноз ставок и KPI перевозчиков в одном окне.' },
  { slug: 'end-to-end', photo: 'process-forklift', title: 'Сквозной процесс', text: 'От заявки до закрывающих документов — с выгрузкой в вашу ERP.' },
  { slug: 'independence', photo: 'independence-port', title: 'Честный выбор', text: 'Правила торгов исключают сговор и конфликт интересов.' },
  { slug: 'verified', photo: 'verified-truck', title: 'Проверенные перевозчики', text: 'Только компании, прошедшие проверку документов и истории.' },
];

const faq = [
  { q: 'Чем общий лот отличается от личного?', a: 'Общий лот видят все проверенные перевозчики платформы, он публикуется после проверки модератором. Личный — только приглашённые вами перевозчики, он активируется сразу.' },
  { q: 'Как формируется цена?', a: 'Вы задаёте стартовую цену, перевозчики предлагают свою в заявках. Вы видите все предложения и выбираете лучшее не только по цене, но и по срокам и рейтингу.' },
  { q: 'Можно указать особые требования?', a: 'Да: тип кузова, температурный режим, сроки подачи, страхование и требования к документам — всё это указывается в лоте.' },
  { q: 'Как быстро находится исполнитель?', a: 'Первые предложения обычно приходят в течение часа. Выбор победителя занимает от нескольких часов до 1–3 дней — зависит от вас.' },
  { q: 'Сколько это стоит?', a: 'Первый тендер бесплатный. Дальше — по тарифу «Постоянный клиент» или индивидуальным условиям для крупного бизнеса.' },
];
const openFaq = ref(0);

// ─── Создание заказа ───
const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Красноярск', 'Екатеринбург', 'Казань', 'Самара', 'Владивосток', 'Ростов-на-Дону', 'Нижний Новгород', 'Челябинск', 'Уфа', 'Пермь', 'Воронеж', 'Волгоград', 'Краснодар'];
const today = new Date().toISOString().slice(0, 10);
const blank = () => ({ accessType: 'public', from: '', to: '', type: '', volume: '', dateFrom: '', dateTo: '', price: '' });
const newOrder = reactive(blank());
const showCreateOrderModal = ref(false);
const saving = ref(false);

const openCreateOrder = () => {
  if (!userStore.isAuthenticated) {
    toast.error('Войдите в аккаунт, чтобы создать тендер');
    router.push({ path: '/login', query: { redirect: '/transport-tender?create=1' } });
    return;
  }
  if (userStore.isAdmin) {
    toast.error('Администраторы не создают заказы');
    return;
  }
  if (userStore.isCarrier) {
    toast.error('Тендеры создают заказчики. Перевозчики участвуют в лотах ниже.');
    scrollToOrders();
    return;
  }
  showCreateOrderModal.value = true;
};
const closeCreateOrder = () => {
  showCreateOrderModal.value = false;
  Object.assign(newOrder, blank());
};
const blockLetters = (e) => {
  if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
};
const submitOrder = async () => {
  if (newOrder.from === newOrder.to) return toast.error('Города отправления и назначения должны отличаться');
  if (new Date(newOrder.dateFrom) > new Date(newOrder.dateTo)) return toast.error('Дата начала не может быть позже окончания');
  if (!(Number.parseInt(newOrder.price, 10) > 0)) return toast.error('Укажите корректную начальную цену');
  saving.value = true;
  const u = userStore.user || {};
  const res = await orderStore.createOrder({
    route: `${newOrder.from} — ${newOrder.to}`,
    from: newOrder.from,
    to: newOrder.to,
    type: newOrder.type,
    volume: newOrder.volume,
    dateFrom: newOrder.dateFrom,
    dateTo: newOrder.dateTo,
    price: Number.parseInt(newOrder.price, 10),
    accessType: newOrder.accessType,
    createdBy: u.id,
    customerName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
    customerPhone: u.phone || '',
    customerEmail: u.email || '',
  });
  saving.value = false;
  if (!res.success) return toast.error(res.message || 'Не удалось создать тендер');
  toast.success(newOrder.accessType === 'private' ? 'Личный лот создан и уже активен' : 'Лот отправлен на проверку модератору');
  closeCreateOrder();
  return null;
};

const onKey = (e) => { if (e.key === 'Escape' && showCreateOrderModal.value) closeCreateOrder(); };

onMounted(() => {
  orderStore.fetchOrders();
  if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) bidTimer = setInterval(tickBid, 2600);
  clockTimer = setInterval(() => { timerLeft.value = timerLeft.value > 0 ? timerLeft.value - 1 : 15 * 60; }, 1000);
  window.addEventListener('keydown', onKey);
  // ссылка «Создать заказ» из кабинета ведёт сюда с ?create=1
  if (route.query.create) {
    router.replace({ query: {} });
    openCreateOrder();
  }
});
onBeforeUnmount(() => {
  clearInterval(bidTimer);
  clearInterval(clockTimer);
  cancelAnimationFrame(tween);
  window.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
.tnd { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; overflow-x: hidden; }
.container { max-width: var(--container, 1200px); margin: 0 auto; padding: 0 24px; }
section { padding: 110px 0; }
.ic-btn svg { width: 18px; height: 18px; }

.section-head { max-width: 760px; margin: 0 auto 56px; text-align: center; }
.section-head h2, .board-head h2 { font-size: clamp(30px, 4vw, 46px); margin: 18px 0 14px; color: var(--text-primary); }
.section-head p { color: var(--text-secondary); font-size: 17px; }
.section-head--left { margin: 0; text-align: left; }

.tnd-in { opacity: 0; animation: tnd-in 0.9s var(--motion-ease-out) var(--d, 0ms) forwards; }
@keyframes tnd-in { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: none; } }

/* ─── Шапка ─── */
.tnd-hero { position: relative; overflow: hidden; padding: calc(var(--header-h) + 64px) 0 80px; min-height: min(880px, 100vh); display: flex; align-items: center; background: var(--hero-bg); color: #F2F6F4; }
.tnd-hero > .container { position: relative; z-index: 2; width: 100%; }
.tnd-hero__grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 56px; align-items: center; }
.tnd-hero h1 { font-size: clamp(36px, 5vw, 62px); line-height: 1.05; margin: 22px 0; color: #fff; }
.tnd-hero__lead { max-width: 540px; font-size: 18px; line-height: 1.6; color: rgba(242, 246, 244, 0.78); }
.tnd-hero__actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px; }
.tnd-ghost { color: #F2F6F4; border-color: rgba(255, 255, 255, 0.25); background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(10px); }
.tnd-stats { display: flex; gap: 36px; flex-wrap: wrap; margin-top: 44px; padding-top: 28px; border-top: 1px solid rgba(255, 255, 255, 0.12); }
.tnd-stats strong { display: block; font-family: var(--font-display); font-size: 34px; line-height: 1; color: #fff; }
.tnd-stats dd { margin-top: 8px; font-size: 13px; color: rgba(242, 246, 244, 0.6); }

.live { padding: 22px; border-radius: 24px; background: rgba(8, 13, 18, 0.72); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.8); }
.live__head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: rgba(242, 246, 244, 0.8); }
.live__dot { width: 8px; height: 8px; border-radius: 50%; background: #2DC071; box-shadow: 0 0 0 0 rgba(45, 192, 113, 0.6); animation: live-ping 1.8s ease-out infinite; }
@keyframes live-ping { 0% { box-shadow: 0 0 0 0 rgba(45, 192, 113, 0.6); } 100% { box-shadow: 0 0 0 10px rgba(45, 192, 113, 0); } }
.live__timer { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: rgba(242, 184, 75, 0.12); color: #F2B84B; font-variant-numeric: tabular-nums; }
.live__timer svg { width: 14px; height: 14px; }
.live__lot { margin: 18px 0 16px; }
.live__route { font-family: var(--font-display); font-size: 22px; color: #fff; }
.live__meta { font-size: 13px; color: rgba(242, 246, 244, 0.55); margin-top: 4px; }
.live__price { display: flex; justify-content: space-between; align-items: flex-end; padding: 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06); }
.live__label { display: block; font-size: 12px; color: rgba(242, 246, 244, 0.5); margin-bottom: 4px; }
.live__price strong { font-family: var(--font-display); font-size: 30px; color: #2DC071; font-variant-numeric: tabular-nums; animation: live-flash 0.8s ease; }
@keyframes live-flash { from { color: #fff; text-shadow: 0 0 18px rgba(45, 192, 113, 0.9); } to { color: #2DC071; text-shadow: none; } }
.live__save { text-align: right; }
.live__save strong { font-size: 22px; color: #F2B84B; animation: none; }
.live__bar { height: 4px; margin: 12px 0 14px; border-radius: 4px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.live__bar i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2DC071, #F2B84B); transition: width 0.8s var(--motion-ease-out); }
.live__bids { list-style: none; display: flex; flex-direction: column; gap: 6px; min-height: 212px; }
.live__bids li { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid transparent; }
.live__bids li.top { border-color: rgba(45, 192, 113, 0.35); background: rgba(45, 192, 113, 0.08); }
.live__avatar { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: rgba(60, 200, 216, 0.14); color: #3CC8D8; font-weight: 800; }
.live__who { display: flex; flex-direction: column; font-weight: 700; font-size: 14px; color: #F2F6F4; }
.live__who small { font-weight: 500; font-size: 12px; color: rgba(242, 246, 244, 0.45); }
.live__bid { font-weight: 800; font-variant-numeric: tabular-nums; color: #F2F6F4; }
.live__note { margin-top: 12px; font-size: 12px; color: rgba(242, 246, 244, 0.4); text-align: center; }
.bid-enter-active { transition: opacity 0.6s ease, filter 0.6s ease; }
.bid-leave-active { transition: opacity 0.3s ease; position: absolute; visibility: hidden; }
.bid-enter-from { opacity: 0; filter: blur(6px); }
.bid-leave-to { opacity: 0; }

/* ─── Шаги ─── */
.steps-grid { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; counter-reset: s; }
.step-card { position: relative; padding: 26px 24px; border-radius: 22px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: var(--shadow-card); }
.step-card:not(:last-child)::after { content: ''; position: absolute; top: 48px; right: -17px; width: 18px; height: 2px; background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.6), transparent); }
.step-card__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
.step-card__icon { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 15px; background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); }
.step-card__icon svg { width: 24px; height: 24px; }
.step-card__num { font-family: var(--font-display); font-size: 34px; color: rgba(var(--accent-rgb), 0.18); }
.step-card h3 { font-size: 20px; margin-bottom: 8px; }
.step-card p { font-size: 14.5px; line-height: 1.6; color: var(--text-secondary); }

/* ─── Лоты ─── */
.tnd-board { background: var(--bg-elevated, var(--bg-primary)); }
.board-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 22px; }
.board-head h2 { margin-bottom: 6px; }
.board-hint { max-width: 620px; color: var(--text-secondary); }
.board-hint b { color: var(--warm, #F2B84B); }
.board-search { display: flex; align-items: center; gap: 10px; height: 48px; padding: 0 16px; min-width: 300px; border-radius: 999px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-muted); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.board-search:focus-within { border-color: rgba(var(--accent-rgb), 0.6); box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1); }
.board-search svg { width: 18px; height: 18px; flex-shrink: 0; }
.board-search input { flex: 1; border: 0; outline: none; background: none; color: var(--text-primary); font-size: 15px; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
.chip { height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-secondary); font-weight: 700; font-size: 14px; cursor: pointer; transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
.chip:hover { border-color: rgba(var(--accent-rgb), 0.45); color: var(--text-primary); }
.chip.on { background: var(--accent-color); border-color: var(--accent-color); color: var(--text-on-accent, #04120A); }
.lots { display: flex; flex-direction: column; gap: 10px; }
.lot { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 0.8fr) auto; gap: 24px; align-items: center; padding: 20px 22px; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border-color); transition: border-color 0.25s ease, box-shadow 0.25s ease; }
.lot:hover { border-color: rgba(var(--accent-rgb), 0.4); }
.lot__route { display: flex; gap: 14px; align-items: center; min-width: 0; }
.lot__pin { display: grid; place-items: center; flex-shrink: 0; width: 44px; height: 44px; border-radius: 14px; background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); }
.lot__pin svg { width: 20px; height: 20px; }
.lot h3 { font-size: 17px; margin-bottom: 6px; font-family: var(--font-body); }
.lot__sub { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.badge { padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.badge--std { background: rgba(var(--accent-rgb), 0.12); color: var(--accent-color); }
.badge--cold { background: rgba(60, 200, 216, 0.14); color: #1FA3B3; }
.badge--hot { background: rgba(229, 72, 77, 0.12); color: #E5484D; }
.badge--example { background: rgba(242, 184, 75, 0.16); color: #C98A12; }
.lot__access { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); }
.lot__access svg { width: 13px; height: 13px; }
.lot__facts { display: grid; grid-template-columns: 0.8fr 1.3fr 0.8fr; gap: 12px; }
.lot__facts dt { font-size: 12px; color: var(--text-muted); }
.lot__facts dd { font-weight: 700; font-size: 14.5px; }
.lot__price span { display: block; font-size: 12px; color: var(--text-muted); }
.lot__price strong { font-family: var(--font-display); font-size: 20px; color: var(--accent-color); white-space: nowrap; }
.lot__btn { height: 42px; padding: 0 18px; font-size: 14px; }
.applied { display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 999px; background: rgba(var(--accent-rgb), 0.12); color: var(--accent-color); font-weight: 700; font-size: 13px; }
.applied svg { width: 16px; height: 16px; }
.lot-enter-active, .lot-leave-active { transition: opacity 0.3s ease; }
.lot-enter-from, .lot-leave-to { opacity: 0; }
.lot-leave-active { position: absolute; visibility: hidden; }
.empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 56px 20px; border-radius: 22px; border: 1px dashed var(--border-strong); color: var(--text-secondary); text-align: center; }
.empty > svg { width: 36px; height: 36px; color: var(--text-muted); }
.empty__title { font-weight: 800; font-size: 18px; color: var(--text-primary); }
.empty .ic-btn { margin-top: 10px; }

/* ─── Экономия ─── */
.tnd-save { background: radial-gradient(60% 80% at 0% 100%, rgba(var(--accent-rgb), 0.18), transparent 70%), #070B10; color: #F2F6F4; }
.save-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.tnd-save h2 { font-size: clamp(30px, 4vw, 46px); margin: 18px 0 16px; color: #fff; }
.save-lead { color: rgba(242, 246, 244, 0.7); font-size: 17px; line-height: 1.6; max-width: 480px; }
.save-card { padding: 32px; border-radius: 26px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); }
.save-card__label { font-size: 13px; color: rgba(242, 246, 244, 0.55); }
.save-card__budget { font-family: var(--font-display); font-size: 40px; color: #fff; margin: 6px 0 16px; font-variant-numeric: tabular-nums; }
.range { --fill: 13%; width: 100%; height: 8px; border-radius: 8px; appearance: none; -webkit-appearance: none; background: linear-gradient(90deg, var(--accent-color) var(--fill), rgba(255, 255, 255, 0.1) var(--fill)); outline: none; cursor: pointer; }
.range::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 5px solid var(--accent-color); box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0.2); cursor: grab; }
.range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 5px solid var(--accent-color); cursor: grab; }
.save-card__scale { display: flex; justify-content: space-between; font-size: 12px; color: rgba(242, 246, 244, 0.4); margin-top: 8px; }
.save-card__result { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin: 26px 0; padding: 20px; border-radius: 18px; background: rgba(var(--accent-rgb), 0.08); border: 1px solid rgba(var(--accent-rgb), 0.25); }
.save-card__result span { display: block; font-size: 12px; color: rgba(242, 246, 244, 0.55); margin-bottom: 4px; }
.save-card__result strong { font-family: var(--font-display); font-size: 26px; color: #2DC071; font-variant-numeric: tabular-nums; }
.save-card__result b { font-size: 15px; color: #fff; }
.save-card__btn { width: 100%; }

/* ─── Возможности ─── */
.feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.feature-card { display: flex; flex-direction: column; border-radius: 22px; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: var(--shadow-card); text-decoration: none; color: inherit; transition: border-color 0.25s ease; }
.feature-card:hover { border-color: rgba(var(--accent-rgb), 0.45); }
.feature-card__img { aspect-ratio: 4 / 3; overflow: hidden; background: #0b1117; }
.feature-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--motion-ease-out); }
.feature-card:hover .feature-card__img img { transform: scale(1.05); }
.feature-card__body { display: flex; flex-direction: column; flex: 1; padding: 22px; }
.feature-card h3 { font-size: 19px; margin-bottom: 8px; }
.feature-card p { flex: 1; font-size: 14.5px; line-height: 1.6; color: var(--text-secondary); }
.feature-card__more { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; font-weight: 700; font-size: 14px; color: var(--accent-color); }
.feature-card__more svg { width: 16px; height: 16px; transition: transform 0.25s ease; }
.feature-card:hover .feature-card__more svg { transform: translateX(4px); }

/* ─── Вопросы ─── */
.faq-wrap { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr); gap: 56px; align-items: start; }
.faq-list { display: flex; flex-direction: column; gap: 10px; }
.faq-item { border-radius: 18px; border: 1px solid var(--border-color); background: var(--bg-card); transition: border-color 0.25s ease; }
.faq-item.open { border-color: rgba(var(--accent-rgb), 0.45); }
.faq-item__q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 22px; border: 0; background: none; color: var(--text-primary); font-weight: 700; font-size: 16px; text-align: left; cursor: pointer; }
.faq-item__icon { flex-shrink: 0; width: 22px; height: 22px; padding: 3px; border-radius: 50%; background: rgba(var(--accent-rgb), 0.12); color: var(--accent-color); transition: transform 0.3s var(--motion-ease-out); }
.faq-item.open .faq-item__icon { transform: rotate(45deg); }
.faq-item__a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.35s var(--motion-ease-out); }
.faq-item.open .faq-item__a { grid-template-rows: 1fr; }
.faq-item__a > div { overflow: hidden; }
.faq-item__a p { padding: 0 22px 20px; color: var(--text-secondary); line-height: 1.65; }

/* ─── Призыв ─── */
.tnd-cta-wrap { padding-top: 0; }
.tnd-cta { display: flex; justify-content: space-between; align-items: center; gap: 32px; padding: 48px 52px; border-radius: 28px; background: radial-gradient(60% 120% at 100% 0%, rgba(var(--accent-rgb), 0.28), transparent 60%), linear-gradient(135deg, #0C1A14, #070B10); color: #F2F6F4; }
.tnd-cta h2 { font-size: clamp(26px, 3vw, 36px); color: #fff; margin-bottom: 10px; }
.tnd-cta p { color: rgba(242, 246, 244, 0.7); max-width: 560px; }
.tnd-cta__actions { display: flex; gap: 12px; flex-wrap: wrap; flex-shrink: 0; }

/* ─── Окно создания ─── */
.modal { position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center; padding: 20px; background: rgba(4, 7, 11, 0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); overflow-y: auto; }
.modal__card { width: min(620px, 100%); padding: 28px; border-radius: 26px; background: var(--bg-card-solid, var(--bg-primary)); border: 1px solid var(--border-color); box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; gap: 16px; }
.modal__head { display: flex; justify-content: space-between; align-items: center; }
.modal__head h2 { font-size: 26px; }
.modal__close { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; }
.modal__close svg { width: 20px; height: 20px; }
.access { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.access__opt { display: flex; gap: 12px; align-items: center; padding: 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-input, transparent); color: var(--text-primary); text-align: left; cursor: pointer; transition: border-color 0.2s ease, background 0.2s ease; }
.access__opt svg { width: 22px; height: 22px; color: var(--accent-color); flex-shrink: 0; }
.access__opt span { display: flex; flex-direction: column; }
.access__opt small { color: var(--text-muted); font-size: 12px; }
.access__opt.on { border-color: var(--accent-color); background: rgba(var(--accent-rgb), 0.08); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 700; color: var(--text-secondary); }
.modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* ─── Адаптив ─── */
@media (max-width: 1100px) {
  .lot { grid-template-columns: 1fr 1fr; }
  .lot__action { justify-self: end; }
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 1024px) {
  .tnd-hero__grid { grid-template-columns: 1fr; }
  .live { max-width: 520px; }
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
  .step-card::after { display: none; }
  .save-grid, .faq-wrap { grid-template-columns: 1fr; gap: 32px; }
  .tnd-cta { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 640px) {
  section { padding: 76px 0; }
  .container { padding: 0 16px; }
  .steps-grid, .feature-grid { grid-template-columns: 1fr; }
  .lot { grid-template-columns: 1fr; gap: 14px; }
  .lot__facts { grid-template-columns: 1fr 1fr; }
  .lot__action { justify-self: stretch; }
  .lot__btn { width: 100%; }
  .board-search { min-width: 0; width: 100%; }
  .board-tools { width: 100%; }
  .form-row, .access { grid-template-columns: 1fr; }
  .tnd-cta { padding: 32px 24px; }
  .tnd-stats { gap: 22px; }
  .save-card { padding: 22px; }
  .save-card__result { grid-template-columns: 1fr; }
}
</style>
