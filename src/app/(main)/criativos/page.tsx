import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { findAllByUserId } from "@/services/creative.service";
import { getAll } from "@/services/operation.service";
import { CreativesFooter } from "./_components/creatives-footer";
import { CreativesGrid } from "./_components/creatives-grid";
import { CreativesHeader } from "./_components/creatives-header";
import { CreativesMetrics } from "./_components/creatives-metrics";
import { CreativesPagination } from "./_components/creatives-pagination";
import { computeMetrics, toCreativeViewModel } from "./_mappers";
import type { CreativeStatus, PaymentStatus } from "./_types";

const PAGE_LIMIT = 12;

interface CriativosPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: CreativeStatus;
    operation?: string;
    paymentStatus?: PaymentStatus;
  }>;
}

export default async function CriativosPage({
  searchParams,
}: CriativosPageProps) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const {
    page: pageParam,
    search,
    status,
    operation,
    paymentStatus,
  } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [{ data, pagination }, operations] = await Promise.all([
    findAllByUserId(
      session.userId,
      page,
      PAGE_LIMIT,
      search,
      status,
      operation,
      paymentStatus,
    ),
    getAll(session.userId),
  ]);

  const creatives = data.map(toCreativeViewModel);
  const metrics = computeMetrics(data);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-background text-slate-800 dark:text-foreground">
      <CreativesHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-2">
            Gerenciamento de Criativos
          </h2>
          <p className="text-muted-foreground">
            Monitore performance, pagamentos e registre novos lucros
            rapidamente.
          </p>
        </div>

        <CreativesMetrics metrics={metrics} />

        <CreativesGrid
          creatives={creatives}
          total={pagination.total}
          operations={operations}
        />

        <CreativesPagination pagination={pagination} />
      </div>

      <CreativesFooter metrics={metrics} />
    </div>
  );
}
