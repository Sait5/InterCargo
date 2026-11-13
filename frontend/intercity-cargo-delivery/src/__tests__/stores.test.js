import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { applyTheme } from '@/stores/theme';

const json = (data, status = 200) => new Response(JSON.stringify(data), { status });

describe('Хранилище заказов', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    localStorage.setItem('token', 't');
    vi.restoreAllMocks();
  });

  it('загружает заказы с сервера и считает отклики', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json([
      { id: 'a', status: 'active', accessType: 'public', createdBy: 'c1', applicants: [{ id: 'x', userId: 'u1', status: 'pending' }] },
      { id: 'b', status: 'pending', accessType: 'public', createdBy: 'c1', applicants: [] },
    ]));
    const store = useOrderStore();
    await store.fetchOrders();
    expect(store.orders).toHaveLength(2);
    expect(store.activeOrders.map((o) => o.id)).toEqual(['a']);
    expect(store.pendingOrders.map((o) => o.id)).toEqual(['b']);
    expect(store.hasApplied('a', 'u1')).toBe(true);
    expect(store.getUserApplications('u1')[0].myApplication.id).toBe('x');
  });

  it('не трогает список при ошибке и возвращает сообщение', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ message: 'Заказ ещё не активен' }, 400));
    const store = useOrderStore();
    const res = await store.applyToOrder('a');
    expect(res.success).toBe(false);
    expect(res.message).toBe('Заказ ещё не активен');
    expect(store.orders).toHaveLength(0);
  });
});

describe('Пользователь', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('админ определяется по роли, а не по email', () => {
    const store = useUserStore();
    store.login('t', { id: '1', email: 'admin@intercargo.ru', role: 'user' });
    expect(store.isAdmin).toBe(false);
    store.login('t', { id: '1', email: 'x@y.ru', role: 'admin' });
    expect(store.isAdmin).toBe(true);
  });

  it('не разлогинивает при сбое сети', async () => {
    localStorage.setItem('token', 't');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    const store = useUserStore();
    await store.fetchUser();
    expect(localStorage.getItem('token')).toBe('t');
  });

  it('разлогинивает, если сервер отверг токен', async () => {
    localStorage.setItem('token', 't');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ message: 'Токен недействителен' }, 401));
    const store = useUserStore();
    await store.fetchUser();
    expect(localStorage.getItem('token')).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});

describe('Тема', () => {
  it('ставит светлую тему по умолчанию для неизвестного значения', () => {
    expect(applyTheme('нечто')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(applyTheme('dark')).toBe('dark');
  });
});
