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
  { month: "Jan", commission: 6750 },
  { month: "Feb", commission: 7800 },
  { month: "Mar", commission: 7200 },
  { month: "Apr", commission: 9150 },
  { month: "May", commission: 8250 },
  { month: "Jun", commission: 10050 },
  { month: "Jul", commission: 10800 },
  { month: "Aug", commission: 10200 },
  { month: "Sep", commission: 11100 },
  { month: "Oct", commission: 12300 },
  { month: "Nov", commission: 13350 },
  { month: "Dec", commission: 14250 },
];

export default function CommissionEarnedChart() {
  return (
    <div className="bg-white rounded-md border border-[#e4e4e4]">
      <div className="border-b border-[#e4e4e4] flex items-center p-2 mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        Commission Earned Over Time
      </h3>
      </div>
      <div className="p-2">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar
            dataKey="commission"
            fill="#FF2B36"
            radius={[8, 8, 0, 0]}
            name="Commission Earned"
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
