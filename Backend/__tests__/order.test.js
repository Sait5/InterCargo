const {
  startDb, stopDb, clearDb, register, makeAdmin, authed,
} = require('./helpers');

beforeAll(startDb);
afterAll(stopDb);
afterEach(clearDb);

const orderBody = (extra = {}) => ({
  from: 'Москва',
  to: 'Казань',
  type: 'Стройматериалы',
  volume: '500 кг',
  dateFrom: '2030-01-10',
  dateTo: '2030-01-12',
  price: 30000,
  ...extra,
});

describe('Заказы и чат', () => {
  it('создаёт публичный заказ на модерацию', async () => {
    const customer = await register('customer');
    const res = await authed(customer.token).post('/api/orders', orderBody());
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.route).toBe('Москва — Казань');
    expect(res.body.status).toBe('pending');
  });

  it('отклоняет заказ без обязательных полей', async () => {
    const customer = await register('customer');
    const res = await authed(customer.token).post('/api/orders', { from: 'Москва' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
  });

  it('проходит цикл: модерация → отклик → одобрение → чат', async () => {
    const admin = await makeAdmin();
    const customer = await register('customer');
    const carrier = await register('carrier');
    const other = await register('carrier');

    const { body: order } = await authed(customer.token).post('/api/orders', orderBody());
    expect((await authed(carrier.token).post(`/api/orders/${order.id}/apply`)).status).toBe(400);
    expect((await authed(customer.token).post(`/api/orders/${order.id}/approve`)).status).toBe(403);
    expect((await authed(admin.token).post(`/api/orders/${order.id}/approve`)).status).toBe(200);

    expect((await authed(carrier.token).post(`/api/orders/${order.id}/apply`)).status).toBe(200);
    expect((await authed(carrier.token).post(`/api/orders/${order.id}/apply`)).status).toBe(400);
    await authed(other.token).post(`/api/orders/${order.id}/apply`);

    // Перевозчик видит только свою заявку и не видит контакты заказчика
    const carrierView = (await authed(carrier.token).get('/api/orders')).body[0];
    expect(carrierView.applicants).toHaveLength(1);
    expect(carrierView.customerPhone).toBeUndefined();

    const customerView = (await authed(customer.token).get('/api/orders')).body[0];
    expect(customerView.applicants).toHaveLength(2);
    const applicant = customerView.applicants.find((a) => a.userId === carrier.user.id);

    const decision = await authed(customer.token).post(`/api/orders/${order.id}/applicants/${applicant.id}/approve`);
    expect(decision.status).toBe(200);
    const chatId = decision.body.chat.id;

    const sent = await authed(carrier.token).post(`/api/chats/${chatId}/messages`, { text: 'Здравствуйте!' });
    expect(sent.status).toBe(201);

    const chats = (await authed(customer.token).get('/api/chats')).body;
    expect(chats).toHaveLength(1);
    expect(chats[0].messages[0].text).toBe('Здравствуйте!');

    // Посторонний перевозчик не может писать в чужой чат
    expect((await authed(other.token).post(`/api/chats/${chatId}/messages`, { text: 'привет' })).status).toBe(404);
  });
});
