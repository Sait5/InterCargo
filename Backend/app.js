const express = require('express');
const cors = require('cors');
const config = require('./config');

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin || config.clientOrigins.length === 0 || config.clientOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Источник запроса не разрешён'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Голосовые сообщения чата приходят в base64, поэтому лимит больше стандартного
app.use(express.json({ limit: '3mb' }));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/auctions', require('./routes/auctionRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Слишком большой запрос' });
  }
  console.error(err);
  res.status(500).json({ message: 'Ошибка сервера' });
});

module.exports = app;
