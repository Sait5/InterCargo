<template>
  <footer class="footer">
    <div class="footer-glow footer-glow-1"></div>
    <div class="footer-glow footer-glow-2"></div>

    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="brand-logo">
            <div class="logo-icon">
              IC
            </div>

            <div class="brand-info">
              <h2>InterCargo</h2>
              <span>SMART LOGISTICS PLATFORM</span>
            </div>
          </div>

          <p class="brand-text">
            Цифровая платформа для грузоперевозок,
            тендеров и управления логистикой
            в реальном времени.
          </p>

          <div class="brand-stats">
            <div class="stat-box">
              <strong>12K+</strong>
              <span>Перевозчиков</span>
            </div>

            <div class="stat-box">
              <strong>58K</strong>
              <span>Заказов / мес</span>
            </div>

            <div class="stat-box">
              <strong>99%</strong>
              <span>Вовремя</span>
            </div>
          </div>
        </div>

        <div class="footer-column">
          <h3>Платформа</h3>

          <a href="#">Транспортные тендеры</a>
          <a href="#">Спот-аукционы</a>
          <a href="#">TMS система</a>
          <a href="#">Трекинг грузов</a>
          <a href="#">AI аналитика</a>
        </div>

        <div class="footer-column">
          <h3>Компания</h3>

          <a href="#">О платформе</a>
          <a href="#">Новости</a>
          <a href="#">Карьера</a>
          <a href="#">Партнёрам</a>
          <a href="#">Безопасность</a>
        </div>

        <div class="footer-newsletter">
          <div class="newsletter-card">
            <div class="newsletter-badge">
              INTERCARGO UPDATES
            </div>

            <h3>
              Получайте новости
              и обновления
            </h3>

            <p>
              Новые функции платформы,
              аналитика и тренды логистики.
            </p>

            <div class="newsletter-form">
              <input
                type="email"
                placeholder="Ваш e-mail"
              />

              <button>
                Подписаться
              </button>
            </div>

            <div class="socials">
              <a href="#">TG</a>
              <a href="#">VK</a>
              <a href="#">YT</a>
              <a href="#">IN</a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 InterCargo. Все права защищены.</p>

        <div class="bottom-links">
          <a href="#">Политика</a>
          <a href="#">Cookies</a>
          <a href="#">Условия</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  width: 100%;
  background:
    radial-gradient(circle at top left,
    rgba(45,192,113,0.12),
    transparent 30%),
    linear-gradient(
      180deg,
      #0a0f16 0%,
      #0d141d 100%
    );
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 70px 20px 24px;
}

.footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.015),
      transparent
    );
  pointer-events: none;
}

.footer-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.footer-glow-1 {
  top: -180px;
  left: -120px;
  width: 360px;
  height: 360px;
  background: rgba(45,192,113,0.14);
}

.footer-glow-2 {
  right: -140px;
  bottom: -180px;
  width: 420px;
  height: 420px;
  background: rgba(45,192,113,0.08);
}

.footer-container {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr 0.9fr 1.1fr;
  gap: 42px;
  margin-bottom: 42px;
}

.footer-brand {
  max-width: 420px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.logo-icon {
  width: 62px;
  height: 62px;
  border-radius: 22px;
  background:
    linear-gradient(
      135deg,
      #2dc071 0%,
      #1f9b59 100%
    );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow:
    0 10px 35px rgba(45,192,113,0.35);
  position: relative;
}

.logo-icon::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  border: 1px solid rgba(255,255,255,0.18);
}

.brand-info h2 {
  color: white;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 3px;
}

.brand-info span {
  color: rgba(255,255,255,0.45);
  font-size: 11px;
  letter-spacing: 2.4px;
}

.brand-text {
  color: rgba(255,255,255,0.66);
  line-height: 1.7;
  font-size: 14px;
  margin-bottom: 28px;
}

.brand-stats {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.stat-box {
  flex: 1;
  min-width: 105px;
  padding: 16px;
  border-radius: 20px;
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.06),
      rgba(255,255,255,0.025)
    );
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  transition: 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-4px);
  border-color: rgba(45,192,113,0.25);
  box-shadow: 0 10px 30px rgba(45,192,113,0.08);
}

.stat-box strong {
  display: block;
  color: white;
  font-size: 22px;
  margin-bottom: 4px;
}

.stat-box span {
  color: rgba(255,255,255,0.52);
  font-size: 12px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-column h3,
.newsletter-card h3 {
  color: white;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 20px;
}

.footer-column a {
  width: fit-content;
  text-decoration: none;
  color: rgba(255,255,255,0.58);
  margin-bottom: 14px;
  transition: 0.25s ease;
  position: relative;
  font-size: 14px;
}

.footer-column a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 1px;
  background: var(--accent-color);
  transition: 0.25s ease;
}

.footer-column a:hover {
  color: white;
  transform: translateX(4px);
}

.footer-column a:hover::after {
  width: 100%;
}

.newsletter-card {
  position: relative;
  overflow: hidden;
  padding: 26px;
  border-radius: 28px;
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.08),
      rgba(255,255,255,0.03)
    );
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
}

.newsletter-card::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(45,192,113,0.12);
  filter: blur(60px);
}

.newsletter-badge {
  width: fit-content;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(45,192,113,0.12);
  border: 1px solid rgba(45,192,113,0.24);
  color: #7dffb2;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 18px;
  margin-left: auto;
  margin-right: auto;
}

.newsletter-card h3 {
  font-size: 24px;
  line-height: 1.3;
  margin-bottom: 14px;
}

.newsletter-card p {
  color: rgba(255,255,255,0.62);
  line-height: 1.6;
  margin-bottom: 22px;
  font-size: 14px;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.newsletter-form input {
  width: 100%;
  height: 50px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 0 16px;
  color: white;
  outline: none;
  font-size: 14px;
  transition: 0.25s ease;
}

.newsletter-form input:focus {
  border-color: rgba(45,192,113,0.45);
  box-shadow: 0 0 0 4px rgba(45,192,113,0.08);
}

.newsletter-form input::placeholder {
  color: rgba(255,255,255,0.35);
}

.newsletter-form button {
  height: 50px;
  border: none;
  border-radius: 16px;
  background:
    linear-gradient(
      135deg,
      #2dc071,
      #1f9b59
    );
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 12px 28px rgba(45,192,113,0.28);
}

.newsletter-form button:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 34px rgba(45,192,113,0.35);
}

.socials {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.socials a {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
  transition: 0.25s ease;
  font-size: 12px;
  font-weight: 700;
}

.socials a:hover {
  background: var(--accent-color);
  border-color: transparent;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(45,192,113,0.28);
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-bottom p {
  color: rgba(255,255,255,0.42);
  font-size: 13px;
}

.bottom-links {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.bottom-links a {
  text-decoration: none;
  color: rgba(255,255,255,0.45);
  font-size: 13px;
  transition: 0.25s ease;
}

.bottom-links a:hover {
  color: white;
}

@media (max-width: 1150px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .footer {
    padding: 55px 16px 22px;
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-stats {
    flex-direction: column;
  }

  .stat-box {
    width: 100%;
  }

  .newsletter-card h3 {
    font-size: 20px;
  }

  .brand-info h2 {
    font-size: 24px;
  }
}
</style>