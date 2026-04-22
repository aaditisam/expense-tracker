import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async ({ category, sort } = {}, { rejectWithValue }) => {
    try {
      return await api.getExpenses({ category, sort });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addExpense = createAsyncThunk(
  "expenses/add",
  async ({ payload, idempotencyKey }, { rejectWithValue }) => {
    try {
      return await api.createExpense(payload, idempotencyKey);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create expense");
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    status: "idle",
    submitStatus: "idle",
    error: null,
    submitError: null,
    filter: { category: "", sort: "date_desc" },
  },
  reducers: {
    setFilter(state, action) {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetSubmitStatus(state) {
      state.submitStatus = "idle";
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchExpenses.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload; })
      .addCase(fetchExpenses.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(addExpense.pending, (state) => { state.submitStatus = "loading"; state.submitError = null; })
      .addCase(addExpense.fulfilled, (state) => { state.submitStatus = "succeeded"; })
      .addCase(addExpense.rejected, (state, action) => { state.submitStatus = "failed"; state.submitError = action.payload; });
  },
});

export const { setFilter, resetSubmitStatus } = expensesSlice.actions;

export const selectExpenses = (state) => state.expenses.items;
export const selectStatus = (state) => state.expenses.status;
export const selectSubmitStatus = (state) => state.expenses.submitStatus;
export const selectSubmitError = (state) => state.expenses.submitError;
export const selectFilter = (state) => state.expenses.filter;
export const selectError = (state) => state.expenses.error;
export const selectTotal = (state) =>
  state.expenses.items.reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2);
export const selectCategories = (state) =>
  [...new Set(state.expenses.items.map((e) => e.category))].sort();

export default expensesSlice.reducer;
