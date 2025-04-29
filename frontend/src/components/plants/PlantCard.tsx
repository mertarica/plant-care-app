import { useCallback, useEffect, useState } from "react";
import Button from "../common/Button";
import HealthIndicator from "./HealthIndicator";
import { usePlantTypes } from "../../hooks/usePlantTypes";
import { usePlants } from "../../contexts/PlantsContext";
import { fetchWeatherData } from "../../api/weather";
import HumidityChart from "./charts/HumidityChart";
import RainChart from "./charts/RainChart";

interface PlantCardProps {
  plant: Plant;
}

const PlantCard = ({ plant }: PlantCardProps) => {
  const { setModalOpen, setCurrentPlant, removePlant } = usePlants();
  const { getPlantIcon } = usePlantTypes();

  type WeatherChartData = {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      yAxisID: string;
    }[];
  };

  const [rainData, setRainData] = useState<WeatherChartData | null>(null);
  const [humidityData, setHumidityData] = useState<WeatherChartData | null>(
    null
  );
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [showHumidity, setShowHumidity] = useState(false);
  const [showRain, setShowRain] = useState(false);

  const handleEdit = useCallback(() => {
    setCurrentPlant(plant);
    setModalOpen(true);
  }, [setCurrentPlant, plant, setModalOpen]);

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      removePlant(plant.id).catch((error) => {
        console.error("Error deleting plant:", error);
      });
    }
  }, [plant.id, removePlant]);

  const toggleHumidity = useCallback(() => {
    setShowHumidity((prev) => !prev);
  }, []);

  const toggleRain = useCallback(() => {
    setShowRain((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (plant.location) {
        const { latitude, longitude } = plant.location;
        setIsLoadingWeather(true);

        try {
          const response = await fetchWeatherData({ latitude, longitude });

          if (!response) {
            throw new Error("Failed to fetch weather data");
          }

          // Create array from typed arrays
          const rainArray = Array.from(response.daily.rainSum);
          const humidityArray = Array.from(response.daily.relativeHumidity2m);
          const formattedDates = response.daily.time.map((date) =>
            date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })
          );

          const rainData = {
            labels: formattedDates,
            datasets: [
              {
                label: "Rain (mm)",
                data: rainArray,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                tension: 0.3,
                yAxisID: "y",
              },
            ],
          };

          const humidityData = {
            labels: formattedDates,
            datasets: [
              {
                label: "Humidity (%)",
                data: humidityArray,
                borderColor: "rgb(16, 185, 129)",
                backgroundColor: "rgba(16, 185, 129, 0.5)",
                tension: 0.3,
                yAxisID: "y",
              },
            ],
          };

          setRainData(rainData);
          setHumidityData(humidityData);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        } finally {
          setIsLoadingWeather(false);
        }
      }
    };

    fetchWeather();
  }, [plant.location]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center">
          <div className="text-5xl mr-4">{getPlantIcon(plant.type)}</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {plant.name}
            </h3>
            <p className="text-sm text-gray-500 italic">
              {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
            </p>
          </div>
        </div>
        <HealthIndicator plant={plant} className="hidden sm:flex" />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Mobile Health Indicator */}
        <div className="sm:hidden mb-4">
          <HealthIndicator plant={plant} />
        </div>

        {/* Plant Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-500 mb-1">💧 Water Needs</span>
            <span className="font-medium text-gray-800">
              {plant.weekly_water_need} mm/week
            </span>
          </div>

          <div className="flex flex-col p-3 bg-green-50 rounded-lg">
            <span className="text-green-500 mb-1">💨 Humidity</span>
            <span className="font-medium text-gray-800">
              {plant.expected_humidity}% ideal
            </span>
          </div>

          <div className="flex flex-col p-3 bg-amber-50 rounded-lg col-span-2 md:col-span-1">
            <span className="text-amber-500 mb-1">📍 Location</span>
            <span className="font-medium text-gray-800 truncate">
              {plant.location?.name || "Unknown"}
            </span>
          </div>
        </div>

        {/* Weather Section */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Local Weather
          </h4>

          {isLoadingWeather ? (
            <div className="h-[100px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
          ) : humidityData ? (
            <div className="space-y-4">
              {/* Humidity Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <button
                  onClick={toggleHumidity}
                  className="w-full flex items-center justify-between p-3 text-left bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">💨</span>
                    <span className="font-medium text-gray-700">
                      Humidity Forecast
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showHumidity ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showHumidity && (
                  <div className="p-3">
                    <HumidityChart weatherData={humidityData} />
                  </div>
                )}
              </div>

              {/* Rain Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <button
                  onClick={toggleRain}
                  className="w-full flex items-center justify-between p-3 text-left bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">🌧️</span>
                    <span className="font-medium text-gray-700">
                      Rain Forecast
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showRain ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showRain && (
                  <div className="p-3">
                    <RainChart weatherData={rainData} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[100px] flex items-center justify-center text-sm text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
              Weather data not available
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex justify-end p-3 border-t border-gray-100 bg-gray-50">
        <Button
          variant="outline"
          onClick={handleEdit}
          className="text-sm px-4 py-1.5 mr-2"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          className="text-sm px-4 py-1.5"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PlantCard;
