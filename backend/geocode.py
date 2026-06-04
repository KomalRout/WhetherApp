# geocoding.py
import asyncio
import requests


def _geocode_sync(city: str):
    if not city:
        print("❌ Geocode error: city is None or empty")
        return None

    city = city.strip()

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    try:
        res = requests.get(url, params=params, timeout=10)

        if res.status_code != 200:
            print("❌ Geocode HTTP error:", res.status_code, res.text)
            return None

        data = res.json()

        print("🌍 Geocode raw response:", data)   # DEBUG

        if "results" not in data or not data["results"]:
            print(f"❌ No geocoding results for: {city}")
            return None

        loc = data["results"][0]

        lat = loc.get("latitude")
        lon = loc.get("longitude")
        name = loc.get("name") or city

        if lat is None or lon is None:
            print(f"❌ Missing lat/lon for: {city}")
            return None

        print(f"✅ Geocoded {city} → lat={lat}, lon={lon}")

        return {"lat": lat, "lon": lon, "name": name}

    except Exception as e:
        print("❌ Geocode exception:", e)
        return None


async def geocode(city: str):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, _geocode_sync, city)
