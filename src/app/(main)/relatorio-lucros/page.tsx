import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerSession } from "@/lib/session";
import { getProfitReport } from "@/services/profit-report.service";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DateRangeFilter } from "./_components/date-range-filter";
import { KpiCards } from "./_components/kpi-cards";
import { OperationsList } from "./_components/operations-list";

interface RelatorioLucrosPageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function RelatorioLucrosPage({
  searchParams,
}: RelatorioLucrosPageProps) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const { startDate: startDateParam, endDate: endDateParam } =
    await searchParams;

  const now = new Date();
  const defaultEnd = now;
  const defaultStart = new Date(now);
  defaultStart.setDate(defaultStart.getDate() - 30);

  const startDate = startDateParam ? new Date(startDateParam) : defaultStart;
  const endDate = endDateParam
    ? new Date(`${endDateParam}T23:59:59`)
    : defaultEnd;

  const report = await getProfitReport(session.userId, startDate, endDate);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-background text-slate-800 dark:text-foreground">
      <header className="h-20 border-b border-slate-200 dark:border-border flex items-center justify-between px-6 sticky top-0 bg-[#F8F9FB]/80 dark:bg-background/80 backdrop-blur-sm z-10 w-full shrink-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="h-6 bg-slate-200 dark:bg-border"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">
              Relatório de Lucros
            </h1>
            <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">
              Histórico de pagamentos de comissão agrupado por operação
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          <Suspense>
            <DateRangeFilter />
          </Suspense>

          <KpiCards kpis={report.kpis} />

          <OperationsList operations={report.operations} />
        </div>
      </main>
    </div>
  );
}
