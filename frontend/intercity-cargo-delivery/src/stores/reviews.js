import { defineStore } from 'pinia';
import { ref } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useReviewStore = defineStore('review', () => {
	const loading = ref(false);

	const getAuthHeaders = () => {
		const token = localStorage.getItem('token');
		return {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		};
	};

	const submitReview = async (carrierId, rating, text) => {
		loading.value = true;
		try {
			const response = await fetch(`${API_URL}/api/reviews`, {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify({ carrierId, rating, text })
			});
			const data = await response.json();
			if (response.ok) {
				return { success: true, message: data.message };
			} else {
				return { success: false, message: data.message || 'Ошибка отправки отзыва' };
			}
		} catch (error) {
			console.error('Submit review error:', error);
			return { success: false, message: 'Ошибка соединения' };
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		submitReview
	};
});