// src/app/components/PieChart.tsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: any }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Pie Data",
        data: data?.values || [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return <Pie data={chartData} />;
}