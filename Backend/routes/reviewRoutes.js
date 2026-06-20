const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
	try {
		const { carrierId, rating, text } = req.body;
		const reviewerId = req.user.id;

		if (!carrierId || !rating || !text) {
			return res.status(400).json({ message: 'Все поля обязательны' });
		}

		const carrier = await User.findById(carrierId);
		if (!carrier || carrier.accountType !== 'carrier') {
			return res.status(404).json({ message: 'Перевозчик не найден' });
		}

		if (req.user.accountType !== 'customer') {
			return res.status(403).json({ message: 'Только заказчики могут оставлять отзывы' });
		}

		const existingReview = await Review.findOne({ reviewerId, carrierId });
		if (existingReview) {
			return res.status(400).json({ message: 'Вы уже оставляли отзыв этому перевозчику' });
		}

		const review = new Review({
			reviewerId,
			carrierId,
			rating,
			text
		});

		await review.save();
		res.status(201).json({ message: 'Отзыв успешно отправлен', review });
	} catch (err) {
		console.error('Create review error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.get('/carrier/:carrierId', async (req, res) => {
	try {
		const reviews = await Review.find({ carrierId: req.params.carrierId })
			.populate('reviewerId', 'firstName lastName')
			.sort({ createdAt: -1 });
		res.json(reviews);
	} catch (err) {
		console.error('Get reviews error:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

module.exports = router;