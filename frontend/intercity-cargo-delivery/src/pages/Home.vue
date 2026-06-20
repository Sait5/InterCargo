<template>
  <div class="main">
  <Header />
    <div class="content-section">
      <div class="foreground-layer">
        <div class="info-section">
          <h2 class="section-title">Продукты платформы</h2>
          <div class="features-grid">
            <div class="feature-card" ref="card1">
              <div class="card-content">
                <div class="icon-wrapper">
                  <img src="@/assets/icons/analytics.png" alt="Транспортные тендеры" class="feature-icon" loading="lazy" @error="onImageError" />
                </div>
                <h3>Транспортные тендеры</h3>
                <p class="feature-subtitle">Обеспечим контроль и исполнение бюджета в ТМС</p>
                <div class="feature-list">
                  <div class="feature-item"><span class="feature-dot"></span>Сильнейший аналитический модуль</div>
                  <div class="feature-item"><span class="feature-dot"></span>Единый сквозной процесс «Закупки-исполнение»</div>
                  <div class="feature-item"><span class="feature-dot"></span>Независимость принятых решений</div>
                  <div class="feature-item"><span class="feature-dot"></span>Работа только с проверенными перевозчиками</div>
                </div>
                <button @click="$router.push('/transport-tender')" class="card-btn">Перейти →</button>
              </div>
            </div>
            <div class="feature-card" ref="card2">
              <div class="card-content">
                <div class="icon-wrapper">
                  <img src="@/assets/icons/automation.png" alt="Спот-аукционы" class="feature-icon" loading="lazy" @error="onImageError" />
                </div>
                <h3>Спот-аукционы</h3>
                <p class="feature-subtitle">Заменяем почту и мессенджеры</p>
                <div class="feature-list">
                  <div class="feature-item"><span class="feature-dot"></span>Все торги организации в одном окне</div>
                  <div class="feature-item"><span class="feature-dot"></span>Закройте горящий рейс в пару кликов</div>
                  <div class="feature-item"><span class="feature-dot"></span>Четкий контроль круга участников</div>
                  <div class="feature-item"><span class="feature-dot"></span>Разные типы аукционов под любую ситуацию</div>
                </div>
                <button @click="$router.push('/spot-auctions')" class="card-btn">Перейти →</button>
              </div>
            </div>
            <div class="feature-card" ref="card3">
              <div class="card-content">
                <div class="icon-wrapper">
                  <img src="@/assets/icons/security.png" alt="TMS система" class="feature-icon" loading="lazy" @error="onImageError" />
                </div>
                <h3>TMS / Система управления перевозками</h3>
                <p class="feature-subtitle">Интеграция с ERP-системой клиентов</p>
                <div class="feature-list">
                  <div class="feature-item"><span class="feature-dot"></span>Автоматизация распределения заказов</div>
                  <div class="feature-item"><span class="feature-dot"></span>Отслеживание изменения статусов</div>
                  <div class="feature-item"><span class="feature-dot"></span>Возможность гибкой настройки</div>
                  <div class="feature-item"><span class="feature-dot"></span>Аудит логистических процессов</div>
                </div>
                <button @click="$router.push('/tms')" class="card-btn">Перейти →</button>
              </div>
            </div>
            <div class="feature-card" ref="card4">
              <div class="card-content">
                <div class="icon-wrapper">
                  <img src="@/assets/icons/speed.png" alt="Трекинг грузов" class="feature-icon" loading="lazy" @error="onImageError" />
                </div>
                <h3>Трекинг грузов</h3>
                <p class="feature-subtitle">Полный контроль доставки в реальном времени</p>
                <div class="feature-list">
                  <div class="feature-item"><span class="feature-dot"></span>Бортовые блоки GPS-мониторинга</div>
                  <div class="feature-item"><span class="feature-dot"></span>GSM-связь для стабильного соединения</div>
                  <div class="feature-item"><span class="feature-dot"></span>Мобильное приложение для клиентов</div>
                  <div class="feature-item"><span class="feature-dot"></span>Уведомления о статусе доставки</div>
                </div>
                <button @click="$router.push('/tracking')" class="card-btn">Перейти →</button>
              </div>
            </div>
          </div>
        </div>

        <div class="about-section">
          <div class="section-header">
            <div class="title-glow"></div>
            <h3 class="about-title">О компании</h3>
          </div>
          <div class="about-content">
            <div class="about-text">
              <p class="about-description">InterCargo - ведущая логистическая компания, специализирующаяся на междугородних грузоперевозках по всей России. Мы обеспечиваем надежную и своевременную доставку грузов любой сложности.</p>
            </div>
            <div class="stats-container">
              <div class="stats-grid">
                <div class="stat-card" ref="stat1">
                  <div class="stat-content">
                    <div class="stat-number" data-target="9" data-animated="false">0</div>
                    <div class="stat-text">офисов</div>
                    <div class="stat-detail">Москва, СПБ, Казань</div>
                  </div>
                </div>
                <div class="stat-card" ref="stat2">
                  <div class="stat-content">
                    <div class="stat-number" data-target="256" data-animated="false">0</div>
                    <div class="stat-text">грузовиков</div>
                    <div class="stat-detail">Volvo, Scania, MAN</div>
                  </div>
                </div>
                <div class="stat-card-image" ref="stat3">
                  <img src="@/assets/images/popular-truck.webp" alt="Популярная модель" class="stat-img-cover" loading="lazy" @error="onImageError" />
                </div>
                <div class="stat-card-image" ref="stat4">
                  <img src="@/assets/images/cargo-any.jpg" alt="Любые грузы" class="stat-img-cover" loading="lazy" @error="onImageError" />
                </div>
                <div class="stat-card" ref="stat5">
                  <div class="stat-content">
                    <div class="stat-number" data-target="1000" data-animated="false">0+</div>
                    <div class="stat-text">сотрудников</div>
                    <div class="stat-detail">опытных профессионалов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="news-section">
          <h2 class="news-title">Новости компании</h2>
          <div class="news-grid">
            <div class="news-card">
              <div class="news-image">
                <img src="@/assets/images/new-routes.png" alt="Запуск нового маршрута" class="news-img" loading="lazy" @error="onImageError">
                <span class="news-date-badge">12.03.2026</span>
              </div>
              <div class="news-content">
                <h3 class="news-headline">Запуск нового маршрута Москва – Владивосток</h3>
                <p class="news-excerpt">Увеличиваем географию присутствия: теперь регулярные рейсы на Дальний Восток с фиксированным расписанием.</p>
                <a href="#" class="news-link">Читать далее →</a>
              </div>
            </div>
            <div class="news-card">
              <div class="news-image">
                <img src="@/assets/images/news-1.png" alt="InterCargo в топ-10" class="news-img" loading="lazy" @error="onImageError">
                <span class="news-date-badge">05.03.2026</span>
              </div>
              <div class="news-content">
                <h3 class="news-headline">InterCargo вошла в топ-10 логистических операторов</h3>
                <p class="news-excerpt">По итогам 2024 года компания признана одной из самых надёжных по версии рейтинга «Логистика России».</p>
                <a href="#" class="news-link">Читать далее →</a>
              </div>
            </div>
            <div class="news-card">
              <div class="news-image">
                <img src="@/assets/images/news-2.png" alt="Обновление приложения" class="news-img" loading="lazy" @error="onImageError">
                <span class="news-date-badge">20.02.2026</span>
              </div>
              <div class="news-content">
                <h3 class="news-headline">Обновление мобильного приложения для водителей</h3>
                <p class="news-excerpt">Новые функции: фотофиксация груза, электронные подписи и улучшенный интерфейс.</p>
                <a href="#" class="news-link">Читать далее →</a>
              </div>
            </div>
          </div>
          <div class="news-footer">
            <a href="#" class="news-all-link">Все новости →</a>
          </div>
        </div>

        <div class="carriers-section" ref="carriers">
          <div class="carriers-container">
            <div class="carriers-content">
              <div class="carriers-left">
                <h3 class="carriers-title">Для перевозчиков</h3>
                <div class="carriers-features-list">
                  <div class="carriers-feature-item">
                    <div class="carriers-check"></div>
                    <div class="carriers-text">Все грузовладельцы на одной платформе – участвуйте в аукционах и тендерах, получайте выгодные заказы</div>
                  </div>
                  <div class="carriers-feature-item">
                    <div class="carriers-check"></div>
                    <div class="carriers-text">Только выгодные рейсы – наши перевозчики зарабатывают более 200 000 рублей в год с каждой машины</div>
                  </div>
                  <div class="carriers-feature-item">
                    <div class="carriers-check"></div>
                    <div class="carriers-text">Гарантия загрузки – у нас более 70 000 рейсов</div>
                  </div>
                </div>
              </div>
              <div class="carriers-join">
                <div class="carriers-join-text">Присоединяйтесь</div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-section" ref="contactSection">
          <div class="contact-container">
            <div class="contact-image">
                <img src="@/assets/images/feedback.jpg" alt="Обратная связь" class="contact-img" loading="lazy" @error="onImageError" />
            </div>
            <div class="contact-form-wrapper">
              <h3 class="contact-title">Связаться с нами</h3>
              <div class="contact-form">
                <div class="form-group">
                  <label class="form-label">Имя</label>
                  <input type="text" class="form-input" placeholder="Полное имя" maxlength="100" />
                </div>
                <div class="form-group">
                  <label class="form-label">Адрес электронной почты</label>
                  <input type="email" class="form-input" placeholder="example@gmail.com" maxlength="100" />
                </div>
                <div class="form-group">
                  <label class="form-label">Телефон</label>
                  <input type="tel" class="form-input" placeholder="+7(928)-000-00-00" maxlength="20" />
                </div>
                <div class="form-group">
                  <label class="form-label">Ваше сообщение</label>
                  <textarea class="form-textarea" placeholder="" maxlength="500" rows="4"></textarea>
                </div>
              </div>
              <button class="contact-submit-btn">Отправить</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/ui/Header.vue";
import Footer from "@/ui/Footer.vue";

export default {
  name: "Main",
  components: { Header,Footer  },
  data() {
    return {
      contactForm: {
        name: '',
        email: '',
        phone: '',
        message: ''
      }
    };
  },
  mounted() {
    this.initScrollAnimation();
    this.initNumberAnimation();
    this.initTheme();
    this.preloadImages();
  },
  methods: {
    initTheme() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
    },
    preloadImages() {
      const images = [
        '@/assets/icons/analytics.png',
        '@/assets/icons/automation.png',
        '@/assets/icons/security.png',
        '@/assets/icons/speed.png',
        '@/assets/images/new-routes.png',
        '@/assets/images/news-1.png',
        '@/assets/images/news-2.png',
        '@/assets/images/popular-truck.webp',
        '@/assets/images/cargo-any.jpg',
        '@/assets/images/feedback.jpg'
      ];
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    },
    onImageError(event) {
      console.error('Ошибка загрузки изображения:', event.target.src);
      event.target.style.display = 'none';
      const parent = event.target.parentNode;
      if (parent) {
        parent.style.background = 'linear-gradient(145deg, #2a2f3b, #1a1e2a)';
      }
    },
    initScrollAnimation() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stat-card')) {
              this.animateNumber(entry.target);
            }
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

      const elements = [
        this.$refs.card1,
        this.$refs.card2,
        this.$refs.card3,
        this.$refs.card4,
        this.$refs.stat1,
        this.$refs.stat2,
        this.$refs.stat3,
        this.$refs.stat4,
        this.$refs.stat5,
        this.$refs.carriers,
        this.$refs.contactSection
      ].filter(Boolean);
      
      elements.forEach(el => observer.observe(el));
    },
    animateNumber(card) {
      const numberElement = card.querySelector('.stat-number');
      if (!numberElement || !numberElement.dataset.target || numberElement.dataset.animated === 'true') return;
      numberElement.dataset.animated = 'true';
      const target = parseInt(numberElement.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        numberElement.textContent = Math.floor(current) + (numberElement.textContent.includes('+') ? '+' : '');
      }, 16);
    },
    initNumberAnimation() {
      const numberElements = document.querySelectorAll('.stat-number[data-target]');
      numberElements.forEach(el => {
        if (!el.textContent.includes('+')) {
          el.textContent = '0';
        }
        el.dataset.animated = 'false';
      });
    }
  }
};
</script>

<style>
.feature-subtitle {
  font-size: 16px;
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.5;
  font-family: 'Open Sans', sans-serif;
  text-align: center;
}

:root[data-theme="dark"] {
  --bg-primary: #0a0f1c;
  --bg-secondary: rgba(255, 255, 255, 0.05);
  --bg-card: rgba(255, 255, 255, 0.03);
  --text-primary: #ffffff;
  --text-secondary: #cbd5e0;
  --text-muted: #a0aec0;
  --accent-color: #2DC071;
  --accent-gradient: linear-gradient(135deg, #2DC071, #28a45e);
  --border-color: rgba(45, 192, 113, 0.15);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --glow-color: rgba(45, 192, 113, 0.3);
}

:root[data-theme="light"] {
  --bg-primary: #F3FFFD;
  --bg-secondary: rgba(45, 192, 113, 0.08);
  --bg-card: #ffffff;
  --text-primary: #1a365d;
  --text-secondary: #2d3748;
  --text-muted: #4a5568;
  --accent-color: #2DC071;
  --accent-gradient: linear-gradient(135deg, #2DC071, #28a45e);
  --border-color: rgba(45, 192, 113, 0.3);
  --shadow-color: rgba(0, 0, 0, 0.1);
  --glow-color: rgba(45, 192, 113, 0.2);
}

.main {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
  transition: background-color 0.5s ease;
}

.content-section {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.foreground-layer {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-section {
  text-align: center;
  padding: 120px 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section-title {
  font-size: 52px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 50%, #28a45e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 80px;
  font-family: 'Open Sans', sans-serif;
  text-shadow: 0 0 50px var(--glow-color);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 40px;
}

.feature-card {
  background: var(--bg-card);
  padding: 40px 30px 30px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  box-shadow: 0 4px 20px var(--shadow-color);
  display: flex;
  flex-direction: column;
}

.feature-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.card-content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.icon-wrapper {
  margin-bottom: 20px;
}

.feature-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.feature-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
  font-family: 'Open Sans', sans-serif;
}

.feature-list {
  text-align: left;
  margin-bottom: 20px;
  flex: 1;
}

.feature-item {
  position: relative;
  padding: 8px 0 8px 20px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
  font-family: 'Open Sans', sans-serif;
}

.feature-dot {
  position: absolute;
  left: 0;
  top: 12px;
  width: 6px;
  height: 6px;
  background: var(--accent-color);
  border-radius: 50%;
}

.card-btn {
  background: var(--accent-gradient);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 15px var(--glow-color);
  margin-top: auto;
  align-self: center;
}

.card-btn:hover {
  opacity: 0.9;
}

.about-section {
  width: 100%;
  margin-top: 100px;
  max-width: 1400px;
  padding: 0 20px;
  position: relative;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 60px;
  position: relative;
}

.title-glow {
  width: 120px;
  height: 8px;
  background: var(--accent-gradient);
  border-radius: 4px;
  box-shadow: 0 0 30px var(--glow-color);
  animation: glowPulse 2s ease-in-out infinite alternate;
}

.about-title {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Open Sans', sans-serif;
  margin: 0;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 100px;
  align-items: start;
}

.about-text {
  padding-right: 40px;
}

.about-description {
  font-size: 20px;
  line-height: 1.8;
  color: var(--text-secondary);
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  text-align: left;
}

.stats-container {
  background: var(--bg-card);
  border-radius: 30px;
  width: 900px;
  padding: 60px 50px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 40px var(--shadow-color);
  position: relative;
  overflow: hidden;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 30px;
  position: relative;
  z-index: 2;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 1px solid var(--border-color);
  position: relative;
  width: 200px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px var(--shadow-color);
}

.stat-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stat-number {
  font-size: 48px;
  font-weight: 900;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  font-family: 'Open Sans', sans-serif;
}

.stat-text {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  line-height: 1.4;
}

.stat-detail {
  font-size: 13px;
  color: var(--text-muted);
  font-family: 'Open Sans', sans-serif;
  line-height: 1.3;
  text-align: center;
}

.stat-card-image {
  border-radius: 20px;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  box-shadow: 0 4px 15px var(--shadow-color);
}

.stat-card-image.visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.news-section {
  width: 100%;
  max-width: 1800px;
  margin: 120px auto;
  padding: 0 30px;
}

.news-title {
  font-size: 48px;
  font-weight: 800;
  color: var(--text-primary);
  font-family: 'Open Sans', sans-serif;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}

.news-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--accent-gradient);
  border-radius: 2px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 60px;
}

.news-card {
  background: var(--bg-card);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  height: 100%;
  width: 93%;
  box-shadow: 0 10px 30px var(--shadow-color);
  display: flex;
  flex-direction: column;
}

.news-image {
  position: relative;
  height: 700px;
  overflow: hidden;
  background-color: #2a2f3b;
}

.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.news-date-badge {
  position: absolute;
  top: 20px;
  left: 390px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  border: 1px solid rgba(255,255,255,0.2);
}

.news-content {
  padding: 30px 25px 35px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-headline {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
  font-family: 'Open Sans', sans-serif;
  line-height: 1.4;
}

.news-excerpt {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 25px;
  font-family: 'Open Sans', sans-serif;
  flex: 1;
}

.news-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

.news-footer {
  text-align: center;
}

.news-all-link {
  display: inline-block;
  padding: 16px 50px;
  background: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  text-decoration: none;
  transition: background 0.3s ease, color 0.3s ease;
}

.news-all-link:hover {
  background: var(--accent-color);
  color: white;
}

/* Обновлённый блок связи */
.contact-section {
  width: 100%;
  max-width: 1200px;
  margin: 100px auto 120px;
  padding: 0 30px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.contact-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-container {
  display: flex;
  background: transparent;
  overflow: hidden;
}

.contact-image {
  width: 500px;
  height: 500px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  position: relative;
}

.contact-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(45, 192, 113, 0.15), transparent);
  opacity: 0.7;
}

.contact-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.contact-form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 60px;
  gap: 35px;
  width: 610px;
  background: transparent;
}

.contact-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 36px;
  text-align: center;
  letter-spacing: 0.2px;
  color: var(--text-primary);
  margin: 0;
  position: relative;
}

.contact-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--accent-color);
  border-radius: 2px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 25px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 28px;
  letter-spacing: 0.2px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

[data-theme="light"] .form-input {
  background: rgba(255,255,255,0.4);
  border: 1px solid rgba(45,192,113,0.3);
  color: #1a365d;
}

.form-input::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

[data-theme="light"] .form-input::placeholder {
  color: #4a5568;
}

.form-input:focus {
  border-color: var(--accent-color);
}

.form-textarea {
  width: 100%;
  min-height: 130px;
  max-height: 200px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 28px;
  letter-spacing: 0.2px;
  color: var(--text-primary);
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

[data-theme="light"] .form-textarea {
  background: rgba(255,255,255,0.4);
  border: 1px solid rgba(45,192,113,0.3);
  color: #1a365d;
}

.form-textarea:focus {
  border-color: var(--accent-color);
}

.contact-submit-btn {
  padding: 16px 40px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease;
  text-transform: uppercase;
}

.contact-submit-btn:hover {
  background: #28a45e;
}

.carriers-section {
  width: 100%;
  background: linear-gradient(135deg, #252B42 0%, #1a2332 100%);
  padding: 80px 20px;
  margin-top: 60px;
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
  position: relative;
  overflow: hidden;
}

.carriers-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 70%, rgba(45,192,113,0.15) 0%, transparent 50%);
  animation: rotateGradient 20s linear infinite;
}

.carriers-section.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes rotateGradient {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.carriers-container {
  max-width: 1200px;
  margin: 0 auto;
}

.carriers-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
}

.carriers-left {
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.carriers-title {
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 25px;
}

.carriers-features-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.carriers-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.carriers-check {
  width: 30px;
  height: 30px;
  background: var(--accent-color);
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  margin-top: 2px;
}

.carriers-check::after {
  content: '✓';
}

.carriers-text {
  font-size: 15px;
  line-height: 24px;
  color: #FFFFFF;
}

.carriers-join {
  display: flex;
  align-items: flex-start;
}

.carriers-join-text {
  padding: 14px 40px;
  background: var(--accent-color);
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.carriers-join-text:hover {
  background: #28a45e;
}

@keyframes titleGlow {
  0% { text-shadow: 0 0 50px var(--glow-color); }
  100% { text-shadow: 0 0 60px var(--glow-color); }
}

@keyframes glowPulse {
  0% { box-shadow: 0 0 30px var(--glow-color); }
  100% { box-shadow: 0 0 40px var(--glow-color); }
}

.feature-card:nth-child(1) { transition-delay: 0.1s; }
.feature-card:nth-child(2) { transition-delay: 0.2s; }
.feature-card:nth-child(3) { transition-delay: 0.3s; }
.feature-card:nth-child(4) { transition-delay: 0.4s; }

.stat-card:nth-child(1) { transition-delay: 0.1s; }
.stat-card:nth-child(2) { transition-delay: 0.2s; }
.stat-card-image:nth-child(3) { transition-delay: 0.3s; }
.stat-card-image:nth-child(4) { transition-delay: 0.4s; }
.stat-card:nth-child(5) { transition-delay: 0.5s; }

@media (max-width: 1400px) {
  .stats-container {
    width: auto;
  }
  .news-section {
    max-width: 1500px;
  }
  .news-image {
    height: 500px;
  }
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  .stat-card {
    padding: 35px 25px;
    min-height: 140px;
    width: auto;
  }
  .stat-number {
    font-size: 42px;
  }
  .stat-card-image {
    width: auto;
    height: 180px;
  }
  .news-grid {
    gap: 30px;
  }
  .news-image {
    height: 450px;
  }
  .contact-container {
    flex-direction: column;
  }
  .contact-image {
    width: 100%;
    height: 400px;
    border-radius: 20px 20px 0 0;
  }
  .contact-form-wrapper {
    width: 100%;
    padding: 30px;
  }
}

@media (max-width: 992px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .about-content {
    grid-template-columns: 1fr;
    gap: 50px;
  }
  .stats-container {
    padding: 40px 30px;
  }
  .about-title {
    font-size: 32px;
  }
  .about-description {
    font-size: 16px;
    text-align: center;
  }
  .about-text {
    padding-right: 0;
  }
  .news-title {
    font-size: 42px;
    margin-bottom: 50px;
  }
  .news-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .info-section {
    padding: 80px 15px 60px;
  }
  .section-title {
    font-size: 36px;
    margin-bottom: 60px;
  }
  .features-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  .feature-card {
    padding: 30px 25px;
  }
  .news-title {
    font-size: 36px;
    margin-bottom: 40px;
  }
  .news-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .news-headline {
    font-size: 20px;
  }
  .news-image {
    height: 450px;
  }
  .stat-number {
    font-size: 36px;
  }
  .stat-card-image {
    height: 200px;
  }
  .contact-image {
    height: 300px;
  }
  .contact-form-wrapper {
    padding: 25px;
  }
  .carriers-content {
    flex-direction: column;
    gap: 30px;
  }
  .carriers-left {
    max-width: 100%;
    text-align: center;
  }
  .carriers-feature-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .carriers-join {
    align-items: center;
  }
  .carriers-title {
    font-size: 28px;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 28px;
  }
  .feature-card {
    padding: 25px 20px;
  }
  .feature-card h3 {
    font-size: 20px;
  }
  .stat-card {
    padding: 30px 20px;
    min-height: 120px;
  }
  .stat-number {
    font-size: 32px;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .title-glow {
    width: 60px;
  }
  .card-btn, .news-all-link {
    padding: 12px 25px;
    font-size: 15px;
  }
  .news-section {
    padding: 0 15px;
  }
  .news-title {
    font-size: 32px;
  }
  .news-image {
    height: 350px;
  }
  .news-content {
    padding: 20px 15px;
  }
  .news-headline {
    font-size: 18px;
  }
  .news-excerpt {
    font-size: 14px;
  }
  .contact-image {
    height: 250px;
  }
}
</style>