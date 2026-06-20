<template>
  <div class="saas-landing">
    <Header />

    <main>
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-grid-bg"></div>

        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-badge hero-enter" data-delay="1">
                <span class="badge-dot"></span>
                Enterprise Logistics Platform
              </div>

              <h1 class="hero-title hero-enter-title" data-delay="2">
                Управляйте транспортными<br />
                <span class="gradient-text">заказами</span>
              </h1>

              <p class="hero-description hero-enter" data-delay="3">
                Создавайте заказы, находите перевозчиков и управляйте логистикой в одной системе.
              </p>

              <div class="hero-actions hero-enter" data-delay="4">
                <button v-if="!userStore.isAdmin" class="btn-primary btn-large btn-glow" @click="openCreateOrder">
                  Создать заказ
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <button v-if="!userStore.isAdmin" class="btn-secondary btn-large" @click="scrollToOrders">
                  Смотреть заказы
                </button>
                <button v-else class="btn-secondary btn-large" @click="$router.push('/orders')">
                  Перейти в управление заказами
                </button>
              </div>

              <div class="hero-stats hero-enter" data-delay="5">
                <div
                  v-for="stat in stats"
                  :key="stat.id"
                  class="hero-stat hover-lift"
                  :ref="setStatRef"
                >
                  <span class="hero-stat-value">{{ stat.displayValue }}{{ stat.suffix }}</span>
                  <span class="hero-stat-label">{{ stat.label }}</span>
                </div>
              </div>
            </div>

            <div class="hero-visual hero-enter" data-delay="6">
              <div class="dashboard-card">
                <div class="dashboard-header">
                  <div class="dashboard-title-row">
                    <div class="dashboard-dot"></div>
                    <span>Активные заказы</span>
                  </div>
                  <div class="status-badge">
                    <span class="status-dot"></span>
                    Live
                  </div>
                </div>
                <div class="dashboard-items">
                  <div
                    v-for="order in recentOrders.slice(0, 3)"
                    :key="order.id"
                    class="dashboard-item"
                  >
                    <div class="dashboard-item-left">
                      <div class="dashboard-route">{{ order.route }}</div>
                      <div class="dashboard-meta">{{ order.type }}</div>
                    </div>
                    <div class="dashboard-price">{{ formatPrice(order.price) }}</div>
                  </div>
                  <div v-if="recentOrders.length === 0" class="dashboard-empty">
                    Пока нет активных заказов
                  </div>
                </div>
                <div class="dashboard-footer">
                  <span class="dashboard-footer-text">Обновлено только что</span>
                  <div class="dashboard-progress">
                    <div class="dashboard-progress-bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="social-proof" ref="socialRef">
        <div class="container">
          <p class="social-label reveal">Нам доверяют ведущие логистические компании</p>
          <div class="logos-track">
            <div
              v-for="company in companies"
              :key="company.id"
              class="logo-item reveal logo-animate"
              :style="{ '--i': company.id }"
            >
              {{ company.name }}
            </div>
          </div>
        </div>
      </section>

      <section class="features" id="features" ref="featuresSection">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-badge">Возможности</span>
            <h2 class="section-title">
              Всё для управления<br />
              <span class="gradient-text">транспортными заказами</span>
            </h2>
            <p class="section-subtitle">
              Создавайте общие или личные заказы, управляйте перевозчиками и отслеживайте исполнение.
            </p>
          </div>

          <div class="features-grid">
            <div
              v-for="feature in features"
              :key="feature.id"
              class="feature-card hover-lift reveal"
              :style="{ '--i': feature.id }"
              @click="goToFeature(feature.slug)"
            >
              <div class="feature-icon-wrap" v-html="feature.icon"></div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-text">{{ feature.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="live-orders" id="orders" ref="ordersSection">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-badge">Заказы</span>
            <h2 class="section-title">
              <template v-if="userStore.isAdmin">Все заказы</template>
              <template v-else>Доступные <span class="gradient-text">заказы</span></template>
            </h2>
            <p class="section-subtitle white-text">
              <template v-if="userStore.isAdmin">Просмотр и управление всеми заказами в системе.</template>
              <template v-else>Общие заказы, доступные для просмотра.</template>
            </p>
          </div>

          <div class="live-orders__filters reveal">
            <div class="filter-group">
              <button
                v-for="filter in filters"
                :key="filter.id"
                class="filter-chip"
                :class="{ active: type === filter.value }"
                @click="type = filter.value"
              >
                {{ filter.label }}
              </button>
            </div>
            <div class="search-group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                v-model.trim="search"
                type="text"
                placeholder="Поиск по направлению..."
                class="search-input"
              />
            </div>
          </div>

          <transition-group name="order-list" tag="div" class="live-orders__grid">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="order-card hover-lift"
            >
              <span
                class="order-card__badge"
                :class="getBadgeClass(order.type)"
              >
                {{ order.type }}
              </span>
              <div class="order-card__route">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {{ order.route }}
              </div>
              <div class="order-card__details">
                <div class="order-detail">
                  <span class="order-detail__label">Объём</span>
                  <span class="order-detail__value">{{ order.volume }}</span>
                </div>
                <div class="order-detail">
                  <span class="order-detail__label">Период</span>
                  <span class="order-detail__value">{{ formatDate(order.dateFrom) }} — {{ formatDate(order.dateTo) }}</span>
                </div>
                <div class="order-detail">
                  <span class="order-detail__label">Тип заказа</span>
                  <span class="order-detail__value">{{ order.accessType === 'public' ? 'Общий' : 'Личный' }}</span>
                </div>
              </div>
              <div class="order-card__footer">
                <div class="order-price">
                  <span class="order-price__label">Начальная цена</span>
                  <span class="order-price__value">{{ formatPrice(order.price) }}</span>
                </div>
                <button
                  v-if="canApply(order)"
                  class="btn--accent"
                  @click.stop="applyToOrder(order)"
                >
                  Участвовать
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <span v-else-if="hasApplied(order.id)" class="applied-badge">Заявка подана</span>
                
              </div>
              <div class="order-card__bids">
                <div class="bid-avatars">
                  <div class="bid-avatar">А</div>
                  <div class="bid-avatar">Б</div>
                  <div class="bid-avatar">В</div>
                  <div class="bid-count">+{{ Math.max(0, order.applicants.length - 3) }}</div>
                </div>
                <span class="bid-text">{{ order.applicants.length }} участников</span>
              </div>
            </div>
          </transition-group>

          <transition name="fade">
            <div v-if="filteredOrders.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <p class="empty-title">Заказы не найдены</p>
              <p class="empty-text">Попробуйте изменить параметры поиска или создайте новый заказ</p>
            </div>
          </transition>
        </div>
      </section>

      <section class="process" id="process" ref="processSection">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-badge">Процесс</span>
            <h2 class="section-title">
              Как это <span class="gradient-text">работает</span>
            </h2>
            <p class="section-subtitle">
              Четыре шага от создания заказа до заключения договора.
            </p>
          </div>

          <div class="process-steps">
            <div
              v-for="step in steps"
              :key="step.id"
              class="process-step reveal"
              :style="{ '--i': step.id }"
            >
              <div class="step-visual">
                <div class="step-number">{{ String(step.id).padStart(2, '0') }}</div>
                <div v-if="step.id < steps.length" class="step-connector">
                  <div class="step-connector-line"></div>
                  <div class="step-connector-dot"></div>
                </div>
              </div>
              <div class="step-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-text">{{ step.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="faq" id="faq" ref="faqSection">
        <div class="container">
          <div class="section-header reveal">
            <span class="section-badge">FAQ</span>
            <h2 class="section-title">
              Часто задаваемые <span class="gradient-text">вопросы</span>
            </h2>
          </div>

          <div class="faq__grid">
            <div
              v-for="item in faq"
              :key="item.id"
              class="faq-item reveal"
              :class="{ 'is-open': openFaq === item.id }"
              :style="{ '--i': item.id }"
            >
              <div
                class="faq-item__question"
                @click="toggleFaq(item.id)"
              >
                <span>{{ item.q }}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  :class="{ rotated: openFaq === item.id }"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <transition name="faq-expand">
                <div v-if="openFaq === item.id" class="faq-item__answer">
                  {{ item.a }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-fullwidth">
        <div class="cta-inner">
          <div class="cta-orb cta-orb-1"></div>
          <div class="cta-orb cta-orb-2"></div>
          <div class="cta-layout-text">
            <div class="cta-badge">Начните бесплатно</div>
            <h2 class="cta-title">Готовы оптимизировать логистику?</h2>
            <p class="cta-text">Присоединяйтесь к 500+ компаниям, которые уже экономят на перевозках до 25%</p>
          </div>
        </div>
      </section>
    </main>

    <div class="modal-overlay" v-if="showCreateOrderModal" @click="closeCreateOrder">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Создать новый заказ</h2>
          <button class="modal-close" @click="closeCreateOrder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitOrder" class="modal-form">
          <div class="form-group">
            <label>Тип заказа</label>
            <div class="access-type-selector">
              <div class="access-type-card" :class="{ active: newOrder.accessType === 'public' }" @click="newOrder.accessType = 'public'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div>
                  <div class="access-type-title">Общий заказ</div>
                  <div class="access-type-desc">Доступен всем перевозчикам</div>
                </div>
              </div>
              <div class="access-type-card" :class="{ active: newOrder.accessType === 'private' }" @click="newOrder.accessType = 'private'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div>
                  <div class="access-type-title">Личный заказ</div>
                  <div class="access-type-desc">Только для выбранных перевозчиков</div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Город отправления</label>
              <select v-model="newOrder.from" required>
                <option value="">Выберите город</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Город назначения</label>
              <select v-model="newOrder.to" required>
                <option value="">Выберите город</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Тип груза</label>
            <select v-model="newOrder.type" required>
              <option value="">Выберите тип</option>
              <option value="Сборные">Сборные</option>
              <option value="Рефрижераторные">Рефрижераторные</option>
              <option value="Негабарит">Негабарит</option>
              <option value="Стандартные">Стандартные</option>
            </select>
          </div>
          <div class="form-group">
            <label>Объём</label>
            <input v-model="newOrder.volume" type="text" placeholder="Например: 120 т/мес" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Дата начала</label>
              <input v-model="newOrder.dateFrom" type="date" required class="date-input" />
            </div>
            <div class="form-group">
              <label>Дата окончания</label>
              <input v-model="newOrder.dateTo" type="date" required class="date-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Начальная цена (только цифры)</label>
            <input
              v-model="newOrder.price"
              type="number"
              min="0"
              step="1"
              placeholder="Например: 85000"
              required
              @keydown="blockLetters"
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeCreateOrder">Отмена</button>
            <button type="submit" class="btn-submit">Создать заказ</button>
          </div>
        </form>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/ui/Header.vue'
import Footer from '@/ui/Footer.vue'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

export default {
  name: 'TransportTender',
  components: { Header, Footer },
  data() {
    return {
      search: '',
      type: '',
      openFaq: null,
      observer: null,
      statRefs: [],
      showCreateOrderModal: false,
      newOrder: {
        accessType: 'public',
        from: '',
        to: '',
        type: '',
        volume: '',
        dateFrom: '',
        dateTo: '',
        price: ''
      },
      cities: [
        'Москва',
        'Санкт-Петербург',
        'Новосибирск',
        'Красноярск',
        'Екатеринбург',
        'Казань',
        'Самара',
        'Владивосток',
        'Ростов-на-Дону',
        'Нижний Новгород',
        'Челябинск',
        'Уфа',
        'Пермь',
        'Воронеж',
        'Волгоград'
      ],
      stats: [
        { id: 1, target: 1200, suffix: '+', label: 'заказов выполнено', displayValue: 0 },
        { id: 2, target: 18, suffix: '%', label: 'средняя экономия', displayValue: 0 },
        { id: 3, target: 500, suffix: '+', label: 'перевозчиков в базе', displayValue: 0 },
      ],
      companies: [
        { id: 1, name: 'ТрансЛогистик' },
        { id: 2, name: 'ГрузоТех' },
        { id: 3, name: 'МегаТранс' },
        { id: 4, name: 'КаргоПро' },
        { id: 5, name: 'ЛогистикПлюс' },
        { id: 6, name: 'АвтоФрахт' },
      ],
      filters: [
        { id: 1, label: 'Все', value: '' },
        { id: 2, label: 'Сборные', value: 'Сборные' },
        { id: 3, label: 'Рефрижераторные', value: 'Рефрижераторные' },
        { id: 4, label: 'Негабарит', value: 'Негабарит' },
        { id: 5, label: 'Стандартные', value: 'Стандартные' },
      ],
      features: [
        {
          id: 1,
          slug: 'analytics',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
          title: 'Аналитический модуль',
          text: 'Сравнительные отчёты, прогнозирование ставок и контроль KPI перевозчиков в едином окне.',
        },
        {
          id: 2,
          slug: 'end-to-end',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
          title: 'Сквозной процесс',
          text: 'От заявки до закрывающих документов — всё бесшовно интегрировано с вашей ERP-системой.',
        },
        {
          id: 3,
          slug: 'independence',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
          title: 'Независимость решений',
          text: 'Система исключает человеческий фактор и конфликт интересов при выборе перевозчика.',
        },
        {
          id: 4,
          slug: 'verified',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
          title: 'Проверенные перевозчики',
          text: 'Доступ только для компаний, прошедших строгую верификацию документов и истории.',
        },
      ],
      steps: [
        { id: 1, title: 'Создание заказа', text: 'Укажите направление, объёмы и требования к перевозчикам.' },
        { id: 2, title: 'Подтверждение админом', text: 'Администратор проверяет заказ и активирует его.' },
        { id: 3, title: 'Отбор заявок', text: 'Перевозчики подают заявки, админ выбирает подходящего.' },
        { id: 4, title: 'Исполнение', text: 'Перевозчик выполняет заказ с контролем исполнения и бюджета.' },
      ],
      faq: [
        { id: 1, q: 'В чём разница между общим и личным заказом?', a: 'Общий заказ виден всем зарегистрированным перевозчикам. Личный заказ виден только тем перевозчикам, которых вы выбрали.' },
        { id: 2, q: 'Как формируется начальная цена?', a: 'Вы указываете начальную цену при создании заказа. Перевозчики могут предлагать свои цены в заявках.' },
        { id: 3, q: 'Можно ли задать эксклюзивные условия?', a: 'Да, вы можете настроить требования к транспорту, температурному режиму и срокам доставки.' },
        { id: 4, q: 'Как быстро определяется исполнитель?', a: 'Администратор рассматривает заявки и выбирает подходящего перевозчика. Обычно это занимает 1-3 дня.' },
      ],
      badgeMap: {
        'Негабарит': 'badge--high',
        'Рефрижераторные': 'badge--medium'
      }
    }
  },
  computed: {
    orderStore() {
      return useOrderStore()
    },
    userStore() {
      return useUserStore()
    },
    toast() {
      return useToastStore()
    },
    isCarrier() {
      return this.userStore.user?.accountType === 'carrier'
    },
    isCustomer() {
      return this.userStore.user?.accountType === 'customer'
    },
    orders() {
      if (this.userStore.isAdmin) {
        return this.orderStore.activeOrders
      }
      if (this.isCarrier) {
        return this.orderStore.activeOrders
      }
      return this.orderStore.activeOrders
    },
    recentOrders() {
      return this.orders.slice(0, 3)
    },
    filteredOrders() {
      const s = this.search.toLowerCase().trim()
      const t = this.type
      return this.orders.filter((order) => {
        const matchSearch = !s || order.route.toLowerCase().includes(s)
        const matchType = !t || order.type === t
        return matchSearch && matchType
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.scrollToTop()
    })
  },
  mounted() {
    this.initTheme()
    this.initScrollAnimations()
    this.initCountUp()
    this.scrollToTop()
    this.orderStore.fetchOrders()
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
  methods: {
    scrollToTop() {
      this.$nextTick(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'instant' })
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }, 100)
      })
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme') || 'dark'
      document.documentElement.setAttribute('data-theme', savedTheme)
    },
    openCreateOrder() {
      if (!this.userStore.isAuthenticated) {
        this.toast.error('Войдите в аккаунт, чтобы создать заказ')
        this.$router.push('/login')
        return
      }
      if (this.userStore.isAdmin) {
        this.toast.error('Администраторы не могут создавать заказы')
        return
      }
      this.showCreateOrderModal = true
    },
    closeCreateOrder() {
      this.showCreateOrderModal = false
      this.newOrder = {
        accessType: 'public',
        from: '',
        to: '',
        type: '',
        volume: '',
        dateFrom: '',
        dateTo: '',
        price: ''
      }
    },
    blockLetters(event) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
      if (allowedKeys.includes(event.key)) return
      if (!/^\d$/.test(event.key)) {
        event.preventDefault()
      }
    },
    formatPrice(price) {
      const num = parseInt(price)
      if (isNaN(num)) return price
      return num.toLocaleString('ru-RU') + ' ₽'
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    async submitOrder() {
      if (!this.newOrder.from || !this.newOrder.to) {
        this.toast.error('Выберите города отправления и назначения')
        return
      }
      if (this.newOrder.from === this.newOrder.to) {
        this.toast.error('Города отправления и назначения должны отличаться')
        return
      }
      if (!this.newOrder.dateFrom || !this.newOrder.dateTo) {
        this.toast.error('Укажите даты начала и окончания')
        return
      }
      if (new Date(this.newOrder.dateFrom) > new Date(this.newOrder.dateTo)) {
        this.toast.error('Дата начала не может быть позже даты окончания')
        return
      }
      if (!this.newOrder.price || parseInt(this.newOrder.price) <= 0) {
        this.toast.error('Укажите корректную начальную цену')
        return
      }

        const orderData = {
          route: `${this.newOrder.from} — ${this.newOrder.to}`,
          from: this.newOrder.from,
          to: this.newOrder.to,
          type: this.newOrder.type,
          volume: this.newOrder.volume,
          dateFrom: this.newOrder.dateFrom,
          dateTo: this.newOrder.dateTo,
          price: parseInt(this.newOrder.price),
          accessType: this.newOrder.accessType,
          createdBy: this.userStore.user?.id,
          customerName: `${this.userStore.user?.firstName || ''} ${this.userStore.user?.lastName || ''}`.trim(),
          customerPhone: this.userStore.user?.phone || '',
          customerEmail: this.userStore.user?.email || ''
        }

const result = this.orderStore.createOrder(orderData)

      if (result.success) {
        if (this.newOrder.accessType === 'private') {
          this.toast.success('Личный заказ создан и активирован!')
        } else {
          this.toast.success('Заказ создан и отправлен на подтверждение администратору!')
        }
        this.closeCreateOrder()
      } else {
        this.toast.error(result.message || 'Ошибка создания заказа')
      }
    },
    canApply(order) {
      if (!this.userStore.isAuthenticated) return false
      if (this.userStore.isAdmin) return false
      if (!this.isCarrier) return false
      return !this.hasApplied(order.id)
    },
    hasApplied(orderId) {
      if (!this.userStore.user) return false
      return this.orderStore.hasApplied(orderId, this.userStore.user.id)
    },
async applyToOrder(order) {
  if (!this.userStore.isAuthenticated) {
    this.toast.error('Войдите в аккаунт, чтобы участвовать в заказе')
    this.$router.push('/login')
    return
  }
  
      const applicantInfo = {
        userId: this.userStore.user.id,
        name: `${this.userStore.user?.firstName || ''} ${this.userStore.user?.lastName || ''}`.trim(),
        phone: this.userStore.user?.phone || '',
        company: this.userStore.user?.company || ''
      }
      
      const result = this.orderStore.applyToOrder(order.id, applicantInfo)
      
      if (result.success) {
        this.toast.success('Заявка отправлена! Администратор рассмотрит её в ближайшее время.')
      } else {
        this.toast.error(result.message || 'Ошибка отправки заявки')
      }
    },
    scrollToOrders() {
      this.$refs.ordersSection?.scrollIntoView({ behavior: 'smooth' })
    },
    goToFeature(slug) {
      this.$router.push(`/feature/${slug}`).catch(e => {
        if (e.name !== 'NavigationDuplicated') console.error(e)
      })
    },
    toggleFaq(id) {
      this.openFaq = this.openFaq === id ? null : id
    },
    getBadgeClass(type) {
      return this.badgeMap[type] || 'badge--low'
    },
    setStatRef(el) {
      if (el) this.statRefs.push(el)
    },
    initScrollAnimations() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const el = entry.target
            el.classList.add('is-visible')
            if (el.classList.contains('faq')) {
              el.classList.add('section-visible')
            }
            const children = el.querySelectorAll('.reveal')
            children.forEach((child, i) => {
              child.style.setProperty('--i', i)
              requestAnimationFrame(() => {
                child.classList.add('is-visible')
              })
            })
            this.observer.unobserve(el)
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      )
      const sections = [
        this.$refs.featuresSection,
        this.$refs.ordersSection,
        this.$refs.processSection,
        this.$refs.faqSection,
        this.$refs.socialRef
      ].filter(Boolean)
      sections.forEach((section) => this.observer.observe(section))
    },
    initCountUp() {
      this.statRefs = []
      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const index = this.statRefs.indexOf(entry.target)
            if (index !== -1) {
              this.animateStat(index)
            }
            statObserver.unobserve(entry.target)
          })
        },
        { threshold: 0.3 }
      )
      this.$nextTick(() => {
        this.statRefs.forEach((el) => {
          if (el) statObserver.observe(el)
        })
      })
    },
    animateStat(index) {
      const stat = this.stats[index]
      const duration = 1800
      const startTime = performance.now()
      const step = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        stat.displayValue = Math.round(eased * stat.target)
        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    }
  }
}
</script>




<style scoped>
.saas-landing {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.5s ease;
}
.date-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
}

.date-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1);
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.8);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

[data-theme="light"] .date-input::-webkit-calendar-picker-indicator {
  filter: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent-color);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
  border: 1px solid rgba(var(--accent-rgb), 0.15);
}

.section-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 17px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto;
}
.my-order-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.applied-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 10px;
  background: rgba(45, 192, 113, 0.15);
  color: var(--accent-color);
  font-weight: 600;
  font-size: 13px;
  border: 1px solid rgba(45, 192, 113, 0.3);
}

.white-text {
  color: #ffffff;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #2DC071, #28a45e);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  padding: 12px 24px;
  transition: all var(--motion-duration-base) var(--motion-ease-out);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  padding: 12px 24px;
  transition: all var(--motion-duration-base) var(--motion-ease-out);
}

.btn-secondary:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.1);
}

.btn-secondary-demo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  padding: 12px 24px;
  transition: all var(--motion-duration-base) var(--motion-ease-out);
}

.btn-secondary-demo:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.1);
}

[data-theme="dark"] .btn-secondary-demo {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

[data-theme="dark"] .btn-secondary-demo:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 14px;
}

.btn--accent {
  background: rgba(45, 192, 113, 0.12);
  color: var(--accent-color);
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.btn--accent:hover {
  background: rgba(45, 192, 113, 0.2);
  transform: translateY(-2px);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity var(--motion-duration-slow) var(--motion-ease-out),
    transform var(--motion-duration-slow) var(--motion-ease-out);
  will-change: transform, opacity;
  transition-delay: calc(var(--i, 0) * var(--motion-stagger));
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes heroTitlePop {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  60% {
    opacity: 1;
    transform: translateY(-2px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.hero-enter {
  opacity: 0;
  animation: heroFadeUp var(--motion-duration-slow) var(--motion-ease-out) forwards;
}

.hero-enter-title {
  opacity: 0;
  animation: heroTitlePop var(--motion-duration-slow) var(--motion-ease-out) forwards;
}

.hero-enter[data-delay="1"] { animation-delay: 0ms; }
.hero-enter[data-delay="2"],
.hero-enter-title[data-delay="2"] { animation-delay: 120ms; }
.hero-enter[data-delay="3"] { animation-delay: 240ms; }
.hero-enter[data-delay="4"] { animation-delay: 380ms; }
.hero-enter[data-delay="5"] { animation-delay: 520ms; }
.hero-enter[data-delay="6"] { animation-delay: 680ms; }

.gradient-text {
  background: linear-gradient(
    135deg,
    var(--accent-color) 0%,
    #4ECDC4 25%,
    #2DD4BF 50%,
    #4ECDC4 75%,
    var(--accent-color) 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hover-lift {
  transition:
    transform var(--motion-duration-base) var(--motion-ease-out),
    box-shadow var(--motion-duration-base) var(--motion-ease-out),
    border-color var(--motion-duration-base) var(--motion-ease-out);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px var(--shadow-color);
  border-color: rgba(var(--accent-rgb), 0.4);
}

.btn-glow::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%);
  opacity: 0;
  transition: opacity var(--motion-duration-fast) var(--motion-ease-out);
}

.btn-glow:hover::after {
  opacity: 1;
}

.hero {
  padding: 140px 0 80px;
  position: relative;
  overflow: hidden;
  background: #000000;
}

.hero-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(
    ellipse at center,
    rgba(var(--accent-rgb), 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
  animation: heroGlow 10s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
}

.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent-color);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 28px;
  border: 1px solid rgba(var(--accent-rgb), 0.2);
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0); }
}

.hero-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
  color: #ffffff;
}

.hero-description {
  font-size: 18px;
  color: #b0b0b0;
  line-height: 1.65;
  margin-bottom: 36px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 56px;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  min-width: 120px;
}

.hero-stat:hover {
  border-color: rgba(var(--accent-rgb), 0.4);
}

.hero-stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-color);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.hero-stat-label {
  font-size: 12px;
  color: #a0a0a0;
  margin-top: 4px;
}

.hero-visual {
  position: relative;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.3), transparent);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dashboard-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
}

.dashboard-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-color);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.5);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(var(--accent-rgb), 0.15);
  color: var(--accent-color);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.dashboard-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dashboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  border-radius: 12px;
  transition: background var(--motion-duration-fast) var(--motion-ease-out);
}

.dashboard-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.dashboard-item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-route {
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
}

.dashboard-meta {
  font-size: 12px;
  color: #a0a0a0;
}

.dashboard-price {
  font-weight: 700;
  color: var(--accent-color);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.dashboard-empty {
  padding: 20px;
  text-align: center;
  color: #a0a0a0;
  font-size: 14px;
}

.dashboard-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dashboard-footer-text {
  font-size: 12px;
  color: #a0a0a0;
  white-space: nowrap;
}

.dashboard-progress {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.dashboard-progress-bar {
  height: 100%;
  width: 72%;
  background: linear-gradient(90deg, var(--accent-color), #4ECDC4);
  border-radius: 2px;
}

.social-proof {
  padding: 48px 0 64px;
  border-bottom: 1px solid var(--border-color);
}

.social-label {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
  margin-bottom: 32px;
}

.logos-track {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}

.logo-item {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-muted);
  opacity: 0.5;
  transition: all var(--motion-duration-base) var(--motion-ease-out);
  letter-spacing: -0.01em;
}

.logo-item:hover {
  opacity: 1;
  color: var(--text-secondary);
}

.logo-animate {
  transition: transform 0.3s ease, opacity 0.3s ease, color 0.3s ease;
}

.logo-animate:hover {
  transform: translateY(-5px) scale(1.05);
}

.features {
  padding: 100px 0;
}

.live-orders {
  padding: 80px 0;
  background: #000000;
}

.process {
  padding: 100px 0;
}

.faq {
  padding: 80px 0;
  background: #000000;
}

.cta-fullwidth {
  width: 100%;
  background: #000000;
  padding: 80px 0;
  margin: 0;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .features {
  background: #ffffff;
}

[data-theme="dark"] .features {
  background: #000000;
}

[data-theme="light"] .process {
  background: #ffffff;
}

[data-theme="dark"] .process {
  background: #000000;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--accent-rgb), 0.3);
  box-shadow: 0 20px 40px -12px var(--shadow-color);
}

[data-theme="light"] .feature-card {
  background: #ffffff;
  border-color: #e0e0e0;
}

[data-theme="dark"] .feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.3), transparent);
  opacity: 0;
  transition: opacity var(--motion-duration-base) var(--motion-ease-out);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--accent-rgb), 0.1);
  border-radius: 14px;
  margin-bottom: 20px;
  color: var(--accent-color);
  border: 1px solid rgba(var(--accent-rgb), 0.15);
}

.feature-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

[data-theme="light"] .feature-title {
  color: #1a1a1a;
}

[data-theme="dark"] .feature-title {
  color: #ffffff;
}

.feature-text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

[data-theme="light"] .feature-text {
  color: #4a4a4a;
}

[data-theme="dark"] .feature-text {
  color: #b0b0b0;
}

.live-orders__filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 48px;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 8px 18px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.filter-chip.active {
  background: rgba(45, 192, 113, 0.15);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.search-group {
  position: relative;
}

.search-group svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0a0a0;
}

.search-input {
  padding: 12px 16px 12px 42px;
  width: 280px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.08);
}

.live-orders__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.order-list-move,
.order-list-enter-active,
.order-list-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.order-list-enter-from,
.order-list-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}

.order-list-leave-active {
  position: absolute;
  width: calc(100% - 24px);
}

.order-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.order-card:hover {
  transform: translateY(-5px);
  border-color: rgba(45, 192, 113, 0.3);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.order-card__badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 16px;
}

.badge--high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.badge--medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.badge--low {
  background: rgba(45, 192, 113, 0.2);
  color: var(--accent-color);
}

.order-card__route {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff;
}

.order-card__details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-detail__label {
  font-size: 13px;
  color: #a0a0a0;
}

.order-detail__value {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.order-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-price__label {
  font-size: 11px;
  color: #a0a0a0;
  display: block;
}

.order-price__value {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-color);
}

.private-badge {
  font-size: 12px;
  color: #a0a0a0;
  font-weight: 500;
}

.order-card__bids {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bid-avatars {
  display: flex;
  align-items: center;
}

.bid-avatar {
  width: 28px;
  height: 28px;
  background: rgba(45, 192, 113, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-left: -6px;
  border: 1px solid #000000;
  color: #ffffff;
}

.bid-avatar:first-child {
  margin-left: 0;
}

.bid-count {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  margin-left: -6px;
  color: #ffffff;
}

.bid-text {
  font-size: 12px;
  color: #a0a0a0;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  grid-column: 1 / -1;
}

.empty-icon {
  color: #a0a0a0;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
}

.empty-text {
  color: #a0a0a0;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--motion-duration-fast) var(--motion-ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
}

.process-step {
  text-align: center;
  position: relative;
}

.step-visual {
  position: relative;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.step-number {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2DC071, #28a45e);
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  position: relative;
  z-index: 2;
  transition: all var(--motion-duration-base) var(--motion-ease-spring);
  box-shadow: 0 4px 16px rgba(var(--accent-rgb), 0.3);
}

.process-step:hover .step-number {
  transform: scale(1.1) rotate(-3deg);
  box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.4);
}

.step-connector {
  position: absolute;
  top: 50%;
  left: calc(50% + 36px);
  right: calc(-50% + 36px);
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 1;
}

.step-connector-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-color), rgba(var(--accent-rgb), 0.2));
  border-radius: 1px;
}

.step-connector-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
  opacity: 0.4;
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

[data-theme="light"] .step-title {
  color: #1a1a1a;
}

[data-theme="dark"] .step-title {
  color: #ffffff;
}

.step-text {
  font-size: 14px;
  line-height: 1.6;
}

[data-theme="light"] .step-text {
  color: #4a4a4a;
}

[data-theme="dark"] .step-text {
  color: #b0b0b0;
}

.faq__grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.section-visible .faq-item {
  opacity: 1;
  transform: translateY(0);
}

.section-visible .faq-item:nth-child(1) { transition-delay: 0.05s; }
.section-visible .faq-item:nth-child(2) { transition-delay: 0.1s; }
.section-visible .faq-item:nth-child(3) { transition-delay: 0.15s; }
.section-visible .faq-item:nth-child(4) { transition-delay: 0.2s; }

.faq-item__question {
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s ease;
  color: #ffffff;
}

.faq-item__question:hover {
  color: var(--accent-color);
}

.faq-item__question svg {
  transition: transform 0.2s ease;
  color: var(--accent-color);
}

.faq-item__question svg.rotated {
  transform: rotate(180deg);
}

.faq-item__answer {
  padding: 0 24px 24px;
  font-size: 15px;
  color: #b0b0b0;
  line-height: 1.6;
}

.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.cta-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.cta-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.cta-stat-side {
  flex: 1;
  text-align: center;
  min-width: 160px;
}

.cta-stat-side .cta-stat-value {
  font-size: 42px;
  font-weight: 800;
  color: var(--accent-color);
  margin-bottom: 8px;
  white-space: nowrap;
}

.cta-stat-side .cta-stat-label {
  font-size: 14px;
  color: #b0b0b0;
}

.cta-content {
  flex: 2;
  text-align: center;
  min-width: 280px;
}

.cta-badge {
  display: inline-block;
  background: rgba(45, 192, 113, 0.15);
  color: var(--accent-color);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(45, 192, 113, 0.3);
}

.cta-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  color: #ffffff;
}

.cta-text {
  font-size: 18px;
  color: #b0b0b0;
  margin-bottom: 32px;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.cta-note {
  font-size: 14px;
  color: #888888;
  display: block;
}

.cta-inner .btn-primary {
  background: linear-gradient(135deg, #2DC071, #1f9b59);
  box-shadow: 0 8px 24px rgba(45, 192, 113, 0.3);
}

.cta-inner .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(45, 192, 113, 0.4);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input,
.form-group select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1);
}

.form-group select {
  cursor: pointer;
}

.form-group select option {
  background: var(--bg-card);
  color: var(--text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.access-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.access-type-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.access-type-card:hover {
  border-color: rgba(45, 192, 113, 0.3);
}

.access-type-card.active {
  border-color: var(--accent-color);
  background: rgba(45, 192, 113, 0.05);
}

.access-type-card svg {
  width: 24px;
  height: 24px;
  color: var(--accent-color);
  flex-shrink: 0;
}

.access-type-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.access-type-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.08);
}

.btn-submit {
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #2DC071, #28a45e);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(45, 192, 113, 0.2);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(45, 192, 113, 0.3);
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-visual {
    max-width: 500px;
    margin: 0 auto;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .step-connector {
    display: none;
  }
  
  .cta-layout {
    flex-direction: column;
    gap: 32px;
  }
  
  .cta-stat-side {
    flex: auto;
    width: 100%;
  }
  
  .cta-stat-side .cta-stat-value {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 0 60px;
  }

  .hero-stats {
    gap: 12px;
  }

  .hero-stat {
    min-width: 100px;
    padding: 12px 14px;
  }

  .hero-stat-value {
    font-size: 22px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .process-steps {
    grid-template-columns: 1fr;
  }

  .live-orders__filters {
    flex-direction: column;
  }

  .search-group {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .live-orders__grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 28px;
  }

  .filter-group {
    justify-content: center;
  }

  .cta-fullwidth {
    padding: 60px 0;
  }

  .cta-title {
    font-size: 28px;
  }

  .cta-text {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .logos-track {
    gap: 24px;
  }

  .logo-item {
    font-size: 14px;
  }

  .modal-content {
    padding: 30px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .access-type-selector {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
.applied-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 10px;
  background: rgba(45, 192, 113, 0.15);
  color: var(--accent-color);
  font-weight: 600;
  font-size: 13px;
  border: 1px solid rgba(45, 192, 113, 0.3);
}
.cta-layout-text {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.modal-form select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
}

.modal-form select:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1);
}

.modal-form select option {
  background: var(--bg-card);
  color: var(--text-primary);
}

.modal-form input[type="date"] {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
}

.modal-form input[type="date"]:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1);
}

.modal-form input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.modal-form input[type="number"] {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
}

.modal-form input[type="number"]:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1);
}

.modal-form input[type="number"]::-webkit-inner-spin-button,
.modal-form input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>