const {
  app, request, startDb, stopDb, clearDb, register, makeAdmin, authed,
} = require('./helpers');

beforeAll(startDb);
afterAll(stopDb);
afterEach(clearDb);

describe('Авторизация', () => {
  it('регистрирует пользователя и не отдаёт пароль', async () => {
    const { token, user } = await register('customer');
    expect(token).toBeTruthy();
    expect(user.id).toBeTruthy();
    expect(user.password).toBeUndefined();
    expect(user.role).toBe('user');
  });

  it('не даёт стать админом через регистрацию', async () => {
    const { user } = await register('customer', { role: 'admin', email: 'admin@intercargo.ru' });
    expect(user.role).toBe('user');
  });

  it('/me возвращает id после перезагрузки страницы', async () => {
    const { token, user } = await register('carrier');
    const res = await authed(token).get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user.id);
    expect(res.body.password).toBeUndefined();
  });

  it('отклоняет неверный пароль', async () => {
    const { user } = await register('customer');
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'Wrong123!' });
    expect(res.status).toBe(400);
  });

  it('отклоняет запрос без токена', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('заблокированный пользователь не может войти', async () => {
    const admin = await makeAdmin();
    const victim = await register('carrier');
    const block = await authed(admin.token).put(`/api/users/${victim.user.id}/block`);
    expect(block.status).toBe(200);

    const login = await request(app).post('/api/auth/login').send({ email: victim.user.email, password: 'Test1234!' });
    expect(login.status).toBe(403);
    const me = await authed(victim.token).get('/api/auth/me');
    expect(me.status).toBe(403);
  });

  it('список пользователей доступен только админу', async () => {
    const user = await register('customer');
    expect((await authed(user.token).get('/api/users/all')).status).toBe(403);
    const admin = await makeAdmin();
    expect((await authed(admin.token).get('/api/users/all')).status).toBe(200);
  });
});

describe('Заявки и подписка', () => {
  it('сохраняет заявку без настроенной почты', async () => {
    const res = await request(app).post('/api/contact/offer-request').send({ name: 'Анна', phone: '+79990000000' });
    expect(res.status).toBe(200);
  });

  it('подписывает на новости и не дублирует email', async () => {
    expect((await request(app).post('/api/contact/subscribe').send({ email: 'a@b.ru' })).status).toBe(200);
    expect((await request(app).post('/api/contact/subscribe').send({ email: 'A@b.ru' })).status).toBe(200);
    expect((await request(app).post('/api/contact/subscribe').send({ email: 'плохой' })).status).toBe(400);
  });
});
