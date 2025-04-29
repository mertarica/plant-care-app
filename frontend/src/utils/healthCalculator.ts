export const calculateHealthScore = (
  weeklyWaterNeed: number,
  expectedHumidity: number,
  dailyRain: number,
  actualHumidity: number
): number => {
  // Convert weekly water need to daily water need
  const dailyWaterNeed = weeklyWaterNeed / 7;

  // Calculate water score: how well daily rain meets daily water needs
  // If rain exceeds needs, we consider it fully satisfied (capped at 100%)
  const waterSatisfactionRate = Math.min(1, dailyRain / dailyWaterNeed);

  // Calculate humidity score: how close actual humidity is to expected humidity
  const humidityScore =
    1 - Math.min(1, Math.abs(expectedHumidity - actualHumidity) / 100);

  // Weight water at 60% and humidity at 40%
  return Math.round((waterSatisfactionRate * 0.6 + humidityScore * 0.4) * 100);
};

export const getHealthStatus = (healthScore: number): string => {
  if (healthScore >= 80) {
    return "Healthy";
  } else if (healthScore >= 50) {
    return "Needs Attention";
  } else {
    return "Unhealthy";
  }
};

export const getHealthColor = (healthScore: number): string => {
  if (healthScore >= 80) {
    return "bg-green-500";
  } else if (healthScore >= 50) {
    return "bg-yellow-500";
  } else {
    return "bg-red-500";
  }
};
