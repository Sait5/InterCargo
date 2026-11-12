const Notification = require('../models/Notification');

async function notify(userIds, title, text, extra = {}) {
  const ids = [].concat(userIds).filter(Boolean);
  if (!ids.length) return;
  await Notification.insertMany(ids.map((userId) => ({ userId, title, text, ...extra })));
}

module.exports = notify;
