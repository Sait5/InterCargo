import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/api/client';

export const useReviewStore = defineStore('review', () => {
  const loading = ref(false);
  const myReviews = ref([]);

  const submitReview = async (carrierId, rating, text) => {
    loading.value = true;
    const res = await api('/reviews', { method: 'POST', body: { carrierId, rating, text } });
    loading.value = false;
    return { success: res.ok, message: res.message || (res.ok ? 'Отзыв отправлен' : 'Ошибка отправки отзыва') };
  };

  // Отзывы о текущем перевозчике
  const fetchMyReviews = async () => {
    loading.value = true;
    const res = await api('/reviews/my');
    loading.value = false;
    if (res.ok) myReviews.value = res.data;
    return { success: res.ok, message: res.message };
  };

  const fetchCarrierReviews = async (carrierId) => {
    const res = await api(`/reviews/carrier/${carrierId}`, { auth: false });
    return res.ok ? res.data : [];
  };

  return { loading, myReviews, submitReview, fetchMyReviews, fetchCarrierReviews };
});
