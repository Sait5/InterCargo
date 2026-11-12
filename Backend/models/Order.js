const mongoose = require('mongoose');

const toId = {
  versionKey: false,
  transform(doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
};

const applicantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
});
applicantSchema.set('toJSON', toId);

const orderSchema = new mongoose.Schema({
  route: { type: String, required: true, trim: true, maxlength: 200 },
  from: { type: String, required: [true, 'Укажите город отправления'], trim: true, maxlength: 100 },
  to: { type: String, required: [true, 'Укажите город назначения'], trim: true, maxlength: 100 },
  type: { type: String, default: '', trim: true, maxlength: 100 },
  volume: { type: String, default: '', trim: true, maxlength: 100 },
  dateFrom: { type: Date, required: [true, 'Укажите дату начала'] },
  dateTo: { type: Date, required: [true, 'Укажите дату окончания'] },
  price: { type: Number, required: true, min: [1, 'Укажите корректную цену'] },
  accessType: { type: String, enum: ['public', 'private'], default: 'public' },
  // public — ждёт модерации администратора, private — публикуется сразу
  status: { type: String, enum: ['pending', 'active', 'rejected', 'completed'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customerName: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  applicants: [applicantSchema],
  approvedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});
orderSchema.set('toJSON', toId);
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
