import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  SummaryResponse,
  MetricCard,
  CommissionsChartResponse,
  CommissionsDataPoint,
  RankingEntry,
  GoalResponse,
} from "@/dtos/dashboard.dto";

// ─── Helpers ───

function calcMetricCard(current: number, previous: number): MetricCard {
  let percentChange = 0;
  if (previous > 0) {
    percentChange = Math.round(((current - previous) / previous) * 100);
  } else if (current > 0) {
    percentChange = 100;
  }
  return {
    value: current,
    percentChange,
    trend: current > 0 && current >= previous ? "up" : "down",
  };
}

function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

// ─── Summary Cards ───

export async function getSummary(userId: string): Promise<SummaryResponse> {
  const now = new Date();
  const current = getMonthRange(now);
  const prev = getMonthRange(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
  );

  const userFilter = { operation: { userId } };

  // Aggregate current month
  const currentAgg = await prisma.creative.aggregate({
    where: {
      ...userFilter,
      createdAt: { gte: current.start, lt: current.end },
    },
    _sum: { totalProfit: true, freelancerCut: true },
  });

  // Aggregate previous month
  const prevAgg = await prisma.creative.aggregate({
    where: { ...userFilter, createdAt: { gte: prev.start, lt: prev.end } },
    _sum: { totalProfit: true, freelancerCut: true },
  });

  // Active creatives count (current)
  const activeCreativesCurrent = await prisma.creative.count({
    where: { operation: { userId }, isActive: true },
  });

  // Active creatives count (previous month)
  const activeCreativesPrev = await prisma.creative.count({
    where: {
      operation: { userId },
      isActive: true,
      createdAt: { lt: current.start },
    },
  });

  const curTotal = Number(currentAgg._sum.totalProfit ?? 0);
  const prevTotal = Number(prevAgg._sum.totalProfit ?? 0);
  const curCut = Number(currentAgg._sum.freelancerCut ?? 0);
  const prevCut = Number(prevAgg._sum.freelancerCut ?? 0);

  return {
    totalProfit: calcMetricCard(curTotal, prevTotal),
    activeCreatives: calcMetricCard(
      activeCreativesCurrent,
      activeCreativesPrev,
    ),
    myProfit: calcMetricCard(curCut, prevCut),
  };
}

// ─── Commissions Chart ───

export async function getCommissionsChart(
  userId: string,
  period: "weekly" | "monthly",
): Promise<CommissionsChartResponse> {
  const truncUnit = period === "weekly" ? "week" : "month";

  const rows = await prisma.$queryRaw<
    Array<{
      period_label: string;
      total_profit: Prisma.Decimal;
      my_profit: Prisma.Decimal;
    }>
  >(
    Prisma.sql`
      SELECT
        TO_CHAR(DATE_TRUNC(${Prisma.raw(`'${truncUnit}'`)}, c."createdAt"), 'YYYY-MM-DD') AS period_label,
        COALESCE(SUM(c."totalProfit"), 0) AS total_profit,
        COALESCE(SUM(c."freelancerCut"), 0) AS my_profit
      FROM creatives c
      JOIN operations o ON c."operationId" = o.id
      WHERE o."userId" = ${userId}
      GROUP BY DATE_TRUNC(${Prisma.raw(`'${truncUnit}'`)}, c."createdAt")
      ORDER BY DATE_TRUNC(${Prisma.raw(`'${truncUnit}'`)}, c."createdAt") ASC
    `,
  );

  const data: CommissionsDataPoint[] = rows.map((r) => ({
    label: r.period_label,
    totalProfit: Number(r.total_profit),
    myProfit: Number(r.my_profit),
  }));

  return { period, data };
}

// ─── Top 5 Operations Ranking ───

export async function getTopOperations(
  userId: string,
): Promise<RankingEntry[]> {
  const rows = await prisma.$queryRaw<
    Array<{ operation_name: string; total_profit: Prisma.Decimal }>
  >(
    Prisma.sql`
      SELECT
        o.name AS operation_name,
        COALESCE(SUM(c."freelancerCut"), 0) AS total_profit
      FROM creatives c
      JOIN operations o ON c."operationId" = o.id
      WHERE o."userId" = ${userId}
      GROUP BY o.id, o.name
      ORDER BY total_profit DESC
      LIMIT 5
    `,
  );

  return rows.map((r) => ({
    operationName: r.operation_name,
    totalProfit: Number(r.total_profit),
  }));
}

// ─── Monthly Goals ───

export async function upsertGoal(
  userId: string,
  month: number,
  year: number,
  amount: number,
) {
  return prisma.monthlyGoal.upsert({
    where: { userId_month_year: { userId, month, year } },
    create: {
      userId,
      month,
      year,
      amount: new Prisma.Decimal(amount.toString()),
    },
    update: {
      amount: new Prisma.Decimal(amount.toString()),
    },
  });
}

export async function getGoal(
  userId: string,
  month: number,
  year: number,
): Promise<GoalResponse> {
  const goal = await prisma.monthlyGoal.findUnique({
    where: { userId_month_year: { userId, month, year } },
  });

  const { start, end } = getMonthRange(new Date(year, month - 1, 1));

  const agg = await prisma.creative.aggregate({
    where: {
      operation: { userId },
      createdAt: { gte: start, lt: end },
    },
    _sum: { freelancerCut: true },
  });

  const achieved = Number(agg._sum.freelancerCut ?? 0);
  const goalAmount = goal ? Number(goal.amount) : null;
  const remaining =
    goalAmount !== null ? Math.max(goalAmount - achieved, 0) : 0;
  const percentAchieved =
    goalAmount !== null && goalAmount > 0
      ? Math.round((achieved / goalAmount) * 100 * 10) / 10
      : 0;

  return {
    goal: goalAmount,
    achieved,
    remaining,
    percentAchieved,
  };
}
