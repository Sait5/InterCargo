<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import Toast from '@/ui/Toast.vue';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUser();
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  font-family: 'Open Sans', Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  width: 100%;
  min-height: 100vh;
  background-color: #F3FFFD; 
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: #2DC071;
  border-radius: 6px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: #28a45e;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #2DC071 #f1f1f1;
}
</style>