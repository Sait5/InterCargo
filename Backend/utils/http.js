const mongoose = require('mongoose');

// Первое сообщение из ошибки валидации mongoose или null
function validationMessage(err) {
  if (err && err.name === 'ValidationError') {
    return Object.values(err.errors)[0].message;
  }
  return null;
}

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const fullName = (user) => `${user.firstName || ''} ${user.lastName || ''}`.trim();

module.exports = { validationMessage, isValidId, fullName };
