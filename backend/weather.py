import httpx

WMO_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    95: "Thunderstorm", 99: "Thunderstorm with hail",
}

async def get_weather(lat: float, lon: float) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
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

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        data = resp.json()

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
            for i in range(7)
        ],
    }


async def get_hourly(lat: float, lon: float, hours: int = 12) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,precipitation_probability,weathercode,wind_speed_10m",
        "forecast_days": 1,
        "timezone": "auto",
    }

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        data = resp.json()

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