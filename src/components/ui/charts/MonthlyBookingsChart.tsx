"use client"

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", bookings: 245, target: 300 },
  { month: "Feb", bookings: 289, target: 300 },
  { month: "Mar", bookings: 267, target: 350 },
  { month: "Apr", bookings: 342, target: 350 },
  { month: "May", bookings: 318, target: 400 },
  { month: "Jun", bookings: 401, target: 400 },
  { month: "Jul", bookings: 456, target: 450 },
  { month: "Aug", bookings: 423, target: 450 },
  { month: "Sep", bookings: 778, target: 500 },
  { month: "Oct", bookings: 578, target: 550 },
  { month: "Nov", bookings: 222, target: 600 },
  { month: "Dec", bookings: 150, target: 650 },
];

export default function MonthlyBookingsChart() {
  return (
    <div className="bg-white rounded-md border border-[#e4e4e4]">
      <div className="border-b border-[#e4e4e4] flex items-center p-2 mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        Monthly Bookings Trend
      </h3>
      </div>
      <div className="p-2">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2853AF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2853AF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF2B36" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF2B36" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="bookings"
            stroke="#2853AF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBookings)"
            name="Actual Bookings"
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#FF2B36"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTarget)"
            name="Target Bookings"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
