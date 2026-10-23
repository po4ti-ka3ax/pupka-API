## Переменные окружения (.env)
JWT_SECRET      — случайная строка 64 символа (node -e "...randomBytes(32)...")
JWT_EXPIRES_IN  — срок жизни токена, например 2h
ADMIN_EMAIL / ADMIN_PASSWORD — администратор, создаётся командой npm run db:init
 
## Эндпоинты (новые и изменённые)
| Метод  | Путь                 | Доступ  | Ответы             |
|--------|----------------------|---------|--------------------|
| POST   | /api/auth/register   | все     | 201, 400, 409      |
| POST   | /api/auth/login      | все     | 200, 400, 401, 429 |
| GET    | /api/auth/me         | токен   | 200, 401           |
| POST   | /api/products        | admin   | 201, 400, 401, 403 |
| PUT    | /api/products/:id    | admin   | 200, 400, 401, 403, 404 |
| DELETE | /api/products/:id    | admin   | 204, 401, 403, 404 |
| GET    | /api/orders          | admin   | 200, 401, 403      |
| PATCH  | /api/orders/:id      | admin   | 200, 400, 401, 403, 404 |
git


------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   73.75 |    53.84 |   77.27 |   75.36 |                   
 agromarket-server            |   88.23 |       50 |   66.66 |   88.23 |                   
  app.js                      |   88.23 |       50 |   66.66 |   88.23 | 22,37             
 agromarket-server/middleware |      60 |    66.66 |   66.66 |      60 |                   
  auth.js                     |     100 |      100 |     100 |     100 |                   
  errorHandler.js             |   36.36 |       25 |     100 |   36.36 | 11,19-27          
  loger.js                    |       0 |      100 |       0 |       0 | 2-10              
 agromarket-server/routes     |   75.53 |    51.19 |   84.61 |   78.02 |                   
  auth.js                     |      90 |    73.91 |     100 |      90 | 31,58,84          
  orders.js                   |   39.13 |        0 |   33.33 |   39.13 | 25-43,48-67       
  products.js                 |   85.36 |    68.42 |     100 |    92.1 | 13,78,86          
------------------------------|---------|----------|---------|---------|-------------------

![CI](https://github.com/po4ti-ka3ax/pupka-API/actions/workflows/ci.yml/badge.svg)
 
## Тестирование
1. Создать базу `agromarket_test` (pgAdmin или psql)
2. Скопировать `.env` в `.env.test` и указать в нём тестовую базу
3. `npm test` — все тесты, `npm run test:watch` — режим наблюдения,
   `npm run coverage` — отчёт о покрытии (сейчас: Lines ...%)
 
## Правила работы с Git
- Ветка `main` защищена: изменения — только через Pull Request
- PR сливается после зелёного CI и одобрения ревьюера
- Ветки: `feature/...`, `fix/...`; коммиты: feat, fix, test, refactor, docs, ci, chore
