# geocoding.py
import asyncio
import os

import httpx


def _geocode_sync(city: str):
    if not city:
        print("❌ Geocode error: city is None or empty")
        return None

    city = city.strip()

    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    if not api_key:
        raise RuntimeError("OPENWEATHERMAP_API_KEY is not configured")

    params = {
        "q": city,
        "limit": 1,
        "appid": api_key,
    }

    try:
        with httpx.Client(timeout=10) as client:
            response = client.get(
                "https://api.openweathermap.org/geo/1.0/direct",
                params=params,
            )
            response.raise_for_status()
            results = response.json()

        if not results:
            print(f"❌ No geocoding results for: {city}")
            return None

        loc = results[0]
        lat = loc.get("lat")
        lon = loc.get("lon")
        name = loc.get("name") or city

        if lat is None or lon is None:
            print(f"❌ Missing lat/lon for: {city}")
            return None

        print(f"✅ Geocoded {city} → lat={lat}, lon={lon}")
        return {"lat": lat, "lon": lon, "name": name}
    except (httpx.HTTPError, ValueError, RuntimeError) as e:
        print("❌ Geocode exception:", e)
        return None


async def geocode(city: str):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, _geocode_sync, city)
