// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  historicalData: [],
  longitude: "",
  latitudue: "",
  selectedCity: "",
  dailyForcast: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setHistoricalData: (state, action) => {
      state.historicalData = action.payload;
    },
    setLatLong: (state, action) => {
      state.longitude = action.payload.longitude;
      state.latitudue = action.payload.latitude;
    },
  },
});

export const { setHistoricalData, setLatLong } = appSlice.actions;

export default appSlice.reducer;
