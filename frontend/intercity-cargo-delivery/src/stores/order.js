import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/api/client';

// Заказы хранятся на сервере. Все действия асинхронные и возвращают { success, message }.
export const useOrderStore = defineStore('order', () => {
  const orders = ref([]);
  const loading = ref(false);

  const publicOrders = computed(() => orders.value.filter((o) => o.accessType === 'public' && o.status === 'active'));
  const privateOrders = computed(() => orders.value.filter((o) => o.accessType === 'private' && o.status === 'active'));
  const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'pending'));
  const activeOrders = computed(() => orders.value.filter((o) => o.status === 'active'));

  const getOrderById = (id) => orders.value.find((o) => o.id === id);
  const getUserOrders = (userId) => orders.value.filter((o) => o.createdBy === userId);

  const getUserApplications = (userId) => orders.value
    .map((order) => {
      const mine = (order.applicants || []).find((a) => a.userId === userId);
      return mine ? { ...order, myApplication: mine } : null;
    })
    .filter(Boolean);

  const hasApplied = (orderId, userId) => {
    const order = getOrderById(orderId);
    return Boolean(order && (order.applicants || []).some((a) => a.userId === userId));
  };

  const replace = (order) => {
    if (!order) return;
    const index = orders.value.findIndex((o) => o.id === order.id);
    if (index === -1) orders.value.unshift(order);
    else orders.value.splice(index, 1, order);
  };

  const fetchOrders = async () => {
    if (!localStorage.getItem('token')) {
      orders.value = [];
      return { success: true };
    }
    loading.value = true;
    const res = await api('/orders');
    loading.value = false;
    if (res.ok) orders.value = res.data;
    return { success: res.ok, message: res.message };
  };

  const createOrder = async (orderData) => {
    const res = await api('/orders', { method: 'POST', body: orderData });
    if (res.ok) replace(res.data);
    return { success: res.ok, order: res.data, message: res.message };
  };

  const applyToOrder = async (orderId) => {
    const res = await api(`/orders/${orderId}/apply`, { method: 'POST' });
    if (res.ok) replace(res.data);
    return { success: res.ok, message: res.message };
  };

  const moderate = async (orderId, action) => {
    const res = await api(`/orders/${orderId}/${action}`, { method: 'POST' });
    if (res.ok) replace(res.data);
    return { success: res.ok, message: res.message };
  };
  const approveOrder = (orderId) => moderate(orderId, 'approve');
  const rejectOrder = (orderId) => moderate(orderId, 'reject');

  const decideApplicant = async (orderId, applicantId, action) => {
    const res = await api(`/orders/${orderId}/applicants/${applicantId}/${action}`, { method: 'POST' });
    if (res.ok) replace(res.data.order);
    return { success: res.ok, chat: res.data?.chat, message: res.message };
  };
  const approveApplicant = (orderId, applicantId) => decideApplicant(orderId, applicantId, 'approve');
  const rejectApplicant = (orderId, applicantId) => decideApplicant(orderId, applicantId, 'reject');

  const deleteOrder = async (orderId) => {
    const res = await api(`/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) orders.value = orders.value.filter((o) => o.id !== orderId);
    return { success: res.ok, message: res.message };
  };

  return {
    orders,
    loading,
    publicOrders,
    privateOrders,
    pendingOrders,
    activeOrders,
    getOrderById,
    getUserOrders,
    getUserApplications,
    hasApplied,
    fetchOrders,
    createOrder,
    applyToOrder,
    approveOrder,
    rejectOrder,
    approveApplicant,
    rejectApplicant,
    deleteOrder,
  };
});
