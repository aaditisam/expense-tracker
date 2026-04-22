import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense, fetchExpenses, resetSubmitStatus,
  selectSubmitStatus, selectSubmitError, selectFilter,
} from "../features/expenses/expensesSlice";
import { getIdempotencyKey, rotateKey } from "../utils/idempotency";

const CATEGORIES = [
  "Food & Dining","Transport","Shopping","Entertainment",
  "Health","Bills & Utilities","Travel","Education","Other",
];

const today = () => new Date().toISOString().split("T")[0];
const EMPTY = { amount: "", category: "", description: "", date: today() };

export default function ExpenseForm() {
  const dispatch = useDispatch();
  const submitStatus = useSelector(selectSubmitStatus);
  const submitError = useSelector(selectSubmitError);
  const filter = useSelector(selectFilter);
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (submitStatus === "succeeded") {
      setForm({ ...EMPTY, date: today() });
      setFieldErrors({});
      rotateKey();
      dispatch(fetchExpenses(filter));
      const timer = setTimeout(() => dispatch(resetSubmitStatus()), 2500);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, dispatch, filter]);

  function validate() {
    const errs = {};
    const amount = parseFloat(form.amount);
    if (!form.amount) errs.amount = "Required";
    else if (isNaN(amount) || amount <= 0) errs.amount = "Must be positive";
    else if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) errs.amount = "Max 2 decimal places";
    if (!form.category) errs.category = "Required";
    if (!form.description.trim()) errs.description = "Required";
    if (!form.date) errs.date = "Required";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
    if (submitStatus !== "idle") dispatch(resetSubmitStatus());
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    dispatch(addExpense({ payload: form, idempotencyKey: getIdempotencyKey() }));
  }

  const isLoading = submitStatus === "loading";

  return (
    <div className="card form-card">
      <h2 className="card-title"><span className="title-icon">✦</span> New Expense</h2>

      {submitStatus === "succeeded" && (
        <div className="alert alert-success">✓ Expense recorded!</div>
      )}
      {submitStatus === "failed" && submitError && (
        <div className="alert alert-error">✗ {submitError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row two-col">
          <div className="field">
            <label htmlFor="amount">Amount (₹)</label>
            <input id="amount" name="amount" type="number" min="0.01" step="0.01"
              placeholder="0.00" value={form.amount} onChange={handleChange}
              className={fieldErrors.amount ? "input-error" : ""} disabled={isLoading} />
            {fieldErrors.amount && <span className="field-error">{fieldErrors.amount}</span>}
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange}
              className={fieldErrors.date ? "input-error" : ""} disabled={isLoading} />
            {fieldErrors.date && <span className="field-error">{fieldErrors.date}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}
            className={fieldErrors.category ? "input-error" : ""} disabled={isLoading}>
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <input id="description" name="description" type="text"
            placeholder="What did you spend on?" maxLength={255}
            value={form.description} onChange={handleChange}
            className={fieldErrors.description ? "input-error" : ""} disabled={isLoading} />
          {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
