# Expense Tracker Fullstack (React + Express + Sequelize + Postgres)

Aplikasi Expense Tracker sederhana dengan:
- Frontend: React + Vite + Tailwind + Router + Axios
- Backend: Express + Sequelize + Postgres
- Fitur: CRUD Categories & Transactions
- Relasi: Category (1) -> (Many) Transactions
- Multi-currency: IDR / USD / EUR / KRW / JPY / GBP
- Amount support desimal (contoh: 99.74 / 99,74)

---

## 1. Requirements
Pastikan sudah install:
- Node.js (disarankan LTS)
- PostgreSQL + pgAdmin
- Git (opsional)

---

## 2. Struktur Folder
expense-tracker-fullstack/
expense-tracker-server/
expense-tracker-client/


---

## 3. Setup Database (pgAdmin)
1. Buka pgAdmin
2. Buat database baru:
   - Nama: `expense_tracker_db`
3. Pastikan port Postgres kamu sesuai `.env` (contoh 5433 kalau 5432 sudah dipakai)

---

## 4. Setup Backend (Server)
Masuk folder server:
```bash
cd expense-tracker-server

install dependency : 
npm install

Buat file .env : 
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_NAME=expense_tracker_db
DB_USER=postgres
DB_PASS=Postgres123!

jalankan migration : 
npx sequelize-cli db:migrate --config config/config.cjs

jalankan server :
npm run dev

Cek API:
http://localhost:3000/
http://localhost:3000/categories
http://localhost:3000/transactions

Setup Frontend : 
cd expense-tracker-client

install depemdency :
npm install

run client :
npm run dev

Buka web:

http://localhost:5173

6. Fitur
Categories
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id

Transactions
GET /transactions (include Category)
GET /transactions?categoryId=... (filter)
POST /transactions (title, amount, date, categoryId, currency)
PUT /transactions/:id
DELETE /transactions/:id

