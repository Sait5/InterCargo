const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactRequest = require('../models/ContactRequest');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.post('/offer-request', async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Имя и телефон обязательны' });
  }
  try {
    const request = new ContactRequest({ name, phone, email });
    await request.save();

    if (email) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Коммерческое предложение от InterCargo',
        html: `
          <h2>Здравствуйте, ${name}!</h2>
          <p>Спасибо за ваш запрос.</p>
          <p>Мы подготовили для вас индивидуальное коммерческое предложение:</p>
          <h3>Включено в предложение:</h3>
          <ul>
            <li><strong>Точный расчет стоимости</strong> — учтем все параметры вашего груза</li>
            <li><strong>Оптимальные сроки доставки</strong> — выберем самый быстрый маршрут</li>
            <li><strong>Персональный менеджер</strong> — будем на связи 24/7</li>
            <li><strong>Специальные условия</strong> — скидки для постоянных клиентов</li>
          </ul>
          <p>Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.</p>
          <br>
          <p>С уважением,<br>Команда InterCargo</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
        `
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Новая заявка на коммерческое предложение',
      html: `
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'не указан'}</p>
        <hr>
        <p><strong>Требуется подготовить КП с:</strong></p>
        <ul>
          <li>Точным расчетом стоимости</li>
          <li>Оптимальными сроками доставки</li>
          <li>Назначением персонального менеджера</li>
          <li>Специальными условиями</li>
        </ul>
      `
    });

    res.json({ message: 'Заявка успешно отправлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;