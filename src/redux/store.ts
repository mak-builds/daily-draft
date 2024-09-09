import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import sharedSlice from "./SharedSlice";

export const rootReducer = combineReducers({
  sharedSlice,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
