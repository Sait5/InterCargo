<template>
  <div class="register-page">
    <div class="page-wrapper">
      <div class="main-layout">
        <div class="left-column">
          <header class="top-header">
            <div class="logo-area" @click="$router.push('/')" style="cursor: pointer;">
              <div class="logo-icon">
                <img src="@/assets/icons/logotip.png" alt="InterCargo">
              </div>
              <div class="logo-text-wrap">
                <div class="logo-text">
                  <span class="logo-cargo">Inter</span>
                  <span class="logo-express">Cargo</span>
                </div>
                <div class="logo-subtext">Надёжные грузоперевозки<br>по России и СНГ</div>
              </div>
            </div>
          </header>

          <div class="hero-section">
            <h1 class="main-title">Присоединяйтесь<br><span class="text-green">к InterCargo</span></h1>
            <p class="main-subtitle">Создайте аккаунт и начните управлять<br>грузоперевозками с максимальной эффективностью.</p>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                </div>
                <div class="feature-text">
                  <span>Страхование<br>груза</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div class="feature-text">
                  <span>Отслеживание<br>в реальном времени</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div class="feature-text">
                  <span>Доставка<br>точно в срок</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-column">
          <div class="form-card">
            <div class="form-header-row">
              <div></div>
              <div class="login-link">Уже есть аккаунт? <a href="/login">Войти</a></div>
            </div>
            <h2 class="form-title">Создайте аккаунт</h2>
            <p class="form-subtitle">Заполните данные и начните работать с нами</p>

            <div class="stepper">
              <div class="step-item active">
                <div class="step-circle">1</div>
                <div class="step-label">Данные аккаунта</div>
              </div>
              <div class="step-connector"></div>
              <div class="step-item">
                <div class="step-circle">2</div>
                <div class="step-label">Информация о<br>компании</div>
              </div>
              <div class="step-connector"></div>
              <div class="step-item">
                <div class="step-circle">3</div>
                <div class="step-label">Подтверждение</div>
              </div>
            </div>

            <div class="form-body">
              <div class="input-row">
                <div class="input-group">
                  <label>Имя</label>
                  <div class="input-wrapper">
                    <input 
                      type="text" 
                      v-model="form.firstName" 
                      placeholder="Введите ваше имя" 
                      @blur="validateFirstName"
                      @keyup.enter="handleRegister"
                      :disabled="loading"
                    >
                    <svg class="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
                </div>
                <div class="input-group">
                  <label>Фамилия</label>
                  <div class="input-wrapper">
                    <input 
                      type="text" 
                      v-model="form.lastName" 
                      placeholder="Введите вашу фамилию" 
                      @blur="validateLastName"
                      @keyup.enter="handleRegister"
                      :disabled="loading"
                    >
                    <svg class="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
                </div>
              </div>

              <div class="input-row">
                <div class="input-group">
                  <label>Email</label>
                  <div class="input-wrapper">
                    <input 
                      type="email" 
                      autocomplete="email"
                      v-model="form.email" 
                      placeholder="example@email.com" 
                      @blur="validateEmail"
                      @keyup.enter="handleRegister"
                      :disabled="loading"
                    >
                    <svg class="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
                </div>
                <div class="input-group">
                  <label>Телефон</label>
                  <div class="input-wrapper">
                    <input 
                      type="tel" 
                      autocomplete="tel"
                      v-model="form.phone" 
                      placeholder="+7 (___) ___-__-__" 
                      @blur="validatePhone"
                      @keyup.enter="handleRegister"
                      :disabled="loading"
                    >
                    <svg class="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
                </div>
              </div>

              <div class="input-group full-width">
                <label>Тип аккаунта</label>
                <div class="account-type-selector">
                  <div class="type-card" :class="{ active: form.accountType === 'carrier' }" @click="form.accountType = 'carrier'">
                    <div class="type-left">
                      <svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      <div class="type-info">
                        <div class="type-title">Перевозчик</div>
                        <div class="type-desc">У меня есть транспорт для перевозки грузов</div>
                      </div>
                    </div>
                    <div class="type-check">
                      <svg v-if="form.accountType === 'carrier'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2DC071"/><path d="M8 12l3 3 5-5" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5"><circle cx="12" cy="12" r="9"/></svg>
                    </div>
                  </div>
                  <div class="type-card" :class="{ active: form.accountType === 'customer' }" @click="form.accountType = 'customer'">
                    <div class="type-left">
                      <svg class="type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                      <div class="type-info">
                        <div class="type-title">Заказчик</div>
                        <div class="type-desc">Мне нужно доставить груз</div>
                      </div>
                    </div>
                    <div class="type-check">
                      <svg v-if="form.accountType === 'customer'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2DC071"/><path d="M8 12l3 3 5-5" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5"><circle cx="12" cy="12" r="9"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="input-group full-width">
                <label>Компания</label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="form.company" 
                    placeholder="Название вашей компании (необязательно)"
                    :disabled="loading"
                  >
                  <svg class="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M16 14h.01"></path></svg>
                </div>
              </div>

              <div class="input-group full-width">
                <label>Пароль</label>
                <div class="input-wrapper no-left-icon">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    v-model="form.password" 
                    placeholder="Создайте пароль" 
                    @blur="validatePassword"
                    @keyup.enter="handleRegister"
                    :disabled="loading"
                  >
                  <button type="button" class="eye-icon" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
                <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
              </div>

              <div class="input-group full-width">
                <label>Подтвердите пароль</label>
                <div class="input-wrapper no-left-icon">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    v-model="form.confirmPassword" 
                    placeholder="Повторите пароль" 
                    @blur="validateConfirmPassword"
                    @keyup.enter="handleRegister"
                    :disabled="loading"
                  >
                  <button type="button" class="eye-icon" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="!showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
                <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
              </div>

              <div class="checkbox-group">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="form.agreeTerms" @change="validateAgreeTerms">
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Я согласен с <a href="#">условиями использования</a> и <a href="#">политикой конфиденциальности</a></span>
                </label>
                <span class="error-message" v-if="errors.agreeTerms">{{ errors.agreeTerms }}</span>
              </div>

              <button class="submit-btn" :disabled="loading" @click.prevent="handleRegister">
                <span v-if="!loading">Зарегистрироваться</span>
                <span v-else class="spinner"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-section">
        <div class="stats-row">
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <div class="stat-text">
              <div class="stat-value">5000</div>
              <div class="stat-label">Довольных клиентов</div>
            </div>
          </div>
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <div class="stat-text">
              <div class="stat-value">10 000+</div>
              <div class="stat-label">Успешных перевозок</div>
            </div>
          </div>
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <div class="stat-text">
              <div class="stat-value">15+</div>
              <div class="stat-label">Городов доставки</div>
            </div>
          </div>
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <div class="stat-text">
              <div class="stat-value">4.5</div>
              <div class="stat-label">Средняя оценка</div>
            </div>
          </div>
        </div>

        <div class="features-row">
          <div class="feature-box">
            <svg class="feature-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <div class="feature-box-text">
              <div class="feature-box-title">Быстро</div>
              <div class="feature-box-desc">Оперативная обработка заявок</div>
            </div>
          </div>
          <div class="feature-box">
            <svg class="feature-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <div class="feature-box-text">
              <div class="feature-box-title">Надёжно</div>
              <div class="feature-box-desc">Гарантия сохранности вашего груза</div>
            </div>
          </div>
          <div class="feature-box">
            <svg class="feature-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
            <div class="feature-box-text">
              <div class="feature-box-title">Выгодно</div>
              <div class="feature-box-desc">Конкурентные цены без переплат</div>
            </div>
          </div>
          <div class="feature-box">
            <svg class="feature-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <div class="feature-box-text">
              <div class="feature-box-title">Профессионально</div>
              <div class="feature-box-desc">Опытная команда специалистов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const userStore = useUserStore();
const toast = useToastStore();

onMounted(() => {
  if (userStore.isAuthenticated) {
    router.push('/');
  }
});

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  accountType: 'carrier',
  company: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
});
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const validateFirstName = () => {
  if (!form.firstName.trim()) {
    errors.firstName = 'Имя обязательно';
    return false;
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = 'Имя должно содержать минимум 2 символа';
    return false;
  }
  errors.firstName = '';
  return true;
};

const validateLastName = () => {
  if (!form.lastName.trim()) {
    errors.lastName = 'Фамилия обязательна';
    return false;
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = 'Фамилия должна содержать минимум 2 символа';
    return false;
  }
  errors.lastName = '';
  return true;
};

const validateEmail = () => {
  if (!form.email) {
    errors.email = 'Email обязателен';
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email';
    return false;
  }
  errors.email = '';
  return true;
};

const validatePhone = () => {
  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!form.phone) {
    errors.phone = 'Телефон обязателен';
    return false;
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = 'Введите корректный номер телефона';
    return false;
  }
  errors.phone = '';
  return true;
};

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Пароль обязателен';
    return false;
  } else if (form.password.length < 8) {
    errors.password = 'Пароль должен содержать минимум 8 символов';
    return false;
  }
  errors.password = '';
  return true;
};

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль';
    return false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
    return false;
  }
  errors.confirmPassword = '';
  return true;
};

const validateAgreeTerms = () => {
  if (!form.agreeTerms) {
    errors.agreeTerms = 'Необходимо принять условия';
    return false;
  }
  errors.agreeTerms = '';
  return true;
};

const validateForm = () => {
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isAgreeTermsValid = validateAgreeTerms();
  return isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid && isAgreeTermsValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  Object.keys(errors).forEach(key => errors[key] = '');
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        patronymic: '',
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        accountType: form.accountType,
        company: form.company
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      userStore.login(data.token, data.user);
      toast.success('Регистрация прошла успешно!');
      router.push('/');
    } else {
      const message = data.message || 'Ошибка регистрации';
      toast.error(message);
      
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('email')) {
        errors.email = message;
      } else if (lowerMessage.includes('телефон')) {
        errors.phone = message;
      } else if (lowerMessage.includes('пароль')) {
        errors.password = message;
      } else {
        errors.email = message;
      }
    }
  } catch (error) {
    toast.error('Ошибка соединения с сервером');
    errors.email = 'Ошибка соединения с сервером';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.register-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: url('@/assets/images/fonregister.png') no-repeat center center / cover;
  background-color: #0a0f0d;
  background-position: center 20%;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 18, 14, 0.35);
  z-index: 0;
}

.page-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 50px 60px 40px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 580px;
  gap: 40px;
  align-items: start;
  flex: 1;
}

.left-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.top-header {
  margin-bottom: 0;
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  min-height: 130px;
}

.logo-icon {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  margin-left: -20px;
  flex-direction: column;
  margin-top: -10px;
  line-height: 1.1;
}

.logo-cargo {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #ffffff;
}

.logo-express {
  font-size: 24px;
  font-weight: 800;
  color: #2DC071;
  letter-spacing: 1.5px;
}

.logo-subtext {
  font-size: 12px;
  color: #c8d0cc;
  line-height: 1.5;
  border-left: 1px solid rgba(255,255,255,0.3);
  padding-left: 18px;
}

.hero-section {
  margin-top: 190px;
  max-width: 560px;
}

.main-title {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.text-green {
  color: #2DC071;
}

.main-subtitle {
  font-size: 16px;
  color: #d8e0dc;
  line-height: 1.6;
  margin-bottom: 60px;
}

.features-list {
  display: flex;
  gap: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  line-height: 1.4;
  color: #e8ece9;
}

.feature-icon {
  width: 42px;
  height: 42px;
  color: #2DC071;
  flex-shrink: 0;
}

.form-card {
  background: rgba(16, 22, 18, 0.92);
  border-radius: 18px;
  padding: 44px 48px 48px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  margin-top: 20px;
}

.form-header-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}

.login-link {
  font-size: 15px;
  color: #a0a8a4;
}

.login-link a {
  color: #2DC071;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.form-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 15px;
  color: #9ca3af;
  margin-bottom: 32px;
}

.stepper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 36px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2a332e;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  border: 2px solid transparent;
}

.step-item.active .step-circle {
  background: #2DC071;
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(45, 192, 113, 0.2);
}

.step-label {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.3;
}

.step-item.active .step-label {
  color: #ffffff;
  font-weight: 600;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: #2a332e;
  margin-top: 19px;
  min-width: 50px;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  background: #1a2420;
  border: 1px solid #2d3732;
  border-radius: 10px;
  padding: 14px 44px 14px 16px;
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  height: 50px;
}

.input-wrapper input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-wrapper.no-left-icon input {
  padding-left: 16px;
}

.input-wrapper input::placeholder {
  color: #6b7280;
}

.input-wrapper input:focus {
  border-color: #2DC071;
}

.input-icon-right {
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
  color: #6b7280;
  pointer-events: none;
}

.eye-icon {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 1;
}

.eye-icon svg {
  width: 20px;
  height: 20px;
}

.eye-icon:hover {
  color: #9ca3af;
}

.error-message {
  font-size: 13px;
  color: #ef4444;
  margin-top: 4px;
}

.account-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.type-card {
  background: #1a2420;
  border: 1.5px solid #2d3732;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
  gap: 12px;
}

.type-card.active {
  border-color: #2DC071;
  background: rgba(45, 192, 113, 0.08);
}

.type-card:hover {
  border-color: #3d4a42;
}

.type-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.type-icon {
  width: 32px;
  height: 32px;
  color: #2DC071;
  flex-shrink: 0;
}

.type-info {
  flex: 1;
}

.type-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 3px;
}

.type-desc {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.3;
}

.type-check {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-check svg {
  width: 24px;
  height: 24px;
}

.checkbox-group {
  margin-top: 6px;
}

.custom-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #9ca3af;
  user-select: none;
}

.custom-checkbox input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 1.5px solid #3d4a42;
  border-radius: 5px;
  background: #1a2420;
  flex-shrink: 0;
  margin-top: 1px;
  position: relative;
  transition: all 0.2s;
}

.custom-checkbox input:checked + .checkmark {
  background: #2DC071;
  border-color: #2DC071;
}

.custom-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text a {
  color: #2DC071;
  text-decoration: none;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  background: #2DC071;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 16px;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background: #28a45e;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bottom-section {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: rgba(16, 22, 18, 0.88);
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 18px;
}

.stat-item:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-icon {
  width: 42px;
  height: 42px;
  color: #2DC071;
  flex-shrink: 0;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #2DC071;
}

.stat-label {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.35;
}

.features-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: rgba(16, 22, 18, 0.88);
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.feature-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 18px;
}

.feature-box:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.feature-box-icon {
  width: 42px;
  height: 42px;
  color: #2DC071;
  flex-shrink: 0;
}

.feature-box-text {
  display: flex;
  flex-direction: column;
}

.feature-box-title {
  font-size: 22px;
  font-weight: 800;
  color: #2DC071;
  margin-bottom: 3px;
}

.feature-box-desc {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.35;
}

@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .page-wrapper {
    padding: 30px 30px 20px;
  }
  .hero-section {
    margin-top: 80px;
  }
  .main-title {
    font-size: 44px;
  }
}

@media (max-width: 992px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .left-column {
    order: 2;
  }
  .right-column {
    order: 1;
  }
  .hero-section {
    margin-top: 40px;
  }
  .form-card {
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 20px 16px;
  }
  .logo-text-wrap {
    flex-wrap: wrap;
    gap: 8px;
  }
  .logo-subtext {
    border-left: none;
    padding-left: 0;
  }
  .hero-section {
    margin-top: 30px;
  }
  .main-title {
    font-size: 34px;
  }
  .features-list {
    flex-wrap: wrap;
    gap: 20px;
  }
  .input-row {
    grid-template-columns: 1fr;
  }
  .account-type-selector {
    grid-template-columns: 1fr;
  }
  .stepper {
    display: none;
  }
  .stats-row, .features-row {
    grid-template-columns: 1fr 1fr;
    padding: 16px;
    gap: 16px;
  }
  .stat-item, .feature-box {
    border-right: none;
    padding: 0;
  }
  .stat-item:not(:last-child), .feature-box:not(:last-child) {
    border-right: none;
  }
  .form-card {
    padding: 24px 16px;
  }
  .form-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .stats-row, .features-row {
    grid-template-columns: 1fr;
  }
}
</style>