<template>
  <div class="page-wrapper">
    <Header />
    <main class="article-container">
      <div class="article-content">
        <header class="article-header">
          <span class="article-badge">Сквозной процесс</span>
          <h1 class="article-title">Единый цикл управления <span class="text-accent">от заявки до оплаты</span></h1>
          <p class="article-lead">
            Исключение разрозненных инструментов. Все этапы логистической закупки связаны в непрерывную цепочку,
            где статус на одном этапе автоматически инициирует действия на следующем.
          </p>
        </header>

        <section class="content-block">
          <h2 class="block-title">Жизненный цикл тендера</h2>
          <div class="timeline">
            <div class="timeline-item" v-for="(step, index) in steps" :key="index">
              <div class="timeline-line" v-if="index < steps.length - 1"></div>
              <div class="timeline-marker">{{ index + 1 }}</div>
              <div class="timeline-content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
                <div class="timeline-tags">
                  <span v-for="tag in step.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-block">
          <h2 class="block-title">Автоматизация рутины</h2>
          <div class="automation-grid">
            <div class="auto-card">
              <h3>Умные уведомления</h3>
              <p>Система самостоятельно информирует участников о смене статусов, дедлайнах и запросах на уточнение, снижая нагрузку на менеджеров.</p>
            </div>
            <div class="auto-card">
              <h3>Генерация документов</h3>
              <p>Договоры, спецификации и акты формируются автоматически на основе данных выигравшей ставки и подписываются через интегрированный ЭДО.</p>
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
  name: "EndToEndProcess",
  components: { Header, Footer },
  data() {
    return {
      steps: [
        {
          title: "Инициация закупки",
          description: "Формирование лота с указанием маршрута, объемов, требований к транспорту и сроков. Валидация данных перед публикацией.",
          tags: ["Техническое задание", "Бюджетный лимит"],
        },
        {
          title: "Сбор предложений",
          description: "Приглашение верифицированных перевозчиков. Сбор и структурирование ставок в едином интерфейсе для сравнения.",
          tags: ["Аукцион", "Запрос котировок"],
        },
        {
          title: "Оценка и акцепт",
          description: "Сравнение условий по заданным критериям. Выбор победителя и автоматическая отправка уведомлений всем участникам.",
          tags: ["Сравнительная ведомость", "Протокол"],
        },
        {
          title: "Исполнение и контроль",
          description: "Мониторинг перевозки в реальном времени. Фиксация отклонений и оперативное решение возникающих проблем.",
          tags: ["GPS-трекинг", "Статусы"],
        },
        {
          title: "Закрытие и оплата",
          description: "Автоматическая сверка выполненных объемов, формирование закрывающих документов и инициирование платежа.",
          tags: ["Акты", "Счета-фактуры"],
        },
      ],
    };
  },
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
  margin-bottom: 40px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.timeline {
  position: relative;
  padding-left: 24px;
}
.timeline-item {
  position: relative;
  padding-bottom: 48px;
  padding-left: 40px;
}
.timeline-line {
  position: absolute;
  left: 15px;
  top: 40px;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}
.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  z-index: 2;
}
.timeline-content h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.timeline-content p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.timeline-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tag {
  padding: 4px 12px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
.automation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.auto-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
}
.auto-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.auto-card p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .article-title {
    font-size: 32px;
  }
  .automation-grid {
    grid-template-columns: 1fr;
  }
  .article-container {
    padding: 60px 20px 80px;
  }
}
</style>