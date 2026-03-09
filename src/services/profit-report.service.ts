import { differenceInDays, subDays } from "date-fns";
import type {
  ProfitReportCreativeEntry,
  ProfitReportKpis,
  ProfitReportOperationGroup,
  ProfitReportResponse,
  TrendDirection,
} from "@/dtos/profit-report.dto";
import prisma from "@/lib/prisma";

export async function getProfitReport(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<ProfitReportResponse> {
  const daysDiff = differenceInDays(endDate, startDate);
  const prevStart = subDays(startDate, daysDiff);
  const prevEnd = new Date(startDate);

  const [currentEntries, previousEntries, unpaidCreatives] = await Promise.all([
    prisma.profitEntry.findMany({
      where: {
        paidAt: { gte: startDate, lte: endDate },
        creative: { operation: { userId } },
      },
      include: { creative: { include: { operation: true } } },
      orderBy: { paidAt: "desc" },
    }),
    prisma.profitEntry.findMany({
      where: {
        paidAt: { gte: prevStart, lte: prevEnd },
        creative: { operation: { userId } },
      },
      include: { creative: { include: { operation: true } } },
    }),
    prisma.creative.findMany({
      where: {
        totalProfit: { gt: 0 },
        isActive: true,
        operation: { userId },
        profitLogs: {
          some: { createdAt: { gte: startDate, lte: endDate } },
        },
      },
      include: { operation: true },
    }),
  ]);

  const prevTotalsByCreative = aggregateByCreative(
    previousEntries,
    (e) => e.totalProfit,
  );
  const currentTotalsByCreative = aggregateByCreative(
    currentEntries,
    (e) => e.totalProfit,
  );
  const currentCommissionsByCreative = aggregateByCreative(
    currentEntries,
    (e) => e.commission,
  );

  const kpis = buildKpis(currentEntries, previousEntries);
  const operationMap = new Map<string, ProfitReportOperationGroup>();

  // Process paid entries — consolidate per creative
  const paidCreativeIds = new Set<string>();

  for (const entry of currentEntries) {
    const creativeId = entry.creativeId;
    if (paidCreativeIds.has(creativeId)) continue;
    paidCreativeIds.add(creativeId);

    const op = entry.creative.operation;
    const group = getOrCreateGroup(operationMap, op);

    const totalProfit = currentTotalsByCreative.get(creativeId) ?? 0;
    const commission = currentCommissionsByCreative.get(creativeId) ?? 0;
    const trend = computeTrend(
      totalProfit,
      prevTotalsByCreative.get(creativeId),
    );

    group.totalProfit += totalProfit;
    group.myProfit += commission;
    group.creatives.push({
      creativeId,
      creativeName: entry.creative.name,
      totalProfit,
      commission,
      paidAt: entry.paidAt,
      isPaid: true,
      trend,
    });
  }

  // Add unpaid creatives (skip those already processed as paid)
  for (const creative of unpaidCreatives) {
    if (paidCreativeIds.has(creative.id)) continue;

    const group = getOrCreateGroup(operationMap, creative.operation);

    group.creatives.push({
      creativeId: creative.id,
      creativeName: creative.name,
      totalProfit: Number(creative.totalProfit),
      commission: Number(creative.freelancerCut),
      paidAt: null,
      isPaid: false,
      trend: "estavel",
    });
  }

  return { kpis, operations: Array.from(operationMap.values()) };
}

function aggregateByCreative<T extends { creativeId: string }>(
  entries: T[],
  getValue: (entry: T) => number,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of entries) {
    map.set(
      entry.creativeId,
      (map.get(entry.creativeId) ?? 0) + getValue(entry),
    );
  }
  return map;
}

function buildKpis(
  currentEntries: {
    totalProfit: number;
    commission: number;
    creativeId: string;
    creative: { name: string; operation: { name: string } };
  }[],
  previousEntries: { totalProfit: number }[],
): ProfitReportKpis {
  const totalProfit = currentEntries.reduce((s, e) => s + e.totalProfit, 0);
  const myProfit = currentEntries.reduce((s, e) => s + e.commission, 0);
  const prevTotalProfit = previousEntries.reduce(
    (s, e) => s + e.totalProfit,
    0,
  );

  let percentChange = 0;
  if (prevTotalProfit > 0) {
    percentChange = Math.round(
      ((totalProfit - prevTotalProfit) / prevTotalProfit) * 100,
    );
  } else if (totalProfit > 0) {
    percentChange = 100;
  }

  const profitByCreative = aggregateByCreative(
    currentEntries,
    (e) => e.totalProfit,
  );
  const creativesList = Array.from(profitByCreative.entries())
    .map(([creativeId, profit]) => {
      const entry = currentEntries.find((e) => e.creativeId === creativeId)!;
      return {
        name: entry.creative.name,
        operationName: entry.creative.operation.name,
        totalProfit: profit,
      };
    })
    .sort((a, b) => b.totalProfit - a.totalProfit);

  let topCreative: ProfitReportKpis["topCreative"] = null;
  let bottomCreative: ProfitReportKpis["bottomCreative"] = null;

  if (creativesList.length > 0) {
    topCreative = creativesList[0];
    bottomCreative = creativesList[creativesList.length - 1];
  }

  return { totalProfit, myProfit, percentChange, topCreative, bottomCreative };
}

function getOrCreateGroup(
  map: Map<string, ProfitReportOperationGroup>,
  operation: { id: string; name: string; freelancerCutPercentage: unknown },
): ProfitReportOperationGroup {
  let group = map.get(operation.id);
  if (!group) {
    group = {
      operationId: operation.id,
      operationName: operation.name,
      freelancerCutPercentage: Number(operation.freelancerCutPercentage),
      totalProfit: 0,
      myProfit: 0,
      creatives: [],
    };
    map.set(operation.id, group);
  }
  return group;
}

function computeTrend(
  currentTotal: number,
  previousTotal: number | undefined,
): TrendDirection {
  if (previousTotal === undefined || previousTotal === 0) return "estavel";
  if (currentTotal > previousTotal) return "ascensao";
  if (currentTotal < previousTotal) return "queda";
  return "estavel";
}
