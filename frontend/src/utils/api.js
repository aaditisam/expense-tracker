const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.join(", ") || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  getExpenses({ category, sort } = {}) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return request(`/expenses${qs ? `?${qs}` : ""}`);
  },
  createExpense(payload, idempotencyKey) {
    return request("/expenses", {
      method: "POST",
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
      body: JSON.stringify(payload),
    });
  },
};
