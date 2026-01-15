"use client"

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { destination: "Bali", revenue: 18500, bookings: 342 },
  { destination: "Paris", revenue: 16200, bookings: 289 },
  { destination: "Tokyo", revenue: 14800, bookings: 267 },
  { destination: "Barcelona", revenue: 12450, bookings: 234 },
  { destination: "Maldives", revenue: 11300, bookings: 198 },
];

export default function TopDestinationsChart() {
  return (
    <div className="bg-white rounded-md border border-[#e4e4e4]">
      <div className="border-b border-[#e4e4e4] flex items-center p-2 mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        Top-Performing Destinations Chart
      </h3>
      </div>
      <div className="p-2">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis dataKey="destination" type="category" stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value) =>
              typeof value === "number" ? `$${value.toLocaleString()}` : value
            }
          />
          <Legend />
          <Bar dataKey="revenue" fill="#FF2B36" name="Revenue" radius={[0, 8, 8, 0]} />
          <Bar dataKey="bookings" fill="#2853AF" name="Bookings" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
