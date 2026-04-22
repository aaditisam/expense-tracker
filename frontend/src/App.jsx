import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, selectFilter } from "./features/expenses/expensesSlice";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseList from "./components/ExpenseList";
import CategorySummary from "./components/CategorySummary";

export default function App() {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);

  useEffect(() => {
    dispatch(fetchExpenses(filter));
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">₹</span>
            <span className="logo-text"><strong>Track</strong></span>
          </div>
          <p className="header-sub">Personal expense tracker</p>
        </div>
      </header>

      <main className="main-content">
        <div className="layout">
          <aside className="sidebar">
            <ExpenseForm />
            <CategorySummary />
          </aside>

          <section className="content-area">
            <ExpenseFilters />
            <ExpenseList />
          </section>
        </div>
      </main>
    </div>
  );
}
