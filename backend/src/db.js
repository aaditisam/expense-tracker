// import Database from "better-sqlite3";
// import path from "path";
// import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const DB_PATH = path.join(__dirname, "..", "expenses.db");

// let db;

// export function getDb() {
//   if (!db) {
//     db = new Database(DB_PATH);
//     db.pragma("journal_mode = WAL");
//     db.pragma("foreign_keys = ON");
//     initSchema(db);
//   }
//   return db;
// }

// function initSchema(db) {
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS expenses (
//       id          TEXT PRIMARY KEY,
//       idempotency_key TEXT UNIQUE,
//       amount      INTEGER NOT NULL,
//       category    TEXT NOT NULL,
//       description TEXT NOT NULL,
//       date        TEXT NOT NULL,
//       created_at  TEXT NOT NULL DEFAULT (datetime('now'))
//     );

//     CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
//     CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
//   `);
// }

// export function closeDb() {
//   if (db) {
//     db.close();
//     db = null;
//   }
// }
