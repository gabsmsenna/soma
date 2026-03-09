import { CommissionChart } from "@/app/(main)/dashboard/_components/commission-chart";
import { DistributionChart } from "@/app/(main)/dashboard/_components/distribution-chart";
import { Header } from "@/app/(main)/dashboard/_components/header";
import { KpiGrid } from "@/app/(main)/dashboard/_components/kpi-grid";
import { MonthlyGoal } from "@/app/(main)/dashboard/_components/monthly-goal";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-background text-slate-800 dark:text-foreground">
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
