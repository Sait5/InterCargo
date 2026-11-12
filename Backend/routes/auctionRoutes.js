const express = require('express');
const Auction = require('../models/Auction');
const auth = require('../middleware/auth');
const notify = require('../utils/notify');
const { isValidId, fullName } = require('../utils/http');

const router = express.Router();

const isAdmin = (user) => user.role === 'admin';
const sameId = (a, b) => String(a && (a._id || a)) === String(b && (b._id || b));

// Аукционы, у которых вышло время, закрываются автоматически при любом обращении
async function closeExpired() {
  const expired = await Auction.find({ status: 'active', endsAt: { $lte: new Date() } });
  for (const auction of expired) {
    auction.status = 'completed';
    await auction.save();
    if (auction.winnerId) {
      await notify(auction.winnerId, 'Вы выиграли аукцион', `Аукцион «${auction.title}» завершён, ваша ставка лучшая.`);
    }
    await notify(auction.creatorId, 'Аукцион завершён', `Время аукциона «${auction.title}» истекло.`);
  }
}

// Приватный аукцион видят только создатель, приглашённые перевозчики и админ
function canSee(auction, user) {
  if (auction.accessType !== 'private') return true;
  if (isAdmin(user) || sameId(auction.creatorId, user._id)) return true;
  return auction.allowedCarriers.some((id) => sameId(id, user._id));
}

const visibilityFilter = (user) => (isAdmin(user)
  ? {}
  : { $or: [{ accessType: 'public' }, { creatorId: user._id }, { allowedCarriers: user._id }] });

router.get('/', auth, async (req, res) => {
  try {
    await closeExpired();
    const filter = visibilityFilter(req.user);
    if (req.query.status) filter.status = req.query.status;
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
    await closeExpired();
    const auctions = await Auction.find({ ...visibilityFilter(req.user), status: 'active' })
      .populate('creatorId', 'firstName lastName company')
      .sort({ endsAt: 1 });
    res.json(auctions);
  } catch (err) {
    console.error('Get active auctions error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    await closeExpired();
    const auctions = await Auction.find({ creatorId: req.user._id }).sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    console.error('Get my auctions error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Аукцион не найден' });
    await closeExpired();
    const auction = await Auction.findById(req.params.id)
      .populate('creatorId', 'firstName lastName company phone email')
      .populate('bids.bidderId', 'firstName lastName company');
    if (!auction || !canSee(auction, req.user)) {
      return res.status(404).json({ message: 'Аукцион не найден' });
    }
    res.json(auction);
  } catch (err) {
    console.error('Get auction error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const {
      title, route, cargoType, volume, startPrice, dateFrom, dateTo, description, accessType, allowedCarriers,
    } = req.body;
    if (!title || !route || !cargoType || !volume || !startPrice || !dateFrom || !dateTo) {
      return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }
    if (req.user.accountType !== 'customer' && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Только заказчики могут создавать аукционы' });
    }
    const price = Number(startPrice);
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: 'Укажите корректную стартовую цену' });
    }
    const startsAt = new Date();
    const endsAt = new Date(dateTo);
    if (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
      return res.status(400).json({ message: 'Дата окончания должна быть позже текущего момента' });
    }
    const isPrivate = accessType === 'private';
    const invited = isPrivate ? (allowedCarriers || []).filter(isValidId) : [];

    const auction = await Auction.create({
      title,
      route,
      cargoType,
      volume,
      startPrice: price,
      currentPrice: price,
      dateFrom: new Date(dateFrom),
      dateTo: endsAt,
      description: description || '',
      creatorId: req.user._id,
      creatorName: fullName(req.user),
      accessType: isPrivate ? 'private' : 'public',
      allowedCarriers: invited,
      status: 'active',
      startsAt,
      endsAt,
    });

    if (invited.length) {
      await notify(invited, 'Приглашение в аукцион', `Вас пригласили в закрытый аукцион «${title}».`);
    }
    res.status(201).json({ message: 'Аукцион создан', auction });
  } catch (err) {
    console.error('Create auction error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/bid', auth, async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Укажите корректную сумму ставки' });
    }
    if (req.user.accountType !== 'carrier') {
      return res.status(403).json({ message: 'Только перевозчики могут делать ставки' });
    }
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Аукцион не найден' });

    await closeExpired();
    const auction = await Auction.findById(req.params.id);
    if (!auction || !canSee(auction, req.user)) {
      return res.status(404).json({ message: 'Аукцион не найден' });
    }
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Аукцион не активен' });
    }
    if (sameId(auction.creatorId, req.user._id)) {
      return res.status(403).json({ message: 'Нельзя делать ставки на свой аукцион' });
    }
    if (amount >= auction.currentPrice) {
      return res.status(400).json({ message: `Ставка должна быть меньше текущей цены (${auction.currentPrice} ₽)` });
    }

    const previousLeader = auction.winnerId;
    const existingBid = auction.bids.find((b) => sameId(b.bidderId, req.user._id));
    if (existingBid) {
      existingBid.amount = amount;
      existingBid.createdAt = new Date();
    } else {
      auction.bids.push({
        bidderId: req.user._id,
        bidderName: fullName(req.user),
        bidderCompany: req.user.company || '',
        amount,
      });
    }
    auction.currentPrice = amount;
    auction.winnerId = req.user._id;
    auction.winnerName = fullName(req.user);
    await auction.save();

    if (previousLeader && !sameId(previousLeader, req.user._id)) {
      await notify(previousLeader, 'Вашу ставку перебили', `В аукционе «${auction.title}» новая ставка: ${amount} ₽.`);
    }
    res.json({ message: 'Ставка принята', auction });
  } catch (err) {
    console.error('Place bid error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

async function loadOwned(req, res) {
  if (!isValidId(req.params.id)) {
    res.status(404).json({ message: 'Аукцион не найден' });
    return null;
  }
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404).json({ message: 'Аукцион не найден' });
    return null;
  }
  if (!sameId(auction.creatorId, req.user._id) && !isAdmin(req.user)) {
    res.status(403).json({ message: 'Это может сделать только создатель аукциона' });
    return null;
  }
  return auction;
}

router.post('/:id/complete', auth, async (req, res) => {
  try {
    const auction = await loadOwned(req, res);
    if (!auction) return;
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Аукцион уже завершён' });
    }
    auction.status = 'completed';
    await auction.save();
    if (auction.winnerId) {
      await notify(auction.winnerId, 'Вы выиграли аукцион', `Заказчик завершил аукцион «${auction.title}», ваша ставка лучшая.`);
    }
    res.json({ message: 'Аукцион завершён', auction });
  } catch (err) {
    console.error('Complete auction error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const auction = await loadOwned(req, res);
    if (!auction) return;
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Отменить можно только активный аукцион' });
    }
    auction.status = 'cancelled';
    await auction.save();
    const bidders = auction.bids.map((b) => b.bidderId);
    await notify(bidders, 'Аукцион отменён', `Заказчик отменил аукцион «${auction.title}».`);
    res.json({ message: 'Аукцион отменён', auction });
  } catch (err) {
    console.error('Cancel auction error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const auction = await loadOwned(req, res);
    if (!auction) return;
    await auction.deleteOne();
    res.json({ message: 'Аукцион удалён' });
  } catch (err) {
    console.error('Delete auction error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
