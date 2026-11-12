import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { useUserStore } from '@/stores/user'

const page = (title, extra = {}) => ({ title, ...extra })

const routes = [
  { path: '/', name: 'Home', component: Home, meta: page('Грузоперевозки по России') },
  { path: '/login', name: 'Login', component: () => import('../pages/Login.vue'), meta: page('Вход', { guestOnly: true }) },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue'), meta: page('Регистрация', { guestOnly: true }) },

  // Публичные страницы
  { path: '/services', name: 'Services', component: () => import('../pages/Services.vue'), meta: page('Услуги') },
  { path: '/transport-tender', name: 'TransportTender', component: () => import('../pages/TransportTender.vue'), meta: page('Транспортные тендеры') },
  { path: '/about', name: 'About', component: () => import('../pages/About.vue'), meta: page('О компании') },
  { path: '/contacts', name: 'Contacts', component: () => import('../pages/Contacts.vue'), meta: page('Контакты') },
  { path: '/tms', name: 'TMS', component: () => import('../pages/TMS.vue'), meta: page('TMS-система') },
  { path: '/tracking', name: 'Tracking', component: () => import('../pages/Tracking.vue'), meta: page('Трекинг грузов') },
  { path: '/news', name: 'News', component: () => import('../pages/News.vue'), meta: page('Новости') },
  { path: '/privacy', name: 'Privacy', component: () => import('../pages/Privacy.vue'), meta: page('Политика и условия') },
  { path: '/feature/analytics', name: 'AnalyticsModule', component: () => import('../features/AnalyticsModule.vue'), meta: page('Аналитика') },
  { path: '/feature/end-to-end', name: 'EndToEndProcess', component: () => import('../features/EndToEndProcess.vue'), meta: page('Сквозной процесс') },
  { path: '/feature/independence', name: 'IndependenceModule', component: () => import('../features/IndependenceModule.vue'), meta: page('Независимость решений') },
  { path: '/feature/verified', name: 'VerifiedCarriers', component: () => import('../features/VerifiedCarriers.vue'), meta: page('Проверенные перевозчики') },

  // Личный кабинет
  { path: '/profile', name: 'Profile', component: () => import('../pages/Profile.vue'), meta: page('Профиль', { requiresAuth: true }) },
  { path: '/settings', name: 'Settings', component: () => import('../pages/Settings.vue'), meta: page('Настройки', { requiresAuth: true }) },
  { path: '/orders', name: 'Orders', component: () => import('../pages/Orders.vue'), meta: page('Заказы', { requiresAuth: true }) },
  { path: '/carriers', name: 'Carriers', component: () => import('../pages/Carriers.vue'), meta: page('Перевозчики', { requiresAuth: true }) },
  { path: '/my-applications', name: 'MyApplications', component: () => import('../pages/MyApplications.vue'), meta: page('Мои заявки', { requiresAuth: true }) },
  { path: '/documents', name: 'Documents', component: () => import('../pages/Documents.vue'), meta: page('Документы', { requiresAuth: true }) },
  { path: '/reviews', name: 'Reviews', component: () => import('../pages/Reviews.vue'), meta: page('Отзывы', { requiresAuth: true }) },
  { path: '/chat', name: 'Chat', component: () => import('../pages/Chat.vue'), meta: page('Чат', { requiresAuth: true }) },
  { path: '/admin', name: 'AdminPanel', component: () => import('../pages/AdminPanel.vue'), meta: page('Админ-панель', { requiresAuth: true, requiresAdmin: true }) },

  // Аукционы
  { path: '/spot-auctions', name: 'SpotAuctions', component: () => import('../pages/SpotAuctions.vue'), meta: page('Спот-аукционы') },
  { path: '/auctions', name: 'AuctionList', component: () => import('../pages/AuctionList.vue'), meta: page('Аукционы', { requiresAuth: true }) },
  { path: '/create-auction', name: 'CreateAuction', component: () => import('../pages/CreateAuction.vue'), meta: page('Новый аукцион', { requiresAuth: true }) },
  { path: '/auction/:id', name: 'AuctionBidding', component: () => import('../pages/AuctionBidding.vue'), meta: page('Аукцион', { requiresAuth: true }) },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../fallback/NotFound.vue'), meta: page('Страница не найдена') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 90, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const hasToken = Boolean(localStorage.getItem('token'))

  // При открытии по прямой ссылке сначала дожидаемся профиля, иначе права проверяются по пустым данным
  if (hasToken) await userStore.ensureLoaded()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { path: '/profile' }
  }
  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { path: '/profile' }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — InterCargo` : 'InterCargo'
})

export default router
