<template>
  <div class="calc">
    <div class="controls">
      <div class="row2">
        <label class="field">
          <span>Откуда</span>
          <select v-model="from" class="ic-input">
            <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
        <button class="swap" type="button" aria-label="Поменять местами" @click="swap"><ArrowLeftRight /></button>
        <label class="field">
          <span>Куда</span>
          <select v-model="to" class="ic-input">
            <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
      </div>

      <label class="slider">
        <span class="s-head"><span>Вес груза</span><b>{{ weight }} т</b></span>
        <input v-model.number="weight" type="range" min="1" max="20" step="1" :style="fill(weight, 1, 20)">
        <span class="s-scale"><i>1 т</i><i>10 т</i><i>20 т</i></span>
      </label>

      <label class="slider">
        <span class="s-head"><span>Объём</span><b>{{ volume }} м³</b></span>
        <input v-model.number="volume" type="range" min="2" max="90" step="1" :style="fill(volume, 2, 90)">
        <span class="s-scale"><i>2 м³</i><i>45 м³</i><i>90 м³</i></span>
      </label>

      <div class="chips" role="radiogroup" aria-label="Тип груза">
        <button v-for="t in types" :key="t.id" type="button" class="chip" :class="{ on: type === t.id }" role="radio" :aria-checked="type === t.id" @click="type = t.id">
          <component :is="t.icon" /> {{ t.label }}
        </button>
      </div>

      <label class="toggle">
        <input v-model="urgent" type="checkbox">
        <span class="track"><span class="thumb"></span></span>
        <span>Срочно — отправка в течение 24 часов</span>
      </label>
    </div>

    <div class="result">
      <span class="r-label">Предварительная стоимость</span>
      <div class="price"><span>{{ fmt(animatedPrice) }}</span> ₽</div>
      <div class="r-grid">
        <div><strong>{{ km.toLocaleString('ru-RU') }} км</strong><small>по трассе</small></div>
        <div><strong>{{ days }}–{{ days + 1 }} дн</strong><small>в пути</small></div>
        <div><strong>{{ vehicle }}</strong><small>транспорт</small></div>
      </div>
      <ul class="included">
        <li><Check /> Страхование груза</li>
        <li><Check /> Трекинг и документы в кабинете</li>
        <li><Check /> Цена фиксируется в договоре</li>
      </ul>
      <button class="ic-btn ic-btn--primary go" type="button" @click="request">Получить точный расчёт <ArrowRight /></button>
      <small class="note">Оценка по средним ставкам. Точную цену менеджер пришлёт за 15 минут.</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ArrowLeftRight, ArrowRight, Check, Package, Snowflake, Container, Gem } from 'lucide-vue-next';
import mapData from '@/data/russia-map.json';

const emit = defineEmits(['request']);
const props = defineProps({
  // город отправления, выбранный на карте
  presetFrom: { type: String, default: '' },
});

const cities = [...mapData.cities].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
const byId = Object.fromEntries(cities.map((c) => [c.id, c]));

const from = ref('msk');
const to = ref('kzn');
const weight = ref(10);
const volume = ref(40);
const type = ref('general');
const urgent = ref(false);

const types = [
  { id: 'general', label: 'Обычный', icon: Package, k: 1 },
  { id: 'reefer', label: 'Рефрижератор', icon: Snowflake, k: 1.18 },
  { id: 'oversize', label: 'Негабарит', icon: Container, k: 1.35 },
  { id: 'valuable', label: 'Ценный', icon: Gem, k: 1.12 },
];

watch(() => props.presetFrom, (id) => {
  if (id && byId[id]) {
    from.value = id;
    if (to.value === id) to.value = id === 'msk' ? 'spb' : 'msk';
  }
});

const swap = () => { [from.value, to.value] = [to.value, from.value]; };

// Расстояние по трассе ≈ 1,25 × по прямой
const km = computed(() => {
  const a = byId[from.value];
  const b = byId[to.value];
  if (!a || !b || a === b) return 0;
  const rad = (d) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return Math.round((2 * 6371 * Math.asin(Math.sqrt(h)) * 1.25) / 10) * 10;
});

const vehicle = computed(() => {
  if (weight.value <= 1.5 && volume.value <= 9) return 'Газель';
  if (weight.value <= 5 && volume.value <= 36) return '5 т';
  if (weight.value <= 10 && volume.value <= 50) return '10 т';
  return 'Фура 20 т';
});

const price = computed(() => {
  if (!km.value) return 0;
  const rate = { 'Газель': 32, '5 т': 46, '10 т': 58, 'Фура 20 т': 72 }[vehicle.value];
  const k = types.find((t) => t.id === type.value).k * (urgent.value ? 1.25 : 1);
  return Math.max(9000, Math.round((km.value * rate * k) / 500) * 500);
});

const days = computed(() => Math.max(1, Math.ceil(km.value / (urgent.value ? 900 : 650))));

// Плавно «докручиваем» цену при изменениях
const animatedPrice = ref(price.value);
let raf = 0;
watch(price, (target) => {
  cancelAnimationFrame(raf);
  const start = animatedPrice.value;
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 450);
    animatedPrice.value = Math.round(start + (target - start) * (1 - (1 - k) ** 3));
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
});

const fmt = (v) => v.toLocaleString('ru-RU');
const fill = (v, min, max) => ({ '--p': `${((v - min) / (max - min)) * 100}%` });

const request = () => {
  const t = types.find((x) => x.id === type.value).label.toLowerCase();
  emit('request', `${byId[from.value].name} → ${byId[to.value].name}, ${weight.value} т, ${volume.value} м³, груз: ${t}${urgent.value ? ', срочно' : ''}. Оценка калькулятора: ${fmt(price.value)} ₽.`);
};
</script>

<style scoped>
.calc {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-card-solid);
  box-shadow: var(--shadow-card);
}

.controls {
  display: grid;
  gap: 26px;
  padding: 34px;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 10px;
}

.field {
  display: grid;
  gap: 7px;
}

.field > span,
.s-head > span {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
}

select.ic-input {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A8882' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  cursor: pointer;
}

.swap {
  display: grid;
  place-items: center;
  width: 44px;
  height: 50px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-input);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.3s ease;
}

.swap:hover {
  color: var(--accent-color);
  border-color: rgba(var(--accent-rgb), 0.5);
  transform: rotate(180deg);
}

.swap svg {
  width: 18px;
  height: 18px;
}

.slider {
  display: grid;
  gap: 10px;
}

.s-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.s-head b {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--text-primary);
}

/* Ползунок */
input[type="range"] {
  --p: 50%;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--accent-color) 0 var(--p), var(--border-color) var(--p) 100%);
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 4px solid var(--accent-color);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.45);
  transition: transform 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.12);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 4px solid var(--accent-color);
}

.s-scale {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 12px;
}

.s-scale i {
  font-style: normal;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.chip svg {
  width: 16px;
  height: 16px;
}

.chip.on {
  border-color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent-color);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
}

.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.track {
  position: relative;
  width: 46px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 13px;
  background: var(--border-strong);
  transition: background 0.25s ease;
}

.thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s var(--motion-ease-out);
}

.toggle input:checked + .track {
  background: var(--accent-color);
}

.toggle input:checked + .track .thumb {
  transform: translateX(20px);
}

.toggle input:focus-visible + .track {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Результат — тёмная карточка-акцент */
.result {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 34px;
  color: #F2F6F4;
  background:
    radial-gradient(90% 70% at 100% 0%, rgba(45, 192, 113, 0.28), transparent 60%),
    linear-gradient(160deg, #0C1D15, #06100C);
}

.r-label {
  color: rgba(242, 246, 244, 0.6);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.price {
  margin: 10px 0 22px;
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 52px);
  font-weight: 700;
  line-height: 1;
  color: #2DC071;
  font-variant-numeric: tabular-nums;
}

.r-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px 0;
  border-block: 1px solid rgba(255, 255, 255, 0.1);
}

.r-grid strong {
  display: block;
  font-family: var(--font-display);
  font-size: 17px;
}

.r-grid small {
  color: rgba(242, 246, 244, 0.55);
  font-size: 12.5px;
}

.included {
  display: grid;
  gap: 8px;
  margin: 18px 0 24px;
  list-style: none;
  color: rgba(242, 246, 244, 0.78);
  font-size: 14px;
}

.included li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.included svg {
  width: 16px;
  height: 16px;
  color: #2DC071;
}

.go {
  margin-top: auto;
  width: 100%;
  height: 52px;
  --text-on-accent: #04130A;
}

.note {
  margin-top: 12px;
  color: rgba(242, 246, 244, 0.5);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 900px) {
  .calc {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .controls,
  .result {
    padding: 22px;
  }

  .row2 {
    grid-template-columns: 1fr;
  }

  .swap {
    justify-self: center;
    height: 40px;
    transform: rotate(90deg);
  }
}
</style>
