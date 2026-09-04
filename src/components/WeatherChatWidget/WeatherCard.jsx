import { useState } from "react";

const conditionIcon = (condition = "") => {
  const value = condition.toLowerCase();
  if (value.includes("thunder") || value.includes("storm")) return "⛈️";
  if (value.includes("rain") || value.includes("drizzle")) return "🌧️";
  if (value.includes("snow")) return "🌨️";
  if (value.includes("fog") || value.includes("mist")) return "🌫️";
  if (value.includes("clear") || value.includes("sun")) return "☀️";
  return "☁️";
};

const number = (value, digits = 0) =>
  typeof value === "number" ? value.toFixed(digits) : "—";

function DayDetails({ day }) {
  return (
    <div className="wcw-weather-day-details">
      <span>Humidity {number(day.humidity)}%</span>
      <span>Wind {number(day.wind_speed, 1)} km/h</span>
      <span>Rain {number(day.precip_probability)}%</span>
    </div>
  );
}

export default function WeatherCard({ weather }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const current = weather.current ?? {};
  const forecast = Array.isArray(weather.forecast) ? weather.forecast : [];

  return (
    <div className="wcw-weather-card">
      <div className="wcw-weather-card-heading">
        <div>
          <div className="wcw-weather-location">{weather.location ?? "Weather"}</div>
          <div className="wcw-weather-label">Current conditions</div>
        </div>
        <span className="wcw-weather-current-icon" aria-hidden="true">
          {conditionIcon(current.condition)}
        </span>
      </div>
      <div className="wcw-weather-current">
        <strong>{number(current.temp, 1)}°</strong>
        <span>{current.condition ?? "Unknown conditions"}</span>
      </div>
      <div className="wcw-weather-metrics">
        <span>Humidity {number(current.humidity)}%</span>
        <span>Wind {number(current.wind_speed, 1)} km/h</span>
      </div>
      <div className="wcw-weather-forecast" aria-label="Five day forecast">
        {forecast.map((day) => {
          const selected = selectedDate === day.date;
          return (
            <div className="wcw-weather-day-wrapper" key={day.date}>
              <button
                className={`wcw-weather-day ${selected ? "selected" : ""}`}
                onClick={() => setSelectedDate(selected ? null : day.date)}
                aria-expanded={selected}
              >
                <span>{new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span className="wcw-weather-day-icon" aria-hidden="true">
                  {conditionIcon(day.condition)}
                </span>
                <strong>{number(day.max, 0)}°</strong>
                <small>{number(day.min, 0)}°</small>
              </button>
              {selected && <DayDetails day={day} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
