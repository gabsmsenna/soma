import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerSession } from "@/lib/session";
import { getProfitReport } from "@/services/profit-report.service";
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
    <div className="flex flex-col min-h-screen bg-[#181610] text-slate-100">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Relatório de Lucros
              </h2>
              <p className="text-slate-400 mt-1">
                Histórico de pagamentos de comissão agrupado por operação
              </p>
            </div>
          </div>

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
