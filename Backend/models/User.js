const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    match: [/^[А-Яа-яЁёA-Za-z-]+$/, 'Имя должно содержать только буквы и дефисы'],
    minlength: [1, 'Имя не может быть короче 1 символа'],
    maxlength: [50, 'Имя не может быть длиннее 50 символов']
  },
  lastName: {
    type: String,
    required: [true, 'Фамилия обязательна'],
    trim: true,
    match: [/^[А-Яа-яЁёA-Za-z-]+$/, 'Фамилия должна содержать только буквы и дефисы'],
    minlength: [1, 'Фамилия не может быть короче 1 символа'],
    maxlength: [50, 'Фамилия не может быть длиннее 50 символов']
  },
  patronymic: {
    type: String,
    trim: true,
    match: [/^[А-Яа-яЁёA-Za-z-]*$/, 'Отчество должно содержать только буквы и дефисы'],
    maxlength: [50, 'Отчество не может быть длиннее 50 символов'],
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Электронная почта обязательна'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный формат email'],
    maxlength: [50, 'Email не может быть длиннее 50 символов']
  },
  phone: {
    type: String,
    required: [true, 'Номер телефона обязателен'],
    unique: true,
    trim: true,
    match: [/^\+?\d{10,15}$/, 'Номер телефона должен содержать от 10 до 15 цифр'],
    minlength: [10, 'Номер телефона не может быть короче 10 символов'],
    maxlength: [15, 'Номер телефона не может быть длиннее 15 символов']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [8, 'Пароль должен содержать минимум 8 символов'],
    maxlength: [50, 'Пароль не может быть длиннее 50 символов'],
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,50}$/, 'Пароль должен содержать минимум 1 заглавную букву, 1 строчную, 1 цифру и 1 спецсимвол (@$!%*?&_-)']
  },
  accountType: {
    type: String,
    enum: ['carrier', 'customer'],
    default: 'customer'
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Название компании не может быть длиннее 100 символов'],
    default: ''
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);