import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';


describe('Валидация', () => {
  test('регистрация с некорректным e-mail → 400 и поле email в details', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email: 'не-почта', password: '12345678' });

    expect(res.status).toBe(400);
    expect(res.body.details.map((d) => d.field)).toContain('email');
  });

  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL, 
        password: process.env.ADMIN_PASSWORD
      });
    
    // Сохраняем полученный токен
    token = res.body.token;
    console.log(token)
  });

  test('нельзя зарегистрироваться админом через поле role', async () => {
    const email = `role${Date.now()}@test.kz`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Хакер', email, password: '12345678', role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('user');
    // ЗАДАНИЕ: проверьте в ответе или в базе, что role = 'buyer' (или ваша роль по умолчанию)
  });

  test('товар с отрицательной ценой → 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Мёд', price: -500, category: 'Мёд' });

    expect(res.status).toBe(400);
  });

  test('GET /api/products/abc → 400, а не 500', async () => {
    const res = await request(app).get('/api/products/abc');
    expect(res.status).toBe(400);
  });

 test('пароль из 7 символов → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email: 'shortpass@test.kz', password: '1234567' });

    expect(res.status).toBe(400);
  });

  test('PATCH товара с пустым телом {} → 400', async () => {
    const res = await request(app)
      .post('/api/products/')
      .send({name: 'x'.repeat(200_000), price:100, category:"Мёд"});

    expect(res.status).toBe(413);
  });

  // ЗАДАНИЕ: пароль из 7 символов → 400
  // ЗАДАНИЕ: PATCH товара с пустым телом {} → 400
  // ЗАДАНИЕ: тело больше 100 КБ → 413 (подсказка: 'x'.repeat(200_000))
});
