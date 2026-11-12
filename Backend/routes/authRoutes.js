const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const config = require('../config');
const { validationMessage } = require('../utils/http');

const router = express.Router();

const signToken = (user) => jwt.sign({ user: { id: user.id } }, config.jwtSecret, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const {
    firstName, lastName, patronymic, email, phone,
    password, confirmPassword, accountType, company,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Пароли не совпадают' });
  }

  try {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { phone }] });
    if (existing) {
      return res.status(400).json({
        message: existing.email === normalizedEmail
          ? 'Пользователь с таким email уже существует'
          : 'Пользователь с таким номером телефона уже существует',
      });
    }

    // Роль администратора через регистрацию не выдаётся — только скриптом scripts/make-admin.js
    const user = new User({
      firstName,
      lastName,
      patronymic: patronymic || '',
      email: normalizedEmail,
      phone,
      password,
      accountType: accountType === 'carrier' ? 'carrier' : 'customer',
      company: company || '',
    });
    await user.save();

    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    const message = validationMessage(err);
    if (message) return res.status(400).json({ message });
    console.error('Register error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Введите email и пароль' });
  }

  try {
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Аккаунт заблокирован. Обратитесь в поддержку.' });
    }

    res.json({ token: signToken(user), user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

router.put('/me', auth, async (req, res) => {
  try {
    const { firstName, lastName, patronymic, email, phone } = req.body;
    const user = req.user;

    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Email уже используется другим пользователем' });
      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const taken = await User.findOne({ phone, _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Телефон уже используется другим пользователем' });
      user.phone = phone;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (patronymic !== undefined) user.patronymic = patronymic;

    await user.save();
    res.json(user);
  } catch (err) {
    const message = validationMessage(err);
    if (message) return res.status(400).json({ message });
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Текущий и новый пароль обязательны' });
    }

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Неверный текущий пароль' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Пароль успешно изменён' });
  } catch (err) {
    const message = validationMessage(err);
    if (message) return res.status(400).json({ message });
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
