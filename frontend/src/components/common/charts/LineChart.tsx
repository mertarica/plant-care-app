import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  options?: ChartOptions<"line">;
  data: {
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

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  if (!data) return null;

  return (
    <div className="h-[180px] mt-4">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
