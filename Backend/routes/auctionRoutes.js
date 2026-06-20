const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
	try {
		const { status } = req.query;
		const filter = {};
		if (status) filter.status = status;
		const auctions = await Auction.find(filter)
			.populate('creatorId', 'firstName lastName company')
			.sort({ createdAt: -1 });
		res.json(auctions);
	} catch (err) {
		console.error('Get auctions error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.get('/active', auth, async (req, res) => {
	try {
		const now = new Date();
		const auctions = await Auction.find({
			status: 'active',
			endsAt: { $gt: now }
		}).populate('creatorId', 'firstName lastName company')
			.sort({ endsAt: 1 });
		res.json(auctions);
	} catch (err) {
		console.error('Get active auctions error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.get('/my', auth, async (req, res) => {
	try {
		const auctions = await Auction.find({ creatorId: req.user.id })
			.sort({ createdAt: -1 });
		res.json(auctions);
	} catch (err) {
		console.error('Get my auctions error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const auction = await Auction.findById(req.params.id)
			.populate('creatorId', 'firstName lastName company phone email')
			.populate('bids.bidderId', 'firstName lastName company');
		if (!auction) return res.status(404).json({ message: 'Аукцион не найден' });
		res.json(auction);
	} catch (err) {
		console.error('Get auction error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.post('/', auth, async (req, res) => {
	try {
		const { title, route, cargoType, volume, startPrice, dateFrom, dateTo, description, accessType, allowedCarriers } = req.body;
		if (!title || !route || !cargoType || !volume || !startPrice || !dateFrom || !dateTo) {
			return res.status(400).json({ message: 'Заполните все обязательные поля' });
		}
		if (req.user.accountType !== 'customer' && !req.user.isAdmin) {
			return res.status(403).json({ message: 'Только заказчики могут создавать аукционы' });
		}
		const startsAt = new Date();
		const endsAt = new Date(dateTo);
		if (endsAt <= startsAt) {
			return res.status(400).json({ message: 'Дата окончания должна быть позже даты начала' });
		}
		const auction = new Auction({
			title,
			route,
			cargoType,
			volume,
			startPrice: Number(startPrice),
			currentPrice: Number(startPrice),
			dateFrom: new Date(dateFrom),
			dateTo: endsAt,
			description: description || '',
			creatorId: req.user.id,
			creatorName: `${req.user.firstName} ${req.user.lastName}`.trim(),
			accessType: accessType || 'public',
			allowedCarriers: accessType === 'private' ? (allowedCarriers || []) : [],
			status: 'active',
			startsAt,
			endsAt
		});
		await auction.save();
		res.status(201).json({ message: 'Аукцион создан', auction });
	} catch (err) {
		console.error('Create auction error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.post('/:id/bid', auth, async (req, res) => {
	try {
		const { amount } = req.body;
		if (!amount || amount <= 0) {
			return res.status(400).json({ message: 'Укажите корректную сумму ставки' });
		}
		if (req.user.accountType !== 'carrier') {
			return res.status(403).json({ message: 'Только перевозчики могут делать ставки' });
		}
		const auction = await Auction.findById(req.params.id);
		if (!auction) return res.status(404).json({ message: 'Аукцион не найден' });
		if (auction.status !== 'active') {
			return res.status(400).json({ message: 'Аукцион не активен' });
		}
		if (new Date() > auction.endsAt) {
			auction.status = 'completed';
			await auction.save();
			return res.status(400).json({ message: 'Аукцион завершён' });
		}
		if (auction.creatorId.toString() === req.user.id) {
			return res.status(403).json({ message: 'Нельзя делать ставки на свой аукцион' });
		}
		if (auction.accessType === 'private' && !auction.allowedCarriers.includes(req.user.id)) {
			return res.status(403).json({ message: 'Вы не приглашены на этот аукцион' });
		}
		if (Number(amount) >= auction.currentPrice) {
			return res.status(400).json({ message: `Ставка должна быть меньше текущей цены (${auction.currentPrice} ₽)` });
		}
		const existingBid = auction.bids.find(b => b.bidderId.toString() === req.user.id);
		if (existingBid) {
			existingBid.amount = Number(amount);
			existingBid.createdAt = new Date();
		} else {
			auction.bids.push({
				bidderId: req.user.id,
				bidderName: `${req.user.firstName} ${req.user.lastName}`.trim(),
				bidderCompany: req.user.company || '',
				amount: Number(amount)
			});
		}
		auction.currentPrice = Number(amount);
		auction.winnerId = req.user.id;
		auction.winnerName = `${req.user.firstName} ${req.user.lastName}`.trim();
		await auction.save();
		res.json({ message: 'Ставка принята', auction });
	} catch (err) {
		console.error('Place bid error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.post('/:id/complete', auth, async (req, res) => {
	try {
		const auction = await Auction.findById(req.params.id);
		if (!auction) return res.status(404).json({ message: 'Аукцион не найден' });
		if (auction.creatorId.toString() !== req.user.id && !req.user.isAdmin) {
			return res.status(403).json({ message: 'Только создатель может завершить аукцион' });
		}
		if (auction.status !== 'active') {
			return res.status(400).json({ message: 'Аукцион уже завершён' });
		}
		auction.status = 'completed';
		await auction.save();
		res.json({ message: 'Аукцион завершён', auction });
	} catch (err) {
		console.error('Complete auction error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.post('/:id/cancel', auth, async (req, res) => {
	try {
		const auction = await Auction.findById(req.params.id);
		if (!auction) return res.status(404).json({ message: 'Аукцион не найден' });
		if (auction.creatorId.toString() !== req.user.id && !req.user.isAdmin) {
			return res.status(403).json({ message: 'Только создатель может отменить аукцион' });
		}
		auction.status = 'cancelled';
		await auction.save();
		res.json({ message: 'Аукцион отменён', auction });
	} catch (err) {
		console.error('Cancel auction error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.delete('/:id', auth, async (req, res) => {
	try {
		const auction = await Auction.findById(req.params.id);
		if (!auction) return res.status(404).json({ message: 'Аукцион не найден' });
		if (auction.creatorId.toString() !== req.user.id && !req.user.isAdmin) {
			return res.status(403).json({ message: 'Нет прав на удаление' });
		}
		await Auction.findByIdAndDelete(req.params.id);
		res.json({ message: 'Аукцион удалён' });
	} catch (err) {
		console.error('Delete auction error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

module.exports = router;