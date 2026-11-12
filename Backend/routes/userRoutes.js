const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { isValidId, validationMessage } = require('../utils/http');

const router = express.Router();

// Публичная карточка перевозчика — без email
const carrierCard = (u) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  patronymic: u.patronymic,
  phone: u.phone,
  company: u.company,
  accountType: u.accountType,
  isBlocked: u.isBlocked,
  createdAt: u.createdAt,
});

router.get('/carriers', auth, async (req, res) => {
  try {
    const carriers = await User.find({ accountType: 'carrier' }).sort({ createdAt: -1 });
    res.json(carriers.map(carrierCard));
  } catch (error) {
    console.error('Ошибка получения перевозчиков:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/all', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/:id/block', auth, requireAdmin, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Пользователь не найден' });
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: 'Нельзя заблокировать самого себя' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });
    res.json({
      success: true,
      message: user.isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован',
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error('Ошибка блокировки пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Пользователь не найден' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const { firstName, lastName, patronymic, email, phone, company } = req.body;

    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Email уже используется' });
      user.email = email;
    }
    if (phone && phone !== user.phone) {
      const taken = await User.findOne({ phone, _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Телефон уже используется' });
      user.phone = phone;
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (patronymic !== undefined) user.patronymic = patronymic;
    if (company !== undefined) user.company = company;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    const message = validationMessage(error);
    if (message) return res.status(400).json({ message });
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
