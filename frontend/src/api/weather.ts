import { fetchWeatherApi } from "openmeteo";

interface WeatherRequestParams {
  latitude: number;
  longitude: number;
  days?: number; 
}

export const fetchWeatherData = async ({
  latitude,
  longitude,
  days = 14, // Default to 14 days
}: WeatherRequestParams) => {
  const params = {
    latitude,
    longitude,
    daily: [
      "rain_sum", // Daily total rainfall (mm)
      "relative_humidity_2m_mean", // Daily average relative humidity (%)
    ],
    past_days: days, 
    forecast_days: 14, 
    timezone: "auto", 
  };

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    // Process daily data
    const daily = response.daily()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const weatherData = {
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        rainSum: daily.variables(0)!.valuesArray()!,
        relativeHumidity2m: daily.variables(1)!.valuesArray()!,
      },
    };

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
};

// Helper function
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
