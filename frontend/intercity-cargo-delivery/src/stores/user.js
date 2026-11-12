import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/api/client';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  let readyPromise = null;

  const isAdmin = computed(() => user.value?.role === 'admin');
  const isCustomer = computed(() => user.value?.accountType === 'customer');
  const isCarrier = computed(() => user.value?.accountType === 'carrier');

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    user.value = userData;
    isAuthenticated.value = true;
    readyPromise = Promise.resolve();
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    loading.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
  };

  const fetchUser = async () => {
    if (!localStorage.getItem('token')) {
      logout();
      return { success: false, message: 'Нет токена' };
    }
    loading.value = true;
    const res = await api('/auth/me');
    loading.value = false;

    if (res.ok) {
      user.value = res.data;
      isAuthenticated.value = true;
      return { success: true, user: res.data };
    }
    // Разлогиниваем только если сервер отверг токен, а не при сбое сети
    if (res.status === 401 || res.status === 403) logout();
    return { success: false, message: res.message };
  };

  // Дождаться загрузки пользователя (нужно роутеру при открытии страницы по прямой ссылке)
  const ensureLoaded = () => {
    if (!readyPromise) readyPromise = fetchUser();
    return readyPromise;
  };

  const updateUser = async (userData) => {
    const res = await api('/auth/me', { method: 'PUT', body: userData });
    if (res.ok) user.value = res.data;
    return { success: res.ok, user: res.data, message: res.message };
  };

  const changePassword = async (passwords) => {
    const res = await api('/auth/me/password', { method: 'PUT', body: passwords });
    return { success: res.ok, message: res.message };
  };

  const fetchCarriers = async () => {
    const res = await api('/users/carriers');
    return { success: res.ok, carriers: res.ok ? res.data : [], message: res.message };
  };

  const fetchAllUsers = async () => {
    const res = await api('/users/all');
    return { success: res.ok, users: res.ok ? res.data : [], message: res.message };
  };

  const blockUser = async (userId) => {
    const res = await api(`/users/${userId}/block`, { method: 'PUT' });
    return { success: res.ok, message: res.message, isBlocked: res.data?.isBlocked };
  };

  const updateUserById = async (userId, userData) => {
    const res = await api(`/users/${userId}`, { method: 'PUT', body: userData });
    return { success: res.ok, user: res.data?.user, message: res.message };
  };

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    isCustomer,
    isCarrier,
    login,
    logout,
    fetchUser,
    ensureLoaded,
    updateUser,
    changePassword,
    fetchCarriers,
    fetchAllUsers,
    blockUser,
    updateUserById,
  };
});
