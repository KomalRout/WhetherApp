import React from "react";
import WeatherIcon from "../WeatherIconAndAnimation/WeatherIcon";
import "./HourlyForcastList.css";

const HourlyForcastList = ({ item, index }) => {
  return (
    <div
      id={`hourly-forcast-item-${index}`}
      className={`hourly-forcast-item ${!item ? "loading" : ""}`}
      key={`hourly-forcast-item-${index}`}
      aria-label={`Hourly forecast for ${item ? item.time_stamp : "loading"}`}
    >
      {item ? (
        <>
          <WeatherIcon code={item.weather_code} />
          <p className="hourly-forecast-text">{item.time_stamp}</p>
          <p className="hourly-forecast-temp">{`${item.temperature}°`}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(HourlyForcastList);
