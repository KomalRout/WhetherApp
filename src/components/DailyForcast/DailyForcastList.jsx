import React from "react";
import WeatherIcon from "../WeatherIconAndAnimation/WeatherIcon";
import "./dailyForcast.css";

const DailyForcastList = ({ daily, index }) => {
  return (
    <div
      id={`daily-forcast-${index}`}
      key={`daily-forcast${index}`}
      className={`forcast-item card-item ${!daily ? "loading" : ""}`}
      aria-label={`Daily forecast for ${daily ? daily.day : "loading"}`}
    >
      {daily ? (
        <>
          <p className="day-label">{daily.day}</p>
          <WeatherIcon code={daily.weather_code} />
          <div className="temp-range">
            <p className="temp-range-value">{daily.temperature_max + "°"}</p>
            <p className="temp-range-value">{daily.temperature_min + "°"}</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(DailyForcastList);
