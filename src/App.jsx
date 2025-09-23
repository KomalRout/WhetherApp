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
      <main className="content-container">
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
                <img src="assets/images/icon-sunny.webp" alt="sunny-icon" />
                <p>20</p>
              </div>
            </div>
          </div>
          <div className="characteristics">
            <p>Feels Like</p>
            <p>Humidity</p>
            <p>Wind</p>
            <p>Precipitation</p>
          </div>
          <p>Daily Forcast</p>
          <div>{/* Future daily forecast components will go here */}</div>
        </div>
      </main>
      <aside></aside>
    </div>
  );
};

export default App;
