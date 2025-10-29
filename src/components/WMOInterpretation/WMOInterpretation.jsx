import React from "react";

const WMOInterpretation = ({ code }) => {
  switch (code) {
    case 0:
      return (
        <img alt="Clear sky" src="public/assets/images/icon-overcast.webp" />
      );
    case 1:
    case 2:
    case 3:
      return (
        <img
          alt="Partly cloudy"
          src="public/assets/images/icon-partly-cloudy.webp"
        />
      );
    case 45:
    case 48:
      return <img alt="Foggy" src="public/assets/images/icon-fog.webp" />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <img alt="Drizzle" src="public/assets/images/icon-drizzle.webp" />;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <img alt="Rainy" src="public/assets/images/icon-rain.webp" />;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return <img alt="Snowy" src="public/assets/images/icon-snow.webp" />;
    case 80:
    case 81:
    case 82:
      return (
        <img alt="Partly cloudy" src="public/assets/images/icon-rain.webp" />
      );
    case 95:
    case 96:
    case 99:
      return (
        <img alt="Thunderstorm" src="public/assets/images/icon-storm.webp" />
      );
    default:
      return "Unknown weather code";
  }
};

export default WMOInterpretation;
