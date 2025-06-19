import { configureStore } from "@reduxjs/toolkit";
import groups from "./slices/groups";

const store = configureStore({
  reducer: { groups },
});

export default store;
