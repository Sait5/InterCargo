const mongoose = require('mongoose');

const toId = {
  versionKey: false,
  transform(doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
};

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'voice'], default: 'text' },
  // Для голосовых — data:audio/...;base64
  text: { type: String, required: true, maxlength: 3 * 1024 * 1024 },
  duration: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
messageSchema.set('toJSON', toId);

const chatSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});
chatSchema.set('toJSON', toId);
chatSchema.index({ orderId: 1, carrierId: 1 }, { unique: true });

module.exports = mongoose.model('Chat', chatSchema);
