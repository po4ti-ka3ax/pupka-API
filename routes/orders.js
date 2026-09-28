import { Router } from "express";
const router = Router();
// Пока храним заявки в памяти: при перезапуске сервера они пропадут.
// В следующей лабораторной переедем в базу данных.
const orders = [];
let nextId = 1;
// GET /api/orders — список заявок (чтобы проверять результат)
router.get("/", (req, res) => {
  res.json(orders);
});
// POST /api/orders — новая заявка
router.post("/", (req, res) => {
  // || {} — защита: если тело не пришло, req.body будет undefined
  const { name, email, phone, quantity, date, comment } = req.body || {};
  if (!name || !email || !quantity) {
    
    return res
      .status(400)
      .json({ error: "Поля name, email и quantity обязательны" });
  }

  if (quantity < 10) {
    return res.status(400).json({ error: "Минимальный объём заказа - 10кг" });
  }

  const order = {
    id: nextId++,
    name,
    email,
    phone,
    date,
    comment,
    quantity: Number(quantity),
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});
export default router;
