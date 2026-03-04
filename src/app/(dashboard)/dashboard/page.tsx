import { CommissionChart } from "@/components/dashboard/commission-chart";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { Header } from "@/components/dashboard/header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { MonthlyGoal } from "@/components/dashboard/monthly-goal";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <KpiGrid />

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Commission Growth Chart */}
          <CommissionChart />

          {/* Distribution Donut */}
          <DistributionChart />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Monthly Goal */}
          <MonthlyGoal />
        </div>
      </div>
    </div>
  );
}
