import { configureStore } from "@reduxjs/toolkit";
import groups from "./slices/groups";
import members from "./slices/members";
import expenses from "./slices/expenses";

const store = configureStore({
  reducer: { groups, members, expenses },
});

export default store;
