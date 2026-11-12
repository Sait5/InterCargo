<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <Toast />
</template>

<script setup>
import Toast from '@/ui/Toast.vue';
</script>
