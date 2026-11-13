<template>
  <div class="backdrop" :class="`side-${side}`" aria-hidden="true">
    <video
      v-if="video"
      class="media"
      :src="`/video/${video}.mp4`"
      :poster="`/video/${video}.jpg`"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
    ></video>
    <img v-else-if="src" class="media photo" :src="src" alt="" decoding="async" fetchpriority="high">
    <div class="veil"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Фото страниц (Pexels, см. docs/CREDITS.md)
const photos = Object.fromEntries(
  Object.entries(import.meta.glob('@/assets/photos/*.webp', { eager: true, import: 'default' }))
    .map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url]),
);
const videos = ['truck-mountains', 'highway-top'];

const props = defineProps({
  // имя фото из assets/photos или видео из public/video
  view: { type: String, default: 'news-port' },
  // с какой стороны текст: left — фото затемнено слева, center — по центру
  side: { type: String, default: 'left' },
});

const video = computed(() => (videos.includes(props.view) ? props.view : null));
const src = computed(() => photos[props.view] || photos['news-port']);
</script>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--hero-bg);
}

.media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo {
  animation: kenburns 28s ease-in-out infinite alternate;
}

@keyframes kenburns {
  from { transform: scale(1.03); }
  to { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
}

.veil {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.side-left .veil {
  background:
    linear-gradient(90deg, rgba(4, 9, 8, 0.9) 0%, rgba(4, 9, 8, 0.72) 38%, rgba(4, 9, 8, 0.25) 70%, rgba(4, 9, 8, 0.35) 100%),
    linear-gradient(180deg, rgba(4, 9, 8, 0.55) 0%, transparent 28%, transparent 80%, rgba(4, 9, 8, 0.6) 100%);
}

.side-center .veil {
  background:
    radial-gradient(55% 60% at 50% 50%, rgba(4, 9, 8, 0.6), rgba(4, 9, 8, 0.25) 100%),
    linear-gradient(180deg, rgba(4, 9, 8, 0.55) 0%, transparent 30%, transparent 75%, rgba(4, 9, 8, 0.6) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .photo {
    animation: none;
  }
}

@media (max-width: 760px) {
  .side-left .veil {
    background: linear-gradient(180deg, rgba(4, 9, 8, 0.65), rgba(4, 9, 8, 0.85) 60%, rgba(4, 9, 8, 0.9));
  }
}
</style>
