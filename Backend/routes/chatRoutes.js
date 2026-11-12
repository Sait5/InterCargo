const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const notify = require('../utils/notify');
const { isValidId } = require('../utils/http');

const router = express.Router();

const sameId = (a, b) => String(a && (a._id || a)) === String(b && (b._id || b));
const isMember = (chat, user) => sameId(chat.customerId, user._id) || sameId(chat.carrierId, user._id);

router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ $or: [{ customerId: req.user._id }, { carrierId: req.user._id }] })
      .populate('orderId', 'route from to price status type volume dateFrom dateTo')
      .populate('customerId', 'firstName lastName company')
      .populate('carrierId', 'firstName lastName company')
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error('Get chats error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

async function findMyChat(req, res) {
  if (!isValidId(req.params.id)) {
    res.status(404).json({ message: 'Чат не найден' });
    return null;
  }
  const chat = await Chat.findById(req.params.id);
  if (!chat || !isMember(chat, req.user)) {
    res.status(404).json({ message: 'Чат не найден' });
    return null;
  }
  return chat;
}

router.post('/:id/messages', auth, async (req, res) => {
  try {
    const chat = await findMyChat(req, res);
    if (!chat) return;
    if (chat.status === 'closed') return res.status(400).json({ message: 'Чат закрыт' });

    const type = req.body.type === 'voice' ? 'voice' : 'text';
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Пустое сообщение' });
    if (type === 'text' && text.length > 4000) return res.status(400).json({ message: 'Сообщение слишком длинное' });
    if (type === 'voice' && !text.startsWith('data:audio/')) {
      return res.status(400).json({ message: 'Неверный формат записи' });
    }

    chat.messages.push({ senderId: req.user._id, type, text, duration: Number(req.body.duration) || 0 });
    await chat.save();

    const recipient = sameId(chat.customerId, req.user._id) ? chat.carrierId : chat.customerId;
    await notify(recipient, 'Новое сообщение', type === 'voice' ? 'Голосовое сообщение в чате' : text.slice(0, 120));
    res.status(201).json(chat.messages[chat.messages.length - 1]);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/close', auth, async (req, res) => {
  try {
    const chat = await findMyChat(req, res);
    if (!chat) return;
    chat.status = 'closed';
    await chat.save();
    res.json({ message: 'Чат закрыт' });
  } catch (err) {
    console.error('Close chat error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
