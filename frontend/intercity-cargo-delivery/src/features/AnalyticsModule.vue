<template>
  <div class="page-wrapper">
    <Header />
    <main class="article-container">
      <div class="article-content">
        <header class="article-header">
          <span class="article-badge">Аналитический модуль</span>
          <h1 class="article-title">Данные для принятия <span class="text-accent">обоснованных решений</span></h1>
          <p class="article-lead">
            Система агрегирует информацию на каждом этапе закупки, превращая разрозненные данные в структурированные отчеты. 
            Это позволяет оптимизировать бюджет и минимизировать логистические риски на основе фактов, а не интуиции.
          </p>
        </header>

        <section class="content-block">
          <h2 class="block-title">Источники данных для анализа</h2>
          <div class="info-grid">
            <div class="info-card">
              <h3>История ставок</h3>
              <p>Архив всех предложений по маршрутам с детализацией по времени, типу груза и условиям оплаты. Позволяет выявлять рыночные тренды и аномалии ценообразования.</p>
            </div>
            <div class="info-card">
              <h3>Исполнение обязательств</h3>
              <p>Фактические данные о своевременности подачи транспорта, сохранности груза и корректности документооборота по каждому завершённому контракту.</p>
            </div>
            <div class="info-card">
              <h3>Рыночные бенчмарки</h3>
              <p>Сравнение внутренних ставок компании со среднерыночными показателями по регионам с учетом сезонности и макроэкономических факторов.</p>
            </div>
          </div>
        </section>

        <section class="content-block">
          <h2 class="block-title">Механика принятия решений</h2>
          <div class="decision-matrix">
            <div class="matrix-item">
              <div class="matrix-step">01</div>
              <div class="matrix-content">
                <h3>Прогнозирование стартовой цены</h3>
                <p>Алгоритм рассчитывает оптимальный коридор цен для публикации тендера, чтобы обеспечить конкуренцию, не завышая бюджет.</p>
              </div>
            </div>
            <div class="matrix-item">
              <div class="matrix-step">02</div>
              <div class="matrix-content">
                <h3>Выявление аномалий</h3>
                <p>Система автоматически подсвечивает демпинговые или завышенные ставки, требующие дополнительной проверки со стороны закупщика.</p>
              </div>
            </div>
            <div class="matrix-item">
              <div class="matrix-step">03</div>
              <div class="matrix-content">
                <h3>Консолидация объемов</h3>
                <p>Аналитика предлагает объединить мелкие разрозненные заявки в крупные лоты для получения оптовых условий от перевозчиков.</p>
              </div>
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
  name: "AnalyticsModule",
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
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.info-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  transition: border-color 0.2s ease;
}
.info-card:hover {
  border-color: var(--accent-color);
}
.info-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.info-card p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.decision-matrix {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.matrix-item {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  align-items: flex-start;
}
.matrix-step {
  width: 48px;
  height: 48px;
  background: var(--bg-secondary);
  color: var(--accent-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  flex-shrink: 0;
}
.matrix-content h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}
.matrix-content p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .article-title {
    font-size: 32px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .matrix-item {
    flex-direction: column;
    gap: 16px;
  }
  .article-container {
    padding: 60px 20px 80px;
  }
}
</style>