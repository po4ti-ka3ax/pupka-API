import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/categories", () => {
  it("возвращает массив категорий с количеством", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(typeof res.body[0].count).toBe("number"); // ::int — число, а не строка
  });


  it("сумма count по всем категориям равна общему количеству продуктов", async () => {
    const [categoriesRes, productsRes] = await Promise.all([
      request(app).get("/api/categories"),
      request(app).get("/api/products"),
    ]);

    expect(categoriesRes.status).toBe(200);
    expect(productsRes.status).toBe(200);

    const totalCategoriesCount = categoriesRes.body.reduce(
      (sum, c) => sum + c.count,
      0,
    );

    expect(totalCategoriesCount).toBe(productsRes.body.length);

  });
});
