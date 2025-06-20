import { configureStore } from "@reduxjs/toolkit";
import groups from "./slices/groups";
import members from "./slices/members";

const store = configureStore({
  reducer: { groups, members },
});

export default store;
