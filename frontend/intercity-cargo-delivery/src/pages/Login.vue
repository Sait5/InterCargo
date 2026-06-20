<template>
  <div class="login-page">
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
            <h1 class="main-title">Добро пожаловать<br><span class="text-green">в InterCargo</span></h1>
            <p class="main-subtitle">Войдите в свой аккаунт и управляйте<br>грузоперевозками с максимальной эффективностью.</p>
            
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
              <div class="login-link">Нет аккаунта? <a href="/register">Зарегистрироваться</a></div>
            </div>
            <h2 class="form-title">Вход в аккаунт</h2>
            <p class="form-subtitle">Войдите, чтобы управлять перевозками</p>

            <div class="form-body">
              <div class="input-group full-width">
                <label>Email</label>
                <div class="input-wrapper">
                  <input 
                    type="email" 
                    autocomplete="email" 
                    v-model="form.email" 
                    placeholder="example@email.com" 
                    @blur="validateEmail"
                    @keyup.enter="handleLogin"
                    :disabled="loading"
                  >
                  <svg class="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
              </div>

              <div class="input-group full-width">
                <label>Пароль</label>
                <div class="input-wrapper no-left-icon">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    v-model="form.password" 
                    placeholder="Введите пароль" 
                    @blur="validatePassword"
                    @keyup.enter="handleLogin"
                    :disabled="loading"
                  >
                  <button type="button" class="eye-icon" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
                <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
              </div>

              <div class="options-row">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="form.remember">
                  <span class="checkmark"></span>
                  <span class="checkbox-text">Запомнить меня</span>
                </label>
                <a href="#" class="forgot-link" @click.prevent="forgotPassword">Забыли пароль?</a>
              </div>

              <button class="submit-btn" :disabled="loading" @click.prevent="handleLogin">
                <span v-if="!loading">Войти</span>
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
  email: '',
  password: '',
  remember: false
});
const errors = reactive({
  email: '',
  password: ''
});
const loading = ref(false);
const showPassword = ref(false);

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

const validateForm = () => {
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  return isEmailValid && isPasswordValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  errors.email = '';
  errors.password = '';
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      userStore.login(data.token, data.user);
      if (form.remember) {
        localStorage.setItem('rememberMe', 'true');
      }
      toast.success('Успешный вход в аккаунт!');
      router.push('/');
    } else {
      const message = data.message || 'Ошибка входа';
      toast.error(message);
      
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('email')) {
        errors.email = message;
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

const forgotPassword = () => {
  toast.success('Инструкция по восстановлению пароля отправлена на почту');
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: url('@/assets/images/fonregister.png') no-repeat center center / cover;
  background-color: #0a0f0d;
  background-position: center 20%;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
}

.login-page::before {
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
}

.top-header {
  margin-bottom: 0;
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

.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0 8px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #d8e0dc;
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

.checkbox-text {
  color: #d8e0dc;
}

.forgot-link {
  color: #2DC071;
  text-decoration: none;
  font-size: 14px;
}

.forgot-link:hover {
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

.stats-row, .features-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: rgba(16, 22, 18, 0.88);
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.stat-item, .feature-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 18px;
}

.stat-item:not(:last-child), .feature-box:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-icon, .feature-box-icon {
  width: 42px;
  height: 42px;
  color: #2DC071;
  flex-shrink: 0;
}

.stat-value, .feature-box-title {
  font-size: 22px;
  font-weight: 800;
  color: #2DC071;
  margin-bottom: 3px;
}

.stat-label, .feature-box-desc {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.35;
}

.feature-box-text {
  display: flex;
  flex-direction: column;
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