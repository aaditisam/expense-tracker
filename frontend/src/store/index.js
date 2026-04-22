import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "../features/expenses/expensesSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
});
