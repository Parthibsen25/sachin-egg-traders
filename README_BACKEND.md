# Backend (Node.js + Express + Mongoose)

Quick steps to run locally:

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.

2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm run dev   # requires nodemon (dev)
# or
npm start
```

API endpoints:
- `GET /api/prices` — list prices
- `POST /api/prices` — upsert price object or array of prices
- `POST /api/seed` — seed default prices
