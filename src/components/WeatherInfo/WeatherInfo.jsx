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
    <div className="weather-info">
      <div className="location-info">
        <p className="location-title">{location}</p>
        <p className="location-time">{currentForcast.time}</p>
      </div>
      <div className="temperature-info">
        <WeatherIcon code={currentForcast.weather_code} />
        <p>{currentForcast.temperature + "°"}</p>
      </div>
      <div
        className="favorite-icon"
        onClick={() => {
          handleFavoriteLocationList();
        }}
      >
        {!favoriteBtnClicked && !isFavLocation ? (
          <FavoriteBorderOutlined />
        ) : (
          <FavoriteOutlined />
        )}
      </div>
    </div>
  );
};

export default WeatherInfo;
