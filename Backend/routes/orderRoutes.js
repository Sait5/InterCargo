const express = require('express');
const Order = require('../models/Order');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const notify = require('../utils/notify');
const { isValidId, validationMessage, fullName } = require('../utils/http');

const router = express.Router();

const isAdmin = (user) => user.role === 'admin';
const sameId = (a, b) => String(a && (a._id || a)) === String(b && (b._id || b));

// Перевозчик видит только свою заявку, чужие контакты ему не показываем
function forViewer(order, user) {
  const json = order.toJSON();
  if (isAdmin(user) || sameId(order.createdBy, user._id)) return json;
  json.applicants = json.applicants.filter((a) => sameId(a.userId, user._id));
  delete json.customerPhone;
  delete json.customerEmail;
  return json;
}

async function findOrder(req, res) {
  if (!isValidId(req.params.id)) {
    res.status(404).json({ message: 'Заказ не найден' });
    return null;
  }
  const order = await Order.findById(req.params.id);
  if (!order) res.status(404).json({ message: 'Заказ не найден' });
  return order;
}

router.get('/', auth, async (req, res) => {
  try {
    let filter;
    if (isAdmin(req.user)) filter = {};
    else if (req.user.accountType === 'customer') filter = { createdBy: req.user._id };
    else filter = { $or: [{ status: 'active' }, { 'applicants.userId': req.user._id }] };

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders.map((o) => forViewer(o, req.user)));
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.accountType !== 'customer' && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Создавать заказы могут только заказчики' });
    }
    const { from, to, type, volume, dateFrom, dateTo, price, accessType } = req.body;
    if (!from || !to) return res.status(400).json({ message: 'Укажите маршрут' });
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      return res.status(400).json({ message: 'Дата начала не может быть позже даты окончания' });
    }

    const isPrivate = accessType === 'private';
    const order = await Order.create({
      route: `${from} — ${to}`,
      from,
      to,
      type,
      volume,
      dateFrom,
      dateTo,
      price: Number(price),
      accessType: isPrivate ? 'private' : 'public',
      status: isPrivate ? 'active' : 'pending',
      approvedAt: isPrivate ? new Date() : null,
      createdBy: req.user._id,
      customerName: fullName(req.user),
      customerPhone: req.user.phone,
      customerEmail: req.user.email,
    });

    await notify(
      req.user._id,
      isPrivate ? 'Личный заказ создан' : 'Заказ ожидает подтверждения',
      isPrivate
        ? `Заказ «${order.route}» опубликован и доступен перевозчикам.`
        : `Заказ «${order.route}» отправлен на проверку администратору.`,
      { orderId: order._id },
    );
    res.status(201).json(order);
  } catch (err) {
    const message = validationMessage(err);
    if (message) return res.status(400).json({ message });
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (req.user.accountType !== 'carrier') {
      return res.status(403).json({ message: 'Откликаться на заказы могут только перевозчики' });
    }
    const order = await findOrder(req, res);
    if (!order) return;
    if (order.status !== 'active') return res.status(400).json({ message: 'Заказ ещё не активен' });
    if (order.applicants.some((a) => sameId(a.userId, req.user._id))) {
      return res.status(400).json({ message: 'Вы уже подали заявку на этот заказ' });
    }

    order.applicants.push({
      userId: req.user._id,
      name: fullName(req.user),
      phone: req.user.phone,
      company: req.user.company,
    });
    await order.save();
    await notify(order.createdBy, 'Новая заявка на заказ', `Перевозчик откликнулся на заказ «${order.route}».`, { orderId: order._id });
    res.json(forViewer(order, req.user));
  } catch (err) {
    console.error('Apply order error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Модерация публичных заказов
router.post('/:id/approve', auth, requireAdmin, async (req, res) => {
  try {
    const order = await findOrder(req, res);
    if (!order) return;
    order.status = 'active';
    order.approvedAt = new Date();
    await order.save();
    await notify(order.createdBy, 'Заказ опубликован', `Заказ «${order.route}» одобрен и виден перевозчикам.`, { orderId: order._id });
    res.json(order);
  } catch (err) {
    console.error('Approve order error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/reject', auth, requireAdmin, async (req, res) => {
  try {
    const order = await findOrder(req, res);
    if (!order) return;
    order.status = 'rejected';
    await order.save();
    await notify(order.createdBy, 'Заказ отклонён', `Заказ «${order.route}» отклонён администратором.`, { orderId: order._id });
    res.json(order);
  } catch (err) {
    console.error('Reject order error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Решение заказчика по заявке перевозчика
async function decideApplicant(req, res, approve) {
  try {
    const order = await findOrder(req, res);
    if (!order) return;
    if (!sameId(order.createdBy, req.user._id) && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Это может сделать только автор заказа' });
    }
    const applicant = isValidId(req.params.applicantId) ? order.applicants.id(req.params.applicantId) : null;
    if (!applicant) return res.status(404).json({ message: 'Заявка не найдена' });

    applicant.status = approve ? 'approved' : 'rejected';
    await order.save();

    let chat = null;
    if (approve) {
      chat = await Chat.findOneAndUpdate(
        { orderId: order._id, carrierId: applicant.userId },
        { $setOnInsert: { customerId: order.createdBy, status: 'active' } },
        { upsert: true, new: true },
      );
    }
    await notify(
      applicant.userId,
      approve ? 'Заявка одобрена' : 'Заявка отклонена',
      approve
        ? `Ваша заявка на заказ «${order.route}» одобрена. Открыт чат с заказчиком.`
        : `Ваша заявка на заказ «${order.route}» отклонена.`,
      { orderId: order._id },
    );
    res.json({ order, chat });
  } catch (err) {
    console.error('Applicant decision error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

router.post('/:id/applicants/:applicantId/approve', auth, (req, res) => decideApplicant(req, res, true));
router.post('/:id/applicants/:applicantId/reject', auth, (req, res) => decideApplicant(req, res, false));

router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await findOrder(req, res);
    if (!order) return;
    if (!sameId(order.createdBy, req.user._id) && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }
    await Chat.deleteMany({ orderId: order._id });
    await order.deleteOne();
    res.json({ message: 'Заказ удалён' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
