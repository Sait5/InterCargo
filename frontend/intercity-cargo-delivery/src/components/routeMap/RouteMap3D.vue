<template>
  <div class="route-map" ref="root">
    <div v-if="failed" class="fallback" aria-hidden="true"></div>

    <div class="labels" aria-hidden="true">
      <span
        v-for="l in labels"
        :key="l.id"
        class="label"
        :class="[`tier-${l.tier}`, { active: l.active, hidden: !l.show }]"
        :style="{ transform: `translate(${l.x}px, ${l.y}px) translate(-50%, -100%)` }"
      >{{ l.name }}</span>
    </div>

    <ul class="legend" aria-label="Обозначения на карте">
      <li><i class="lg-route"></i>Маршруты InterCargo</li>
      <li><i class="lg-road"></i>Федеральные трассы</li>
      <li><i class="lg-river"></i>Реки</li>
      <li><i class="lg-hub"></i>Хабы и склады</li>
    </ul>

    <transition name="route-card" mode="out-in">
      <div v-if="featured" :key="featured.from + featured.to" class="route-card">
        <span class="rc-eyebrow">Маршрут в работе</span>
        <div class="rc-route">
          <span>{{ featured.from }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span>{{ featured.to }}</span>
        </div>
        <div class="rc-stats">
          <div><strong>{{ featured.km.toLocaleString('ru-RU') }}</strong><small>км по трассе</small></div>
          <div><strong>{{ featured.days }}–{{ featured.days + 1 }}</strong><small>дней в пути</small></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue';

const root = ref(null);
const labels = shallowRef([]);
const featured = ref(null);
const failed = ref(false);
let map = null;
let lastLabelUpdate = 0;

const props = defineProps({
  // Прямоугольники (в координатах страницы), под которыми подписи не показываем
  avoid: { type: Function, default: () => [] },
});

// Раскладка подписей: важные первыми, без наложений друг на друга и на текст героя
function layoutLabels(list) {
  const w = root.value?.clientWidth || 0;
  const small = w < 760;
  const box = root.value?.getBoundingClientRect();
  const avoid = (props.avoid() || []).map((r) => ({
    x0: r.left - box.left - 8, x1: r.right - box.left + 8, y0: r.top - box.top - 8, y1: r.bottom - box.top + 8,
  }));
  const placed = [];
  const order = [...list].sort((a, b) => (b.active - a.active) || (a.tier - b.tier));
  const show = new Set();
  for (const l of order) {
    if (!l.visible) continue;
    if (!l.active && (l.tier === 3 || (small && l.tier === 2))) continue;
    const lw = l.name.length * (l.tier === 1 ? 7.6 : 6.6) + 18;
    const r = { x0: l.x - lw / 2, x1: l.x + lw / 2, y0: l.y - 24, y1: l.y };
    const hit = (o) => r.x0 < o.x1 && r.x1 > o.x0 && r.y0 < o.y1 && r.y1 > o.y0;
    if (!l.active && (placed.some(hit) || avoid.some(hit))) continue;
    if (r.x0 < 4 || r.x1 > w - 4) continue;
    placed.push(r);
    show.add(l.id);
  }
  return list.map((l) => ({ ...l, show: show.has(l.id) }));
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
};

onMounted(async () => {
  if (!hasWebGL()) {
    failed.value = true;
    return;
  }
  try {
    // three.js грузится отдельным файлом только на главной
    const { createRouteMap } = await import('./scene.js');
    if (!root.value) return;
    const created = await createRouteMap(root.value, {
      onFeatured: (info) => { featured.value = info; },
      onLabels: (list) => {
        const now = performance.now();
        if (now - lastLabelUpdate < 50) return; // 20 раз в секунду достаточно
        lastLabelUpdate = now;
        labels.value = layoutLabels(list);
      },
    });
    // Компонент могли закрыть, пока грузились текстуры
    if (!root.value) created.destroy();
    else map = created;
  } catch (e) {
    console.error('3D-карта не запустилась:', e);
    failed.value = true;
  }
});

onBeforeUnmount(() => {
  if (map) map.destroy();
  map = null;
});
</script>

<style scoped>
.route-map {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.route-map :deep(canvas) {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.fallback {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 50% at 65% 55%, rgba(45, 192, 113, 0.22), transparent 70%),
    radial-gradient(40% 40% at 85% 30%, rgba(60, 200, 216, 0.16), transparent 70%);
}

.labels {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.label {
  position: absolute;
  left: 0;
  top: 0;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(4, 7, 11, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(242, 246, 244, 0.78);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  will-change: transform;
}

.label.tier-1 {
  font-size: 12.5px;
  color: #F2F6F4;
}

.label.tier-2,
.label.tier-3 {
  padding: 2px 6px;
  background: rgba(4, 7, 11, 0.45);
  border-color: transparent;
  color: rgba(242, 246, 244, 0.62);
  font-size: 10.5px;
}

.label.active {
  color: #04130A;
  background: #2DC071;
  border-color: #2DC071;
  box-shadow: 0 0 20px rgba(45, 192, 113, 0.55);
}

.label.hidden {
  opacity: 0;
}

.legend {
  position: absolute;
  z-index: 3;
  left: clamp(16px, 4vw, 56px);
  bottom: clamp(28px, 7vh, 72px);
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(8, 14, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  list-style: none;
  color: rgba(242, 246, 244, 0.72);
  font-size: 12.5px;
  font-weight: 600;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend i {
  display: block;
  width: 22px;
  height: 3px;
  border-radius: 2px;
}

.lg-route { background: linear-gradient(90deg, #2DC071, #3CC8D8); box-shadow: 0 0 8px #2DC071; }
.lg-road { background: #F2B84B; opacity: 0.8; }
.lg-river { background: #3CC8D8; opacity: 0.7; height: 2px !important; }
.lg-hub { width: 10px !important; height: 10px !important; margin: 0 6px; border-radius: 50% !important; background: #E9FFF2; box-shadow: 0 0 0 3px rgba(45, 192, 113, 0.45); }

.route-card {
  position: absolute;
  z-index: 3;
  right: clamp(16px, 4vw, 56px);
  bottom: clamp(28px, 7vh, 72px);
  width: 290px;
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(8, 14, 20, 0.72);
  border: 1px solid rgba(45, 192, 113, 0.28);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #F2F6F4;
}

.rc-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2DC071;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.rc-eyebrow::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2DC071;
  box-shadow: 0 0 10px #2DC071;
  animation: blink 1.6s ease-in-out infinite;
}

@keyframes blink {
  50% { opacity: 0.35; }
}

.rc-route {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 14px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.25;
}

.rc-route svg {
  width: 18px;
  height: 18px;
  color: #3CC8D8;
}

.rc-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.rc-stats strong {
  display: block;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
}

.rc-stats small {
  color: rgba(242, 246, 244, 0.6);
  font-size: 12px;
}

.route-card-enter-active,
.route-card-leave-active {
  transition: opacity 0.35s ease, transform 0.35s var(--motion-ease-out);
}

.route-card-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.route-card-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* На широких экранах — в пустые верхние углы над Арктикой */
@media (min-width: 1200px) {
  .legend {
    top: calc(var(--header-h) + 7vh);
    bottom: auto;
  }

  .route-card {
    top: calc(var(--header-h) + 7vh);
    bottom: auto;
  }
}

@media (max-width: 960px) {
  .legend {
    display: none;
  }
}

@media (max-width: 760px) {
  .route-card {
    display: none;
  }
}
</style>
