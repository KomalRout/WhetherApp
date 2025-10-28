import axios from "axios";
import { fetchWeatherApi } from "openmeteo";

export const fetchWeatherData = async (location) => {
  const [longitude, latitude] = location;
  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: ["temperature_2m_min", "temperature_2m_max", "weather_code"],
    hourly: "temperature_2m",
    current: [
      "wind_speed_10m",
      "precipitation",
      "relative_humidity_2m",
      "apparent_temperature",
      "temperature_2m",
      "is_day",
      "weather_code",
      "rain",
      "showers",
      "snowfall",
    ],
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const response = await fetchWeatherApi(url, params).then((res) => res);
  const data = await response.json();
  return data;
};

export const fetchLocationData = async (query) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`;
  const response = await axios(url).then((res) => {
    return res.data.results;
  });
  let processedData = (response ?? []).map((item) => {
    let last_admin_index = Object.entries(item)?.reduce((acc, [key, value]) => {
      if (key.startsWith("admin")) {
        let index = parseInt(key.replace("admin", ""));
        return index > acc ? index : acc;
      }
      return acc;
    }, 0);

    let name = "";
    if (last_admin_index === 0) {
      name = item["country"];
    } else {
      while (last_admin_index > 0) {
        let admin_key = `admin${last_admin_index}`;
        if (item[admin_key]) {
          name += `${item[admin_key]}`;
        }
        last_admin_index--;
      }
    }

    return {
      name,
      long: item.longitude,
      lat: item.latitude,
    };
  });
  return processedData;
};
