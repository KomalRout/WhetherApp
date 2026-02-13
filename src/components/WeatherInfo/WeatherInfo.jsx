import React from "react";
import WeatherIcon from "../WeatherIconAndAnimation/WeatherIcon";
import { FavoriteOutlined, FavoriteBorderOutlined } from "@mui/icons-material";
import "./weatherInfo.css";

const WeatherInfo = ({
  location,
  currentForcast,
  favoriteBtnClicked,
  isFavLocation,
  handleFavoriteLocationList,
}) => {
  return (
    <div className="weather-info" aria-label="Weather Information">
      <div className="location-info" aria-label="Location Information">
        <p className="location-title" aria-label="Location Name">
          {location}
        </p>
        <p className="location-time" aria-label="Current Time">
          {currentForcast.time}
        </p>
      </div>
      <div className="temperature-info" aria-label="Temperature Information">
        <WeatherIcon code={currentForcast.weather_code} aria-hidden="true" />
        <p aria-label="Current Temperature">
          {currentForcast.temperature + "°"}
        </p>
      </div>
      <div
        className="favorite-icon"
        onClick={() => {
          handleFavoriteLocationList();
        }}
        aria-label="Favorite Location Button"
      >
        {!favoriteBtnClicked && !isFavLocation ? (
          <FavoriteBorderOutlined aria-hidden="true" />
        ) : (
          <FavoriteOutlined aria-hidden="true" />
        )}
      </div>
    </div>
  );
};

export default React.memo(WeatherInfo);
