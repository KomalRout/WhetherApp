import React from "react";

const WMOInterpretation = ({ code }) => {
  switch (code) {
    case 0:
      return (
        <img alt="Clear sky" src="public/assets/images/icon-overcast.webp" />
      );
    case (1, 2, 3):
      return (
        <img
          alt="Partly cloudy"
          src="public/assets/images/icon-partly-cloudy.webp"
        />
      );
    case (45, 48):
      return <img alt="Foggy" src="public/assets/images/icon-fog.webp" />;
    case (51, 53, 55, 56, 57):
      return <img alt="Drizzle" src="public/assets/images/icon-drizzle.webp" />;
    case (61, 63, 65, 66, 67):
      return <img alt="Rainy" src="public/assets/images/icon-rain.webp" />;
    case (71, 73, 75, 77, 85, 86):
      return <img alt="Snowy" src="public/assets/images/icon-snow.webp" />;
    case (80, 81, 82):
      return (
        <img alt="Partly cloudy" src="public/assets/images/icon-rain.webp" />
      );
    case (95, 96, 99):
      return (
        <img alt="Thunderstorm" src="public/assets/images/icon-storm.webp" />
      );
    default:
      return "Unknown weather code";
  }
};

export default WMOInterpretation;
