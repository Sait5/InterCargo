<template>
  <div class="backdrop" :class="`side-${side}`" aria-hidden="true">
    <img :src="src" alt="" decoding="async" fetchpriority="high">
    <div class="veil"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import west from '@/assets/map/map-west.webp';
import siberia from '@/assets/map/map-siberia.webp';
import east from '@/assets/map/map-east.webp';
import overview from '@/assets/map/map-overview.webp';

// Кадры той же 3D-карты, что на главной: так все страницы выглядят единым целым
const views = { west, siberia, east, overview };

const props = defineProps({
  view: { type: String, default: 'overview' },
  // С какой стороны оставить место под текст: left — текст слева, center — текст по центру
  side: { type: String, default: 'left' },
});

const src = computed(() => views[props.view] || overview);
</script>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.backdrop img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 60% 40%;
  opacity: 0.85;
  animation: drift 40s ease-in-out infinite alternate;
}

@keyframes drift {
  from { transform: scale(1.04) translate3d(0, 0, 0); }
  to { transform: scale(1.1) translate3d(-1.5%, -1%, 0); }
}

.veil {
  position: absolute;
  inset: 0;
}

.side-left .veil {
  background:
    linear-gradient(90deg, rgba(4, 7, 11, 0.96) 0%, rgba(4, 7, 11, 0.82) 34%, rgba(4, 7, 11, 0.25) 70%, rgba(4, 7, 11, 0.5) 100%),
    linear-gradient(180deg, rgba(4, 7, 11, 0.6) 0%, transparent 30%, transparent 70%, var(--hero-bg) 100%);
}

.side-center .veil {
  background:
    radial-gradient(60% 70% at 50% 45%, rgba(4, 7, 11, 0.86), rgba(4, 7, 11, 0.45) 100%),
    linear-gradient(180deg, rgba(4, 7, 11, 0.5) 0%, transparent 30%, transparent 70%, var(--hero-bg) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .backdrop img {
    animation: none;
  }
}

@media (max-width: 760px) {
  .side-left .veil {
    background: linear-gradient(180deg, rgba(4, 7, 11, 0.7), rgba(4, 7, 11, 0.9) 60%, var(--hero-bg));
  }
}
</style>
