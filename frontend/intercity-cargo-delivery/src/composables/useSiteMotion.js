// Анимации для всего сайта без правки каждой страницы:
//  • появление блоков и карточек при прокрутке (по очереди внутри сетки)
//  • «набегающие» цифры в статистике
//  • подсветка карточек, следующая за курсором
import { nextTick, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

// Страницы-лендинги, где включаем автоматическую анимацию
const SCOPES = '.saas-landing, .home, .news-page, .privacy-page, .page-wrapper';

// Что появляется при прокрутке
const REVEAL = [
  'section .section-header', 'section .section-head', 'section h2',
  '[class*="-grid"] > *', '[class*="-list"] > *', '.timeline-item', '.process-step',
  '.cta-card', '.cta-section .container > *', '.content-block', '.info-card', '.post',
].join(', ');

// Цифры, которые набегают
const COUNTERS = '.hero-stat-value, .stats dt, .stat-number, .hero-stat strong';

// Карточки с подсветкой под курсором
const GLOW = [
  '[class*="-card"]:not(.route-card):not(.dashboard-card):not(.cta-card)',
  '.product', '.news-card', '.post',
].join(', ');

const reduceMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateNumber(el) {
  const raw = el.textContent.trim();
  const m = raw.match(/^([^\d-]*)(-?[\d\s]+(?:[.,]\d+)?)(.*)$/);
  if (!m || el.dataset.counted) return;
  el.dataset.counted = '1';
  const [, pre, num, post] = m;
  const target = parseFloat(num.replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(target) || target === 0) return;
  const decimals = (num.split(/[.,]/)[1] || '').length;
  const spaced = /\s/.test(num) || target >= 10000;
  const fmt = (v) => {
    const s = v.toFixed(decimals);
    return spaced ? Number(s).toLocaleString('ru-RU', { minimumFractionDigits: decimals }) : s.replace('.', ',');
  };
  const start = performance.now();
  const dur = 1400;
  const step = (now) => {
    const k = Math.min(1, (now - start) / dur);
    const e = 1 - (1 - k) ** 3;
    el.textContent = `${pre}${fmt(target * e)}${post}`;
    if (k < 1) requestAnimationFrame(step);
    else el.textContent = raw;
  };
  requestAnimationFrame(step);
}

export function useSiteMotion() {
  const route = useRoute();
  let observer = null;

  // Подсветка под курсором: рисуем радиальный градиент поверх фона карточки,
  // только если у неё нет своей картинки-фона
  let lit = null;
  const unlight = () => {
    if (lit) lit.style.backgroundImage = '';
    lit = null;
  };
  const onPointer = (e) => {
    const card = e.target.closest?.('[data-glow]');
    if (card !== lit) unlight();
    if (!card) return;
    if (!lit) {
      if (getComputedStyle(card).backgroundImage !== 'none') return;
      lit = card;
    }
    const r = card.getBoundingClientRect();
    card.style.backgroundImage = `radial-gradient(420px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(var(--accent-rgb), 0.11), transparent 45%)`;
  };

  const scan = async () => {
    await nextTick();
    // ждём, пока закончится переход страницы
    await new Promise((r) => setTimeout(r, 320));
    if (observer) observer.disconnect();
    const roots = document.querySelectorAll(SCOPES);
    if (!roots.length) return;

    const reveal = reduceMotion() ? [] : [...new Set([...roots].flatMap((root) => [...root.querySelectorAll(REVEAL)]))]
      .filter((el) => !el.closest('.hero, .page-hero, .site-header, footer, .ic-reveal') && !el.classList.contains('ic-reveal'));

    reveal.forEach((el) => {
      // задержка по порядку внутри родителя — эффект «волны»
      const index = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 70}ms`);
      el.classList.add('ic-auto-reveal');
    });

    roots.forEach((root) => root.querySelectorAll(GLOW).forEach((el) => {
      if (!el.closest('.site-header, footer')) el.setAttribute('data-glow', '');
    }));

    const counters = [...new Set([...roots].flatMap((root) => [...root.querySelectorAll(COUNTERS)]))];

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        if (el.matches(COUNTERS) && !reduceMotion()) animateNumber(el);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveal.forEach((el) => observer.observe(el));
    counters.forEach((el) => observer.observe(el));
  };

  onMounted(() => {
    document.addEventListener('pointermove', onPointer, { passive: true });
    scan();
  });
  watch(() => route.fullPath, scan);
  onBeforeUnmount(() => {
    document.removeEventListener('pointermove', onPointer);
    if (observer) observer.disconnect();
  });
}
