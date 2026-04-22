import { useDispatch, useSelector } from "react-redux";
import {
  setFilter, fetchExpenses,
  selectFilter, selectCategories,
} from "../features/expenses/expensesSlice";

export default function ExpenseFilters() {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const categories = useSelector(selectCategories);

  function handleCategory(e) {
    const newFilter = { ...filter, category: e.target.value };
    dispatch(setFilter(newFilter));
    dispatch(fetchExpenses(newFilter));
  }

  function handleSort(e) {
    const newFilter = { ...filter, sort: e.target.value };
    dispatch(setFilter(newFilter));
    dispatch(fetchExpenses(newFilter));
  }

  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label htmlFor="filter-category">Filter</label>
        <select id="filter-category" value={filter.category} onChange={handleCategory}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-sort">Sort</label>
        <select id="filter-sort" value={filter.sort} onChange={handleSort}>
          <option value="date_desc">Newest First</option>
          <option value="">Default</option>
        </select>
      </div>
    </div>
  );
}
