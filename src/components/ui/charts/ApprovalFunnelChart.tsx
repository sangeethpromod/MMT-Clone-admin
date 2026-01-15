"use client"

import React from "react";
import {
  Funnel,
  FunnelChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Submitted", value: 1250 },
  { name: "Under Review", value: 950 },
  { name: "Approved", value: 780 },
];

const colors = ["#2853AF", "#6b7280", "#FF2B36"];

export default function ApprovalFunnelChart() {
  return (
     <div className="bg-white rounded-md border border-[#e4e4e4]">
      <div className="border-b border-[#e4e4e4] flex items-center p-2 mb-4">
      <h3 className="text-lg font-medium text-gray-900">
        Approval Funnel: Submitted → Reviewed → Approved
      </h3>
      </div>
      <div className="p-2">
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value) => `${value} items`}
          />
          <Legend />
          <Funnel
            dataKey="value"
            data={data}
            fill="#8884d8"
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item.name} className="text-center">
            <div
              className="inline-block w-4 h-4 rounded-full mb-2"
              style={{ backgroundColor: colors[index] }}
            ></div>
            <p className="text-sm text-gray-600">{item.name}</p>
            <p className="text-lg font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
