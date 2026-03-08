import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerSession } from "@/lib/session";
import { findProfitPaymentsGroupedByOperation } from "@/services/creative.service";
import { DateRangeFilter } from "./_components/date-range-filter";
import { ProfitPaymentsList } from "./_components/profit-payments-list";

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

  const groups = await findProfitPaymentsGroupedByOperation(
    session.userId,
    startDate,
    endDate,
  );

  const totalComissao = groups.reduce((sum, g) => sum + g.totalComissao, 0);
  const totalLucro = groups.reduce((sum, g) => sum + g.totalLucro, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-2">Relatório de Lucros</h2>
          <p className="text-muted-foreground">
            Histórico de pagamentos de comissão agrupado por operação.
          </p>
        </div>

        <Suspense>
          <DateRangeFilter />
        </Suspense>

        {groups.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Operações
              </p>
              <p className="text-2xl font-bold">{groups.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Lucro total
              </p>
              <p className="text-2xl font-bold">
                {totalLucro.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4 col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Comissão total
              </p>
              <p className="text-2xl font-bold text-[#FFBB00]">
                {totalComissao.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        )}

        <ProfitPaymentsList groups={groups} />
      </div>
    </div>
  );
}
