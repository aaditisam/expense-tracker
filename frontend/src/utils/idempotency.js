const STORAGE_KEY = "expense_idempotency_key";

export function getIdempotencyKey() {
  let key = sessionStorage.getItem(STORAGE_KEY);
  if (!key) key = rotateKey();
  return key;
}

export function rotateKey() {
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(STORAGE_KEY, key);
  return key;
}
