import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/api/client';

describe('API-клиент', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('добавляет токен и возвращает данные', async () => {
    localStorage.setItem('token', 'abc');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ id: 1 }), { status: 200 }));
    const res = await api('/auth/me');
    expect(res.ok).toBe(true);
    expect(res.data).toEqual({ id: 1 });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
  });

  it('не отправляет токен, если auth: false', async () => {
    localStorage.setItem('token', 'abc');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
    await api('/auth/login', { method: 'POST', auth: false, body: {} });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('пробрасывает сообщение сервера при ошибке', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Неверный email или пароль' }), { status: 400 }));
    const res = await api('/auth/login', { method: 'POST', body: {} });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
    expect(res.message).toBe('Неверный email или пароль');
  });

  it('не падает без сети', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    const res = await api('/orders');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.message).toMatch(/Нет связи/);
  });
});
