<template>
  <section class="page-hero">
    <HeroBackdrop :view="view" side="left" />
    <div class="ic-container inner">
      <span v-if="eyebrow" class="ic-eyebrow">{{ eyebrow }}</span>
      <h1><slot name="title">{{ title }}</slot></h1>
      <p v-if="lead || $slots.default"><slot>{{ lead }}</slot></p>
    </div>
  </section>
</template>

<script setup>
import HeroBackdrop from '@/ui/HeroBackdrop.vue';

defineProps({
  view: { type: String, default: 'overview' },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
});
</script>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  padding: 96px 0 88px;
  background:
    radial-gradient(60% 90% at 80% 0%, rgba(var(--accent-rgb), 0.16), transparent 65%),
    var(--hero-bg);
  color: var(--hero-text);
  border-bottom: 1px solid var(--border-color);
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(70% 100% at 70% 0%, #000, transparent);
}

.inner {
  position: relative;
  z-index: 1;
}

h1 {
  max-width: 820px;
  margin: 18px 0 14px;
  font-size: clamp(32px, 4.6vw, 56px);
  color: var(--hero-text);
}

p {
  max-width: 640px;
  color: var(--hero-muted);
  font-size: 17px;
  line-height: 1.6;
}
</style>
