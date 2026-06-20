const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    patronymic,
    email,
    phone,
    password,
    confirmPassword,
    accountType,
    company
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Пароли не совпадают' });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({
        message: user.email === email
          ? 'Пользователь с таким email уже существует'
          : 'Пользователь с таким номером телефона уже существует'
      });
    }

    user = new User({
      firstName,
      lastName,
      patronymic: patronymic || '',
      email,
      phone,
      password,
      accountType: accountType || 'customer',
      company: company || ''
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        company: user.company
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('Register error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        company: user.company
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { firstName, lastName, patronymic, email, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(400).json({ message: 'Email уже используется другим пользователем' });
      }
      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const existing = await User.findOne({ phone, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(400).json({ message: 'Телефон уже используется другим пользователем' });
      }
      user.phone = phone;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (patronymic !== undefined) user.patronymic = patronymic;

    await user.save();

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      patronymic: user.patronymic,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
      company: user.company
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
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

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Новый пароль должен быть не менее 8 символов' });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный текущий пароль' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;