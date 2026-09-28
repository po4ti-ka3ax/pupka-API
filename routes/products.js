import { Router } from "express";
import { products } from "../data/product.js";
const router = Router();
// Пути — ОТНОСИТЕЛЬНО точки подключения роутера:
// '/' -> /api/products
// '/:id' -> /api/products/:id
router.get("/", (req, res) => {
  const search = (req.query.search || "").toLowerCase();
  const filteredProducts = products.filter((p) => {
    return p.name.toLowerCase().includes(search);
  });
  res.json(filteredProducts);
});
router.get("/:id", (req, res) => {
  const product = products.find((p) => String(p.id) === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }
  res.json(product);
});


export default router;
