# Intercity Cargo Delivery

Веб-платформа для организации междугородних грузоперевозок с системой аукционов.

## О проекте

Платформа позволяет размещать заявки на перевозку грузов, получать предложения от перевозчиков и выбирать оптимальные условия доставки.

## Скриншоты

### Главная страница


![Главная страница](/frontend/intercity-cargo-delivery/src/assets/screenshots/home.png)


---


![Главная страница](/frontend/intercity-cargo-delivery/src/assets/screenshots/home-2.png)


### Каталог перевозок


![Каталог перевозок](/frontend/intercity-cargo-delivery/src/assets/screenshots/catalog.png)


---


![Каталог перевозок](/frontend/intercity-cargo-delivery/src/assets/screenshots/catalog-2.png)


### Личный кабинет

![Личный кабинет](/frontend/intercity-cargo-delivery/src/assets/screenshots/profile.png)

---

## Возможности

- Регистрация и авторизация пользователей
- Управление профилем
- Создание и просмотр заявок
- Система аукционов
- Отзывы пользователей
- Форма обратной связи
- Защищенные маршруты

---

## Технологии

### Frontend

- Vue 3
- Vue Router
- Pinia
- Vite
- SCSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

---

## Структура проекта

```text
Backend/
├── middleware/
├── models/
├── routes/
├── server.js
└── config.js

frontend/
└── intercity-cargo-delivery/
    ├── src/
    ├── public/
    └── vite.config.js
```

---

## Установка

### Клонирование репозитория

```bash
git clone https://github.com/username/project.git
cd project
```

### Backend

```bash
cd Backend
npm install
npm start
```

### Frontend

```bash
cd frontend/intercity-cargo-delivery
npm install
npm run dev
```

---

## Конфигурация

Создайте файл `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## API

### Аутентификация

```http
POST /api/auth/register
POST /api/auth/login
```

### Перевозки

```http
GET    /api/auctions
POST   /api/auctions
PUT    /api/auctions/:id
DELETE /api/auctions/:id
```

### Отзывы

```http
GET  /api/reviews
POST /api/reviews
```

---

## Лицензия

MIT
