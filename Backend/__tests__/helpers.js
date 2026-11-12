const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongo;

async function startDb() {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}

async function stopDb() {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
}

async function clearDb() {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
}

let counter = 0;

// Регистрирует пользователя и возвращает { token, user }
async function register(accountType = 'customer', overrides = {}) {
  counter += 1;
  const body = {
    firstName: 'Иван',
    lastName: accountType === 'carrier' ? 'Перевозчиков' : 'Заказчиков',
    email: `user${counter}@test.local`,
    phone: `+7999000${String(counter).padStart(4, '0')}`,
    password: 'Test1234!',
    confirmPassword: 'Test1234!',
    accountType,
    company: 'ТестКо',
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(body);
  if (res.status !== 201) throw new Error(`Регистрация не удалась: ${res.body.message}`);
  return res.body;
}

async function makeAdmin() {
  const admin = await register('customer');
  await User.updateOne({ email: admin.user.email }, { role: 'admin' });
  return admin;
}

const authed = (token) => ({
  get: (url) => request(app).get(url).set('Authorization', `Bearer ${token}`),
  post: (url, body = {}) => request(app).post(url).set('Authorization', `Bearer ${token}`).send(body),
  put: (url, body = {}) => request(app).put(url).set('Authorization', `Bearer ${token}`).send(body),
  del: (url) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
});

module.exports = { app, request, startDb, stopDb, clearDb, register, makeAdmin, authed };
