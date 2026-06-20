<template>
  <div class="page-wrapper">
    <Header />
    <main class="article-container">
      <div class="article-content">
        <header class="article-header">
          <span class="article-badge">Проверенные перевозчики</span>
          <h1 class="article-title">Многоуровневая система <span class="text-accent">верификации</span></h1>
          <p class="article-lead">
            Доступ к тендерам получают только компании, прошедшие строгий аудит.
            Это гарантирует финансовую устойчивость, наличие ресурсов и соответствие законодательным нормам.
          </p>
        </header>

        <section class="content-block">
          <h2 class="block-title">Этапы проверки контрагента</h2>
          <div class="verification-steps">
            <div class="v-step">
              <div class="v-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                  <path d="M22 6L12 13L2 6"/>
                </svg>
              </div>
              <h3>Юридический аудит</h3>
              <p>Проверка учредительных документов, отсутствия в реестрах недобросовестных поставщиков (РНП) и действующих судебных ограничений.</p>
            </div>
            <div class="v-step">
              <div class="v-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Финансовая устойчивость</h3>
              <p>Анализ бухгалтерской отчетности, проверка отсутствия критических задолженностей перед бюджетом и контрагентами.</p>
            </div>
            <div class="v-step">
              <div class="v-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Ресурсная база</h3>
              <p>Подтверждение права собственности или долгосрочной аренды подвижного состава, наличие необходимых лицензий и допусков.</p>
            </div>
            <div class="v-step">
              <div class="v-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Пилотный проект</h3>
              <p>Для новых участников допускается участие только в тендерах с низким уровнем риска до набора положительной статистики.</p>
            </div>
          </div>
        </section>

        <section class="content-block">
          <h2 class="block-title">Динамический рейтинг надежности</h2>
          <p class="section-desc">
            Статус "проверенного" не является пожизненным. Рейтинг перевозчика пересчитывается после каждого выполненного рейса на основе следующих метрик:
          </p>
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Своевременность</h3>
              <p>Соответствие фактического времени подачи и доставки заявленным в договоре срокам.</p>
            </div>
            <div class="metric-card">
              <h3>Качество документов</h3>
              <p>Отсутствие ошибок, исправлений и задержек в предоставлении транспортных накладных и актов.</p>
            </div>
            <div class="metric-card">
              <h3>Коммуникация</h3>
              <p>Скорость и полнота ответов на запросы, проактивное информирование о нештатных ситуациях.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "@/ui/Header.vue";
import Footer from "@/ui/Footer.vue";

export default {
  name: "VerifiedCarriers",
  components: { Header, Footer },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50);
    });
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    });
  }
};
</script>

<style scoped>
.page-wrapper {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  width: 100%;
  overflow-x: hidden;
}
.article-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 80px 24px 120px;
}
.article-content {
  max-width: 900px;
  width: 100%;
}
.article-header {
  text-align: center;
  margin-bottom: 60px;
}
.article-badge {
  display: inline-block;
  background: var(--bg-secondary);
  color: var(--accent-color);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
}
.article-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}
.text-accent {
  color: var(--accent-color);
}
.article-lead {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
.content-block {
  margin-top: 80px;
}
.block-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.section-desc {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 32px;
}
.verification-steps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.v-step {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.v-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  margin-bottom: 4px;
}
.v-step h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}
.v-step p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  text-align: center;
}
.metric-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--accent-color);
}
.metric-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .article-title {
    font-size: 32px;
  }
  .verification-steps,
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .article-container {
    padding: 60px 20px 80px;
  }
}
</style>