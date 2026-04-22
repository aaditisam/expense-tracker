import { useSelector } from "react-redux";
import { selectExpenses } from "../features/expenses/expensesSlice";

const CATEGORY_COLORS = {
  "Food & Dining": "#f97316",
  "Transport": "#3b82f6",
  "Shopping": "#ec4899",
  "Entertainment": "#8b5cf6",
  "Health": "#10b981",
  "Bills & Utilities": "#ef4444",
  "Travel": "#06b6d4",
  "Education": "#f59e0b",
  "Other": "#6b7280",
};

export default function CategorySummary() {
  const expenses = useSelector(selectExpenses);

  if (expenses.length === 0) return null;

  const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="card summary-card">
      <h2 className="card-title"><span className="title-icon">◑</span> By Category</h2>
      <div className="summary-list">
        {sorted.map(([cat, amt]) => {
          const pct = grandTotal > 0 ? (amt / grandTotal) * 100 : 0;
          const color = CATEGORY_COLORS[cat] || "#6b7280";
          return (
            <div key={cat} className="summary-item">
              <div className="summary-item-top">
                <span className="summary-cat" style={{ color }}>
                  <span className="cat-dot" style={{ background: color }} />
                  {cat}
                </span>
                <span className="summary-amt">
                  ₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="pct-label">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
