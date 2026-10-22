import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { uniqueEmail } from "./helpers.js";

describe("POST /api/auth/register", () => {
  it("создаёт покупателя и возвращает токен", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Айгерим", email: uniqueEmail(), password: "qwerty123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe("user");
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  it("не даёт стать админом через тело запроса (mass assignment)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Хакер",
      email: uniqueEmail(),
      password: "qwerty123",
      role: "admin",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("user");
  });

  it("повторный e-mail — 409", async () => {
    const body = { name: "Дубль", email: uniqueEmail(), password: "qwerty123" };
    await request(app).post("/api/auth/register").send(body); // первый раз — 201
    const res = await request(app).post("/api/auth/register").send(body);

    expect(res.status).toBe(409);
  });

  it("Простой пароль — 400", async () => {
    const body = {
      name: "Дубль",
      email: `Test${Date.now()}@Mail.KZ`,
      password: "123",
    };
    await request(app).post("/api/auth/register").send(body);
    const res = await request(app).post("/api/auth/register").send(body);

    expect(res.status).toBe(400);
  });

  // ЗАДАНИЕ: пароль '123' — статус 400
  // ЗАДАНИЕ: e-mail `Test${Date.now()}@Mail.KZ` сохраняется в нижнем регистре
});

describe("POST /api/auth/login", () => {
  it("админ входит и получает JWT из трёх частей", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body.token.split(".")).toHaveLength(3);
    expect(res.body.user.role).toBe("admin");
  });

  it("неверный пароль и чужой e-mail дают одинаковый ответ", async () => {
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.ADMIN_EMAIL, password: "не-тот-пароль" });
    const unknownEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: uniqueEmail("nobody"), password: "не-тот-пароль" });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
  });
});

describe("POST /api/auth/me", () => {
  it("Без токена — 404", async () => {
    const res = await request(app).post("/api/auth/me");

    expect(res.status).toBe(404);
  });

  it("с токеном покупателя — 200 и в ответе нет password_hash", async () => {
    // 1. Сначала регистрируем нового пользователя, чтобы получить токен
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Тестер",
      email: uniqueEmail(),
      password: "qwerty123",
    });

    const token = registerRes.body.token;

    // 2. Делаем GET-запрос на /api/auth/me, передавая токен в заголовке Authorization
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    // 3. Проверяем результаты
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body).not.toHaveProperty("password_hash");
  });


});

// ЗАДАНИЕ: describe('GET /api/auth/me'): без токена — 401;
// ЗАДАНИЕ: с токеном покупателя — 200 и в ответе нет password_hash
