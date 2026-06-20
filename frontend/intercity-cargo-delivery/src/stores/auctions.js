import { defineStore } from 'pinia';
import { ref } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useAuctionStore = defineStore('auction', () => {
	const auctions = ref([]);
	const activeAuctions = ref([]);
	const myAuctions = ref([]);
	const currentAuction = ref(null);
	const loading = ref(false);

	const getAuthHeaders = () => {
		const token = localStorage.getItem('token');
		return {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		};
	};

	const fetchAll = async () => {
		loading.value = true;
		try {
			const res = await fetch(`${API_URL}/api/auctions`, { headers: getAuthHeaders() });
			if (res.ok) {
				auctions.value = await res.json();
				return { success: true };
			}
			return { success: false, message: 'Ошибка загрузки' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		} finally {
			loading.value = false;
		}
	};

	const fetchActive = async () => {
		loading.value = true;
		try {
			const res = await fetch(`${API_URL}/api/auctions/active`, { headers: getAuthHeaders() });
			if (res.ok) {
				activeAuctions.value = await res.json();
				return { success: true };
			}
			return { success: false, message: 'Ошибка загрузки' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		} finally {
			loading.value = false;
		}
	};

	const fetchMy = async () => {
		loading.value = true;
		try {
			const res = await fetch(`${API_URL}/api/auctions/my`, { headers: getAuthHeaders() });
			if (res.ok) {
				myAuctions.value = await res.json();
				return { success: true };
			}
			return { success: false, message: 'Ошибка загрузки' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		} finally {
			loading.value = false;
		}
	};

	const fetchById = async (id) => {
		loading.value = true;
		try {
			const res = await fetch(`${API_URL}/api/auctions/${id}`, { headers: getAuthHeaders() });
			if (res.ok) {
				currentAuction.value = await res.json();
				return { success: true };
			}
			return { success: false, message: 'Аукцион не найден' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		} finally {
			loading.value = false;
		}
	};

	const create = async (data) => {
		try {
			const res = await fetch(`${API_URL}/api/auctions`, {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify(data)
			});
			const result = await res.json();
			if (res.ok) return { success: true, auction: result.auction };
			return { success: false, message: result.message || 'Ошибка создания' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		}
	};

	const placeBid = async (id, amount) => {
		try {
			const res = await fetch(`${API_URL}/api/auctions/${id}/bid`, {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify({ amount })
			});
			const result = await res.json();
			if (res.ok) {
				currentAuction.value = result.auction;
				return { success: true };
			}
			return { success: false, message: result.message || 'Ошибка ставки' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		}
	};

	const complete = async (id) => {
		try {
			const res = await fetch(`${API_URL}/api/auctions/${id}/complete`, {
				method: 'POST',
				headers: getAuthHeaders()
			});
			const result = await res.json();
			if (res.ok) {
				currentAuction.value = result.auction;
				return { success: true };
			}
			return { success: false, message: result.message };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		}
	};

	const cancel = async (id) => {
		try {
			const res = await fetch(`${API_URL}/api/auctions/${id}/cancel`, {
				method: 'POST',
				headers: getAuthHeaders()
			});
			const result = await res.json();
			if (res.ok) {
				currentAuction.value = result.auction;
				return { success: true };
			}
			return { success: false, message: result.message };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		}
	};

	const remove = async (id) => {
		try {
			const res = await fetch(`${API_URL}/api/auctions/${id}`, {
				method: 'DELETE',
				headers: getAuthHeaders()
			});
			if (res.ok) return { success: true };
			return { success: false, message: 'Ошибка удаления' };
		} catch (e) {
			return { success: false, message: 'Ошибка соединения' };
		}
	};

	return {
		auctions, activeAuctions, myAuctions, currentAuction, loading,
		fetchAll, fetchActive, fetchMy, fetchById,
		create, placeBid, complete, cancel, remove
	};
});