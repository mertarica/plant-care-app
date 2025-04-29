import React from "react";
import LineChart from "../../common/charts/LineChart";

const HumidityChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
  if (!weatherData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: "Humidity Forecast",
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Humidity (%)",
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="h-[180px] mt-4">
      <LineChart options={options} data={weatherData} />
    </div>
  );
};

export default HumidityChart;
