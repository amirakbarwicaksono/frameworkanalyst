"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaChartLine, FaChartPie, FaBars, FaClock } from "react-icons/fa"; // Import chart icons
import dynamic from "next/dynamic";

// Dynamically import chart libraries to avoid SSR issues
const LineChart = dynamic(() => import("@linechart"), { ssr: false });
const PieChart = dynamic(() => import("@piechart"), { ssr: false });
const BarChart = dynamic(() => import("@barchart"), { ssr: false });

export default function Dashboard() {
  const [data, setData] = useState<any>(null); // Placeholder for fetched data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard-data`);
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-black p-4">
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/log-history" className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          <FaClock className="inline mr-1" /> Log History
        </Link>
      </header>

      {/* Layout for Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Section 1: Line Chart */}
        <section className="border border-gray-300 rounded-lg p-4 bg-foreground shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaChartLine className="mr-2" /> Line Chart
          </h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : data ? (
            <LineChart data={data.lineChart} />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </section>

        {/* Section 2: Pie Chart */}
        <section className="border border-gray-300 rounded-lg p-4 bg-foreground shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaChartPie className="mr-2" /> Pie Chart
          </h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : data ? (
            <PieChart data={data.pieChart} />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </section>

        {/* Section 3: Bar Chart */}
        <section className="border border-gray-300 rounded-lg p-4 bg-foreground shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaBars className="mr-2" /> Bar Chart
          </h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : data ? (
            <BarChart data={data.barChart} />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </section>

        {/* Section 4: Summary Cards */}
        <section className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="p-4 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <h4 className="text-xs font-bold mb-2 text-center">Metric {index}</h4>
              <p className="text-lg font-bold text-center">1,234</p>
              <p className="text-xs italic text-center">Last Updated: Loading...</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}