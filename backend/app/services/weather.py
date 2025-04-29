import httpx
from datetime import datetime, timedelta
import re


async def parse_location(location: str):
    """
    Konum bilgisini parse eder. Enlem/boylam veya şehir/ülke formatında olabilir.
    """
    # Latitude,longitude formatını kontrol et (e.g., "41.0082,28.9784")
    coords_pattern = re.compile(
        r'^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$')

    if coords_pattern.match(location):
        lat, lon = map(float, location.split(','))
        return lat, lon

    # Şehir/ülke formatı için geocoding API kullanmamız gerekecek
    # Basit tutmak için Open-Meteo'nun geocoding API'sini kullanalım
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": location, "count": 1}
        )
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            result = data["results"][0]
            return result["latitude"], result["longitude"]

        # Eğer konum bulunamazsa varsayılan olarak İstanbul'u kullan
        return 41.0082, 28.9784


async def get_weather_data(location: str, start_date: datetime, end_date: datetime):
    """
    Open-Meteo API'sinden hava durumu verilerini çeker
    """
    latitude, longitude = await parse_location(location)

    base_url = "https://archive-api.open-meteo.com/v1/archive"

    # Tarihleri formatlama
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date_str,
        "end_date": end_date_str,
        "daily": "precipitation_sum,relative_humidity_mean",
        "timezone": "auto"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(base_url, params=params)
        response.raise_for_status()
        return response.json()


async def calculate_plant_health(weekly_water_need: float, expected_humidity: float, location: str):
    """
    Bitkinin sağlık durumunu hesaplar
    """
    today = datetime.now()
    week_ago = today - timedelta(days=7)

    try:
        weather_data = await get_weather_data(
            location=location,
            start_date=week_ago,
            end_date=today
        )

        # Son 7 günlük yağış toplamı (mm)
        precipitation_sum = sum(weather_data["daily"]["precipitation_sum"])

        # Son 7 günlük ortalama bağıl nem (%)
        humidity_mean = sum(weather_data["daily"]["relative_humidity_mean"]) / len(
            weather_data["daily"]["relative_humidity_mean"])

        # Su ihtiyacı karşılanma oranı (mm yağış = ml/cm²)
        water_satisfaction = min(
            precipitation_sum / weekly_water_need * 100, 100)

        # Nem karşılanma oranı
        humidity_satisfaction = 100 - abs(humidity_mean - expected_humidity)

        # Sağlık skoru (0-100)
        health_score = (water_satisfaction * 0.6) + \
            (humidity_satisfaction * 0.4)

        return {
            "health_score": health_score,
            "water_satisfaction": water_satisfaction,
            "humidity_satisfaction": humidity_satisfaction,
            "actual_precipitation": precipitation_sum,
            "actual_humidity": humidity_mean,
            "date": today
        }
    except Exception as e:
        # Hava durumu verisi alınamazsa varsayılan değerler döndür
        return {
            "health_score": 50,  # Orta düzey sağlık
            "water_satisfaction": 50,
            "humidity_satisfaction": 50,
            "actual_precipitation": 0,
            "actual_humidity": 50,
            "date": today,
            "error": str(e)
        }
