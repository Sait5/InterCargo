const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  
  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Токон недействителен' });
  }
};