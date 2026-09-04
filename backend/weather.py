import asyncio
import os
import time
from collections import defaultdict

import httpx


_API_URL = "https://api.openweathermap.org/data/2.5"
_CACHE_TTL_SECONDS = 300
_REQUEST_TIMEOUT_SECONDS = 15
_FORECAST_CACHE: dict[tuple[float, float], tuple[float, dict]] = {}


def _api_key() -> str:
    key = os.getenv("OPENWEATHERMAP_API_KEY")
    if not key:
        raise RuntimeError("OPENWEATHERMAP_API_KEY is not configured")
    return key


async def _get(path: str, params: dict) -> dict:
    request_params = {**params, "appid": _api_key()}
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=_REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(f"{_API_URL}/{path}", params=request_params)
                response.raise_for_status()
                data = response.json()
                if data.get("cod") not in (None, 200, "200"):
                    raise RuntimeError(data.get("message", "OpenWeatherMap returned an error"))
                return data
        except (httpx.HTTPError, ValueError, RuntimeError) as exc:
            last_error = exc
            if attempt < 2:
                await asyncio.sleep(2**attempt)
    raise RuntimeError(f"Weather service request failed: {last_error}") from last_error


async def _fetch_weather(lat: float, lon: float) -> dict:
    cache_key = (round(float(lat), 3), round(float(lon), 3))
    cached = _FORECAST_CACHE.get(cache_key)
    if cached and time.monotonic() - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]

    current, forecast = await asyncio.gather(
        _get("weather", {"lat": lat, "lon": lon, "units": "metric"}),
        _get("forecast", {"lat": lat, "lon": lon, "units": "metric"}),
    )
    data = {"current": current, "forecast": forecast}
    _FORECAST_CACHE[cache_key] = (time.monotonic(), data)
    return data


def _condition(item: dict) -> str:
    return item.get("weather", [{}])[0].get("description", "Unknown").capitalize()


def _format_current(data: dict) -> dict:
    current = data["current"]
    return {
        "temp": current["main"]["temp"],
        "humidity": current["main"]["humidity"],
        "wind_speed": current.get("wind", {}).get("speed", 0) * 3.6,
        "condition": _condition(current),
    }


def _format_daily(forecasts: list[dict]) -> list[dict]:
    days: dict[str, list[dict]] = defaultdict(list)
    for item in forecasts:
        date = item["dt_txt"][:10]
        days[date].append(item)

    return [
        {
            "date": date,
            "max_temp": max(item["main"]["temp_max"] for item in items),
            "min_temp": min(item["main"]["temp_min"] for item in items),
            "rain_sum": sum(item.get("rain", {}).get("3h", 0) for item in items),
            "precip_probability": max(item.get("pop", 0) for item in items) * 100,
            "condition": _condition(max(items, key=lambda item: item["main"]["temp"])),
        }
        for date, items in days.items()
    ]


async def get_weather(lat: float, lon: float) -> dict:
    data = await _fetch_weather(lat, lon)
    if "current" not in data or "forecast" not in data:
        raise ValueError("Weather service returned an incomplete response")
    return {
        "current": _format_current(data),
        "forecast": _format_daily(data["forecast"].get("list", [])),
    }


async def get_hourly(lat: float, lon: float, hours: int = 12) -> dict:
    data = await _fetch_weather(lat, lon)
    forecasts = data["forecast"].get("list", [])
    # The free forecast endpoint provides three-hour intervals rather than hourly data.
    intervals = max(1, min(8, (hours + 2) // 3))
    return {
        "hourly": [
            {
                "time": item["dt_txt"],
                "temp": item["main"]["temp"],
                "precip_probability": item.get("pop", 0) * 100,
                "wind_speed": item.get("wind", {}).get("speed", 0) * 3.6,
                "condition": _condition(item),
            }
            for item in forecasts[:intervals]
        ]
    }
