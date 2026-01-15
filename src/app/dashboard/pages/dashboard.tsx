import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Wallet,
  Calendar,
  CalendarCheck,
  Building2,
  PiggyBank,
  BadgeDollarSign,
} from "lucide-react";
import KPICard from "../../../components/ui/kpiCard";
import Dropdown from "../../../components/ui/dropdown";
import MonthlyRevenueChart from "../../../components/ui/charts/MonthlyRevenueChart";
import MonthlyBookingsChart from "../../../components/ui/charts/MonthlyBookingsChart";
import CommissionEarnedChart from "../../../components/ui/charts/CommissionEarnedChart";
import TopDestinationsChart from "../../../components/ui/charts/TopDestinationsChart";
import HostTravellerGrowthChart from "../../../components/ui/charts/HostTravellerGrowthChart";
import ApprovalFunnelChart from "../../../components/ui/charts/ApprovalFunnelChart";

const monthOptions = [
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
  { label: "July", value: "july" },
  { label: "August", value: "august" },
  { label: "September", value: "september" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" },
];

const topHosts = [
  { name: "Luxury Villas Co.", revenue: "$12,450", rank: 1 },
  { name: "Beach Paradise", revenue: "$11,230", rank: 2 },
  { name: "Mountain Retreats", revenue: "$9,840", rank: 3 },
  { name: "Urban Homes", revenue: "$8,560", rank: 4 },
  { name: "Cozy Cottages", revenue: "$7,320", rank: 5 },
];

export default function DashboardContent() {
  const [selectedMonth, setSelectedMonth] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">Offbeat KPI Metrics</h1>
          <Dropdown
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="Select month"
          />
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <KPICard
              label="Total Platform Revenue (MTD)"
              value="$145,320"
              icon={<Wallet size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Platform Commission Earned"
              value="$21,798"
              icon={<PiggyBank size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Total Platform Revenue (YTD)"
              value="$1,234,560"
              icon={<TrendingUp size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Active Hosts"
              value="342"
              icon={<Building2 size={20} strokeWidth={1.5} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <KPICard
              label="Active Travellers"
              value="5,847"
              icon={<Users size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Total Bookings (MTD)"
              value="1,245"
              icon={<Calendar size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Total Bookings (YTD)"
              value="9,856"
              icon={<CalendarCheck size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Approval Queue Count"
              value="28"
              icon={<CheckCircle size={20} strokeWidth={1.5} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard
              label="Revenue per Active Host"
              value="$424.75"
              icon={<BadgeDollarSign size={20} strokeWidth={1.5} />}
            />
            <KPICard
              label="Revenue per Active Traveller"
              value="$24.87"
              icon={<DollarSign size={20} strokeWidth={1.5} />}
            />
          </div>
        </div>

        <div className="h-px bg-gray-100 my-10"></div>

        <div className="mb-10">
          <h2 className="text-base font-medium text-gray-900 mb-5">Top Revenue Hosts</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topHosts.map((host) => (
              <KPICard
                key={host.rank}
                label={host.name}
                value={host.revenue}
                icon={
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-semibold">
                    {host.rank}
                  </span>
                }
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100 my-10"></div>

        <div className="mb-8">
          <h2 className="text-base font-medium text-gray-900 mb-5">Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <MonthlyRevenueChart />
            <MonthlyBookingsChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <CommissionEarnedChart />
            <TopDestinationsChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HostTravellerGrowthChart />
            <ApprovalFunnelChart />
          </div>
        </div>
      </div>
    </div>
  );
}