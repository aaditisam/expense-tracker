import { useSelector } from "react-redux";
import { selectExpenses, selectStatus, selectTotal, selectError } from "../features/expenses/expensesSlice";

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

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || "#6b7280";
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ExpenseList() {
  const expenses = useSelector(selectExpenses);
  const status = useSelector(selectStatus);
  const total = useSelector(selectTotal);
  const error = useSelector(selectError);

  if (status === "loading") {
    return (
      <div className="card list-card">
        <div className="loading-rows">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="card list-card">
        <div className="empty-state error-state">
          <span className="empty-icon">⚠</span>
          <p>{error || "Failed to load expenses."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card list-card">
      <div className="list-header">
        <h2 className="card-title"><span className="title-icon">◈</span> Expenses</h2>
        <div className="total-badge">
          <span className="total-label">Total</span>
          <span className="total-amount">₹{parseFloat(total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">◎</span>
          <p>No expenses yet. Add your first one!</p>
        </div>
      ) : (
        <div className="expense-table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th className="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="expense-row">
                  <td className="date-cell">{formatDate(e.date)}</td>
                  <td>
                    <span
                      className="category-pill"
                      style={{ "--pill-color": getCategoryColor(e.category) }}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className="desc-cell">{e.description}</td>
                  <td className="amount-cell">
                    ₹{parseFloat(e.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="summary-footer">
          <span className="count-label">{expenses.length} {expenses.length === 1 ? "entry" : "entries"}</span>
          <span className="summary-total">
            ₹{parseFloat(total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
}
