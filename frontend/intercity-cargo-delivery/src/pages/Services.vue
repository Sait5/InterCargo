<template>
  <div class="saas-landing svc">
    <Header />
    <main>
      <!-- ─── Шапка ─── -->
      <section class="hero svc-hero">
        <HeroBackdrop view="services-warehouse" side="left" />
        <div class="container svc-hero__inner">
          <div class="svc-hero__text">
            <span class="ic-eyebrow svc-in" style="--d: 0ms">Услуги InterCargo</span>
            <h1 class="svc-hero__title svc-in" style="--d: 90ms">
              Логистика <span class="ic-accent">под ключ</span> —<br>от одной паллеты до своего автопарка
            </h1>
            <p class="svc-hero__lead svc-in" style="--d: 180ms">
              Перевозим грузы по всей России, проводим тендеры и спот-аукционы, страхуем и показываем каждую машину на карте.
              Выберите услугу — расскажем, как она работает.
            </p>
            <div class="svc-hero__actions svc-in" style="--d: 270ms">
              <RouterLink to="/#calc" class="ic-btn ic-btn--primary">
                Рассчитать стоимость <ArrowRight />
              </RouterLink>
              <a href="#catalog" class="ic-btn ic-btn--ghost svc-hero__ghost" @click.prevent="scrollToCatalog()">Подобрать услугу</a>
            </div>
          </div>

          <nav class="svc-index svc-in" style="--d: 360ms" aria-label="Список услуг">
            <p class="svc-index__label">Шесть направлений</p>
            <button
              v-for="(s, i) in services"
              :key="s.id"
              type="button"
              class="svc-index__item"
              @click="scrollToCatalog(i)"
            >
              <span class="svc-index__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="svc-index__name">{{ s.title }}</span>
              <ArrowUpRight class="svc-index__arrow" />
            </button>
          </nav>
        </div>

        <div class="container">
          <dl class="svc-stats svc-in" style="--d: 450ms">
            <div v-for="st in stats" :key="st.label" class="hero-stat">
              <dt><strong>{{ st.value }}</strong></dt>
              <dd>{{ st.label }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- ─── Витрина услуг ─── -->
      <section id="catalog" ref="catalog" class="svc-catalog">
        <div class="container">
          <div class="section-head">
            <span class="ic-eyebrow">Что мы делаем</span>
            <h2>Одна платформа — <span class="ic-accent">весь цикл перевозки</span></h2>
            <p>Нажмите на направление, чтобы увидеть, что в него входит и с чего начать.</p>
          </div>

          <div class="showcase">
            <div class="showcase__tabs" role="tablist" aria-label="Услуги">
              <button
                v-for="(s, i) in services"
                :key="s.id"
                type="button"
                role="tab"
                class="tab"
                :class="{ on: active === i }"
                :aria-selected="active === i"
                @click="active = i"
              >
                <span class="tab__icon"><component :is="s.icon" /></span>
                <span class="tab__body">
                  <span class="tab__title">{{ s.title }}</span>
                  <span class="tab__short">{{ s.short }}</span>
                </span>
                <span class="tab__num">{{ String(i + 1).padStart(2, '0') }}</span>
              </button>
            </div>

            <article class="panel" role="tabpanel">
              <div class="panel__media">
                <img
                  v-for="(s, i) in services"
                  :key="s.id"
                  :src="photo(s.photo)"
                  :class="{ on: active === i }"
                  alt=""
                  loading="lazy"
                  decoding="async"
                >
                <div class="panel__chips">
                  <span v-for="chip in current.chips" :key="chip">{{ chip }}</span>
                </div>
              </div>
              <Transition name="swap" mode="out-in">
                <div :key="current.id" class="panel__body">
                  <h3>{{ current.title }}</h3>
                  <p class="panel__text">{{ current.text }}</p>
                  <ul class="panel__features">
                    <li v-for="f in current.features" :key="f"><Check />{{ f }}</li>
                  </ul>
                  <div class="panel__metrics">
                    <div v-for="m in current.metrics" :key="m.label">
                      <strong>{{ m.value }}</strong>
                      <span>{{ m.label }}</span>
                    </div>
                  </div>
                  <div class="panel__actions">
                    <RouterLink :to="current.link" class="ic-btn ic-btn--primary">{{ current.action }} <ArrowRight /></RouterLink>
                    <RouterLink to="/contacts?topic=order" class="ic-btn ic-btn--ghost">Обсудить задачу</RouterLink>
                  </div>
                </div>
              </Transition>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── Транспорт ─── -->
      <section class="svc-fleet is-dark">
        <div class="container">
          <div class="section-head section-head--left">
            <span class="ic-eyebrow">Автопарк</span>
            <h2>Подберём машину <span class="ic-accent">под ваш груз</span></h2>
            <p>Собственные тягачи Volvo, Scania и MAN плюс проверенные партнёры — от «газели» по городу до трала для негабарита.</p>
          </div>
          <div class="fleet-grid">
            <article v-for="v in fleet" :key="v.name" class="fleet-card">
              <div class="fleet-card__top">
                <span class="fleet-card__icon"><component :is="v.icon" /></span>
                <span class="fleet-card__tag">{{ v.tag }}</span>
              </div>
              <h3>{{ v.name }}</h3>
              <p>{{ v.text }}</p>
              <div class="fleet-card__specs">
                <span><b>{{ v.tons }}</b> т</span>
                <span v-if="v.volume"><b>{{ v.volume }}</b> м³</span>
                <span v-if="v.pallets"><b>{{ v.pallets }}</b> паллет</span>
              </div>
              <div class="fleet-card__bar" :title="`Грузоподъёмность до ${v.maxTons} т`">
                <i :style="{ width: (v.maxTons / 40) * 100 + '%' }"></i>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── Процесс ─── -->
      <section class="svc-process">
        <div class="container">
          <div class="section-head">
            <span class="ic-eyebrow">Как мы работаем</span>
            <h2>От заявки до закрывающих документов — <span class="ic-accent">пять шагов</span></h2>
          </div>
          <ol ref="timeline" class="timeline" :style="{ '--p': progress }">
            <li v-for="(step, i) in steps" :key="step.title" class="timeline-item" :class="{ done: progress * steps.length > i + 0.2 }">
              <span class="timeline-item__dot">{{ i + 1 }}</span>
              <span class="timeline-item__time"><Clock />{{ step.time }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- ─── Тарифы ─── -->
      <section class="svc-pricing">
        <div class="container">
          <div class="section-head">
            <span class="ic-eyebrow">Тарифы</span>
            <h2>Прозрачная цена <span class="ic-accent">без доплат</span></h2>
            <p>Стоимость фиксируется в договоре. Точную цену рейса покажет калькулятор на главной.</p>
          </div>
          <div class="pricing-grid">
            <article v-for="plan in pricing" :key="plan.title" class="price-card" :class="{ featured: plan.featured }">
              <span v-if="plan.featured" class="price-card__badge">Выбирают чаще всего</span>
              <h3>{{ plan.title }}</h3>
              <p class="price-card__desc">{{ plan.desc }}</p>
              <div class="price-card__price">{{ plan.price }}</div>
              <ul>
                <li v-for="f in plan.features" :key="f"><Check />{{ f }}</li>
              </ul>
              <RouterLink :to="plan.link" class="ic-btn" :class="plan.featured ? 'ic-btn--primary' : 'ic-btn--ghost'">
                {{ plan.btn }}
              </RouterLink>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── Вопросы ─── -->
      <section class="svc-faq">
        <div class="container faq-wrap">
          <div class="section-head section-head--left">
            <span class="ic-eyebrow">Вопросы</span>
            <h2>Часто <span class="ic-accent">спрашивают</span></h2>
            <p>Не нашли ответ? Напишите в Telegram или позвоните — ответим за несколько минут.</p>
            <div class="faq-contacts">
              <a href="https://t.me/+79188180890" target="_blank" rel="noopener" class="ic-btn ic-btn--ghost">Telegram</a>
              <a href="tel:+79188180890" class="ic-btn ic-btn--ghost"><Phone />Позвонить</a>
            </div>
          </div>
          <div class="faq-list">
            <div v-for="(q, i) in faq" :key="q.q" class="faq-item" :class="{ open: openFaq === i }">
              <button type="button" class="faq-item__q" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? -1 : i">
                {{ q.q }}
                <Plus class="faq-item__icon" />
              </button>
              <div class="faq-item__a"><div><p>{{ q.a }}</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Призыв ─── -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card svc-cta">
            <div>
              <h2>Расскажите, что нужно перевезти</h2>
              <p>Посчитаем стоимость и сроки за 30 минут и предложим подходящий транспорт.</p>
            </div>
            <div class="svc-cta__actions">
              <RouterLink to="/#calc" class="ic-btn ic-btn--primary">Рассчитать стоимость <ArrowRight /></RouterLink>
              <RouterLink to="/contacts?topic=order" class="ic-btn ic-btn--ghost">Оставить заявку</RouterLink>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import {
  Truck, Gavel, Zap, Navigation, ShieldCheck, BarChart3, ArrowRight, ArrowUpRight, Check, Plus, Clock, Phone,
  Package, Snowflake, Thermometer, Container, Weight,
} from 'lucide-vue-next';
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';
import HeroBackdrop from '@/ui/HeroBackdrop.vue';

// Фото (Pexels, см. docs/CREDITS.md)
const photos = Object.fromEntries(
  Object.entries(import.meta.glob('@/assets/photos/*.webp', { eager: true, import: 'default' }))
    .map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url]),
);
const photo = (name) => photos[name];

const stats = [
  { value: `${new Date().getFullYear() - 2010}`, label: 'лет на рынке' },
  { value: '5 000+', label: 'клиентов' },
  { value: '250+', label: 'единиц техники' },
  { value: '99%', label: 'рейсов в срок' },
];

const services = [
  {
    id: 'freight', icon: Truck, photo: 'about-trucks',
    title: 'Междугородние перевозки',
    short: 'Целой машиной и сборные грузы',
    text: 'Доставляем грузы любой сложности собственным автопарком: целой машиной или сборным грузом, от двери до двери.',
    features: ['Отдельная машина или сборный груз', 'Страхование на полную стоимость', 'GPS-трекинг каждой машины', 'Погрузка и экспедирование'],
    metrics: [{ value: 'от 1 дня', label: 'по европейской части' }, { value: '250+', label: 'своих тягачей' }],
    chips: ['Вся Россия', 'До 20 т', 'От двери до двери'],
    action: 'Рассчитать стоимость', link: '/#calc',
  },
  {
    id: 'tender', icon: Gavel, photo: 'tender-ship',
    title: 'Транспортные тендеры',
    short: 'Лучшие перевозчики на год вперёд',
    text: 'Собираем предложения перевозчиков по вашим направлениям, сравниваем по цене, срокам и рейтингу и фиксируем ставки в договоре.',
    features: ['Шаблоны лотов по направлениям', 'Сравнение предложений в одной таблице', 'Контроль бюджета и экономии', 'Только проверенные перевозчики'],
    metrics: [{ value: 'до 18%', label: 'экономия бюджета' }, { value: '3 000+', label: 'перевозчиков в базе' }],
    chips: ['Годовые ставки', 'Аналитика', 'Рейтинги'],
    action: 'Провести тендер', link: '/transport-tender',
  },
  {
    id: 'spot', icon: Zap, photo: 'spot-port',
    title: 'Спот-аукционы',
    short: 'Горящий рейс закрыт за минуты',
    text: 'Выставляете рейс — перевозчики торгуются в реальном времени, а система сама выбирает лучшую ставку к нужному сроку.',
    features: ['Запуск аукциона за 5 минут', 'Ставки в реальном времени', 'Закрытые и открытые торги', 'Автовыбор победителя'],
    metrics: [{ value: '5 мин', label: 'на запуск' }, { value: '−12%', label: 'к рыночной ставке' }],
    chips: ['Онлайн-торги', 'Без звонков'],
    action: 'Запустить аукцион', link: '/spot-auctions',
  },
  {
    id: 'tracking', icon: Navigation, photo: 'tracking-dusk',
    title: 'Трекинг грузов',
    short: 'Каждая машина на карте',
    text: 'Видно, где груз прямо сейчас: маршрут, остановки и прогноз прибытия. Уведомления приходят на почту и в мессенджер.',
    features: ['GPS-мониторинг онлайн', 'Уведомления о статусах', 'История перемещений', 'Доступ для получателя по ссылке'],
    metrics: [{ value: '24/7', label: 'мониторинг' }, { value: '1 мин', label: 'обновление позиции' }],
    chips: ['Онлайн-карта', 'Уведомления'],
    action: 'Открыть трекинг', link: '/tracking',
  },
  {
    id: 'insurance', icon: ShieldCheck, photo: 'independence-port',
    title: 'Страхование грузов',
    short: 'Гарантия сохранности',
    text: 'Страхуем груз на полную стоимость от всех рисков. Полис оформляется вместе с заявкой, выплаты — без долгих разбирательств.',
    features: ['Страхование от всех рисков', 'Полис вместе с заявкой', 'Выплата до 10 рабочих дней', 'Особые условия для дорогих грузов'],
    metrics: [{ value: '100%', label: 'стоимости груза' }, { value: 'от 0,1%', label: 'тариф от суммы' }],
    chips: ['Все риски', 'Быстрые выплаты'],
    action: 'Застраховать груз', link: '/contacts?topic=order',
  },
  {
    id: 'analytics', icon: BarChart3, photo: 'analytics-office',
    title: 'Аналитика и отчёты',
    short: 'Цифры по каждому рейсу',
    text: 'Дашборды по расходам, срокам и перевозчикам. Прогноз ставок помогает планировать бюджет, а отчёты собираются сами.',
    features: ['Дашборды в реальном времени', 'Прогноз ставок по направлениям', 'KPI перевозчиков', 'Автоматические отчёты'],
    metrics: [{ value: '40+', label: 'готовых отчётов' }, { value: 'API', label: 'выгрузка в 1С и ERP' }],
    chips: ['Дашборды', 'Прогнозы', 'Экспорт'],
    action: 'Смотреть аналитику', link: '/feature/analytics',
  },
];

const active = ref(0);
const current = computed(() => services[active.value]);

const fleet = [
  { icon: Truck, name: 'Тент 20 т', tag: 'Самый ходовой', tons: '20', maxTons: 20, volume: '82–92', pallets: 33, text: 'Универсальная фура для большинства грузов: паллеты, оборудование, стройматериалы.' },
  { icon: Snowflake, name: 'Рефрижератор', tag: '−25…+25 °C', tons: '20', maxTons: 20, volume: '86', pallets: 33, text: 'Продукты, лекарства и цветы с контролем температуры на всём пути.' },
  { icon: Thermometer, name: 'Изотерм', tag: 'Без перепадов', tons: '10', maxTons: 10, volume: '45', pallets: 18, text: 'Держит температуру без агрегата — для напитков, химии и бытовой техники.' },
  { icon: Package, name: 'Малотоннажный', tag: 'По городу', tons: '1,5–5', maxTons: 5, volume: '9–36', pallets: 12, text: 'Газели и пятитонники для доставки по городу и области в день заказа.' },
  { icon: Container, name: 'Контейнеровоз', tag: '20 и 40 футов', tons: '30', maxTons: 30, volume: '67', pallets: 0, text: 'Вывоз контейнеров из портов и с ж/д станций до склада клиента.' },
  { icon: Weight, name: 'Трал / негабарит', tag: 'Спецпроект', tons: 'до 40', maxTons: 40, volume: '', pallets: 0, text: 'Спецтехника и крупное оборудование с разрешениями и сопровождением.' },
];

const steps = [
  { title: 'Заявка', time: '5 минут', text: 'Оставьте заявку на сайте или позвоните. Нужны маршрут, вес и тип груза.' },
  { title: 'Расчёт', time: 'до 30 минут', text: 'Менеджер присылает точную цену, сроки и подходящий транспорт.' },
  { title: 'Договор', time: 'в день обращения', text: 'Подписываем договор онлайн — все документы в электронном виде.' },
  { title: 'Перевозка', time: 'по графику', text: 'Забираем груз вовремя, вы следите за машиной на карте.' },
  { title: 'Документы', time: 'в день доставки', text: 'Сдаём груз получателю и присылаем закрывающие документы через ЭДО.' },
];

const pricing = [
  {
    title: 'Разовая перевозка', desc: 'Для разовых отправок', price: 'от 15 ₽/км',
    features: ['Доставка по всей России', 'Страхование груза', 'GPS-трекинг', 'Электронные документы', 'Поддержка в рабочее время'],
    btn: 'Рассчитать рейс', link: '/#calc',
  },
  {
    title: 'Постоянный клиент', desc: 'Для регулярных перевозок', price: 'от 12 ₽/км', featured: true,
    features: ['Всё из «Разовой»', 'Персональный менеджер', 'Отсрочка платежа', 'Скидки до 20%', 'Поддержка 24/7'],
    btn: 'Получить предложение', link: '/contacts?topic=order',
  },
  {
    title: 'Корпоративный', desc: 'Для крупного бизнеса', price: 'Индивидуально',
    features: ['Всё из «Постоянного»', 'Выделенный автопарк', 'Интеграция с ERP и API', 'SLA с гарантиями', 'Модуль аналитики'],
    btn: 'Обсудить условия', link: '/contacts?topic=partnership',
  },
];

const faq = [
  { q: 'Как быстро вы подаёте машину?', a: 'По крупным городам — в день заявки или на следующий день. Для рефрижераторов и негабарита обычно нужно 1–2 дня на подготовку.' },
  { q: 'Можно отправить груз меньше целой машины?', a: 'Да, сборным грузом: платите только за свои паллеты или кубометры. Сборные рейсы уходят из Москвы, Петербурга, Казани и Екатеринбурга несколько раз в неделю.' },
  { q: 'Что входит в стоимость?', a: 'Перевозка, топливо, платные дороги, GPS-трекинг и электронные документы. Страхование, погрузка и простой сверх нормы считаются отдельно и указываются в расчёте заранее.' },
  { q: 'Как застраховать груз?', a: 'Отметьте страхование в заявке — полис оформим вместе с договором. Тариф от 0,1% от стоимости груза, покрытие от всех рисков.' },
  { q: 'Работаете ли вы с НДС?', a: 'Да, работаем с НДС и без. Закрывающие документы отправляем через ЭДО в день доставки.' },
  { q: 'Как отследить груз?', a: 'После отправки вы получаете номер груза. Введите его на странице «Трекинг» — там видно машину на карте, статус и время прибытия.' },
];
const openFaq = ref(0);

// Плавный переход к витрине с выбором услуги
const catalog = ref(null);
const scrollToCatalog = async (i) => {
  if (typeof i === 'number') active.value = i;
  await nextTick();
  catalog.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Линия процесса заполняется по мере прокрутки
const timeline = ref(null);
const progress = ref(0);
let raf = 0;
const onScroll = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const el = timeline.value;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    progress.value = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)));
  });
};
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  cancelAnimationFrame(raf);
});
</script>

<style scoped>
.svc { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; overflow-x: hidden; }
.container { max-width: var(--container, 1200px); margin: 0 auto; padding: 0 24px; }
section { padding: 110px 0; }
.ic-btn svg { width: 18px; height: 18px; }

.section-head { max-width: 760px; margin: 0 auto 56px; text-align: center; }
.section-head h2 { font-size: clamp(30px, 4vw, 46px); margin: 18px 0 14px; color: var(--text-primary); }
.section-head p { color: var(--text-secondary); font-size: 17px; }
.section-head--left { margin: 0 0 48px; text-align: left; }

/* Мягкое появление шапки — только прозрачность и размытие, без прыжков */
.svc-in { opacity: 0; animation: svc-in 0.9s var(--motion-ease-out) var(--d, 0ms) forwards; }
@keyframes svc-in { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: none; } }

/* ─── Шапка ─── */
.svc-hero { position: relative; overflow: hidden; padding: calc(var(--header-h) + 72px) 0 56px; min-height: min(900px, 100vh); display: flex; flex-direction: column; justify-content: center; background: var(--hero-bg); color: #F2F6F4; }
.svc-hero > .container { position: relative; z-index: 2; width: 100%; }
.svc-hero__inner { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr); gap: 64px; align-items: end; }
.svc-hero__title { font-size: clamp(36px, 5vw, 64px); line-height: 1.04; margin: 22px 0 22px; color: #fff; }
.svc-hero__lead { max-width: 560px; font-size: 18px; line-height: 1.6; color: rgba(242, 246, 244, 0.78); }
.svc-hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.svc-hero__ghost { color: #F2F6F4; border-color: rgba(255, 255, 255, 0.25); background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(10px); }

.svc-index { padding: 22px; border-radius: 22px; background: rgba(8, 13, 18, 0.62); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.svc-index__label { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(242, 246, 244, 0.5); margin-bottom: 8px; }
.svc-index__item { width: 100%; display: grid; grid-template-columns: 34px 1fr 18px; align-items: center; gap: 10px; padding: 12px 4px; border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); background: none; color: #F2F6F4; font-weight: 600; font-size: 15px; text-align: left; cursor: pointer; transition: color 0.2s ease, padding 0.25s ease; }
.svc-index__item:first-of-type { border-top: 0; }
.svc-index__num { font-family: var(--font-display); font-size: 13px; color: var(--accent-color); }
.svc-index__arrow { width: 18px; height: 18px; opacity: 0.35; transition: opacity 0.2s ease, color 0.2s ease; }
.svc-index__item:hover { color: var(--accent-color); padding-left: 10px; }
.svc-index__item:hover .svc-index__arrow { opacity: 1; color: var(--accent-color); }

.svc-stats { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 64px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(8, 13, 18, 0.55); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.svc-stats .hero-stat { padding: 22px 26px; border-left: 1px solid rgba(255, 255, 255, 0.08); }
.svc-stats .hero-stat:first-child { border-left: 0; }
.svc-stats strong { display: block; font-family: var(--font-display); font-size: 32px; line-height: 1; color: #fff; }
.svc-stats dd { margin-top: 8px; font-size: 13px; color: rgba(242, 246, 244, 0.6); }

/* ─── Витрина ─── */
.showcase { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 28px; align-items: start; }
.showcase__tabs { display: flex; flex-direction: column; gap: 8px; }
.tab { position: relative; display: grid; grid-template-columns: 46px 1fr auto; gap: 14px; align-items: center; padding: 16px 18px; border-radius: 18px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); text-align: left; cursor: pointer; overflow: hidden; transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease; }
.tab::before { content: ''; position: absolute; left: 0; top: 18%; bottom: 18%; width: 3px; border-radius: 3px; background: var(--accent-color); transform: scaleY(0); transition: transform 0.3s var(--motion-ease-out); }
.tab:hover { border-color: rgba(var(--accent-rgb), 0.35); }
.tab.on { border-color: rgba(var(--accent-rgb), 0.55); box-shadow: 0 18px 40px -28px rgba(var(--accent-rgb), 0.7); }
.tab.on::before { transform: scaleY(1); }
.tab__icon { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: rgba(var(--accent-rgb), 0.1); color: var(--accent-color); transition: background 0.25s ease, color 0.25s ease; }
.tab.on .tab__icon { background: var(--accent-color); color: var(--text-on-accent, #04120A); }
.tab__icon svg { width: 22px; height: 22px; }
.tab__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.tab__title { font-weight: 700; font-size: 16px; }
.tab__short { font-size: 13px; color: var(--text-muted); }
.tab__num { font-family: var(--font-display); font-size: 13px; color: var(--text-muted); }
.tab.on .tab__num { color: var(--accent-color); }

.panel { position: sticky; top: calc(var(--header-h) + 24px); border-radius: 26px; overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-card); box-shadow: var(--shadow-card); }
.panel__media { position: relative; aspect-ratio: 16 / 8; background: #0b1117; overflow: hidden; }
.panel__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.06); transition: opacity 0.7s ease, transform 6s ease; }
.panel__media img.on { opacity: 1; transform: scale(1); }
.panel__media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(4, 7, 11, 0.55)); pointer-events: none; }
.panel__chips { position: absolute; left: 18px; bottom: 16px; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; }
.panel__chips span { padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #F2F6F4; background: rgba(8, 13, 18, 0.6); border: 1px solid rgba(255, 255, 255, 0.16); backdrop-filter: blur(8px); }
.panel__body { padding: 30px 32px 32px; }
.panel__body h3 { font-family: var(--font-display); font-size: 28px; margin-bottom: 10px; }
.panel__text { color: var(--text-secondary); font-size: 16px; line-height: 1.65; }
.panel__features { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin: 22px 0; }
.panel__features li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; }
.panel__features svg { flex-shrink: 0; width: 18px; height: 18px; padding: 3px; border-radius: 50%; background: rgba(var(--accent-rgb), 0.14); color: var(--accent-color); margin-top: 1px; }
.panel__metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 18px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }
.panel__metrics strong { display: block; font-family: var(--font-display); font-size: 26px; color: var(--accent-color); line-height: 1.1; }
.panel__metrics span { font-size: 13px; color: var(--text-muted); }
.panel__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.swap-enter-active, .swap-leave-active { transition: opacity 0.25s ease, filter 0.25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; filter: blur(4px); }

/* ─── Автопарк ─── */
.svc-fleet { background: radial-gradient(70% 60% at 85% 0%, rgba(var(--accent-rgb), 0.16), transparent 70%), #070B10; color: #F2F6F4; }
.svc-fleet .section-head h2 { color: #fff; }
.svc-fleet .section-head p { color: rgba(242, 246, 244, 0.7); max-width: 640px; }
.fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fleet-card { padding: 24px; border-radius: 20px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09); transition: border-color 0.25s ease, background-color 0.25s ease; }
.fleet-card:hover { border-color: rgba(var(--accent-rgb), 0.45); }
.fleet-card__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.fleet-card__icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 13px; background: rgba(var(--accent-rgb), 0.14); color: var(--accent-color); }
.fleet-card__icon svg { width: 22px; height: 22px; }
.fleet-card__tag { font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 999px; color: #F2B84B; background: rgba(242, 184, 75, 0.1); border: 1px solid rgba(242, 184, 75, 0.25); }
.fleet-card h3 { font-size: 20px; color: #fff; margin-bottom: 8px; }
.fleet-card p { font-size: 14px; line-height: 1.6; color: rgba(242, 246, 244, 0.65); min-height: 67px; }
.fleet-card__specs { display: flex; gap: 8px; flex-wrap: wrap; margin: 18px 0 14px; }
.fleet-card__specs span { font-size: 13px; padding: 6px 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); color: rgba(242, 246, 244, 0.7); }
.fleet-card__specs b { color: #fff; font-family: var(--font-display); }
.fleet-card__bar { height: 4px; border-radius: 4px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.fleet-card__bar i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--accent-color), var(--accent-2)); }

/* ─── Процесс ─── */
.timeline { --p: 0; position: relative; list-style: none; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
.timeline::before, .timeline::after { content: ''; position: absolute; top: 21px; left: 22px; right: calc((100% - 80px) / 5 - 22px); height: 2px; border-radius: 2px; }
.timeline::before { background: var(--border-color); }
.timeline::after { background: linear-gradient(90deg, var(--accent-color), var(--accent-2)); transform-origin: left; transform: scaleX(var(--p)); }
.timeline-item { position: relative; z-index: 1; }
.timeline-item__dot { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; font-family: var(--font-display); font-weight: 700; background: var(--bg-primary); border: 2px solid var(--border-strong); color: var(--text-muted); transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease; }
.timeline-item.done .timeline-item__dot { background: var(--accent-color); border-color: var(--accent-color); color: var(--text-on-accent, #04120A); box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0.14); }
.timeline-item__time { display: inline-flex; align-items: center; gap: 6px; margin: 20px 0 10px; font-size: 12px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 0.04em; }
.timeline-item__time svg { width: 14px; height: 14px; }
.timeline-item h3 { font-size: 20px; margin-bottom: 8px; color: var(--text-primary); }
.timeline-item p { font-size: 14.5px; line-height: 1.6; color: var(--text-secondary); }

/* ─── Тарифы ─── */
.svc-pricing { background: var(--bg-elevated, var(--bg-primary)); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items: stretch; }
.price-card { position: relative; display: flex; flex-direction: column; padding: 32px 28px; border-radius: 24px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: var(--shadow-card); }
.price-card.featured { background: linear-gradient(160deg, #0F1E18, #070B10 70%); border-color: rgba(var(--accent-rgb), 0.5); color: #F2F6F4; box-shadow: 0 30px 60px -30px rgba(var(--accent-rgb), 0.55); }
.price-card__badge { position: absolute; top: -13px; left: 28px; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; background: var(--accent-gradient); color: var(--text-on-accent, #04120A); }
.price-card h3 { font-size: 22px; }
.price-card__desc { margin-top: 4px; font-size: 14px; color: var(--text-muted); }
.price-card.featured .price-card__desc { color: rgba(242, 246, 244, 0.6); }
.price-card__price { margin: 22px 0; font-family: var(--font-display); font-size: 34px; color: var(--accent-color); }
.price-card ul { list-style: none; display: flex; flex-direction: column; gap: 11px; margin-bottom: 28px; flex: 1; }
.price-card li { display: flex; gap: 10px; font-size: 14.5px; }
.price-card li svg { flex-shrink: 0; width: 18px; height: 18px; color: var(--accent-color); }
.price-card .ic-btn { width: 100%; }

/* ─── Вопросы ─── */
.faq-wrap { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 56px; align-items: start; }
.faq-wrap .section-head--left { position: sticky; top: calc(var(--header-h) + 24px); }
.faq-contacts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
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
.cta-section { padding-top: 0; }
.svc-cta { display: flex; justify-content: space-between; align-items: center; gap: 32px; padding: 48px 52px; border-radius: 28px; background: radial-gradient(60% 120% at 100% 0%, rgba(var(--accent-rgb), 0.28), transparent 60%), linear-gradient(135deg, #0C1A14, #070B10); color: #F2F6F4; }
.svc-cta h2 { font-size: clamp(26px, 3vw, 36px); color: #fff; margin-bottom: 10px; }
.svc-cta p { color: rgba(242, 246, 244, 0.7); }
.svc-cta__actions { display: flex; gap: 12px; flex-wrap: wrap; flex-shrink: 0; }

/* ─── Адаптив ─── */
@media (max-width: 1024px) {
  .svc-hero__inner { grid-template-columns: 1fr; gap: 36px; }
  .svc-index { max-width: 520px; }
  .showcase { grid-template-columns: 1fr; }
  .showcase__tabs { flex-direction: row; overflow-x: auto; padding-bottom: 6px; scroll-snap-type: x mandatory; }
  .tab { flex: 0 0 260px; scroll-snap-align: start; }
  .panel { position: static; }
  .fleet-grid, .pricing-grid { grid-template-columns: repeat(2, 1fr); }
  .timeline { grid-template-columns: 1fr; gap: 0; }
  .timeline::before, .timeline::after { top: 22px; bottom: 22px; left: 21px; right: auto; width: 2px; height: auto; }
  .timeline::after { transform-origin: top; transform: scaleY(var(--p)); }
  .timeline-item { display: grid; grid-template-columns: 44px 1fr; column-gap: 18px; padding-bottom: 28px; }
  .timeline-item > :not(.timeline-item__dot) { grid-column: 2; }
  .timeline-item__dot { grid-row: 1 / span 3; }
  .timeline-item__time { margin-top: 10px; }
  .faq-wrap { grid-template-columns: 1fr; gap: 0; }
  .faq-wrap .section-head--left { position: static; }
  .svc-cta { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 640px) {
  section { padding: 76px 0; }
  .container { padding: 0 16px; }
  .svc-stats { grid-template-columns: 1fr 1fr; margin-top: 40px; }
  .svc-stats .hero-stat:nth-child(3) { border-left: 0; }
  .svc-stats .hero-stat:nth-child(n + 3) { border-top: 1px solid rgba(255, 255, 255, 0.08); }
  .fleet-grid, .pricing-grid { grid-template-columns: 1fr; }
  .panel__features { grid-template-columns: 1fr; }
  .panel__body { padding: 22px 20px 24px; }
  .svc-cta { padding: 32px 24px; }
  .svc-hero__actions .ic-btn { flex: 1 1 100%; }
}
</style>
