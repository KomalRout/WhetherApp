import axios from "axios";
import { fetchWeatherApi } from "openmeteo";

export const fetchWeatherData = async (location) => {
  const [longitude, latitude] = location;
  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: ["temperature_2m_min", "temperature_2m_max", "weather_code"],
    hourly: ["temperature_2m", "weather_code"],
    current: [
      "wind_speed_10m",
      "precipitation",
      "relative_humidity_2m",
      "apparent_temperature",
      "temperature_2m",
      "weather_code",
    ],
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params).then((res) => res);
  const data = responses[0] ?? null;
  const utcOffsetSeconds = data.utcOffsetSeconds();
  const current = data.current();
  const hourly = data.hourly();
  const daily = data.daily();

  const weatherData = {
    current: {
      time: new Date(
        (Number(current.time()) + utcOffsetSeconds) * 1000
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "long",
      }),
      windSpeed: Math.round(current.variables(0).value()),
      precipitation: current.variables(1).value(),
      humidity: current.variables(2).value(),
      apparent_temperature: Math.round(current.variables(3).value()),
      temperature: Math.round(current.variables(4).value()),
      weather_code: current.variables(6).value(),
    },
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        ),
      ].map((_, i) =>
        new Date(
          (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
            1000
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
          weekday: "short",
        })
      ),
      temperature: Array.from(hourly.variables(0).valuesArray()),
      weather_code: Array.from(hourly.variables(1).valuesArray()),
    },
    daily: {
      time: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
        ),
      ].map((_, i) =>
        new Date(
          (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
            1000
        ).toLocaleDateString("en-US", { weekday: "short" })
      ),
      temperature_min: Array.from(daily.variables(0).valuesArray()),
      temperature_max: Array.from(daily.variables(1).valuesArray()),
      weather_code: Array.from(daily.variables(2).valuesArray()),
    },
  };
  return weatherData;
};

export const fetchLocationData = async (query) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`;
  const response = await axios(url).then((res) => {
    return res.data.results;
  });
  let processedData = (response ?? []).map((item, index) => {
    response;
    let last_admin_index = Object.entries(item)?.reduce((acc, [key, value]) => {
      if (key.startsWith("admin")) {
        let index = parseInt(key.replace("admin", ""));
        return index > acc ? index : acc;
      }
      return acc;
    }, 0);
    console.log("last_admin_index", last_admin_index);
    let name = "";
    if (last_admin_index === 0) {
      name = item["country"];
    } else {
      while (last_admin_index > 0) {
        let admin_key = `admin${last_admin_index}`;
        if (item[admin_key]) {
          name =
            name === "" ? `${item[admin_key]}` : `${name}, ${item[admin_key]}`;
        }
        last_admin_index--;
      }
      name = name + `, ${item["country"]}`;
    }

    return {
      name,
      long: item.longitude,
      lat: item.latitude,
    };
  });
  return processedData;
};
