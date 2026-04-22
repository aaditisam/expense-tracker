import { Router } from "express";
import { createExpense, listExpenses, getCategories } from "./expenses.js";
import { validateExpense } from "./validation.js";

const router = Router();

// POST /expenses
router.post("/expenses", (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const idempotency_key = req.headers["idempotency-key"] || null;

    const { created, expense } = createExpense({
      idempotency_key,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
      date: req.body.date,
    });

    return res.status(created ? 201 : 200).json(expense);
  } catch (err) {
    console.error("POST /expenses error:", err);
    return res.status(500).json({ errors: ["Internal server error"] });
  }
});

// GET /expenses
router.get("/expenses", (req, res) => {
  try {
    const { category, sort } = req.query;
    const expenses = listExpenses({ category, sort });
    return res.json(expenses);
  } catch (err) {
    console.error("GET /expenses error:", err);
    return res.status(500).json({ errors: ["Internal server error"] });
  }
});

// GET /expenses/categories  — helper for the frontend filter dropdown
router.get("/expenses/categories", (req, res) => {
  try {
    const categories = getCategories();
    return res.json(categories);
  } catch (err) {
    console.error("GET /expenses/categories error:", err);
    return res.status(500).json({ errors: ["Internal server error"] });
  }
});

export default router;
