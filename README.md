## 🚀 Live Demo

Frontend: https://expense-tracker-theta-ochre-55.vercel.app  
Backend: https://expense-tracker-u9u2.onrender.com/api


# PaisaTrack — Expense Tracker

A minimal full-stack personal expense tracker with a Node.js/Express backend and React + Redux Toolkit frontend.

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express app entry
│   │   ├── routes.js         # API route handlers
│   │   ├── expenses.js       # Business logic + in-memory store
│   │   ├── validation.js     # Input validation
│   │   └── expenses.test.js  # Integration tests
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── store/
    │   │   └── index.js              # Redux store
    │   ├── features/expenses/
    │   │   └── expensesSlice.js      # Thunks, reducers, selectors
    │   ├── components/
    │   │   ├── ExpenseForm.jsx       # Add expense form
    │   │   ├── ExpenseFilters.jsx    # Category + sort controls
    │   │   ├── ExpenseList.jsx       # Table + totals
    │   │   └── CategorySummary.jsx  # Breakdown by category
    │   ├── utils/
    │   │   ├── api.js                # Fetch wrapper
    │   │   └── idempotency.js        # Client-side idempotency key
    │   └── styles/
    │       └── global.css
    └── package.json
```

---

## API

| Method | Path                     | Description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| POST   | /api/expenses            | Create a new expense                        |
| GET    | /api/expenses            | List expenses (`?category=&sort=date_desc`) |
| GET    | /api/expenses/categories | List distinct categories                    |
| GET    | /health                  | Health check                                |

### POST /api/expenses

**Request headers:**

- `Idempotency-Key: <uuid>` _(optional but recommended)_

**Request body:**

```json
{
  "amount": "250.50",
  "category": "Food & Dining",
  "description": "Lunch at Meghana Foods",
  "date": "2024-04-22"
}
```

**Response:** `201 Created` (or `200 OK` if idempotency key matched):

```json
{
  "id": "...",
  "amount": "250.50",
  "category": "Food & Dining",
  "description": "Lunch at Meghana Foods",
  "date": "2024-04-22",
  "created_at": "2024-04-22T10:30:00.000Z"
}
```

---

## Key Design Decisions

### Money handling

Amount is stored as **integer paise** (1 INR = 100 paise) in SQLite using `INTEGER`. This avoids all floating-point representation errors. The API accepts and returns decimal strings (`"250.50"`), converting at the boundary. A regex validation (`/^\d+(\.\d{1,2})?$/`) rejects inputs with more than 2 decimal places before they reach the DB.

### Idempotency

The `POST /expenses` endpoint accepts an optional `Idempotency-Key` request header. The key is stored in a `UNIQUE` column; a duplicate key returns the original record with `200 OK` instead of creating a duplicate. The frontend generates a key per form submission using `sessionStorage` and rotates it on success. This means:

- Accidental double-clicks → same key → no duplicate
- Page refresh before submit → same session key → safe to retry
- Page refresh after success → new session → fresh key

### Persistence

Used an **in-memory data store** instead of SQLite.

Reason:
- Avoided native dependency issues (`better-sqlite3`) in restricted environments
- Simplified setup and ensured smooth deployment on Render

Trade-off:
- Data resets when the server restarts

Design choice:
The architecture cleanly separates data logic, so replacing this with SQLite or PostgreSQL would require minimal changes.

### Frontend state

Redux Toolkit manages all server state (expenses, filters, submit lifecycle).

Optimizations:
- Avoided unnecessary refetches by updating local state on successful mutations
- Prevented duplicate UI entries by respecting backend idempotency responses

This results in a faster and smoother user experience.

---
## Deployment

- **Frontend** deployed on Vercel
- **Backend** deployed on Render

Notes:
- Backend may take ~5–10 seconds to respond after inactivity (cold start)
- Frontend communicates with backend via environment variable (`VITE_API_URL`)

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover: money conversion, idempotency correctness, category filtering, and date sort order.

---

## Trade-offs Due to Time Constraints

- Used in-memory storage instead of a persistent database
- Limited test coverage to core functionality
- Did not implement pagination or advanced filtering
- Minimal UI animations to focus on core functionality

---

## What Was Intentionally Not Implemented

- Authentication / user accounts
- Edit or delete expenses
- Persistent database (SQLite/Postgres)
- Pagination or infinite scrolling
- Advanced analytics (charts, trends)
