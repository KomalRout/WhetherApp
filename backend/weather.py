import httpx
import asyncio
import time

WMO_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    95: "Thunderstorm", 99: "Thunderstorm with hail",
}

_FORECAST_CACHE: dict[tuple[object, ...], tuple[float, dict]] = {}
_CACHE_TTL_SECONDS = 300
_REQUEST_TIMEOUT_SECONDS = 15


async def _fetch_forecast(params: dict) -> dict:
    cache_key = (
        round(float(params["latitude"]), 3),
        round(float(params["longitude"]), 3),
        tuple(sorted(
            (key, str(value))
            for key, value in params.items()
            if key not in ("latitude", "longitude")
        )),
    )
    cached = _FORECAST_CACHE.get(cache_key)
    if cached and time.monotonic() - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]

    last_error = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=_REQUEST_TIMEOUT_SECONDS) as client:
                resp = await client.get("https://api.open-meteo.com/v1/forecast", params=params)
                resp.raise_for_status()
                data = resp.json()
                if data.get("error"):
                    raise ValueError(data.get("reason", "Open-Meteo returned an error"))
                _FORECAST_CACHE[cache_key] = (time.monotonic(), data)
                return data
        except (httpx.HTTPError, ValueError) as exc:
            last_error = exc
            if attempt < 2:
                await asyncio.sleep(2**attempt)
    raise RuntimeError(f"Weather service request failed: {last_error}") from last_error


async def get_weather(lat: float, lon: float) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        # your original daily fields, kept exactly
        "daily": "rain_sum,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode",
        # new: current conditions
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode",
        "forecast_days": 7,
        "timezone": "auto",
    }

    data = await _fetch_forecast(params)
    if "current" not in data or "daily" not in data:
        raise ValueError("Weather service returned an incomplete response")
    cur = data["current"]
    daily = data["daily"]

    return {
        # current snapshot
        "current": {
            "temp":      cur["temperature_2m"],
            "humidity":  cur["relative_humidity_2m"],
            "wind_speed": cur["wind_speed_10m"],
            "condition": WMO_CODES.get(cur["weathercode"], "Unknown"),
        },
        # your original 7-day structure, just shaped for the agent
        "forecast": [
            {
                "date":              daily["time"][i],
                "max_temp":          daily["temperature_2m_max"][i],
                "min_temp":          daily["temperature_2m_min"][i],
                "rain_sum":          daily["rain_sum"][i],
                "precip_probability": daily["precipitation_probability_max"][i],
                "condition":         WMO_CODES.get(daily["weathercode"][i], "Unknown"),
            }
            for i in range(len(daily["time"]))
        ],
    }


async def get_hourly(lat: float, lon: float, hours: int = 12) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,precipitation_probability,weathercode,wind_speed_10m",
        "forecast_days": 1,
        "timezone": "auto",
    }

    data = await _fetch_forecast(params)
    if "hourly" not in data:
        raise ValueError("Weather service returned an incomplete hourly response")
    hourly = data["hourly"]
    return {
        "hourly": [
            {
                "time":              hourly["time"][i],
                "temp":              hourly["temperature_2m"][i],
                "precip_probability": hourly["precipitation_probability"][i],
                "wind_speed":        hourly["wind_speed_10m"][i],
                "condition":         WMO_CODES.get(hourly["weathercode"][i], "Unknown"),
            }
            for i in range(min(hours, len(hourly["time"])))
        ]
    }