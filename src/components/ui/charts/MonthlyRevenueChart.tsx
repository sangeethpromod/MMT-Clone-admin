"use client"

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 45000, commission: 6750 },
  { month: "Feb", revenue: 52000, commission: 7800 },
  { month: "Mar", revenue: 48000, commission: 7200 },
  { month: "Apr", revenue: 61000, commission: 9150 },
  { month: "May", revenue: 55000, commission: 8250 },
  { month: "Jun", revenue: 67000, commission: 10050 },
  { month: "Jul", revenue: 72000, commission: 10800 },
  { month: "Aug", revenue: 68000, commission: 10200 },
  { month: "Sep", revenue: 74000, commission: 11100 },
  { month: "Oct", revenue: 82000, commission: 12300 },
  { month: "Nov", revenue: 89000, commission: 13350 },
  { month: "Dec", revenue: 95000, commission: 14250 },
];

export default function MonthlyRevenueChart() {
  return (
    <div className="bg-white rounded-md border border-[#e4e4e4]">
      <div className="border-b border-[#e4e4e4] flex items-center p-2 mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        Monthly Revenue Trend
      </h3>
      </div>
      <div className="p-2">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2853AF"
            strokeWidth={2}
            dot={{ fill: "#2853AF", r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Revenue"
          />
          <Line
            type="monotone"
            dataKey="commission"
            stroke="#FF2B36"
            strokeWidth={2}
            dot={{ fill: "#FF2B36", r: 4 }}
            activeDot={{ r: 6 }}
            name="Commission Earned"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
