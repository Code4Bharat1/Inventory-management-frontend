"use client";

import DashboardCard from "./DashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Inventory Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Total Products" count={data.totalProducts} />
          <DashboardCard title="Low Stock" count={data.lowStockProducts} />
          <DashboardCard title="Out of Stock" count={data.outOfStockProducts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
