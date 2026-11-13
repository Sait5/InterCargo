// Показательные данные: выводятся, когда своих записей ещё нет,
// и всегда помечены как «Пример». Действия на них недоступны.
const day = (n) => new Date(Date.now() + n * 864e5).toISOString();

export const exampleOrders = [
  {
    id: 'ex-1', example: true, route: 'Москва — Казань', from: 'Москва', to: 'Казань', type: 'Стройматериалы', volume: '20 т',
    dateFrom: day(2), dateTo: day(4), price: 85000, accessType: 'public', status: 'active', customerName: 'ООО «СтройМаркет»',
    applicants: [
      { id: 'ex-a1', name: 'Игорь Волков', company: 'ВолковТранс', phone: '+7 999 000-10-02', status: 'approved', appliedAt: day(-1) },
      { id: 'ex-a2', name: 'Дмитрий Орлов', company: 'СибЛогистик', phone: '+7 999 000-10-03', status: 'pending', appliedAt: day(-1) },
    ],
  },
  {
    id: 'ex-2', example: true, route: 'Санкт-Петербург — Екатеринбург', from: 'Санкт-Петербург', to: 'Екатеринбург', type: 'Оборудование', volume: '12 т',
    dateFrom: day(3), dateTo: day(7), price: 140000, accessType: 'public', status: 'pending', customerName: 'ООО «СтройМаркет»', applicants: [],
  },
  {
    id: 'ex-3', example: true, route: 'Краснодар — Москва', from: 'Краснодар', to: 'Москва', type: 'Продукты (реф)', volume: '18 т',
    dateFrom: day(1), dateTo: day(3), price: 96000, accessType: 'private', status: 'active', customerName: 'АО «ЮгАгро»',
    applicants: [{ id: 'ex-a3', name: 'Сергей Ким', company: 'РефЛайн', phone: '+7 999 000-10-05', status: 'rejected', appliedAt: day(-2) }],
  },
];

export const exampleApplications = [
  { ...exampleOrders[0], myApplication: { id: 'ex-m1', status: 'approved', appliedAt: day(-1) } },
  { ...exampleOrders[2], myApplication: { id: 'ex-m2', status: 'pending', appliedAt: day(-1) } },
  { ...exampleOrders[1], status: 'active', myApplication: { id: 'ex-m3', status: 'rejected', appliedAt: day(-3) } },
];

export const exampleAuctions = [
  {
    _id: 'ex-au1', example: true, title: 'Металлопрокат, срочно', route: 'Челябинск — Москва', cargoType: 'Металлопрокат', volume: '20 т',
    startPrice: 120000, currentPrice: 104500, status: 'active', accessType: 'public', dateFrom: day(1), dateTo: day(3), endsAt: day(1.4),
    bids: [{}, {}, {}, {}], creatorName: 'ООО «СтройМаркет»',
  },
  {
    _id: 'ex-au2', example: true, title: 'Рефрижератор, молочная продукция', route: 'Москва — Санкт-Петербург', cargoType: 'Продукты (реф)', volume: '15 т',
    startPrice: 70000, currentPrice: 63800, status: 'active', accessType: 'private', dateFrom: day(1), dateTo: day(2), endsAt: day(0.6),
    bids: [{}, {}, {}], creatorName: 'АО «Молоко Плюс»',
  },
  {
    _id: 'ex-au3', example: true, title: 'Оборудование для цеха', route: 'Казань — Новосибирск', cargoType: 'Оборудование', volume: '8 т',
    startPrice: 210000, currentPrice: 187000, status: 'completed', accessType: 'public', dateFrom: day(-4), dateTo: day(-1), endsAt: day(-1),
    bids: [{}, {}, {}, {}, {}, {}], winnerName: 'СибЛогистик', creatorName: 'ООО «ТехноПром»',
  },
];

export const exampleReviews = [
  { id: 'ex-r1', example: true, reviewerName: 'Анна Смирнова', rating: 5, text: 'Привезли вовремя, водитель на связи всю дорогу. Документы пришли в кабинет в тот же день.', date: day(-3), orderRoute: 'Москва — Казань' },
  { id: 'ex-r2', example: true, reviewerName: 'Олег Петров', rating: 4, text: 'Хорошая работа, небольшая задержка на погрузке, но предупредили заранее.', date: day(-9), orderRoute: 'Самара — Уфа' },
  { id: 'ex-r3', example: true, reviewerName: 'Мария Ли', rating: 5, text: 'Аккуратно довезли хрупкий груз, фото при выгрузке — очень удобно.', date: day(-20), orderRoute: 'Санкт-Петербург — Москва' },
];

export const exampleChat = {
  id: 'ex-chat', example: true, status: 'active', unread: 0,
  orderId: { route: 'Москва — Казань', price: 85000, type: 'Стройматериалы', volume: '20 т', dateFrom: day(1), dateTo: day(3), status: 'in_progress' },
  customerId: { firstName: 'Анна', lastName: 'Смирнова', company: 'ООО «СтройМаркет»' },
  carrierId: { firstName: 'Игорь', lastName: 'Волков', company: 'ВолковТранс' },
  messages: [
    { id: 'm1', fromOther: true, type: 'text', text: 'Здравствуйте! Видел вашу заявку Москва — Казань, готов взять. Тент 20 т, Volvo FH.', createdAt: day(-1.1) },
    { id: 'm2', fromOther: false, type: 'text', text: 'Добрый день! Подходит. Загрузка на складе в Подольске, ворота №3, с 9:00.', createdAt: day(-1.09) },
    { id: 'm3', fromOther: true, type: 'text', text: 'Принято. Пропуск нужен на машину?', createdAt: day(-1.08) },
    { id: 'm4', fromOther: false, type: 'text', text: 'Да, пришлите номер — закажу сегодня.', createdAt: day(-1.07) },
    { id: 'm5', fromOther: true, type: 'text', text: 'А 123 ВС 77, водитель Смирнов Алексей.', createdAt: day(-1.06) },
    { id: 'm6', fromOther: true, type: 'text', text: 'Доброе утро! Машина на загрузке, начинаем.', createdAt: day(-0.2) },
    { id: 'm7', fromOther: false, type: 'text', text: 'Отлично, спасибо. Пришлите фото после погрузки, пожалуйста.', createdAt: day(-0.19) },
    { id: 'm8', fromOther: true, type: 'text', text: 'Погрузили, пломба 004512. Выезжаем, в Казани будем завтра к обеду 👍', createdAt: day(-0.12) },
  ],
};
