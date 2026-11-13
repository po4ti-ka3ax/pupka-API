import express from "express";
import cors from 'cors';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';   
import helmet from 'helmet';
import categoriesRouter from './routes/categories.js';
import { logger } from "./middleware/loger.js";
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './db/pool.js';

const app = express();

const VERSION = (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7);

app.set('trust proxy', 1);
 
app.use(helmet());

// Сначала CORS и парсер тела запросов

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(cors({
  origin(origin, callback) {
    // запросы без Origin (curl, Postman, тесты Supertest) пропускаем
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false); // браузер с чужого сайта не получит ответ
  },
}));

app.use(express.json({ limit: '100kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger);
}

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok', version: VERSION });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'unavailable', version: VERSION });
  }
});

app.get("/api/about", (req, res) => {
  res.json({ name: "АгроМаркет", version:"1.0", author: "Повышев Дмитрий Владимирович" });
});

app.use('/api/categories', categoriesRouter);   
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use(errorHandler);

export default app;