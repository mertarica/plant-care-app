interface WeatherRequestParams {
  latitude: number;
  longitude: number;
}

interface WeatherChartProps {
  weatherData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
      yAxisID?: string;
    }[];
  } | null;
}
