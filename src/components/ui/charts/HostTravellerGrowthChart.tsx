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
  { month: "Jan", hosts: 120, travellers: 2100 },
  { month: "Feb", hosts: 135, travellers: 2400 },
  { month: "Mar", hosts: 152, travellers: 2800 },
  { month: "Apr", hosts: 178, travellers: 3200 },
  { month: "May", hosts: 195, travellers: 3600 },
  { month: "Jun", hosts: 218, travellers: 4100 },
  { month: "Jul", hosts: 245, travellers: 4600 },
  { month: "Aug", hosts: 268, travellers: 5100 },
  { month: "Sep", hosts: 295, travellers: 5500 },
  { month: "Oct", hosts: 318, travellers: 5900 },
  { month: "Nov", hosts: 330, travellers: 5847 },
  { month: "Dec", hosts: 342, travellers: 5847 },
];

export default function HostTravellerGrowthChart() {
  return (
    <div className="bg-white rounded-md border border-[#e4e4e4]">
      <div className="border-b border-[#e4e4e4] flex items-center p-2 mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        Host vs Traveller Growth Curve
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
            dataKey="hosts"
            stroke="#FF2B36"
            strokeWidth={2}
            dot={{ fill: "#FF2B36", r: 4 }}
            activeDot={{ r: 6 }}
            name="Active Hosts"
          />
          <Line
            type="monotone"
            dataKey="travellers"
            stroke="#2853AF"
            strokeWidth={2}
            dot={{ fill: "#2853AF", r: 4 }}
            activeDot={{ r: 6 }}
            name="Active Travellers"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
