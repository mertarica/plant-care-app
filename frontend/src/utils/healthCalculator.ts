export const calculateHealthScore = (
  expectedWater: number,
  expectedHumidity: number,
  actualRain: number,
  actualHumidity: number
): number => {
  const waterScore =
    1 - Math.min(1, Math.abs(expectedWater - actualRain) / expectedWater);
  const humidityScore =
    1 - Math.min(1, Math.abs(expectedHumidity - actualHumidity) / 100);

  return Math.round((waterScore * 0.6 + humidityScore * 0.4) * 100);
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
