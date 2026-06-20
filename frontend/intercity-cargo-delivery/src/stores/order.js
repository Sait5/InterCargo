import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useOrderStore = defineStore('order', () => {
	const orders = ref([]);
	const loading = ref(false);

	const publicOrders = computed(() => {
		return orders.value.filter(o => o.accessType === 'public' && o.status === 'active');
	});

	const privateOrders = computed(() => {
		return orders.value.filter(o => o.accessType === 'private' && o.status === 'active');
	});

	const pendingOrders = computed(() => {
		return orders.value.filter(o => o.status === 'pending');
	});

	const activeOrders = computed(() => {
		return orders.value.filter(o => o.status === 'active');
	});

	const getOrderById = (id) => {
		return orders.value.find(o => o.id === id);
	};

	const getUserOrders = (userId) => {
		return orders.value.filter(o => o.createdBy === userId);
	};

	const getUserApplications = (userId) => {
		const applications = [];
		orders.value.forEach(order => {
			if (order.applicants && order.applicants.length > 0) {
				const userApplicant = order.applicants.find(a => a.userId === userId);
				if (userApplicant) {
					applications.push({
						...order,
						myApplication: userApplicant
					});
				}
			}
		});
		return applications;
	};

	const fetchOrders = () => {
		loading.value = true;
		try {
			const saved = localStorage.getItem('orders');
			if (saved) {
				orders.value = JSON.parse(saved);
			} else {
				orders.value = [];
			}
			return { success: true };
		} catch (error) {
			console.error('Ошибка загрузки заказов:', error);
			return { success: false, message: 'Ошибка загрузки заказов' };
		} finally {
			loading.value = false;
		}
	};

	const saveOrders = () => {
		localStorage.setItem('orders', JSON.stringify(orders.value));
	};

	const createOrder = (orderData) => {
		try {
			const isPrivate = orderData.accessType === 'private';
			const newOrder = {
				id: Date.now(),
				...orderData,
				applicants: [],
				createdAt: new Date().toISOString(),
				status: isPrivate ? 'active' : 'pending',
				approvedAt: isPrivate ? new Date().toISOString() : null
			};
			orders.value.unshift(newOrder);
			saveOrders();

			const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
			if (!isPrivate) {
				notifications.unshift({
					id: Date.now() + 1,
					title: 'Новый заказ ожидает подтверждения',
					text: `Заказ "${newOrder.route}" требует подтверждения администратором`,
					date: 'Только что',
					read: false,
					orderId: newOrder.id
				});
			} else {
				notifications.unshift({
					id: Date.now() + 1,
					title: 'Личный заказ создан',
					text: `Личный заказ "${newOrder.route}" успешно создан и доступен перевозчикам`,
					date: 'Только что',
					read: false,
					orderId: newOrder.id
				});
			}
			localStorage.setItem('user_notifications', JSON.stringify(notifications));

			return { success: true, order: newOrder };
		} catch (error) {
			console.error('Ошибка создания заказа:', error);
			return { success: false, message: 'Ошибка создания заказа' };
		}
	};

	const applyToOrder = (orderId, applicantData) => {
		try {
			const order = orders.value.find(o => o.id === orderId);
			if (!order) {
				return { success: false, message: 'Заказ не найден' };
			}
			if (order.status !== 'active') {
				return { success: false, message: 'Заказ ещё не активен' };
			}

			const userId = typeof applicantData === 'object' ? applicantData.userId : applicantData;
			const alreadyApplied = order.applicants.some(a => a.userId === userId);
			if (alreadyApplied) {
				return { success: false, message: 'Вы уже подали заявку на этот заказ' };
			}

			const applicant = {
				id: Date.now(),
				userId: userId,
				name: typeof applicantData === 'object' ? (applicantData.name || '') : '',
				phone: typeof applicantData === 'object' ? (applicantData.phone || '') : '',
				company: typeof applicantData === 'object' ? (applicantData.company || '') : '',
				status: 'pending',
				appliedAt: new Date().toISOString()
			};

			order.applicants.push(applicant);
			saveOrders();

			const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
			notifications.unshift({
				id: Date.now() + 1,
				title: 'Новая заявка на заказ',
				text: `Перевозчик подал заявку на заказ "${order.route}"`,
				date: 'Только что',
				read: false,
				orderId: order.id,
				applicantId: applicant.id
			});
			localStorage.setItem('user_notifications', JSON.stringify(notifications));

			return { success: true };
		} catch (error) {
			console.error('Ошибка подачи заявки:', error);
			return { success: false, message: 'Ошибка подачи заявки' };
		}
	};

	const hasApplied = (orderId, userId) => {
		const order = orders.value.find(o => o.id === orderId);
		if (!order) return false;
		return order.applicants.some(a => a.userId === userId);
	};

	const approveOrder = (orderId) => {
		try {
			const order = orders.value.find(o => o.id === orderId);
			if (!order) {
				return { success: false, message: 'Заказ не найден' };
			}
			order.status = 'active';
			order.approvedAt = new Date().toISOString();
			saveOrders();

			const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
			notifications.unshift({
				id: Date.now() + 1,
				title: 'Заказ активирован',
				text: `Ваш заказ "${order.route}" одобрен и опубликован`,
				date: 'Только что',
				read: false
			});
			localStorage.setItem('user_notifications', JSON.stringify(notifications));

			return { success: true };
		} catch (error) {
			console.error('Ошибка одобрения заказа:', error);
			return { success: false, message: 'Ошибка одобрения заказа' };
		}
	};

	const rejectOrder = (orderId) => {
		try {
			const order = orders.value.find(o => o.id === orderId);
			if (!order) {
				return { success: false, message: 'Заказ не найден' };
			}
			order.status = 'rejected';
			saveOrders();

			const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
			notifications.unshift({
				id: Date.now() + 1,
				title: 'Заказ отклонён',
				text: `Ваш заказ "${order.route}" был отклонён администратором`,
				date: 'Только что',
				read: false
			});
			localStorage.setItem('user_notifications', JSON.stringify(notifications));

			return { success: true };
		} catch (error) {
			console.error('Ошибка отклонения заказа:', error);
			return { success: false, message: 'Ошибка отклонения заказа' };
		}
	};

	const approveApplicant = async (orderId, applicantId) => {
		try {
			const order = orders.value.find(o => o.id === orderId);
			if (!order) return { success: false, message: 'Заказ не найден' };
			const applicant = order.applicants.find(a => a.id === applicantId);
			if (!applicant) return { success: false, message: 'Заявка не найдена' };

			applicant.status = 'approved';
			saveOrders();

			try {
				const chatModule = await import('./chat');
				const chatStore = chatModule.useChatStore();
				chatStore.createChat(orderId, order.createdBy, applicant.userId);
			} catch (e) {
				console.warn('Чат-стор недоступен:', e);
			}

			const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
			notifications.unshift({
				id: Date.now() + 1,
				title: 'Заявка одобрена',
				text: `Ваша заявка на заказ "${order.route}" одобрена. Открыт чат с заказчиком.`,
				date: 'Только что',
				read: false
			});
			localStorage.setItem('user_notifications', JSON.stringify(notifications));

			return { success: true };
		} catch (error) {
			console.error('Ошибка одобрения заявки:', error);
			return { success: false, message: 'Ошибка одобрения заявки' };
		}
	};

	const rejectApplicant = (orderId, applicantId) => {
		try {
			const order = orders.value.find(o => o.id === orderId);
			if (!order) return { success: false, message: 'Заказ не найден' };
			const applicant = order.applicants.find(a => a.id === applicantId);
			if (!applicant) return { success: false, message: 'Заявка не найдена' };

			applicant.status = 'rejected';
			saveOrders();

			const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
			notifications.unshift({
				id: Date.now() + 1,
				title: 'Заявка отклонена',
				text: `Ваша заявка на заказ "${order.route}" отклонена`,
				date: 'Только что',
				read: false
			});
			localStorage.setItem('user_notifications', JSON.stringify(notifications));

			return { success: true };
		} catch (error) {
			console.error('Ошибка отклонения заявки:', error);
			return { success: false, message: 'Ошибка отклонения заявки' };
		}
	};

	const deleteOrder = (orderId) => {
		try {
			orders.value = orders.value.filter(o => o.id !== orderId);
			saveOrders();
			return { success: true };
		} catch (error) {
			console.error('Ошибка удаления заказа:', error);
			return { success: false, message: 'Ошибка удаления заказа' };
		}
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
		fetchOrders,
		saveOrders,
		createOrder,
		applyToOrder,
		hasApplied,
		approveOrder,
		rejectOrder,
		approveApplicant,
		rejectApplicant,
		deleteOrder
	};
});