<template>
  <div class="page-wrapper">
    <Header />
    <main class="article-container">
      <div class="article-content">
        <header class="article-header">
          <span class="article-badge">Независимость решений</span>
          <h1 class="article-title">Объективность, встроенная <span class="text-accent">в алгоритм</span></h1>
          <p class="article-lead">
            Человеческий фактор и субъективные предпочтения исключены из процесса выбора.
            Система оценивает участников строго по заранее утвержденным и прозрачным критериям.
          </p>
        </header>

        <section class="content-block">
          <h2 class="block-title">Критерии оценки</h2>
          <div class="criteria-grid">
            <div class="criteria-card">
              <div class="criteria-weight">40%</div>
              <h3>Стоимость перевозки</h3>
              <p>Базовый параметр, но не единственный. Анализируется не только итоговая сумма, но и структура затрат (НДС, тип оплаты).</p>
            </div>
            <div class="criteria-card">
              <div class="criteria-weight">30%</div>
              <h3>Надежность исполнителя</h3>
              <p>Внутренний рейтинг перевозчика, сформированный на основе истории успешных завершений контрактов и отсутствия претензий.</p>
            </div>
            <div class="criteria-card">
              <div class="criteria-weight">20%</div>
              <h3>Соответствие требованиям</h3>
              <p>Наличие необходимого типа подвижного состава, допусков к специфическим грузам и страхового покрытия.</p>
            </div>
            <div class="criteria-card">
              <div class="criteria-weight">10%</div>
              <h3>Скорость реакции</h3>
              <p>Время, затраченное перевозчиком на предоставление развернутого коммерческого предложения и ответов на уточнения.</p>
            </div>
          </div>
        </section>

        <section class="content-block">
          <h2 class="block-title">Механика рейтингования</h2>
          <div class="mechanics-list">
            <div class="mechanic-item">
              <h3>1. Нормализация данных</h3>
              <p>Все разнородные параметры (цена в рублях, рейтинг в баллах, сроки в днях) приводятся к единой безразмерной шкале от 0 до 100.</p>
            </div>
            <div class="mechanic-item">
              <h3>2. Применение весов</h3>
              <p>К нормализованным значениям применяются весовые коэффициенты, настроенные закупщиком под специфику конкретного лота.</p>
            </div>
            <div class="mechanic-item">
              <h3>3. Формирование скоринга</h3>
              <p>Система рассчитывает итоговый балл для каждого участника и выстраивает прозрачный ранжированный список с обоснованием позиции.</p>
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
  name: "IndependenceModule",
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
.criteria-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.criteria-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
}
.criteria-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--accent-color);
}
.criteria-weight {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent-color);
  margin-bottom: 12px;
}
.criteria-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.criteria-card p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.mechanics-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.mechanic-item {
  padding: 24px;
  background: var(--bg-card);
  border-radius: 16px;
  border-left: 4px solid var(--border-color);
}
.mechanic-item h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}
.mechanic-item p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .article-title {
    font-size: 32px;
  }
  .criteria-grid {
    grid-template-columns: 1fr;
  }
  .article-container {
    padding: 60px 20px 80px;
  }
}
</style>