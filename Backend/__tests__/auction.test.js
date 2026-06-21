const request = require('supertest');
const app = require('../server'); 

describe('API аукционов', () => {
  it('должен вернуть список активных аукционов', async () => {
    const res = await request(app)
      .get('/api/auctions/active')
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('должен отклонить ставку без авторизации', async () => {
    const res = await request(app)
      .post('/api/auctions/123/bid')
      .send({ amount: 5000 })
      .expect(401); 
  });
});