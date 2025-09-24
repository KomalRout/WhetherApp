import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import "./App.css";
import Dropdown from "./components/Dropdown";

const App = () => {
  const unit_options = [
    { value: "celsius", label: "Celsius", icon: "assets/images/celsius.svg" },
    {
      value: "fahrenheit",
      label: "Fahrenheit",
      icon: "assets/images/fahrenheit.svg",
    },
  ];

  const temperature_details = [
    { label: "Feels Like", value: "18°" },
    { label: "Humidity", value: "60%" },
    { label: "Wind", value: "10 km/h" },
    { label: "Precipitation", value: "20%" },
  ];

  const daily_forcast = [
    {
      day: "Wed",
      icon: "public/assets/images/icon-sunny.webp",
      max_temp: "22°",
      min_temp: "15°",
    },
    {
      day: "Thu",
      icon: "public/assets/images/icon-snow.webp",
      max_temp: "19°",
      min_temp: "14°",
    },
    {
      day: "Fri",
      icon: "public/assets/images/icon-rain.webp",
      max_temp: "21°",
      min_temp: "16°",
    },
    {
      day: "Sat",
      icon: "public/assets/images/icon-partly-cloudy.webp",
      max_temp: "23°",
      min_temp: "17°",
    },
    {
      day: "Sun",
      icon: "public/assets/images/icon-sunny.webp",
      max_temp: "24°",
      min_temp: "18°",
    },
    {
      day: "Mon",
      icon: "public/assets/images/icon-storm.webp",
      max_temp: "20°",
      min_temp: "15°",
    },
    {
      day: "Tue",
      icon: "public/assets/images/icon-storm.webp",
      max_temp: "21°",
      min_temp: "16°",
    },
  ];

  const week_options = [
    { label: "Monday", value: "Mon", id: "Mon" },
    { label: "Monday", value: "Mon", id: "Mon" },
    { label: "Monday", value: "Mon", id: "Mon" },
  ];

  const hourly_forcast = [
    {
      time_stamp: "3 PM",
      icon: "public/assets/images/icon-sunny.webp",
      temp: "22°",
    },
    {
      time_stamp: "3 PM",
      icon: "public/assets/images/icon-sunny.webp",
      temp: "22°",
    },
    {
      time_stamp: "3 PM",
      icon: "public/assets/images/icon-sunny.webp",
      temp: "22°",
    },
    {
      time_stamp: "3 PM",
      icon: "public/assets/images/icon-sunny.webp",
      temp: "22°",
    },
    {
      time_stamp: "3 PM",
      icon: "public/assets/images/icon-sunny.webp",
      temp: "22°",
    },
  ];
  const InputPlaceholder = () => {
    return (
      <>
        <img src="assets/images/search-icon.svg" alt="search icon" />
        <span>Search for a place ...</span>
      </>
    );
  };
  return (
    <div>
      <header>
        <img src="assets/images/logo.svg" />
        <Dropdown
          options={unit_options}
          label={"Unit"}
          icon={"assets/images/icon-units.svg"}
        />
      </header>
      <div className="title-container">
        <p className="title">How's the sky looking today?</p>
      </div>
      <main className="main-content-container">
        <div className="search-container">
          <input
            id="search-input"
            name="search-input"
            className="search-input"
            type="search"
            placeholder="Search for a place..."
          />
          <button className="search-btn">Search</button>
        </div>
        <div className="content-container">
          <div className="left-content">
            {/* Weather Information Section */}
            <div className="weather-info">
              <img
                src="assets/images/bg-today-large.svg"
                alt="weather_bg_large"
              />
              <div className="location-info">
                <p>Berlin,Germany</p>
                <p>Tuesday, Aug 5, 2025</p>
              </div>
              <div className="temperature-info">
                <img
                  src="public/assets/images/icon-sunny.webp"
                  alt="sunny-icon"
                />
                <p>20</p>
              </div>
            </div>
            {/* Temperature Details Section */}
            <div className="temperature-details">
              {temperature_details.map((detail) => (
                <div className="detail-item card-item" key={detail.label}>
                  <p>{detail.label}</p>
                  <p>{detail.value}</p>
                </div>
              ))}
            </div>
            {/* Daily Forcast Section */}
            <div className="daily-forcast">
              <p>Daily Forcast</p>
              <div className="forcast-details">
                {daily_forcast.map((day) => (
                  <div className="forcast-item card-item" key={day.day}>
                    <p>{day.day}</p>
                    <img src={day.icon} alt={`${day.day}-icon`} />
                    <div className="temp-range">
                      <p>{day.max_temp}</p>
                      <p>{day.min_temp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hourly-forecast">
            <div className="hourly-forecast-header">
              <p>Hourly Forecast</p>
              <Dropdown options={week_options} />
            </div>
            {hourly_forcast?.map((item) => (
              <div className="hourly-forcast-item">
                <img src={item.icon} />
                <p>{item.time_stamp}</p>
                <p>{item.temp}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
