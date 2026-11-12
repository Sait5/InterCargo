const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async function auth(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return res.status(401).json({ message: 'Токен недействителен' });
  }

  try {
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Аккаунт заблокирован' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
