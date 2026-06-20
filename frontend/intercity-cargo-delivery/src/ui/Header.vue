<template>
  <header class="header">
    <div class="video-container">
      <video class="background-video" autoplay muted loop playsinline>
        <source src="@/assets/videos/truck-aerial.mov" type="video/mp4">
      </video>
      <div class="video-overlay"></div>
    </div>
    <div class="container">
      <div class="top-bar">
        <div class="logo-area" @click="$router.push('/')" style="cursor: pointer;">
          <div class="logo-icon">
            <img src="@/assets/icons/logotip.png" alt="InterCargo">
          </div>
          <div class="logo-text">
            <span class="logo-cargo">Inter</span>
            <span class="logo-express">Cargo</span>
          </div>
        </div>
        <nav class="main-nav" :class="{ 'active': isMobileMenuOpen }">
          <div class="nav-items">
            <router-link to="/" class="nav-item" @click="closeMobileMenu">Главная</router-link>
            <router-link to="/services" class="nav-item" @click="closeMobileMenu">Услуги</router-link>
            <router-link to="/transport-tender" class="nav-item" @click="closeMobileMenu">Тарифы</router-link>
            <router-link to="/about" class="nav-item" @click="closeMobileMenu">О компании</router-link>
<router-link to="/contacts" class="nav-item" @click="closeMobileMenu">Контакты</router-link>
            
            <template v-if="userStore.isAuthenticated">
              <div class="user-dropdown" @click.stop="isDropdownOpen = !isDropdownOpen">
                <div class="user-avatar">{{ userInitials }}</div>
                <span class="user-name">Привет, {{ userStore.user?.firstName || 'Гость' }}</span>
                <svg class="dropdown-arrow" :class="{ 'open': isDropdownOpen }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <div class="dropdown-menu" v-if="isDropdownOpen" @click.stop>
                  <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Профиль
                  </router-link>
                  <router-link to="/settings" class="dropdown-item" @click="closeDropdown">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    Настройки
                  </router-link>
                  <div class="dropdown-item logout" @click="handleLogout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Выход
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="nav-item" @click="closeMobileMenu">Вход</router-link>
              <router-link to="/register" class="nav-item" @click="closeMobileMenu">Регистрация</router-link>
            </template>
          </div>
          <div class="nav-actions">
            <button class="nav-btn outline" @click="trackPackage">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="btn-text">Отследить груз</span>
            </button>
            <button class="nav-btn primary" @click="orderCall">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="btn-text">Заказать звонок</span>
            </button>
          </div>
          <div class="mobile-phone">
            <div class="phone-item">
              <div class="phone-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#2DC071"/>
                </svg>
              </div>
              <div class="phone-info">
                <div class="phone-label">Телефон</div>
                <a href="tel:+79188180890" class="phone-number">+7 (918) 818 08 90</a>
              </div>
            </div>
          </div>
        </nav>
        <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{'active':isMobileMenuOpen}">
          <span class="menu-line"></span>
          <span class="menu-line"></span>
          <span class="menu-line"></span>
        </button>
      </div>
      <div class="company-info">
        <div class="info-text">
          <div class="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            На рынке с 2010 года • Более 5000 клиентов
          </div>
          <h1 class="main-title">
            <span class="title-line">Междугородние</span>
            <span class="title-line accent">грузоперевозки</span>
            <span class="title-line">по всей России</span>
          </h1>
          <p class="description">
            Надежная и быстрая доставка грузов любой сложности.<br>
            Современный автопарк, профессиональные водители, полное страхование<br>
            и круглосуточная поддержка клиентов.
          </p>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">12+</div>
              <div class="stat-label">Лет опыта</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">150+</div>
              <div class="stat-label">Единиц техники</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">5000+</div>
              <div class="stat-label">Довольных клиентов</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Поддержка</div>
            </div>
          </div>
          <div class="advantages-grid">
            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="advantage-content">
                <h3 class="advantage-title">Быстрая доставка</h3>
                <p class="advantage-desc">Сроки от 1 дня</p>
              </div>
            </div>
            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="advantage-content">
                <h3 class="advantage-title">Полное страхование</h3>
                <p class="advantage-desc">100% гарантия сохранности</p>
              </div>
            </div>
            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="advantage-content">
                <h3 class="advantage-title">Онлайн-отслеживание</h3>
                <p class="advantage-desc">Контроль в реальном времени</p>
              </div>
            </div>
          </div>
        </div>
        <div class="request-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 20V16" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 12H16.01" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-title-content">
              <h3>Получите коммерческое предложение</h3>
              <p>Индивидуальный расчет для вашего груза</p>
            </div>
          </div>
          <div class="card-features">
            <div class="card-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#2DC071" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Точный расчет стоимости</span>
            </div>
            <div class="card-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#2DC071" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Оптимальные сроки доставки</span>
            </div>
            <div class="card-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#2DC071" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Персональный менеджер</span>
            </div>
            <div class="card-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#2DC071" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Специальные условия</span>
            </div>
          </div>
          <div class="request-form">
            <div class="form-group">
              <input type="text" placeholder="Ваше имя" v-model="offerName" :class="{'error': formErrors.includes('Введите имя')}">
            </div>
            <div class="form-group">
              <input type="tel"
                placeholder="+7 (___) ___-__-__"
                v-model="offerPhone"
                @input="formatPhone"
                @focus="formatPhone"
                :class="{ 'error': formErrors.includes('Введите корректный телефон') }">
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email" v-model="offerEmail" :class="{'error': formErrors.includes('Введите корректный email') }">
            </div>
            <button class="submit-btn" @click="sendOfferRequest" :disabled="isSubmitting">
              <span v-if="!isSubmitting">Получить предложение</span>
              <span v-else class="loading-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="loading-spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="60" stroke-dashoffset="40" stroke-linecap="round"/>
                </svg>
                Отправка...
              </span>
            </button>
            <div class="privacy-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 9.37258 22 4 12 4C2 4 2 9.37258 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Нажимая кнопку, вы соглашаетесь с <a href="/privacy">политикой конфиденциальности</a></span>
            </div>
          </div>
          <div class="card-contacts">
            <div class="contact-item">
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#2DC071"/>
                </svg>
              </div>
              <div class="contact-info">
                <div class="contact-label">Телефон</div>
                <a href="tel:89188180890" class="contact-value">8 (918) 818 08 90</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 0 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="#2DC071" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="contact-info">
                <div class="contact-label">Email</div>
                <a href="mailto:info@fastdelivery.ru" class="contact-value">info@fastdelivery.ru</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-down-btn" @click="scrollToNextSection">
        <div class="scroll-text">Почему выбирают нас</div>
        <div class="scroll-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 12L12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';

export default {
  name: "HeaderComponent",
  data() {
    return {
      offerName: '',
      offerPhone: '',
      offerEmail: '',
      isMobileMenuOpen: false,
      isDropdownOpen: false,
      isSubmitting: false,
      formErrors: []
    };
  },
  computed: {
    userInitials() {
      const user = this.userStore.user;
      if (!user) return '?';
      return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || '?';
    }
  },
  beforeCreate() {
    this.userStore = useUserStore();
    this.toast = useToastStore();
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.user-dropdown')) {
        this.isDropdownOpen = false;
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    handleLogout() {
      this.userStore.logout();
      this.closeDropdown();
      this.toast.success('Вы вышли из аккаунта');
      this.$router.push('/');
    },
    handleResize() {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    },
    scrollToNextSection() {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    formatPhone(event) {
      let value = this.offerPhone.replace(/\D/g, '');
      if (!value.startsWith('7') && !value.startsWith('8')) {
        value = '7' + value;
      }
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      let formatted = '+7 ';
      if (value.length > 1) {
        formatted += '(' + value.slice(1, 4);
      }
      if (value.length >= 4) {
        formatted += ') ' + value.slice(4, 7);
      }
      if (value.length >= 7) {
        formatted += '-' + value.slice(7, 9);
      }
      if (value.length >= 9) {
        formatted += '-' + value.slice(9, 11);
      }
      this.offerPhone = formatted;
      if (event.target) {
        setTimeout(() => {
          event.target.selectionStart = event.target.selectionEnd = formatted.length;
        }, 0);
      }
    },
    validateForm() {
      this.formErrors = [];
      if (!this.offerName.trim()) {
        this.formErrors.push('Введите имя');
      }
      const phoneDigits = this.offerPhone.replace(/\D/g, '');
      if (phoneDigits.length !== 11) {
        this.formErrors.push('Введите корректный телефон');
      }
      if (this.offerEmail && !this.validateEmail(this.offerEmail)) {
        this.formErrors.push('Введите корректный email');
      }
      return this.formErrors.length === 0;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async sendOfferRequest() {
      if (!this.validateForm()) {
        this.showFormErrors();
        return;
      }
      this.isSubmitting = true;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/contact/offer-request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.offerName,
            phone: this.offerPhone,
            email: this.offerEmail
          })
        });
        const data = await response.json();
        if (response.ok) {
          this.toast.success('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
          this.offerName = '';
          this.offerPhone = '';
          this.offerEmail = '';
          this.formErrors = [];
        } else {
          this.toast.error(data.message || 'Ошибка при отправке');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        this.toast.error('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
      } finally {
        this.isSubmitting = false;
      }
    },
    showFormErrors() {
      const errorMessage = this.formErrors.join('\n');
      this.toast.error('Пожалуйста, исправьте ошибки:\n' + errorMessage);
    },
    orderCall() {
      this.$router.push('/callback');
    },
    trackPackage() {
      this.$router.push('/tracking');
    }
  }
};
</script>

<style scoped>
.header {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0a1929 0%, #1a2a3a 100%);
}
.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}
.video-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(10, 25, 41, 0.95) 0%, rgba(26, 42, 58, 0.85) 100%);
}
.container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  box-sizing: border-box;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  animation: slideDown 0.8s ease-out;
  width: 100%;
}
.logo-area {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  min-height: 90px;
  flex-shrink: 0;
}
.logo-icon {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}
.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  margin-left: -30px;
}
.logo-cargo {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #ffffff;
}
.logo-express {
  font-size: 28px;
  font-weight: 800;
  color: #2DC071;
  letter-spacing: 1.5px;
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 40px;
}
.nav-items {
  display: flex;
  gap: 30px;
  margin-left: 30px;
  align-items: center;
}
.nav-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.nav-item:hover {
  color: #ffffff;
}
.nav-item.router-link-active {
  color: #ffffff;
}
.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #2DC071;
  border-radius: 1px;
}
.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(45, 192, 113, 0.3);
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2DC071, #28a45e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}
.dropdown-arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}
.dropdown-arrow.open {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 220px;
  background: rgba(20, 30, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: dropdownFade 0.2s ease;
}
@keyframes dropdownFade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}
.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}
.dropdown-item.logout {
  color: #ef4444;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 4px;
  padding-top: 12px;
}
.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.nav-btn.primary {
  background: #2DC071;
  color: #ffffff;
}
.nav-btn.primary:hover {
  background: #28a45e;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(45, 192, 113, 0.3);
}
.nav-btn.outline {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.nav-btn.outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1000;
  flex-direction: column;
  gap: 4px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
}
.menu-line {
  width: 24px;
  height: 2px;
  background: #ffffff;
  transition: all 0.3s ease;
  border-radius: 1px;
}
.mobile-menu-btn.active .menu-line:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}
.mobile-menu-btn.active .menu-line:nth-child(2) {
  opacity: 0;
}
.mobile-menu-btn.active .menu-line:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}
.mobile-phone {
  display: none;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: rgba(45, 192, 113, 0.1);
  border-radius: 16px;
  margin-top: 20px;
  border: 1px solid rgba(45, 192, 113, 0.2);
  width: 100%;
}
.phone-item {
  display: flex;
  align-items: center;
  gap: 15px;
}
.phone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(45, 192, 113, 0.15);
  border-radius: 12px;
  flex-shrink: 0;
  padding: 8px;
}
.phone-icon svg {
  width: 24px;
  height: 24px;
}
.phone-info {
  display: flex;
  flex-direction: column;
}
.phone-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
  font-weight: 500;
}
.phone-number {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.phone-number:hover {
  color: #2DC071;
  transform: translateX(2px);
}
.company-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 60px 0;
  flex: 1;
  width: 100%;
}
.info-text {
  max-width: 650px;
  width: 100%;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(45, 192, 113, 0.15);
  border: 1px solid rgba(45, 192, 113, 0.3);
  color: #2DC071;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
}
.main-title {
  font-size: 64px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 30px;
  line-height: 1.1;
}
.title-line {
  display: block;
}
.title-line.accent {
  background: linear-gradient(90deg, #2DC071, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.description {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 40px;
  font-weight: 300;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}
.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 0;
}
.stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(45, 192, 113, 0.2);
  transform: translateY(-2px);
}
.stat-number {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(90deg, #2DC071, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}
.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
  width: 100%;
}
.advantage-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  transition: 0.3s;
  min-width: 240px;
  backdrop-filter: blur(10px);
}
.advantage-card:hover {
  transform: translateY(-3px);
  border-color: rgba(45,192,113,0.35);
  background: rgba(255,255,255,0.06);
}
.advantage-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(45,192,113,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.advantage-content {
  flex: 1;
  min-width: 0;
}
.advantage-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}
.advantage-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}
.request-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  margin-left: auto;
}
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}
.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(45, 192, 113, 0.15);
  border-radius: 16px;
  flex-shrink: 0;
}
.card-title-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
}
.card-title-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}
.card-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}
.card-feature {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-feature svg {
  flex-shrink: 0;
}
.card-feature span {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
}
.request-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}
.form-group input {
  width: 100%;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;
}
.form-group input:focus {
  outline: none;
  border-color: #2DC071;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.1);
}
.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
.form-group input[type="tel"] {
  letter-spacing: 1px;
}
.form-group input.error {
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.05);
}
.form-group input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
}
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 20px;
  background: #2DC071;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}
.submit-btn:hover:not(:disabled) {
  background: #28a45e;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(45, 192, 113, 0.3);
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.loading-text {
  display: flex;
  align-items: center;
  gap: 10px;
}
.loading-spinner {
  animation: spin 1s linear infinite;
}
.privacy-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-top: 20px;
}
.privacy-notice span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}
.privacy-notice a {
  color: #2DC071;
  text-decoration: none;
  transition: color 0.3s ease;
}
.privacy-notice a:hover {
  color: #4ECDC4;
  text-decoration: underline;
}
.card-contacts {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
}
.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: rgba(45, 192, 113, 0.1);
  border-radius: 14px;
  flex-shrink: 0;
  padding: 10px;
}
.contact-icon svg {
  width: 24px;
  height: 24px;
}
.contact-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.contact-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
  font-weight: 500;
}
.contact-value {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  word-break: break-word;
}
.contact-value:hover {
  color: #2DC071;
  transform: translateX(2px);
}
.scroll-down-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  margin-top: auto;
  padding-bottom: 40px;
}
.scroll-down-btn:hover {
  opacity: 1;
  transform: translateY(5px);
}
.scroll-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.scroll-arrow {
  animation: bounce 2s infinite;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@media (max-width: 1600px) {
  .container {
    max-width: 1200px;
    padding: 30px 40px;
  }
  .main-title {
    font-size: 56px;
  }
  .company-info {
    gap: 60px;
  }
  .request-card {
    max-width: 450px;
  }
}
@media (max-width: 1300px) {
  .container {
    max-width: 1100px;
    padding: 25px 35px;
  }
  .main-title {
    font-size: 48px;
  }
  .description {
    font-size: 18px;
  }
  .advantages-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  .advantage-card {
    padding: 15px;
  }
  .advantage-icon {
    width: 40px;
    height: 40px;
  }
}
@media (max-width: 1100px) {
  .container {
    max-width: 100%;
    padding: 20px 30px;
  }
  .main-nav {
    gap: 30px;
  }
  .nav-items {
    gap: 20px;
  }
  .company-info {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .main-title {
    font-size: 42px;
  }
  .request-card {
    max-width: 400px;
    padding: 30px;
  }
  .card-title-content h3 {
    font-size: 22px;
  }
}
@media (max-width: 1024px) {
  .company-info {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
  .info-text {
    max-width: 100%;
    margin: 0 auto;
  }
  .request-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
  }
  .stats-grid {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  .advantages-grid {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .advantage-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  .advantage-icon {
    margin: 0 auto;
  }
}
@media (max-width: 900px) {
  .nav-items {
    gap: 15px;
  }
  .nav-btn {
    padding: 10px 18px;
    font-size: 13px;
  }
  .main-title {
    font-size: 38px;
  }
}
@media (max-width: 768px) {
  .container {
    padding: 15px 20px;
  }
  .logo-area {
    min-height: 60px;
    gap: 12px;
  }
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  .logo-cargo {
    font-size: 20px;
  }
  .logo-express {
    font-size: 20px;
  }
  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background: rgba(10, 25, 41, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 100px 25px 30px;
    transition: right 0.4s ease;
    z-index: 999;
    overflow-y: auto;
    gap: 40px;
  }
  .main-nav.active {
    right: 0;
  }
  .nav-items {
    flex-direction: column;
    gap: 25px;
    width: 100%;
    align-items: flex-start;
  }
  .nav-item {
    font-size: 18px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    text-align: left;
  }
  .user-dropdown {
    width: 100%;
    justify-content: flex-start;
  }
  .dropdown-menu {
    position: static;
    width: 100%;
    margin-top: 12px;
    box-shadow: none;
  }
  .nav-actions {
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }
  .nav-btn {
    width: 100%;
    justify-content: center;
    padding: 15px;
    font-size: 15px;
  }
  .btn-text {
    display: inline;
  }
  .mobile-menu-btn {
    display: flex;
  }
  .mobile-phone {
    display: flex;
  }
  .company-info {
    padding: 40px 0 60px;
  }
  .main-title {
    font-size: 32px;
  }
  .description {
    font-size: 16px;
    line-height: 1.5;
  }
  .request-card {
    padding: 30px 25px;
  }
  .card-title-content h3 {
    font-size: 22px;
  }
  .advantages-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  .advantage-card {
    flex-direction: row;
    text-align: left;
    padding: 20px;
  }
  .advantage-icon {
    margin: 0;
  }
  .scroll-down-btn {
    padding-bottom: 20px;
  }
  .phone-number {
    font-size: 18px;
  }
  .contact-value {
    font-size: 16px;
  }
}
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
    max-width: 300px;
  }
  .main-title {
    font-size: 28px;
  }
  .description {
    font-size: 15px;
  }
  .badge {
    font-size: 13px;
    padding: 10px 20px;
  }
  .request-card {
    padding: 25px 20px;
  }
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  .card-icon {
    margin: 0 auto;
  }
  .card-features {
    gap: 12px;
  }
  .card-feature span {
    font-size: 14px;
  }
  .contact-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  .advantages-grid {
    gap: 15px;
  }
  .advantage-card {
    padding: 18px;
    gap: 15px;
  }
  .advantage-icon {
    width: 40px;
    height: 40px;
  }
  .advantage-title {
    font-size: 16px;
  }
  .advantage-desc {
    font-size: 13px;
  }
  .logo-cargo {
    font-size: 18px;
  }
  .logo-express {
    font-size: 18px;
  }
  .logo-icon {
    width: 50px;
    height: 50px;
  }
  .logo-area {
    min-height: 50px;
    gap: 10px;
  }
  .phone-number {
    font-size: 16px;
  }
  .contact-value {
    font-size: 15px;
  }
  .user-name {
    display: none;
  }
}
@media (max-width: 480px) {
  .container {
    padding: 15px;
  }
  .main-title {
    font-size: 24px;
  }
  .company-info {
    padding: 30px 0 40px;
    gap: 40px;
  }
  .badge {
    padding: 8px 16px;
    font-size: 12px;
  }
  .request-card {
    padding: 20px 16px;
  }
  .card-title-content h3 {
    font-size: 20px;
  }
  .form-group input {
    padding: 16px;
    font-size: 15px;
  }
  .submit-btn {
    padding: 18px;
    font-size: 15px;
  }
  .contact-icon {
    width: 44px;
    height: 44px;
  }
  .logo-cargo {
    font-size: 16px;
  }
  .logo-express {
    font-size: 16px;
  }
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  .logo-area {
    min-height: 40px;
    gap: 8px;
  }
}
@media (max-width: 360px) {
  .main-title {
    font-size: 22px;
  }
  .description {
    font-size: 14px;
  }
  .card-title-content h3 {
    font-size: 18px;
  }
  .card-feature span {
    font-size: 13px;
  }
  .stat-number {
    font-size: 28px;
  }
  .advantage-card {
    padding: 15px;
  }
  .phone-number {
    font-size: 15px;
  }
}
</style>