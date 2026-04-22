import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", router);

// 404 handler
app.use((_req, res) => res.status(404).json({ errors: ["Not found"] }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ errors: ["Internal server error"] });
});

app.listen(PORT, () => {
  console.log(`✅ Expense Tracker API running at http://localhost:${PORT}`);
});

export default app;
