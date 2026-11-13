<template>
  <div class="privacy-page">
    <Header />
    <PageHero view="privacy-office" eyebrow="Документы" title="Политика и условия" lead="Как мы обращаемся с данными и на каких условиях работает платформа." />

    <div class="ic-container layout">
      <nav class="toc" aria-label="Содержание">
        <a href="#privacy">Конфиденциальность</a>
        <a href="#cookies">Cookies</a>
        <a href="#terms">Условия использования</a>
      </nav>

      <div class="doc">
        <section id="privacy">
          <h2>Политика конфиденциальности</h2>
          <p>Мы собираем только те данные, которые нужны для перевозки и работы личного кабинета: имя, телефон, email, название компании и сведения о грузе.</p>
          <ul>
            <li>Данные используются для расчёта стоимости, связи с вами и исполнения заказов.</li>
            <li>Контакты заказчика видят только перевозчики, чья заявка на заказ одобрена.</li>
            <li>Пароли хранятся только в виде хеша — их не видит никто, включая сотрудников.</li>
            <li>Вы можете попросить удалить аккаунт и данные, написав на info@intercargo.ru.</li>
          </ul>
        </section>

        <section id="cookies">
          <h2>Cookies и локальное хранилище</h2>
          <p>Сайт не использует рекламные и аналитические cookies. В браузере сохраняются только:</p>
          <ul>
            <li>токен входа — чтобы не вводить пароль при каждом визите;</li>
            <li>выбранная тема оформления.</li>
          </ul>
          <p>Эти данные можно удалить в любой момент, выйдя из аккаунта или очистив данные сайта в браузере.</p>
        </section>

        <section id="terms">
          <h2>Условия использования</h2>
          <p>Регистрируясь на платформе, вы подтверждаете, что указали достоверные данные и действуете от имени себя или своей компании.</p>
          <ul>
            <li>Заказчик отвечает за точность описания груза, сроков и адресов.</li>
            <li>Перевозчик отвечает за сохранность груза с момента погрузки до выгрузки.</li>
            <li>Ставка в аукционе — обязательство выполнить перевозку по предложенной цене, если вы победили.</li>
            <li>Администрация может заблокировать аккаунт за недостоверные данные или срыв перевозок.</li>
          </ul>
        </section>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';
import PageHero from '@/ui/PageHero.vue';
</script>

<style scoped>
.privacy-page {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 56px;
  padding-top: 64px;
  padding-bottom: 96px;
}

.toc {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  align-self: start;
  display: grid;
  gap: 4px;
}

.toc a {
  padding: 10px 14px;
  border-left: 2px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 600;
  text-decoration: none;
}

.toc a:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.doc {
  max-width: 760px;
}

section {
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border-color);
  scroll-margin-top: calc(var(--header-h) + 24px);
}

section:last-child {
  border-bottom: 0;
}

h2 {
  margin-bottom: 16px;
  font-size: 26px;
}

p,
li {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.7;
}

p {
  margin-bottom: 12px;
}

ul {
  display: grid;
  gap: 8px;
  margin: 8px 0 14px;
  padding-left: 22px;
}

li::marker {
  color: var(--accent-color);
}

@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .toc {
    position: static;
    grid-auto-flow: column;
    overflow-x: auto;
  }
}
</style>
