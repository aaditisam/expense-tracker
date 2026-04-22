export function validateExpense(body) {
  const errors = [];

  // amount
  const amount = parseFloat(body.amount);
  if (body.amount === undefined || body.amount === "") {
    errors.push("amount is required");
  } else if (isNaN(amount) || amount <= 0) {
    errors.push("amount must be a positive number");
  } else if (!/^\d+(\.\d{1,2})?$/.test(String(body.amount).trim())) {
    errors.push("amount must have at most 2 decimal places");
  }

  // category
  if (!body.category || !body.category.trim()) {
    errors.push("category is required");
  } else if (body.category.trim().length > 50) {
    errors.push("category must be 50 characters or fewer");
  }

  // description
  if (!body.description || !body.description.trim()) {
    errors.push("description is required");
  } else if (body.description.trim().length > 255) {
    errors.push("description must be 255 characters or fewer");
  }

  // date (YYYY-MM-DD)
  if (!body.date) {
    errors.push("date is required");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push("date must be in YYYY-MM-DD format");
  } else {
    const d = new Date(body.date);
    if (isNaN(d.getTime())) errors.push("date is not a valid calendar date");
  }

  return errors;
}
