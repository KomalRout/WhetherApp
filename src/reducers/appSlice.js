// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  longitude: "",
  latitude: "",
  selectedCity: "",
  dailyForcast: [],
  hourlyForcast: [],
  currentWeatherInfo: {},
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLatLong: (state, action) => {
      state.longitude = action.payload.longitude;
      state.latitude = action.payload.latitude;
    },
    setCurrentWeatherInfo: (state, action) => {
      state.currentWeatherInfo = action.payload;
    },
    setDailyForcast: (state, action) => {
      const { time, temperature_max, temperature_min, weather_code } =
        action.payload;
      state.dailyForcast = time?.map((val, index) => {
        return {
          day: val,
          temperature_max: Math.round(temperature_max[index]),
          temperature_min: Math.round(temperature_min[index]),
          weather_code: weather_code[index],
        };
      });
    },
    setHourlyForcast: (state, action) => {
      const { time, temperature, weather_code } = action.payload;
      state.hourlyForcast = time?.map((val, index) => {
        return {
          time_stamp: val?.split(",")[1]?.trim(),
          key: val?.split(",")[0]?.trim(),
          temperature: Math.round(temperature[index]),
          weather_code: weather_code[index],
        };
      });
    },
  },
});

export const {
  setLatLong,
  setHourlyForcast,
  setDailyForcast,
  setCurrentWeatherInfo,
} = appSlice.actions;

export default appSlice.reducer;
