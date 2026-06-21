const request = require('supertest');
const app = require('../server');

describe('API заказов (перевозок)', () => {
  it('должен создать новый заказ при валидных данных', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer test-token') 
      .send({
        from: 'Москва',
        to: 'Казань',
        cargo: 'Стройматериалы',
        weight: 500,
        price: 30000
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.from).toBe('Москва');
    expect(res.body.to).toBe('Казань');
  });

  it('должен отклонить создание заказа без обязательных полей', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer test-token')
      .send({
        from: 'Москва'
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});