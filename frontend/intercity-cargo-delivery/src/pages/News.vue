<template>
  <div class="news-page">
    <Header />
    <PageHero view="news-port" eyebrow="Новости" title="Что нового в InterCargo" lead="Маршруты, обновления платформы и жизнь компании." />

    <div class="ic-container list">
      <article v-for="n in news" :id="n.id" :key="n.id" class="post ic-card">
        <div class="post-img">
          <img :src="n.image" :alt="n.title" loading="lazy">
        </div>
        <div class="post-body">
          <div class="meta">
            <span class="tag">{{ n.tag }}</span>
            <time :datetime="n.date">{{ formatNewsDate(n.date) }}</time>
          </div>
          <h2>{{ n.title }}</h2>
          <p v-for="(para, i) in n.body" :key="i">{{ para }}</p>
        </div>
      </article>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/ui/Header.vue';
import Footer from '@/ui/Footer.vue';
import PageHero from '@/ui/PageHero.vue';
import { news, formatNewsDate } from '@/data/news';
</script>

<style scoped>
.news-page {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.list {
  display: grid;
  gap: 28px;
  padding-top: 64px;
  padding-bottom: 96px;
}

.post {
  display: grid;
  grid-template-columns: 380px 1fr;
  overflow: hidden;
  scroll-margin-top: calc(var(--header-h) + 24px);
}

.post:target {
  border-color: rgba(var(--accent-rgb), 0.5);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12);
}

.post-img {
  background: var(--bg-elevated);
}

.post-img img {
  width: 100%;
  height: 100%;
  max-height: 460px;
  object-fit: cover;
  object-position: top;
}

.post-body {
  padding: 36px 40px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-muted);
  font-size: 14px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent-color);
  font-size: 12.5px;
  font-weight: 700;
}

h2 {
  margin: 16px 0 18px;
  font-size: clamp(22px, 2.6vw, 30px);
}

p {
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.7;
}

@media (max-width: 860px) {
  .post {
    grid-template-columns: 1fr;
  }

  .post-img img {
    max-height: 300px;
  }

  .post-body {
    padding: 24px;
  }
}
</style>
