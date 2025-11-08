import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import Dropdown from "./components/Dropdown/Dropdown";
import Search from "./components/Search/Search";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData } from "./service";
import {
  setCurrentWeatherInfo,
  setDailyForcast,
  setHourlyForcast,
} from "./reducers/appSlice";
import WMOInterpretation from "./components/WMOInterpretation/WMOInterpretation";
import { LinearLoader } from "./components/Loader/Loader";
import { transformWithEsbuild } from "vite";

const App = () => {
  const dispatch = useDispatch();
  const unit_options = [
    {
      key: "imperial",
      label: "Switch to Imperial",
      selected: false,
      imperial: ["fehrenheit", "mph", "in"],
    },
    {
      key: "metric",
      label: "Switch to Metric",
      selected: true,
      metric: ["celsius", "kmh", "mm"],
    },
    {
      group: "temperature",
      groupLabel: "Temperature",
      options: [
        {
          key: "celsius",
          label: "Celsius (°C)",
          selected: transformWithEsbuild,
        },
        {
          key: "fehrenheit",
          label: "Fehrenheit (°F)",
          selected: false,
        },
      ],
    },
    {
      group: "windSpeed",
      groupLabel: "Wind Speed",
      options: [
        {
          key: "kmh",
          label: "Kilometers per hour (km/h)",
          selected: true,
        },
        {
          key: "mph",
          label: "Miles per hour (mph)",
          selected: false,
        },
      ],
    },
    {
      group: "precipitation",
      groupLabel: "Precipitation",
      options: [
        {
          key: "mm",
          label: "Millimeters (mm)",
          selected: true,
        },
        {
          key: "inches",
          label: "Inches (in)",
          selected: false,
        },
      ],
    },
  ];
  const [unit, setUnit] = useState([]);

  const hourly_forcast = [
    {
      key: "Mon",
      label: "Monday",
    },
    {
      key: "Tue",
      label: "Tuesday",
    },
    {
      key: "Wed",
      label: "Wednesday",
    },
    {
      key: "Thu",
      label: "Thursday",
    },
    {
      key: "Fri",
      label: "Friday",
    },
    {
      key: "Sat",
      label: "Saturday",
    },
    {
      key: "Sun",
      label: "Sunday",
    },
  ];

  const todaysDay = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  const InputPlaceholder = () => {
    return (
      <>
        <img src="assets/images/search-icon.svg" alt="search icon" />
        <span>Search for a place ...</span>
      </>
    );
  };

  const [filteredHourlyForcast, setFilteredHourlyForcast] = useState([]);

  const state = useSelector((state) => state.appReducer);
  const dailyForcast = state.dailyForcast;
  const hourlyForcast = state.hourlyForcast;
  const currentForcast = state.currentWeatherInfo;
  const location = state.locationSelected;

  let feelsLike = currentForcast.apparent_temperature
    ? currentForcast.apparent_temperature + "°"
    : "_";
  let humidity = currentForcast.humidity ? currentForcast.humidity + "%" : "_";
  let wind = currentForcast.windSpeed ? currentForcast.windSpeed + "km/h" : "_";
  let precipitation = currentForcast.precipitation
    ? currentForcast.precipitation + "%"
    : "_";

  const onDaySelect = (day) => {
    const filteredData = hourlyForcast.filter((item) => item.key === day);
    setFilteredHourlyForcast(filteredData);
  };

  const onUnitChange = (val = "metric") => {
    let modified = unit_options?.filter((item) => item.key !== val);
    setUnit(modified);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (state.latitude !== "" || state.longitude !== "") {
        let weatherData = await fetchWeatherData([
          state.longitude,
          state.latitude,
        ]);

        dispatch(setDailyForcast(weatherData.daily));
        dispatch(setHourlyForcast(weatherData.hourly));
        dispatch(setCurrentWeatherInfo(weatherData.current));
      }
    }, 500);
    debugger;
    onUnitChange();
    onDaySelect(todaysDay);
    return () => clearTimeout(delayDebounceFn);
  }, [state.latitude, state.longitude]);

  return (
    <div>
      <header>
        <img src="assets/images/logo.svg" />
        <Dropdown
          options={unit}
          label={"Unit"}
          onChange={(val) => onUnitChange(val)}
          icon={"assets/images/icon-units.svg"}
        />
      </header>
      <div className="title-container">
        <p className="title">How's the sky looking today?</p>
      </div>
      <main className="main-content-container">
        <Search />
        <div className="content-container">
          <div className="left-content">
            {/* Weather Information Section */}
            <div className="weather-info">
              {Object.keys(currentForcast)?.length > 0 ? (
                <>
                  <img
                    src="assets/images/bg-today-large.svg"
                    alt="weather_bg_large"
                  />
                  <div className="location-info">
                    <p>{location}</p>
                    <p>{currentForcast.time}</p>
                  </div>
                  <div className="temperature-info">
                    <img
                      src="public/assets/images/icon-sunny.webp"
                      alt="sunny-icon"
                    />
                    <p>{currentForcast.temperature + "°"}</p>
                  </div>
                </>
              ) : (
                <div className="current-weather-loader">
                  <LinearLoader />
                  <p>Loading...</p>
                </div>
              )}
            </div>
            {/* Temperature Details Section */}
            <div className="temperature-details">
              <div className="detail-item card-item">
                <p>Feels Like</p>
                <p>{feelsLike}</p>
              </div>
              <div className="detail-item card-item">
                <p>Humidity</p>
                <p>{humidity}</p>
              </div>
              <div className="detail-item card-item">
                <p>Wind</p>
                <p>{wind}</p>
              </div>
              <div className="detail-item card-item">
                <p>Precipitation</p>
                <p>{precipitation}</p>
              </div>
            </div>
            {/* Daily Forcast Section */}
            <div className="daily-forcast">
              <p>Daily Forcast</p>
              <div className="forcast-details">
                {(dailyForcast?.length > 0
                  ? dailyForcast
                  : Array.from({ length: 5 })
                ).map((daily, index) => {
                  return (
                    <div
                      key={`daily-forcast-${index}`}
                      className={`forcast-item card-item ${
                        !daily ? "loading" : ""
                      }`}
                    >
                      {daily ? (
                        <>
                          <p>{daily.day}</p>
                          <WMOInterpretation code={daily.weather_code} />
                          <div className="temp-range">
                            <p>{daily.temperature_max + "°"}</p>
                            <p>{daily.temperature_min + "°"}</p>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Hourly Forcast Section */}
          <div className="hourly-forecast">
            <div className="hourly-forecast-header">
              <p>Hourly Forecast</p>
              <Dropdown
                options={hourlyForcast.length > 0 ? hourly_forcast : []}
                onChange={(value) => onDaySelect(value)}
                todaysDay={todaysDay}
              />
            </div>
            <div className="hourly-forcast-content">
              {(hourlyForcast.length > 0
                ? filteredHourlyForcast
                : Array.from({ length: 10 })
              )?.map((item) => {
                return (
                  <div
                    className={`hourly-forcast-item ${!item ? "loading" : ""}`}
                  >
                    {item ? (
                      <>
                        <WMOInterpretation code={item.weather_code} />
                        <p>{item.time_stamp}</p>
                        <p>{`${item.temperature}°`}</p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
