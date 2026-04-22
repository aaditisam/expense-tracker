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

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express app entry
│   │   ├── routes.js         # API route handlers
│   │   ├── expenses.js       # Business logic + DB queries
│   │   ├── db.js             # SQLite connection + schema
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

**SQLite via `better-sqlite3`** — synchronous, zero-config, single-file DB that survives restarts. Appropriate for a personal tool where concurrent write load is negligible. WAL mode enabled for better read concurrency. Would swap for PostgreSQL in a multi-user or deployed scenario.

### Frontend state

**Redux Toolkit** manages all server state (expense list, filters, submit lifecycle). The filter state lives in Redux so that `ExpenseForm` can trigger a re-fetch with the currently active filters after a successful submission, keeping the list consistent.

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover: money conversion, idempotency correctness, category filtering, and date sort order.

---

## Trade-offs & Intentional Omissions

| Decision                        | Reason                                                                   |
| ------------------------------- | ------------------------------------------------------------------------ |
| No auth                         | Out of scope for a personal tool exercise                                |
| No React Query / SWR            | Redux Toolkit is explicitly required; kept state management in one place |
| SQLite, not Postgres            | Zero-setup; easy to swap later                                           |
| No pagination                   | Small data set; out of scope for the timebox                             |
| No edit/delete                  | Not in the acceptance criteria                                           |
| CSS without a component library | Keeps bundle small; full design control                                  |
