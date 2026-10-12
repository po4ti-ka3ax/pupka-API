import 'dotenv/config'
import express from "express";
import cors from 'cors'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import { logger } from "./middleware/loger.js";
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './db/pool.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json())
app.use(logger)
app.use(errorHandler);





// Маршрут: метод GET + путь '/'

// «Жив ли сервер?» — такой маршрут есть почти в каждом API
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
});


app.get("/api/about", (req, res) => {
  res.json({ name: "АгроМаркет", version:"1.0", author: "Повышев Дмитрий Владимирович" });
});

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)



app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});


app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});

