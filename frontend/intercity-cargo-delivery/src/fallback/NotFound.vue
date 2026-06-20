<template>
  <div class="not-found">
    <Header />
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Страница не найдена</h1>
      <p class="error-message">Извините, запрашиваемая страница не существует.</p>
      <router-link to="/" class="home-link">
        Вернуться на главную
      </router-link>
    </div>
  </div>
</template>

<script>
import Header from "@/ui/Header.vue"
import Footer from "@/ui/Footer.vue"

export default {
  name: "NotFound",
  components: { Header, Footer }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1929 0%, #1a2a3a 100%);
}

.not-found-content {
  max-width: 600px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(90deg, #2DC071, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

.error-title {
  font-size: 32px;
  color: #ffffff;
  margin-bottom: 20px;
  font-weight: 700;
}

.error-message {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  line-height: 1.6;
}

.home-link {
  display: inline-block;
  padding: 16px 32px;
  background: #2DC071;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.home-link:hover {
  background: #28a45e;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 192, 113, 0.3);
}
</style>