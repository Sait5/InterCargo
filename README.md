Intercity Cargo Delivery
Веб-платформа для организации междугородних грузоперевозок с системой аукционов.

О проекте
Платформа позволяет размещать заявки на перевозку грузов, получать предложения от перевозчиков и выбирать оптимальные условия доставки.

Скриншоты
Главная страница
https:///frontend/intercity-cargo-delivery/src/assets/screenshots/home.png
https:///frontend/intercity-cargo-delivery/src/assets/screenshots/home-2.png

Каталог перевозок
https:///frontend/intercity-cargo-delivery/src/assets/screenshots/catalog.png
https:///frontend/intercity-cargo-delivery/src/assets/screenshots/catalog-2.png

Личный кабинет
https:///frontend/intercity-cargo-delivery/src/assets/screenshots/profile.png

Архитектура
Общая схема
text
Frontend (Vue 3 + Pinia) ←→ Backend (Express API) ←→ MongoDB
Backend
text
Backend/
├── middleware/
│   └── auth.js          # Проверка JWT, загрузка пользователя
├── models/
│   ├── Auction.js       # Аукцион + вложенные ставки (bids)
│   ├── User.js          # Пользователи (customer/carrier/admin)
│   ├── Review.js        # Отзывы
│   └── ContactRequest.js
├── routes/
│   ├── authRoutes.js    # Регистрация, логин, профиль
│   ├── auctionRoutes.js # CRUD аукционов, ставки, завершение
│   ├── userRoutes.js    # Управление пользователями
│   ├── reviewRoutes.js
│   └── contactRoutes.js
├── config.js
└── server.js
Frontend
text
frontend/intercity-cargo-delivery/
├── src/
│   ├── pages/           # Home, Login, AuctionList, Profile...
│   ├── stores/          # Pinia: user, auctions, chat, toast...
│   ├── router/          # Маршруты с meta (requiresAuth, requiresAdmin)
│   ├── components/      # Header, Footer, Toast
│   ├── features/        # Analytics, VerifiedCarriers...
│   ├── assets/
│   └── utils/
├── index.html
└── vite.config.js
Как работает система
Полный цикл аукциона
Заказчик (customer) создаёт аукцион через POST /api/auctions

Статус: active

Указывает маршрут, груз, цену, даты

Может сделать аукцион private (только для приглашённых перевозчиков)

Перевозчик (carrier) видит активные аукционы через GET /api/auctions/active

Перевозчик делает ставку через POST /api/auctions/:id/bid

Система проверяет:

Аукцион активен

Ставка меньше текущей цены

Перевозчик не создатель аукциона

Для private: перевозчик в списке приглашённых

Обновляется currentPrice и winnerId

Заказчик завершает аукцион через POST /api/auctions/:id/complete

Статус: completed

Фиксируется победитель (winnerId)

Заказчик и перевозчик связываются через чат для обсуждения деталей

Роли в системе
Роль	Возможности
customer	Создание аукционов, выбор победителя, отзывы
carrier	Просмотр аукционов, ставки, получение заказов
admin	Управление пользователями (блокировка, редактирование), завершение любых аукционов
Статусы аукциона
text
draft → active → completed
              ↘ cancelled
Возможности
Регистрация и авторизация пользователей

Три роли: customer / carrier / admin

Создание и просмотр заявок

Система аукционов со ставками

Приватные тендеры (только для приглашённых)

Отзывы пользователей

Форма обратной связи

Защищенные маршруты (requiresAuth, requiresAdmin)

Админ-панель для управления пользователями

Технологии
Frontend
Vue 3

Vue Router

Pinia

Vite

SCSS

Backend
Node.js

Express.js

MongoDB

Mongoose

JWT

Структура проекта
text
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
├── server.js
└── config.js

frontend/
└── intercity-cargo-delivery/
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
Установка
Клонирование репозитория
bash
git clone https://github.com/username/project.git
cd project
Backend
bash
cd Backend
npm install
npm start
Frontend
bash
cd frontend/intercity-cargo-delivery
npm install
npm run dev
Конфигурация
Создайте файл .env в папке Backend:

env
PORT=4000
MONGO_URI=mongodb://localhost:27017/intercity_cargo
JWT_SECRET=your_secret_key
API
Аутентификация
http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
Аукционы
http
GET    /api/auctions
GET    /api/auctions/active
GET    /api/auctions/my
GET    /api/auctions/:id
POST   /api/auctions
POST   /api/auctions/:id/bid
POST   /api/auctions/:id/complete
POST   /api/auctions/:id/cancel
DELETE /api/auctions/:id
Отзывы
http
GET  /api/reviews
POST /api/reviews
Пользователи (админ)
http
GET  /api/users/all
GET  /api/users/carriers
PUT  /api/users/:id
PUT  /api/users/:id/block
Лицензия
MIT
