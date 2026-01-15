import React from "react";
import clsx from "clsx";

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <div
      className={clsx(
        "bg-white p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all group",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-gray-400 group-hover:text-gray-500 transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1.5 font-normal">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>

      {trend && (
        <div
          className={clsx(
            "text-sm font-medium mt-2",
            trend.direction === "up" ? "text-green-600" : "text-red-600"
          )}
        >
          {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
        </div>
      )}
    </div>
  );
};

export default KPICard;
