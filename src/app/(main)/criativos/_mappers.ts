import type { Creative, Operation } from "@prisma/client";
import type { CreativeMetrics, CreativeViewModel } from "./_types";

type CreativeWithRelations = Creative & {
  operation: Operation;
};

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function toCreativeViewModel(
  c: CreativeWithRelations,
): CreativeViewModel {
  return {
    id: c.id,
    name: c.name,
    totalProfit: c.totalProfit.toString(),
    freelancerCut: c.freelancerCut.toString(),
    totalProfitFormatted: formatBRL(c.totalProfit.toNumber()),
    freelancerCutFormatted: formatBRL(c.freelancerCut.toNumber()),
    isActive: c.isActive,
    isPaid: c.isPaid,
    paidAt: c.paidAt?.toISOString() ?? null,
    operationId: c.operationId,
    operationName: c.operation.name,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export function computeMetrics(
  creatives: CreativeWithRelations[],
): CreativeMetrics {
  const totalActive = creatives.filter((c) => c.isActive).length;

  const totalProfit = creatives.reduce(
    (sum, c) => sum + c.totalProfit.toNumber(),
    0,
  );

  const pendingCreatives = creatives.filter(
    (c) => c.totalProfit.toNumber() > 0,
  );
  const pendingPayment = pendingCreatives.reduce(
    (sum, c) => sum + c.freelancerCut.toNumber(),
    0,
  );
  const pendingCount = pendingCreatives.length;

  const average = creatives.length > 0 ? totalProfit / creatives.length : 0;

  return {
    totalActive,
    totalProfitFormatted: formatBRL(totalProfit),
    pendingPaymentFormatted: formatBRL(pendingPayment),
    pendingCount,
    averageFormatted: formatBRL(average),
  };
}
