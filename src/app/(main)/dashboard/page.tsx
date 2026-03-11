import { redirect } from "next/navigation";
import { CommissionChart } from "@/app/(main)/dashboard/_components/commission-chart";
import { DistributionChart } from "@/app/(main)/dashboard/_components/distribution-chart";
import { Header } from "@/app/(main)/dashboard/_components/header";
import { KpiGrid } from "@/app/(main)/dashboard/_components/kpi-grid";
import { MonthlyGoal } from "@/app/(main)/dashboard/_components/monthly-goal";
import { getServerSession } from "@/lib/session";
import {
  getCommissionsChart,
  getGoal,
  getSummary,
  getTopOperations,
} from "@/services/dashboard.service";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [summary, ranking, weeklyData, monthlyData, goalData] =
    await Promise.all([
      getSummary(session.userId),
      getTopOperations(session.userId),
      getCommissionsChart(session.userId, "weekly"),
      getCommissionsChart(session.userId, "monthly"),
      getGoal(session.userId, month, year),
    ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-background text-slate-800 dark:text-foreground">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <KpiGrid data={summary} />

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Commission Growth Chart */}
          <CommissionChart weeklyData={weeklyData} monthlyData={monthlyData} />

          {/* Distribution Donut */}
          <DistributionChart ranking={ranking} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Monthly Goal */}
          <MonthlyGoal initialData={goalData} />
        </div>
      </div>
    </div>
  );
}
