import React from "react";
import clearSky from "/assets/images/icon-overcast.webp";
import cloudy from "/assets/images/icon-partly-cloudy.webp";
import foggy from "/assets/images/icon-fog.webp";
import drizzle from "/assets/images/icon-drizzle.webp";
import rain from "/assets/images/icon-rain.webp";
import snow from "/assets/images/icon-snow.webp";
import storm from "/assets/images/icon-storm.webp";

const WeatherIcon = ({ code }) => {
  switch (code) {
    case 0:
      return <img alt="Clear sky" src={clearSky} />;
    case 1:
    case 2:
    case 3:
      return <img alt="Partly cloudy" src={cloudy} />;
    case 45:
    case 48:
      return <img alt="Foggy" src={foggy} />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <img alt="Drizzle" src={drizzle} />;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <img alt="Rainy" src={rain} />;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return <img alt="Snowy" src={snow} />;
    case 80:
    case 81:
    case 82:
      return <img alt="Partly cloudy" src={rain} />;
    case 95:
    case 96:
    case 99:
      return <img alt="Thunderstorm" src={storm} />;
    default:
      return "Unknown weather code";
  }
};

export default React.memo(WeatherIcon);
