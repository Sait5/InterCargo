const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const notify = require('../utils/notify');
const { isValidId } = require('../utils/http');

const router = express.Router();

const sameId = (a, b) => String(a && (a._id || a)) === String(b && (b._id || b));
const isMember = (chat, user) => sameId(chat.customerId, user._id) || sameId(chat.carrierId, user._id);
const sideOf = (chat, user) => (sameId(chat.customerId, user._id) ? 'customer' : 'carrier');

const PEOPLE = 'firstName lastName company';
const ORDER = 'route from to price status type volume dateFrom dateTo';

// Короткое описание сообщения для списка диалогов
const preview = (m) => ({
  senderId: m.senderId,
  type: m.type,
  text: m.type === 'voice' ? '' : String(m.text || '').slice(0, 200),
  createdAt: m.createdAt,
});

// Список диалогов: без самих сообщений (голосовые весят мегабайты), с превью и счётчиком непрочитанных
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ $or: [{ customerId: req.user._id }, { carrierId: req.user._id }] })
      .select('-messages.text')
      .populate('orderId', ORDER)
      .populate('customerId', PEOPLE)
      .populate('carrierId', PEOPLE)
      .sort({ 'lastMessage.createdAt': -1, createdAt: -1 });

    res.json(chats.map((chat) => {
      const side = sideOf(chat, req.user);
      const readAt = chat.readAt?.[side];
      const unread = chat.messages.filter((m) => !sameId(m.senderId, req.user._id) && (!readAt || m.createdAt > readAt)).length;
      const last = chat.lastMessage?.createdAt ? chat.lastMessage : chat.messages[chat.messages.length - 1];
      const json = chat.toJSON();
      delete json.messages;
      delete json.readAt;
      return { ...json, lastMessage: last ? preview(last) : null, unread, messageCount: chat.messages.length };
    }));
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

// Переписка одного диалога. ?since=ISO — только сообщения новее этой даты (для опроса)
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await findMyChat(req, res);
    if (!chat) return;
    const since = req.query.since ? new Date(req.query.since) : null;
    const messages = since && !Number.isNaN(since.getTime())
      ? chat.messages.filter((m) => m.createdAt > since)
      : chat.messages;
    await chat.populate([
      { path: 'orderId', select: ORDER },
      { path: 'customerId', select: PEOPLE },
      { path: 'carrierId', select: PEOPLE },
    ]);
    const json = chat.toJSON();
    delete json.readAt;
    // когда собеседник прочитал — чтобы показать «прочитано» у своих сообщений
    const other = sideOf(chat, req.user) === 'customer' ? 'carrier' : 'customer';
    res.json({ ...json, messages: messages.map((m) => m.toJSON()), otherReadAt: chat.readAt?.[other] || null });
  } catch (err) {
    console.error('Get chat error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/read', auth, async (req, res) => {
  try {
    const chat = await findMyChat(req, res);
    if (!chat) return;
    await Chat.updateOne({ _id: chat._id }, { $set: { [`readAt.${sideOf(chat, req.user)}`]: new Date() } });
    res.json({ ok: true });
  } catch (err) {
    console.error('Read chat error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

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
    const message = chat.messages[chat.messages.length - 1];
    chat.lastMessage = preview(message);
    // своё сообщение — значит, чат прочитан
    chat.readAt = { ...(chat.readAt?.toObject?.() || chat.readAt || {}), [sideOf(chat, req.user)]: message.createdAt };
    await chat.save();

    const recipient = sameId(chat.customerId, req.user._id) ? chat.carrierId : chat.customerId;
    await notify(recipient, 'Новое сообщение', type === 'voice' ? 'Голосовое сообщение в чате' : text.slice(0, 120));
    res.status(201).json(message);
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
