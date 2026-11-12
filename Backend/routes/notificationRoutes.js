const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const items = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'Готово' });
  } catch (err) {
    console.error('Read notifications error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'Уведомления очищены' });
  } catch (err) {
    console.error('Clear notifications error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
