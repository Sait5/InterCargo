const {
  startDb, stopDb, clearDb, register, authed,
} = require('./helpers');

beforeAll(startDb);
afterAll(stopDb);
afterEach(clearDb);

const inDays = (n) => new Date(Date.now() + n * 864e5).toISOString();

const auctionBody = (extra = {}) => ({
  title: 'Стройматериалы',
  route: 'Москва — Казань',
  cargoType: 'Стройматериалы',
  volume: '20 т',
  startPrice: 90000,
  dateFrom: inDays(1),
  dateTo: inDays(3),
  ...extra,
});

describe('Аукционы', () => {
  it('требует авторизацию для списка активных', async () => {
    const res = await require('./helpers').request(require('./helpers').app).get('/api/auctions/active');
    expect(res.status).toBe(401);
  });

  it('проходит полный цикл: создание → ставка → завершение', async () => {
    const customer = await register('customer');
    const carrier = await register('carrier');

    const created = await authed(customer.token).post('/api/auctions', auctionBody());
    expect(created.status).toBe(201);
    const id = created.body.auction._id;

    const active = await authed(carrier.token).get('/api/auctions/active');
    expect(active.body).toHaveLength(1);

    const tooHigh = await authed(carrier.token).post(`/api/auctions/${id}/bid`, { amount: 95000 });
    expect(tooHigh.status).toBe(400);

    const bid = await authed(carrier.token).post(`/api/auctions/${id}/bid`, { amount: 85000 });
    expect(bid.status).toBe(200);
    expect(bid.body.auction.currentPrice).toBe(85000);

    const done = await authed(customer.token).post(`/api/auctions/${id}/complete`);
    expect(done.status).toBe(200);
    expect(done.body.auction.status).toBe('completed');

    const notes = await authed(carrier.token).get('/api/notifications');
    expect(notes.body.some((n) => n.title === 'Вы выиграли аукцион')).toBe(true);
  });

  it('перевозчик не может создать аукцион, заказчик не может ставить', async () => {
    const customer = await register('customer');
    const carrier = await register('carrier');
    expect((await authed(carrier.token).post('/api/auctions', auctionBody())).status).toBe(403);

    const { body } = await authed(customer.token).post('/api/auctions', auctionBody());
    const bid = await authed(customer.token).post(`/api/auctions/${body.auction._id}/bid`, { amount: 1000 });
    expect(bid.status).toBe(403);
  });

  it('приглашённый перевозчик может ставить в приватном аукционе, чужой — не видит его', async () => {
    const customer = await register('customer');
    const invited = await register('carrier');
    const stranger = await register('carrier');

    const { body } = await authed(customer.token).post('/api/auctions', auctionBody({
      accessType: 'private',
      allowedCarriers: [invited.user.id],
    }));
    const id = body.auction._id;

    expect((await authed(stranger.token).get('/api/auctions/active')).body).toHaveLength(0);
    expect((await authed(stranger.token).get(`/api/auctions/${id}`)).status).toBe(404);
    expect((await authed(stranger.token).post(`/api/auctions/${id}/bid`, { amount: 80000 })).status).toBe(404);

    const ok = await authed(invited.token).post(`/api/auctions/${id}/bid`, { amount: 80000 });
    expect(ok.status).toBe(200);
  });

  it('несуществующий id даёт 404, а не ошибку сервера', async () => {
    const carrier = await register('carrier');
    expect((await authed(carrier.token).get('/api/auctions/123')).status).toBe(404);
    expect((await authed(carrier.token).post('/api/auctions/123/bid', { amount: 5000 })).status).toBe(404);
  });
});
