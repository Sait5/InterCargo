🚛 Intercity Cargo Delivery
Веб-платформа для организации междугородних грузоперевозок с системой аукционов и тендеров.

Платформа соединяет грузовладельцев и перевозчиков через открытые торги, позволяя выбирать оптимальные условия доставки на основе конкурентных предложений.

📸 Скриншоты
Главная страница	Каталог перевозок	Личный кабинет
https://frontend/intercity-cargo-delivery/src/assets/screenshots/home.png	https://frontend/intercity-cargo-delivery/src/assets/screenshots/catalog.png	https://frontend/intercity-cargo-delivery/src/assets/screenshots/profile.png
🏗 Архитектура проекта
1. Общая схема (Frontend ↔ Backend ↔ Database)
Система построена по клиент-серверной модели с четким разделением ответственности:














2. Детали реализации
🔹 Backend (Серверная часть)
text
Backend/
├── server.js          # Точка входа, подключение CORS/JSON/статики
├── config.js          # Переменные окружения (JWT, MongoDB)
├── middleware/
│   └── auth.js        # JWT-валидация + загрузка пользователя из БД
├── models/
│   ├── User.js        # Пользователи с ролями (customer/carrier/admin)
│   ├── Auction.js     # Аукционы + вложенные ставки (bids)
│   ├── Review.js      # Отзывы о перевозчиках
│   └── ContactRequest.js # Заявки с формы обратной связи
└── routes/
    ├── authRoutes.js      # Регистрация, логин, профиль
    ├── auctionRoutes.js   # CRUD аукционов + ставки + завершение
    ├── userRoutes.js      # Управление пользователями (админ)
    ├── reviewRoutes.js    # Отзывы
    └── contactRoutes.js   # Обратная связь
Ключевые особенности:

Ролевая модель: customer (заказчик), carrier (перевозчик), isAdmin (админ)

JWT авторизация: Middleware проверяет токен и добавляет req.user

Вложенные ставки: bids хранятся внутри аукциона как массив объектов

Индексы MongoDB: Настроены на status и endsAt для быстрых выборок

🔹 Frontend (Клиентская часть)
text
frontend/intercity-cargo-delivery/
├── src/
│   ├── pages/          # 25+ страниц (Home, Login, AuctionList, Profile...)
│   ├── components/     # UI-компоненты (Header, Footer, Toast)
│   ├── features/       # Модульные фичи (Analytics, EndToEndProcess...)
│   ├── stores/         # Pinia хранилища
│   │   ├── user.js     # Аутентификация, профиль, админ-функции
│   │   ├── auctions.js # Управление аукционами и ставками
│   │   ├── chat.js     # Чат (WebSocket готов)
│   │   └── toast.js    # Система уведомлений
│   ├── router/         # Маршруты с защитой (requiresAuth, requiresAdmin)
│   ├── assets/         # Иконки, изображения, видео
│   └── utils/          # Вспомогательные функции
└── vite.config.js      # Настройка Vite сборщика
Ключевые особенности:

Pinia вместо Vuex: Более простой синтаксис и TypeScript-френдли

Защита маршрутов: Проверка localStorage токена + роль admin

Lazy-loading: Страницы загружаются по требованию (кроме основных)

Композиция API: Все логические блоки вынесены в stores

⚙️ Как работает система (Бизнес-логика)
Полный цикл аукциона (самое важное)
Ключевые проверки на бэкенде
javascript
// auctionRoutes.js - создание аукциона
if (req.user.accountType !== 'customer' && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Только заказчики могут создавать аукционы' });
}

// auctionRoutes.js - ставка
if (req.user.accountType !== 'carrier') {
    return res.status(403).json({ message: 'Только перевозчики могут делать ставки' });
}
if (Number(amount) >= auction.currentPrice) {
    return res.status(400).json({ message: `Ставка должна быть меньше текущей цены (${auction.currentPrice} ₽)` });
}
if (auction.accessType === 'private' && !auction.allowedCarriers.includes(req.user.id)) {
    return res.status(403).json({ message: 'Вы не приглашены на этот аукцион' });
}
👉 Этот подход демонстрирует глубокое понимание предметной области и безопасности.

🛡 Почему выбрана такая архитектура?
1. Безопасность на уровне бэкенда
JWT + Middleware проверяют каждый защищённый запрос

Роли жестко закодированы в маршрутах (accountType === 'carrier')

Даже если фронтенд подделает запрос, бэкенд его отклонит

2. Stateless аутентификация (JWT)
Токены хранятся в localStorage, не нагружают сервер сессиями

Позволяет легко масштабировать API (горизонтальное масштабирование)

3. MongoDB для гибкости
Вложенные документы (bids внутри Auction) — идеально для аукционов

Индексы на status, endsAt для быстрых запросов активных аукционов

Легко добавлять новые поля без миграций

4. Pinia для чистоты фронтенда
Единое хранилище user и auctions

getAuthHeaders() автоматически добавляет Bearer токен

Легко переключить на WebSocket или SSE

5. Разделение ответственности
Компоненты Vue только рендерят UI, всю логику выносят в stores

API-слой изолирован в stores, не засоряет компоненты

Router управляет только навигацией, а не бизнес-логикой

📦 Технологический стек
Компонент	Технология	Версия	Назначение
Frontend	Vue 3	^3.5.22	Реактивный UI
Pinia	^3.0.4	Управление состоянием
Vue Router	^4.5.1	Маршрутизация с защитой
Vite	^7.1.7	Сборка и Dev Server
SCSS	^1.101.0	Стилизация
Backend	Node.js	^20.19.0	Среда выполнения
Express.js	-	API сервер
Mongoose	-	ODM для MongoDB
JSON Web Token	-	Аутентификация
CORS	-	Кросс-доменные запросы
Database	MongoDB	-	Хранение данных
Дополнительно	Lucide Icons	^1.0.0	Иконки
🚀 Установка и запуск
1. Клонирование репозитория
bash
git clone https://github.com/username/intercity-cargo-delivery.git
cd intercity-cargo-delivery
2. Backend
bash
cd Backend
npm install
# Создайте .env файл (см. ниже)
npm start
# Сервер запустится на http://localhost:4000
3. Frontend
bash
cd frontend/intercity-cargo-delivery
npm install
npm run dev
# Frontend запустится на http://localhost:5173
4. Конфигурация (.env)
Создайте файл .env в папке Backend:

env
PORT=4000
MONGO_URI=mongodb://localhost:27017/intercity_cargo
JWT_SECRET=ваш_секретный_ключ_не_менее_32_символов
Важно: В production замените JWT_SECRET на сложную строку и используйте MongoDB Atlas.

🔌 API Эндпоинты
Аутентификация
Метод	Путь	Описание	Тело запроса
POST	/api/auth/register	Регистрация	{ email, password, firstName, lastName, accountType }
POST	/api/auth/login	Вход	{ email, password }
GET	/api/auth/me	Получить профиль	(Токен в заголовке)
PUT	/api/auth/me	Обновить профиль	(Токен + данные)
Аукционы (требуют аутентификации)
Метод	Путь	Описание	Особенности
GET	/api/auctions	Все аукционы	Фильтр по ?status=active
GET	/api/auctions/active	Только активные	Сортировка по endsAt
GET	/api/auctions/my	Мои аукционы	Только созданные пользователем
GET	/api/auctions/:id	Детали аукциона	Включает все ставки
POST	/api/auctions	Создать аукцион	Только accountType: customer
POST	/api/auctions/:id/bid	Сделать ставку	Только accountType: carrier, цена ниже текущей
POST	/api/auctions/:id/complete	Завершить	Только создатель или админ
POST	/api/auctions/:id/cancel	Отменить	Только создатель или админ
DELETE	/api/auctions/:id	Удалить	Только создатель или админ
Пользователи (админ)
Метод	Путь	Описание
GET	/api/users/all	Все пользователи
GET	/api/users/carriers	Все перевозчики
PUT	/api/users/:id	Обновить пользователя
PUT	/api/users/:id/block	Заблокировать/разблокировать
📁 Структура проекта (подробно)
text
intercity-cargo-delivery/
├── Backend/                    # Серверная часть
│   ├── middleware/
│   │   └── auth.js            # JWT проверка (3 строки, но мощно!)
│   ├── models/
│   │   ├── Auction.js         # Включает массив bids (вложенный)
│   │   ├── User.js            # Поля: accountType, isBlocked, company...
│   │   └── Review.js          # Отзывы с рейтингом
│   ├── routes/
│   │   ├── auctionRoutes.js   # Самая сложная логика (ставки, завершение)
│   │   ├── authRoutes.js      # Регистрация с хешированием bcrypt
│   │   └── userRoutes.js      # Админ-панель
│   ├── .env                   # Переменные окружения
│   ├── config.js              # Экспорт настроек
│   └── server.js              # Точка входа (CORS, Mongoose, Routes)
│
└── frontend/
    └── intercity-cargo-delivery/
        ├── src/
        │   ├── pages/          # 25 страниц (AuctionList, Profile, AdminPanel...)
        │   ├── features/       # Аналитика, верификация, независимость
        │   ├── stores/         # Pinia: user, auctions, chat, toast, order...
        │   ├── router/         # Маршруты с meta-полями (requiresAuth)
        │   ├── assets/         # Медиа: изображения, иконки, видео
        │   ├── styles/         # Глобальные CSS-переменные
        │   ├── ui/             # UI-компоненты: Header, Footer, Toast
        │   └── utils/          # Вспомогательные функции (imageLoader)
        ├── index.html          # Точка входа фронтенда
        └── vite.config.js      # Настройка Vite
✨ Возможности (Features)
Модуль	Описание
🔐 Регистрация/Авторизация	JWT + роли (customer/carrier/admin)
📋 Аукционы	Создание, просмотр, ставки, завершение
🏷️ Приватные тендеры	Аукционы только для приглашённых перевозчиков
⭐ Отзывы	Рейтинг перевозчиков после завершения
💬 Чат	Коммуникация между заказчиком и перевозчиком
📊 Аналитика	Модуль статистики перевозок
🛡️ Защита маршрутов	requiresAuth и requiresAdmin в роутере
👑 Админ-панель	Управление пользователями (блокировка, редактирование)
📱 Адаптивный дизайн	Корректное отображение на всех устройствах
🧪 Тестирование (рекомендации)
bash
# Тестирование API (используйте Postman или Insomnia)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.ru","password":"123456"}'

# Проверка активных аукционов (с токеном)
curl -X GET http://localhost:4000/api/auctions/active \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# Создание ставки
curl -X POST http://localhost:4000/api/auctions/670123456789/bid \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 45000}'
🐛 Известные ограничения
Отсутствие WebSocket: Чат сейчас на polling (можно заменить на Socket.io)

Нет загрузки файлов: Документы и фотографии грузов пока не реализованы

Нет email-уведомлений: Уведомления только через UI-тосты

📄 Лицензия
MIT © Intercity Cargo Delivery

🤝 Вклад в проект
Если хотите помочь проекту:

Форкните репозиторий

Создайте ветку (git checkout -b feature/amazing-feature)

Закоммитьте изменения (git commit -m 'Add some amazing feature')

Запушьте (git push origin feature/amazing-feature)

Откройте Pull Request

