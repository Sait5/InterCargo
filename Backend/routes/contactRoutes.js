const express = require('express');
const nodemailer = require('nodemailer');
const ContactRequest = require('../models/ContactRequest');
const Subscriber = require('../models/Subscriber');

const router = express.Router();

// Почта отправляется, только если SMTP настроен. Без него заявка просто сохраняется в базе.
const smtpReady = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const transporter = smtpReady
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  : null;

const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[ch]));

async function sendMails({ name, phone, email, message }) {
  if (!transporter) return;
  const safeName = escapeHtml(name);

  if (email) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Коммерческое предложение от InterCargo',
      html: `
        <h2>Здравствуйте, ${safeName}!</h2>
        <p>Спасибо за запрос. Менеджер свяжется с вами в ближайшее время и подготовит расчёт:
        стоимость, сроки доставки и специальные условия.</p>
        <p>С уважением,<br>Команда InterCargo</p>
      `,
    });
  }

  if (process.env.ADMIN_EMAIL) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Новая заявка с сайта',
      html: `
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> ${safeName}</p>
        <p><strong>Телефон:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email) || 'не указан'}</p>
        ${message ? `<p><strong>Сообщение:</strong> ${escapeHtml(message)}</p>` : ''}
      `,
    });
  }
}

router.post('/offer-request', async (req, res) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Имя и телефон обязательны' });
  }

  try {
    await ContactRequest.create({ name, phone, email, message });
  } catch (err) {
    console.error('Contact request save error:', err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }

  // Ошибка почты не должна ломать заявку — она уже сохранена
  sendMails({ name, phone, email, message }).catch((err) => {
    console.error('Contact mail error:', err.message);
  });

  res.json({ message: 'Заявка успешно отправлена' });
});

router.post('/subscribe', async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Введите корректный email' });
  }
  try {
    await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    res.json({ message: 'Вы подписаны на новости InterCargo' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
