import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { getUserToken, getAdminToken, uniqueEmail } from './helpers.js';
 
const newProduct = { name: 'Тестовый мёд', category: 'Мёд', price: 2500, unit: 'кг' };
const newOrder = { name: 'Тестовый мёд', email:uniqueEmail(), quantity:20};

 
describe('Изменение каталога: только admin', () => {
  let userToken;
  let adminToken;
 
  // Выполняется один раз перед всеми тестами этого блока
  beforeAll(async () => {
    userToken = await getUserToken();
    adminToken = await getAdminToken();
  });
 
  it('без токена — 401', async () => {
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.status).toBe(401);
  });
 
  it('покупатель — 403', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newProduct);
    expect(res.status).toBe(403);
  });
 
  it('токен, подписанный чужим ключом, — 401', async () => {
    // Тот же опыт, что с jwt.io в ЛР7: role = admin, но подпись не наша
    const fakeToken = jwt.sign({ sub: '1', role: 'admin' }, 'чужой-секрет');
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(newProduct);
    expect(res.status).toBe(401);
  });
 
  it('админ: создать → изменить → удалить', async () => {
    const auth = `Bearer ${adminToken}`;
 
    const created = await request(app)
      .post('/api/products').set('Authorization', auth).send(newProduct);
    expect(created.status).toBe(201);
    const id = created.body.id;
 
    const updated = await request(app)
      .put(`/api/products/${id}`).set('Authorization', auth)
      .send({ ...newProduct, price: 2700 });
    expect(updated.status).toBe(200);
    expect(Number(updated.body.price)).toBe(2700);   // NUMERIC приходит строкой
 
    const deleted = await request(app)
      .delete(`/api/products/${id}`).set('Authorization', auth)
    expect(deleted.status).toBe(204);

    const getted = await request(app)
      .get(`/api/products/99999`)
    expect(getted.status).toBe(404);
    // ЗАДАНИЕ: DELETE /api/products/${id} с тем же токеном — 204,
    // ЗАДАНИЕ: затем GET /api/products/${id} — 404
  });
 
   it('покупатель не может удалить товар: DELETE /api/products/1', async () => {
    const res = await request(app)
      .delete('/api/products/1')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(403);
  });

  // ЗАДАНИЕ: покупатель не может удалить товар: DELETE /api/products/1 — 403
});

describe('заявки', () => {
 let userToken;
  let adminToken;
 
  // Выполняется один раз перед всеми тестами этого блока
  beforeAll(async () => {
    userToken = await getUserToken();
    adminToken = await getAdminToken();
  });

   it('GET /api/orders без токена — 401', async () => {
    const res = await request(app).get('/api/orders').send(newOrder);
    expect(res.status).toBe(401);
  });

  it('GET /api/orders с токеном покупателя — 403', async () => {
    const res = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${userToken}`)
    .send(newOrder);
    expect(res.status).toBe(403);
  });

   it('GET /api/orders с токеном админа — 200', async () => {
    const res = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(newOrder);
    expect(res.status).toBe(200);
  });
})
 
// ЗАДАНИЕ: describe('Заявки'): GET /api/orders без токена — 401,
// ЗАДАНИЕ: с токеном покупателя — 403, с токеном админа — 200 и массив
