import { useEffect, useState } from "react";
import { fetchWeatherData } from "../../api/weather";
import { calculateHealthScore } from "../../utils/healthCalculator";

interface HealthIndicatorProps {
  plant: Plant;
  className?: string;
}

const HealthIndicator = ({ plant, className }: HealthIndicatorProps) => {
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateHealth = async () => {
      try {
        if (!plant.location) {
          throw new Error("Plant has no location data");
        }

        const { latitude, longitude } = plant.location;

        const weather = await fetchWeatherData({
          latitude,
          longitude,
        });

        const rainAmount = Array.from(weather.daily.rainSum)[0] || 0;
        const humidity = Array.from(weather.daily.relativeHumidity2m)[0] || 50;

        const score = calculateHealthScore(
          plant.weekly_water_need,
          plant.expected_humidity,
          rainAmount,
          humidity
        );

        setHealthScore(score);
      } catch (error) {
        console.error("Failed to calculate health:", error);
        setHealthScore(null);
      } finally {
        setLoading(false);
      }
    };

    calculateHealth();
  }, [plant]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#16a34a"; // Green-600
    if (score >= 50) return "#f97316"; // Orange-500
    return "#dc2626"; // Red-600
  };

  const getHealthText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  if (loading) {
    return (
      <div className={`flex items-center text-gray-400 ${className}`}>
        <div className="w-3 h-3 rounded-full animate-pulse bg-gray-300 mr-2"></div>
        <span className="text-sm">Calculating...</span>
      </div>
    );
  }

  if (healthScore === null) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>Health: N/A</div>
    );
  }

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <div
        className="text-sm font-medium"
        style={{ color: getHealthColor(healthScore) }}
      >
        {getHealthText(healthScore)}
      </div>
      <div className="flex items-center mt-1">
        <div
          className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden"
          title={`Health score: ${healthScore}%`}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${healthScore}%`,
              backgroundColor: getHealthColor(healthScore),
            }}
          />
        </div>
        <span className="text-xs text-gray-500 ml-2">{healthScore}%</span>
      </div>
    </div>
  );
};

export default HealthIndicator;
