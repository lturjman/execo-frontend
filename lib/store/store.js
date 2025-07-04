import { configureStore } from "@reduxjs/toolkit";
import groups from "./slices/groups";
import members from "./slices/members";
import expenses from "./slices/expenses";
import paybacks from "./slices/paybacks";

const store = configureStore({
  reducer: { groups, members, expenses, paybacks },
});

export default store;
