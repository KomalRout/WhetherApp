import { useEffect, useState } from "react";
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
import APIError from "./components/APIError/APIError";

const App = () => {
  const dispatch = useDispatch();
  const [unitType, setUnitType] = useState("metric");
  const [error, setError] = useState(true);

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
      metric: ["celsius", "kmph", "mm"],
    },
    {
      group: "temperature",
      groupLabel: "Temperature",
      options: [
        {
          key: "celsius",
          label: "Celsius (°C)",
          selected: true,
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
          key: "kmph",
          label: "km/h",
          selected: true,
        },
        {
          key: "mph",
          label: "m/h",
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
          key: "in",
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

  const [selectedDay, setSelectedDay] = useState("_");

  const [filteredHourlyForcast, setFilteredHourlyForcast] = useState([]);
  const [searchFound, setSearchFound] = useState(true);
  const state = useSelector((state) => state.appReducer);
  const dailyForcast = state.dailyForcast;
  const hourlyForcast = state.hourlyForcast;
  const currentForcast = state.currentWeatherInfo;
  const location = state.locationSelected;
  const precipitation_unit = unitType === "metric" ? "mm" : "inch";
  const wind_speed_unit = unitType === "metric" ? "km/h" : "m/h";

  let feelsLike = currentForcast.apparent_temperature
    ? currentForcast.apparent_temperature + " °"
    : "_";
  let humidity = currentForcast.humidity ? currentForcast.humidity + " %" : "_";
  let wind = currentForcast.windSpeed
    ? currentForcast.windSpeed + " " + wind_speed_unit
    : "_";
  let precipitation = currentForcast.precipitation
    ? currentForcast.precipitation + " " + precipitation_unit
    : "_";

  const onDaySelect = (day) => {
    const filteredData = hourlyForcast.filter((item) => item.key === day);

    setSelectedDay(
      hourly_forcast?.filter((item) => item.key === day)[0]?.label || ""
    );
    setFilteredHourlyForcast(filteredData);
  };

  const onUnitChange = (val) => {
    let unit_keys = unit_options?.filter((item) => item.key === val)[0][val];
    let modified = unit_options
      ?.filter((item) => item.key !== val)
      ?.map((item) => {
        if (item?.hasOwnProperty("group")) {
          item.options = item.options?.map((opt) => {
            if (unit_keys?.includes(opt.key)) {
              opt.selected = true;
            } else {
              opt.selected = false;
            }
            return opt;
          });
          return item;
        }
        return item;
      });
    setUnit(modified);
    setUnitType(val);
  };

  useEffect(() => {
    onUnitChange(unitType);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (state.latitude !== "" || state.longitude !== "") {
          let weatherData = await fetchWeatherData([
            state.longitude,
            state.latitude,
            unitType,
          ]);
          dispatch(setDailyForcast(weatherData.daily));
          dispatch(setHourlyForcast(weatherData.hourly));
          dispatch(setCurrentWeatherInfo(weatherData.current));
        }
      } catch (err) {
        setError(true);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [state.latitude, state.longitude, unitType]);

  useEffect(() => {
    if (hourlyForcast.length === 0) return;
    onDaySelect(todaysDay);
  }, [hourlyForcast]);

  return (
    <div>
      <header>
        <img alt="weather-logo" src="assets/images/logo.svg" />
        <Dropdown
          options={unit}
          label={"Unit"}
          onChange={(val) => onUnitChange(val)}
          icon={"assets/images/icon-units.svg"}
        />
      </header>
      {!error ? (
        <section>
          <div className="title-container">
            <p className="title">How's the sky looking today?</p>
          </div>
          <main className="main-content-container">
            <Search searchFound={searchFound} setSearchFound={setSearchFound} />
            {searchFound ? (
              <div className="content-container">
                <div className="left-content">
                  {/* Weather Information Section */}
                  <div className="weather-info-container ">
                    {Object.keys(currentForcast)?.length > 0 ? (
                      <div className="weather-info">
                        <div className="location-info">
                          <p className="location-title">{location}</p>
                          <p className="location-time">{currentForcast.time}</p>
                        </div>
                        <div className="temperature-info">
                          <WMOInterpretation
                            code={currentForcast.weather_code}
                          />
                          <p>{currentForcast.temperature + "°"}</p>
                        </div>
                        {/* </div> */}
                      </div>
                    ) : (
                      <div className="current-weather-loader">
                        <LinearLoader />
                        <p>Loading...</p>
                      </div>
                    )}
                    {/* Temperature Details Section */}
                    <div className="temperature-details">
                      <div className="detail-item card-item">
                        <p className="temp-info-title">Feels Like</p>
                        <p className="temp-info-value">{feelsLike}</p>
                      </div>
                      <div className="detail-item card-item">
                        <p className="temp-info-title">Humidity</p>
                        <p className="temp-info-value">{humidity}</p>
                      </div>
                      <div className="detail-item card-item">
                        <p className="temp-info-title">Wind</p>
                        <p className="temp-info-value">{wind}</p>
                      </div>
                      <div className="detail-item card-item">
                        <p className="temp-info-title">Precipitation</p>
                        <p className="temp-info-value">{precipitation}</p>
                      </div>
                    </div>
                  </div>
                  {/* Daily Forcast Section */}
                  <div className="daily-forcast">
                    <p className="daily-forcast-title">Daily Forcast</p>
                    <div className="forcast-details">
                      {(dailyForcast?.length > 0
                        ? dailyForcast
                        : Array.from({ length: 7 })
                      ).map((daily, index) => {
                        return (
                          <div
                            id={`daily-forcast-${index}`}
                            key={`daily-forcast-${index}`}
                            className={`forcast-item card-item ${
                              !daily ? "loading" : ""
                            }`}
                          >
                            {daily ? (
                              <>
                                <p className="day-label">{daily.day}</p>
                                <WMOInterpretation code={daily.weather_code} />
                                <div className="temp-range">
                                  <p className="temp-range-value">
                                    {daily.temperature_max + "°"}
                                  </p>
                                  <p className="temp-range-value">
                                    {daily.temperature_min + "°"}
                                  </p>
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
                    <p className="hourly-forecast-text">Hourly Forecast</p>
                    <Dropdown
                      options={hourlyForcast.length > 0 ? hourly_forcast : []}
                      onChange={(value) => onDaySelect(value)}
                      todaysDay={todaysDay}
                      label={selectedDay}
                    />
                  </div>
                  <div className="hourly-forcast-content">
                    {(hourlyForcast.length > 0
                      ? filteredHourlyForcast
                      : Array.from({ length: 10 })
                    )?.map((item, index) => {
                      return (
                        <div
                          id={`hourly-forcast-item-${index}`}
                          className={`hourly-forcast-item ${
                            !item ? "loading" : ""
                          }`}
                          key={`hourly-forcast-item-${index}`}
                        >
                          {item ? (
                            <>
                              <WMOInterpretation code={item.weather_code} />
                              <p className="hourly-forecast-text">
                                {item.time_stamp}
                              </p>
                              <p className="hourly-forecast-temp">{`${item.temperature}°`}</p>
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
            ) : (
              <p>No search results found!</p>
            )}
          </main>
        </section>
      ) : (
        <APIError />
      )}
      <footer>
        <div className="attribution">
          Challenge by{" "}
          <a href="https://www.frontendmentor.io?ref=challenge">
            Frontend Mentor
          </a>
          . Coded by <a href="#">Komal Rout</a>.
        </div>
      </footer>
    </div>
  );
};

export default App;
