require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET не задан. Укажите его в переменных окружения.');
}

module.exports = {
  isProduction,
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intercity_cargo',
  // Список адресов фронтенда через запятую. Пусто — разрешены все (только для разработки).
  clientOrigins: (process.env.CLIENT_URL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};
