import { useCallback, useEffect, useState, useMemo } from "react";
import "./App.css";
import Dropdown from "./components/Dropdown/Dropdown";
import SearchInput from "./components/Search/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData } from "./service";
import {
  setCurrentWeatherInfo,
  setDailyForcast,
  setHourlyForcast,
} from "./reducers/appSlice";
import WeatherIcon from "./components/WeatherIconAndAnimation/WeatherIcon";
import { LinearLoader } from "./components/Loader/Loader";
import APIError from "./components/APIError/APIError";
import { useGeoLocation } from "./useGeoLocation";
import SavedLocation from "./components/SavedLocation/SavedLocation";
import { daysOfWeek, unit_options } from "./constants";
import WeatherInfo from "./components/WeatherInfo/WeatherInfo";
import DailyForcastList from "./components/DailyForcast/DailyForcastList";
import HourlyForcastList from "./components/HourlyForcast/HourlyForcastList";
import logo from "/assets/images/logo.svg";
const App = () => {
  const dispatch = useDispatch();
  const [unitType, setUnitType] = useState("metric");
  const [error, setError] = useState(false);
  const { refresh, error: locationError } = useGeoLocation();

  const [unit, setUnit] = useState([]);

  const todaysDay = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  const [selectedDay, setSelectedDay] = useState("_");
  const [favoriteBtnClicked, setFavoriteBtnClicked] = useState(false);
  const [filteredHourlyForcast, setFilteredHourlyForcast] = useState([]);
  const [searchFound, setSearchFound] = useState(true);

  const [savedLocBtnClicked, setSavedLocBtnClicked] = useState(false);
  const storedLocation = JSON.parse(localStorage.getItem("favoriteLocations"));
  const storedFavLocs = storedLocation?.map((loc) => loc.locationName) || [];

  const state = useSelector((state) => state.appReducer);
  const dailyForcast = state.dailyForcast;
  const hourlyForcast = state.hourlyForcast;
  const currentForcast = state.currentWeatherInfo;
  const location = state.locationSelected;

  const precipitation_unit = useMemo(() => {
    return unitType === "metric" ? "mm" : "inch";
  }, [unitType]);
  const wind_speed_unit = useMemo(() => {
    return unitType === "metric" ? "km/h" : "m/h";
  }, [unitType]);

  let feelsLike = useMemo(() => {
    return currentForcast.apparent_temperature
      ? currentForcast.apparent_temperature + " °"
      : "_";
  }, [currentForcast]);

  let humidity = useMemo(() => {
    return currentForcast.humidity ? currentForcast.humidity + " %" : "_";
  }, [currentForcast]);

  let wind = useMemo(() => {
    return currentForcast.windSpeed
      ? currentForcast.windSpeed + " " + wind_speed_unit
      : "_";
  }, [currentForcast, wind_speed_unit]);

  let precipitation = useMemo(() => {
    return currentForcast.precipitation
      ? currentForcast.precipitation + " " + precipitation_unit
      : "_";
  }, [currentForcast, precipitation_unit]);

  let isFavLocation =
    storedFavLocs.includes(location) &&
    storedLocation?.find((loc) => loc.locationName === location)?.isFav;

  //Called if theres any change in Location or Unit Type. Also called on initial load when location is fetched.
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

  //Setting the inital data for hourly forcast based on the current day selected.
  useEffect(() => {
    if (hourlyForcast.length === 0) return;
    onDaySelect(todaysDay);
  }, [hourlyForcast]);

  //Setting the favorite button state based on whether the current location is in favorite list or not.
  useEffect(() => {
    if (isFavLocation) {
      setFavoriteBtnClicked(true);
    } else {
      setFavoriteBtnClicked(false);
    }
  }, [isFavLocation]);

  const onSavedLocClick = () => {
    setSavedLocBtnClicked(!savedLocBtnClicked);
  };

  function onDaySelect(day) {
    const filteredData = hourlyForcast.filter((item) => item.key === day);

    setSelectedDay(
      daysOfWeek?.filter((item) => item.key === day)[0]?.label || "",
    );
    setFilteredHourlyForcast(filteredData);
  }

  //Unit Change Callback function
  useCallback(
    (val) => {
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
    },
    [unitType],
  );

  const handleFavoriteLocationList = () => {
    setFavoriteBtnClicked(!favoriteBtnClicked);
    let updatedFavList;
    let isFavLocationCreated = storedLocation?.length > 0;
    let isLocationFav =
      isFavLocationCreated &&
      storedLocation?.some((loc) => loc.locationName === location);
    if (isFavLocationCreated) {
      let index = storedLocation.findIndex(
        (loc) => loc.locationName === location,
      );
      if (!isLocationFav) {
        updatedFavList = [
          ...storedLocation,
          {
            id: `${location}-${storedFavLocs?.length + 1}`,
            locationName: location,
            latitude: state.latitude,
            longitude: state.longitude,
            isFav: true,
          },
        ];
      } else {
        updatedFavList = storedLocation.filter(
          (loc) => loc.id !== storedLocation[index].id,
        );
      }
    } else {
      updatedFavList = [
        {
          id: `${location}-${storedFavLocs?.length + 1}`,
          locationName: location,
          latitude: state.latitude,
          longitude: state.longitude,
          isFav: true,
        },
      ];
    }
    localStorage.setItem("favoriteLocations", JSON.stringify(updatedFavList));
  };

  return (
    <div className="wheather-app-container">
      <header aria-label="App Header">
        <img alt="weather-logo" src={logo} />
        <div className="header-right-content">
          <img
            className="favorite-list-icon"
            alt="frequently-viewed"
            src={
              import.meta.env.REACT_BASE_URL + "/assets/images/icon-saved.svg"
            }
            onClick={onSavedLocClick}
            aria-label="Saved Locations"
          />
          <Dropdown
            options={unit}
            label={"Unit"}
            onChange={(val) => setUnitType(val)}
            icon={"public/assets/images/icon-units.svg"}
            aria-label="Unit Selector"
          />
        </div>
      </header>
      {!error || !locationError ? (
        <section>
          <div className="title-container">
            <p className="title">How's the sky looking today?</p>
          </div>
          <main className="main-content-container">
            <SearchInput
              searchFound={searchFound}
              setSearchFound={setSearchFound}
            />
            {searchFound ? (
              <div className="content-container">
                <div className="left-content">
                  {/* Weather Information Section */}
                  <div className="weather-info-container ">
                    {Object.keys(currentForcast)?.length > 0 ? (
                      <WeatherInfo
                        location={location}
                        currentForcast={currentForcast}
                        favoriteBtnClicked={favoriteBtnClicked}
                        isFavLocation={isFavLocation}
                        handleFavoriteLocationList={handleFavoriteLocationList}
                      />
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
                      ).map((daily, index) => (
                        <DailyForcastList daily={daily} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Hourly Forcast Section */}
                <div className="hourly-forecast">
                  <div className="hourly-forecast-header">
                    <p className="hourly-forecast-text">Hourly Forecast</p>
                    <Dropdown
                      options={hourlyForcast.length > 0 ? daysOfWeek : []}
                      onChange={(value) => onDaySelect(value)}
                      todaysDay={todaysDay}
                      label={selectedDay}
                    />
                  </div>
                  <div className="hourly-forcast-content">
                    {(hourlyForcast.length > 0
                      ? filteredHourlyForcast
                      : Array.from({ length: 10 })
                    )?.map((item, index) => (
                      <HourlyForcastList item={item} index={index} />
                    ))}
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
      <footer aria-label="App Footer">
        <div className="attribution">
          Coded by{" "}
          <a href="#" aria-label="Komal Rout">
            Komal Rout
          </a>
          .
        </div>
      </footer>
      {savedLocBtnClicked && (
        <SavedLocation
          handleFavBtnClick={onSavedLocClick}
          unitType={unitType}
        />
      )}
    </div>
  );
};

export default App;
