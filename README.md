# Intercity Cargo Delivery

Веб-платформа для организации междугородних грузоперевозок с системой аукционов.

---

## О проекте

Платформа позволяет размещать заявки на перевозку грузов, получать предложения от перевозчиков и выбирать оптимальные условия доставки.

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

## Архитектура

### Общая схема

```
Frontend (Vue 3 + Pinia) ↔ Backend (Express API) ↔ MongoDB
```

### Backend

```
Backend/
├── middleware/
│   └── auth.js              # JWT проверка и загрузка пользователя
├── models/
│   ├── Auction.js           # Аукцион и ставки (bids)
│   ├── User.js              # Пользователи (customer / carrier / admin)
│   ├── Review.js            # Отзывы
│   └── ContactRequest.js
├── routes/
│   ├── authRoutes.js        # Регистрация, логин, профиль
│   ├── auctionRoutes.js     # Аукционы, ставки, завершение
│   ├── userRoutes.js        # Управление пользователями
│   ├── reviewRoutes.js      # Отзывы
│   └── contactRoutes.js
├── config.js
└── server.js
```

### Frontend

```
frontend/intercity-cargo-delivery/
├── src/
│   ├── pages/               # Home, Login, Auctions, Profile
│   ├── stores/              # Pinia: user, auctions, chat, toast
│   ├── router/              # Маршруты (requiresAuth, requiresAdmin)
│   ├── components/         # UI компоненты
│   ├── features/           # Доп. функциональность
│   ├── assets/
│   └── utils/
├── index.html
└── vite.config.js
```

---

## Как работает система

### Цикл аукциона

1. **Customer** создаёт аукцион (`POST /api/auctions`)

   * статус: `active`
   * маршрут, груз, цена, сроки
   * может быть `private`

2. **Carrier** просматривает активные аукционы (`GET /api/auctions/active`)

3. **Carrier** делает ставку (`POST /api/auctions/:id/bid`)

   * проверяется:

     * аукцион активен
     * ставка ниже текущей цены
     * не владелец аукциона
     * доступ для private-аукционов
   * обновляется `currentPrice` и `winnerId`

4. **Customer** завершает аукцион (`POST /api/auctions/:id/complete`)

   * статус: `completed`
   * фиксируется победитель

5. Участники связываются через чат для обсуждения доставки

---

## Роли

| Роль     | Возможности                                  |
| -------- | -------------------------------------------- |
| customer | создание аукционов, выбор победителя, отзывы |
| carrier  | участие в аукционах, ставки                  |
| admin    | управление пользователями и аукционами       |

---

## Статусы аукциона

```
draft → active → completed
              ↘ cancelled
```

---

## Возможности

* регистрация и авторизация (JWT)
* 3 роли пользователей
* создание и управление аукционами
* система ставок
* приватные аукционы
* отзывы
* обратная связь
* админ-панель
* защищённые маршруты

---

## Технологии

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
* JWT

---

## Установка

### Клонирование

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

Создайте `.env` в папке `Backend`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/intercity_cargo
JWT_SECRET=your_secret_key
```

---

## API

### Auth

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
```

### Auctions

```
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

```
GET  /api/reviews
POST /api/reviews
```

### Users (admin)

```
GET  /api/users/all
GET  /api/users/carriers
PUT  /api/users/:id
PUT  /api/users/:id/block
```

---

## Лицензия

MIT
