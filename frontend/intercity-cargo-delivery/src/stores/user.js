import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);

  const ADMIN_EMAILS = ['admin@intercargo.ru', 'balaev0540@mail.ru'];

  const isAdmin = computed(() => {
    if (!user.value) return false;
    return ADMIN_EMAILS.includes(user.value.email);
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const login = (token, userData) => {
    isAuthenticated.value = true;
    user.value = userData;
    localStorage.setItem('token', token);
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    loading.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return { success: false, message: 'Нет токена' };
    }

    loading.value = true;

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        user.value = data;
        isAuthenticated.value = true;
        return { success: true, user: data };
      } else {
        logout();
        return { success: false, message: 'Сессия истекла' };
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      logout();
      return { success: false, message: 'Ошибка соединения' };
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        user.value = data;
        return { success: true, user: data };
      } else {
        return { success: false, message: data.message || 'Ошибка обновления' };
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
      return { success: false, message: 'Ошибка соединения' };
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwords)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Ошибка смены пароля' };
      }
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      return { success: false, message: 'Ошибка соединения' };
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/carriers`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, carriers: data };
      } else {
        return { success: false, message: 'Ошибка загрузки перевозчиков' };
      }
    } catch (error) {
      console.error('Ошибка загрузки перевозчиков:', error);
      return { success: false, message: 'Ошибка соединения' };
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/all`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, users: data };
      } else {
        return { success: false, message: 'Ошибка загрузки пользователей' };
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      return { success: false, message: 'Ошибка соединения' };
    }
  };

  const blockUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/block`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message, isBlocked: data.isBlocked };
      } else {
        return { success: false, message: 'Ошибка блокировки' };
      }
    } catch (error) {
      console.error('Ошибка блокировки:', error);
      return { success: false, message: 'Ошибка соединения' };
    }
  };

  const updateUserById = async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      } else {
        const data = await response.json();
        return { success: false, message: data.message || 'Ошибка обновления' };
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
      return { success: false, message: 'Ошибка соединения' };
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    login,
    logout,
    fetchUser,
    updateUser,
    changePassword,
    fetchCarriers,
    fetchAllUsers,
    blockUser,
    updateUserById
  };
});