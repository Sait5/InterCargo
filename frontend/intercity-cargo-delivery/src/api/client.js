// Единая точка общения с сервером
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export const getToken = () => localStorage.getItem('token');

/**
 * Запрос к API. Никогда не бросает исключение:
 * возвращает { ok, status, data, message }.
 */
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return {
      ok: res.ok,
      status: res.status,
      data,
      message: (data && data.message) || (res.ok ? '' : 'Ошибка сервера'),
    };
  } catch {
    return { ok: false, status: 0, data: null, message: 'Нет связи с сервером. Попробуйте позже.' };
  }
}
