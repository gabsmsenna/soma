import type {
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
  const periodLength = endDate.getTime() - startDate.getTime();
  const prevStart = new Date(startDate.getTime() - periodLength);
  const prevEnd = new Date(startDate);

  const [currentEntries, previousEntries, unpaidCreatives] = await Promise.all([
    prisma.profitEntry.findMany({
      where: {
        paidAt: { gte: startDate, lte: endDate },
        creative: { operation: { userId } },
      },
      include: {
        creative: { include: { operation: true } },
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.profitEntry.findMany({
      where: {
        paidAt: { gte: prevStart, lte: prevEnd },
        creative: { operation: { userId } },
      },
      include: {
        creative: { include: { operation: true } },
      },
    }),
    prisma.creative.findMany({
      where: {
        totalProfit: { gt: 0 },
        isActive: true,
        operation: { userId },
      },
      include: { operation: true },
    }),
  ]);

  // Build previous period totals per creative for trend calculation
  const prevTotalsByCreative = new Map<string, number>();
  for (const entry of previousEntries) {
    const current = prevTotalsByCreative.get(entry.creativeId) ?? 0;
    prevTotalsByCreative.set(entry.creativeId, current + entry.totalProfit);
  }

  // KPIs
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

  // Aggregate profit per creative for top/bottom
  const profitByCreative = new Map<
    string,
    { name: string; operationName: string; totalProfit: number }
  >();
  for (const entry of currentEntries) {
    const key = entry.creativeId;
    const existing = profitByCreative.get(key);
    if (existing) {
      existing.totalProfit += entry.totalProfit;
    } else {
      profitByCreative.set(key, {
        name: entry.creative.name,
        operationName: entry.creative.operation.name,
        totalProfit: entry.totalProfit,
      });
    }
  }

  const creativesList = Array.from(profitByCreative.values());
  let topCreative: ProfitReportKpis["topCreative"] = null;
  let bottomCreative: ProfitReportKpis["bottomCreative"] = null;

  if (creativesList.length > 0) {
    creativesList.sort((a, b) => b.totalProfit - a.totalProfit);
    topCreative = creativesList[0];
    bottomCreative = creativesList[creativesList.length - 1];
  }

  const kpis: ProfitReportKpis = {
    totalProfit,
    myProfit,
    percentChange,
    topCreative,
    bottomCreative,
  };

  // Build operation groups
  const operationMap = new Map<string, ProfitReportOperationGroup>();

  // Add paid entries
  for (const entry of currentEntries) {
    const op = entry.creative.operation;
    let group = operationMap.get(op.id);
    if (!group) {
      group = {
        operationId: op.id,
        operationName: op.name,
        freelancerCutPercentage: Number(op.freelancerCutPercentage),
        totalProfit: 0,
        myProfit: 0,
        creatives: [],
      };
      operationMap.set(op.id, group);
    }

    const prevTotal = prevTotalsByCreative.get(entry.creativeId);
    const trend = computeTrend(entry.totalProfit, prevTotal);

    group.totalProfit += entry.totalProfit;
    group.myProfit += entry.commission;
    group.creatives.push({
      creativeId: entry.creativeId,
      creativeName: entry.creative.name,
      totalProfit: entry.totalProfit,
      commission: entry.commission,
      paidAt: entry.paidAt,
      isPaid: true,
      trend,
    });
  }

  // Add unpaid creatives
  // Exclude creatives that already appear as paid entries
  const paidCreativeIds = new Set(currentEntries.map((e) => e.creativeId));

  for (const creative of unpaidCreatives) {
    if (paidCreativeIds.has(creative.id)) continue;

    const op = creative.operation;
    let group = operationMap.get(op.id);
    if (!group) {
      group = {
        operationId: op.id,
        operationName: op.name,
        freelancerCutPercentage: Number(op.freelancerCutPercentage),
        totalProfit: 0,
        myProfit: 0,
        creatives: [],
      };
      operationMap.set(op.id, group);
    }

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

  return {
    kpis,
    operations: Array.from(operationMap.values()),
  };
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
