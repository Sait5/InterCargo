// Выдать или снять роль администратора:
//   node scripts/make-admin.js email@example.com
//   node scripts/make-admin.js email@example.com --revoke
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');

(async () => {
  const email = (process.argv[2] || '').toLowerCase();
  const revoke = process.argv.includes('--revoke');
  if (!email) {
    console.log('Использование: node scripts/make-admin.js email@example.com [--revoke]');
    process.exit(1);
  }
  await mongoose.connect(config.mongoURI);
  const user = await User.findOneAndUpdate({ email }, { role: revoke ? 'user' : 'admin' }, { new: true });
  console.log(user ? `${user.email}: роль ${user.role}` : 'Пользователь не найден');
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
