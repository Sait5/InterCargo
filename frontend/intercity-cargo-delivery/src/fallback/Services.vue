<!-- src/views/Services.vue -->
<template>
  <div>
    <Header />
    <div class="page-content">
      <h2>Услуги</h2>
      <p>Страница в разработке</p>
    </div>
  </div>
</template>

<script>
import Header from "@/ui/Header.vue";
import Footer from "@/ui/Footer.vue";

export default {
  name: "Services",
  components: { Header, Footer }
}
</script>

<style scoped>
.page-content {
  padding: 100px 20px;
  text-align: center;
  min-height: calc(100vh - 80px);
}
</style>