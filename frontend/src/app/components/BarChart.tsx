// src/app/components/BarChart.tsx
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ data }: { data: any }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Bar Data",
        data: data?.values || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
}