// Simple integration tests for expense service
import { createExpense, listExpenses, rupeesToPaise, paiseToRupees } from "./expenses.js";
// import { closeDb, getDb } from "./db.js";

// Use in-memory DB for tests
process.env.TEST = "1";

describe("Money conversion", () => {
  test("rupeesToPaise converts correctly", () => {
    expect(rupeesToPaise("10.50")).toBe(1050);
    expect(rupeesToPaise("100")).toBe(10000);
    expect(rupeesToPaise("0.99")).toBe(99);
  });

  test("paiseToRupees converts correctly", () => {
    expect(paiseToRupees(1050)).toBe("10.50");
    expect(paiseToRupees(10000)).toBe("100.00");
  });

  test("rupeesToPaise throws on invalid input", () => {
    expect(() => rupeesToPaise("-5")).toThrow();
    expect(() => rupeesToPaise("abc")).toThrow();
    expect(() => rupeesToPaise("0")).toThrow();
  });
});

describe("createExpense idempotency", () => {
  // afterAll(() => closeDb());

  test("same idempotency key returns same record", () => {
    const key = `test-key-${Date.now()}`;
    const payload = {
      idempotency_key: key,
      amount: "250.00",
      category: "Food",
      description: "Lunch",
      date: "2024-04-01",
    };
    const first = createExpense(payload);
    const second = createExpense(payload);

    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(first.expense.id).toBe(second.expense.id);
    expect(first.expense.amount).toBe("250.00");
  });

  test("different keys create different records", () => {
    const makePayload = (key) => ({
      idempotency_key: key,
      amount: "100.00",
      category: "Transport",
      description: "Auto",
      date: "2024-04-02",
    });
    const a = createExpense(makePayload(`key-a-${Date.now()}`));
    const b = createExpense(makePayload(`key-b-${Date.now()}`));
    expect(a.expense.id).not.toBe(b.expense.id);
  });
});

describe("listExpenses filtering and sorting", () => {
  // afterAll(() => closeDb());

  test("filters by category case-insensitively", () => {
    createExpense({ amount: "50", category: "Groceries", description: "Veggies", date: "2024-03-01" });
    createExpense({ amount: "200", category: "Entertainment", description: "Movie", date: "2024-03-02" });

    const groceries = listExpenses({ category: "groceries" });
    expect(groceries.every((e) => e.category === "Groceries")).toBe(true);
  });

  test("sorts by date descending when sort=date_desc", () => {
    const results = listExpenses({ sort: "date_desc" });
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].date >= results[i + 1].date).toBe(true);
    }
  });
});
