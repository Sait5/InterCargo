import { onMounted, onBeforeUnmount, nextTick } from 'vue';

// Плавное появление элементов с классом .ic-reveal при прокрутке
export function useReveal(rootRef) {
  let observer = null;

  onMounted(async () => {
    await nextTick();
    const root = rootRef?.value || document;
    const items = root.querySelectorAll('.ic-reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => observer.observe(el));
  });

  onBeforeUnmount(() => observer && observer.disconnect());
}
