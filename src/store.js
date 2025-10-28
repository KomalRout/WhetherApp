// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appSlice"; // Example slice

export const store = configureStore({
  reducer: {
    appReducer: appReducer, // Add your reducers here
  },
});
