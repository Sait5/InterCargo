<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <Toast />
</template>

<script setup>
import Toast from '@/ui/Toast.vue';
import { useSiteMotion } from '@/composables/useSiteMotion';

useSiteMotion();
</script>
