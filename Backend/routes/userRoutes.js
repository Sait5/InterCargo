const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/carriers', auth, async (req, res) => {
	try {
		const carriers = await User.find({ accountType: 'carrier' }).select('-password -email');
		const carriersData = carriers.map(carrier => ({
			id: carrier._id,
			firstName: carrier.firstName,
			lastName: carrier.lastName,
			patronymic: carrier.patronymic,
			phone: carrier.phone,
			company: carrier.company,
			accountType: carrier.accountType,
			isBlocked: carrier.isBlocked,
			createdAt: carrier.createdAt
		}));
		res.json(carriersData);
	} catch (error) {
		console.error('Ошибка получения перевозчиков:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.get('/all', auth, async (req, res) => {
	try {
		if (!['admin@intercargo.ru', 'balaev0540@mail.ru'].includes(req.user.email)) {
			return res.status(403).json({ message: 'Доступ запрещён' });
		}
		const users = await User.find().select('-password');
		const usersData = users.map(user => ({
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			patronymic: user.patronymic,
			email: user.email,
			phone: user.phone,
			company: user.company,
			accountType: user.accountType,
			isBlocked: user.isBlocked,
			createdAt: user.createdAt
		}));
		res.json(usersData);
	} catch (error) {
		console.error('Ошибка получения пользователей:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.put('/:id/block', auth, async (req, res) => {
	try {
		if (!['admin@intercargo.ru', 'balaev0540@mail.ru'].includes(req.user.email)) {
			return res.status(403).json({ message: 'Доступ запрещён' });
		}
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		const newBlockStatus = !user.isBlocked;
		await User.findByIdAndUpdate(req.params.id, { isBlocked: newBlockStatus });
		res.json({
			success: true,
			message: newBlockStatus ? 'Пользователь заблокирован' : 'Пользователь разблокирован',
			isBlocked: newBlockStatus
		});
	} catch (error) {
		console.error('Ошибка блокировки пользователя:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.put('/:id', auth, async (req, res) => {
	try {
		if (!['admin@intercargo.ru', 'balaev0540@mail.ru'].includes(req.user.email)) {
			return res.status(403).json({ message: 'Доступ запрещён' });
		}
		const { firstName, lastName, patronymic, email, phone, company } = req.body;
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		
		const updateData = {};
		if (firstName) updateData.firstName = firstName;
		if (lastName) updateData.lastName = lastName;
		if (patronymic !== undefined) updateData.patronymic = patronymic;
		if (company !== undefined) updateData.company = company;

		if (email && email !== user.email) {
			const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
			if (existingUser) {
				return res.status(400).json({ message: 'Email уже используется' });
			}
			updateData.email = email;
		}
		if (phone && phone !== user.phone) {
			const existingUser = await User.findOne({ phone, _id: { $ne: req.params.id } });
			if (existingUser) {
				return res.status(400).json({ message: 'Телефон уже используется' });
			}
			updateData.phone = phone;
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
		
		res.json({
			success: true,
			user: {
				id: updatedUser._id,
				firstName: updatedUser.firstName,
				lastName: updatedUser.lastName,
				patronymic: updatedUser.patronymic,
				email: updatedUser.email,
				phone: updatedUser.phone,
				company: updatedUser.company,
				accountType: updatedUser.accountType,
				isBlocked: updatedUser.isBlocked,
				createdAt: updatedUser.createdAt
			}
		});
	} catch (error) {
		console.error('Ошибка обновления пользователя:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

module.exports = router;