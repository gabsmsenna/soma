import type { Creative, Operation, Project } from "@prisma/client";
import type { CreativeMetrics, CreativeViewModel } from "./_types";

type CreativeWithRelations = Creative & {
  project: Project & { operation: Operation };
};

function formatBRL(value: string | number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function toCreativeViewModel(
  c: CreativeWithRelations,
): CreativeViewModel {
  return {
    id: c.id,
    name: c.name,
    totalProfit: c.totalProfit.toString(),
    freelancerCut: c.freelancerCut.toString(),
    totalProfitFormatted: formatBRL(c.totalProfit.toString()),
    freelancerCutFormatted: formatBRL(c.freelancerCut.toString()),
    isPaid: c.isPaid,
    paidAt: c.paidAt ? c.paidAt.toISOString() : null,
    projectId: c.projectId,
    projectName: c.project.name,
    projectIsActive: c.project.isActive,
    operationId: c.project.operationId,
    operationName: c.project.operation.name,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export function computeMetrics(
  creatives: CreativeViewModel[],
): CreativeMetrics {
  const totalActive = creatives.filter((c) => c.projectIsActive).length;

  const totalProfit = creatives.reduce(
    (sum, c) => sum + Number(c.totalProfit),
    0,
  );

  const pendingCreatives = creatives.filter((c) => !c.isPaid);
  const pendingPayment = pendingCreatives.reduce(
    (sum, c) => sum + Number(c.freelancerCut),
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
