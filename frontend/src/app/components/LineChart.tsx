// src/app/components/LineChart.tsx
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ data }: { data: any }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Line Data",
        data: data?.values || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
}