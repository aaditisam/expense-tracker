// In-memory store (no DB)
let expenses = [];
let idempotencyMap = new Map();

import { v4 as uuidv4 } from "uuid";

// Convert decimal rupee string -> integer paise
export function rupeesToPaise(rupeeStr) {
  const n = Math.round(parseFloat(rupeeStr) * 100);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Invalid amount");
  return n;
}

// Convert integer paise -> decimal rupee string (2 decimals)
export function paiseToRupees(paise) {
  return (paise / 100).toFixed(2);
}

export function createExpense({ idempotency_key, amount, category, description, date }) {
  // Idempotency: return existing if same key
  if (idempotency_key && idempotencyMap.has(idempotency_key)) {
    return { created: false, expense: idempotencyMap.get(idempotency_key) };
  }

  const id = uuidv4();
  const paise = rupeesToPaise(amount);
  const now = new Date().toISOString();

  const newExpense = {
    id,
    idempotency_key: idempotency_key ?? null,
    amount: paise,
    category: category.trim(),
    description: description.trim(),
    date,
    created_at: now,
  };

  expenses.push(newExpense);

  const formatted = format(newExpense);

  if (idempotency_key) {
    idempotencyMap.set(idempotency_key, formatted);
  }

  return { created: true, expense: formatted };
}

export function listExpenses({ category, sort } = {}) {
  let result = [...expenses];

  if (category) {
    result = result.filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (sort === "date_desc") {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return result.map(format);
}

export function getCategories() {
  const categories = [...new Set(expenses.map((e) => e.category))];
  return categories.sort();
}

function format(row) {
  return {
    id: row.id,
    amount: paiseToRupees(row.amount),
    category: row.category,
    description: row.description,
    date: row.date,
    created_at: row.created_at,
  };
}