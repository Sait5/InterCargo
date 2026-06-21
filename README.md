# Intercity Cargo Delivery

Веб-платформа для организации междугородних грузоперевозок с системой аукционов между заказчиками и перевозчиками.

🔗 **Демо:** https://inter-cargo-6ag6.vercel.app

---

## О проекте

Intercity Cargo Delivery — fullstack веб-приложение для организации междугородних грузоперевозок.

Заказчики публикуют заявки на перевозку грузов, перевозчики участвуют в аукционах и предлагают свои условия доставки, после чего заказчик выбирает победителя.

---

## Основные возможности

* Регистрация и авторизация пользователей (JWT)
* Ролевая модель доступа (Customer, Carrier, Admin)
* Создание и управление аукционами
* Система ставок
* Приватные аукционы
* Личный кабинет пользователя
* Отзывы пользователей
* Форма обратной связи
* Административная панель
* Защищённые маршруты и API

---

## Скриншоты

### Главная страница

![Главная страница](/frontend/intercity-cargo-delivery/src/assets/screenshots/home.png)

![Главная страница](/frontend/intercity-cargo-delivery/src/assets/screenshots/home-2.png)

### Каталог перевозок

![Каталог перевозок](/frontend/intercity-cargo-delivery/src/assets/screenshots/catalog.png)

![Каталог перевозок](/frontend/intercity-cargo-delivery/src/assets/screenshots/catalog-2.png)

### Личный кабинет

![Личный кабинет](/frontend/intercity-cargo-delivery/src/assets/screenshots/profile.png)

---

## Технологический стек

### Frontend

* Vue 3
* Vue Router
* Pinia
* Vite
* SCSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## Архитектура

### Общая схема

```text
Frontend (Vue 3 + Pinia)
           │
           ▼
     Express REST API
           │
           ▼
        MongoDB
```

### Backend

```text
Backend/
├── middleware/
│   └── auth.js
├── models/
│   ├── Auction.js
│   ├── User.js
│   ├── Review.js
│   └── ContactRequest.js
├── routes/
│   ├── authRoutes.js
│   ├── auctionRoutes.js
│   ├── userRoutes.js
│   ├── reviewRoutes.js
│   └── contactRoutes.js
├── config.js
└── server.js
```

### Frontend

```text
frontend/intercity-cargo-delivery/
├── src/
│   ├── pages/
│   ├── stores/
│   ├── router/
│   ├── components/
│   ├── features/
│   ├── assets/
│   └── utils/
├── index.html
└── vite.config.js
```

---

## Роли пользователей

| Роль     | Возможности                                  |
| -------- | -------------------------------------------- |
| Customer | Создание аукционов, выбор победителя, отзывы |
| Carrier  | Просмотр аукционов, участие в торгах, ставки |
| Admin    | Управление пользователями и аукционами       |

---

## Жизненный цикл аукциона

```text
draft → active → completed
              ↘ cancelled
```

### Создание аукциона

Customer создаёт заявку:

* маршрут
* описание груза
* стартовая цена
* сроки доставки
* тип аукциона (public/private)

### Размещение ставок

Carrier может:

* просматривать активные аукционы
* делать ставки
* участвовать в приватных аукционах при наличии доступа

Перед созданием ставки выполняются проверки:

* аукцион активен
* пользователь не является владельцем аукциона
* ставка ниже текущей цены
* есть доступ к приватному аукциону

### Завершение аукциона

Customer выбирает победителя и завершает аукцион.

После завершения:

* фиксируется победитель
* статус меняется на `completed`
* пользователи могут связаться через чат

---

## Установка

### Клонирование репозитория

```bash
git clone https://github.com/Sait5/Intercity-Cargo.git
cd Intercity-Cargo
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

Создайте файл `.env` в папке `Backend`.

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/intercity_cargo
JWT_SECRET=your_secret_key
```

---

## API

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
```

### Auctions

```http
GET    /api/auctions
GET    /api/auctions/active
GET    /api/auctions/my
GET    /api/auctions/:id

POST   /api/auctions
POST   /api/auctions/:id/bid
POST   /api/auctions/:id/complete
POST   /api/auctions/:id/cancel

DELETE /api/auctions/:id
```

### Reviews

```http
GET  /api/reviews
POST /api/reviews
```

### Users (Admin)

```http
GET  /api/users/all
GET  /api/users/carriers

PUT  /api/users/:id
PUT  /api/users/:id/block
```

---

## Тестирование

### Frontend

```bash
cd frontend/intercity-cargo-delivery
npm run test
```

### Backend

```bash
cd Backend
npm run test
```

---

## Лицензия

MIT
