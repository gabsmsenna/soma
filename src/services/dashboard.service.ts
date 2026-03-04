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
        where: { ...userFilter, createdAt: { gte: current.start, lt: current.end } },
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
        activeCreatives: calcMetricCard(activeCreativesCurrent, activeCreativesPrev),
        myProfit: calcMetricCard(curCut, prevCut),
    };
}

// ─── Commissions Chart ───

function getWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const day = now.getDay(); // 0=Sun … 6=Sat
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    const end = new Date(start);
    end.setDate(start.getDate() + 7); // Monday of next week (exclusive)
    return { start, end };
}

function formatDateISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function generateDaySlots(start: Date, end: Date): string[] {
    const slots: string[] = [];
    const cursor = new Date(start);
    while (cursor < end) {
        slots.push(formatDateISO(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }
    return slots;
}

function generateMonthSlots(count: number): string[] {
    const now = new Date();
    const slots: string[] = [];
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        slots.push(formatDateISO(d));
    }
    return slots;
}

export async function getCommissionsChart(
    userId: string,
    period: "weekly" | "monthly",
): Promise<CommissionsChartResponse> {
    const isWeekly = period === "weekly";
    const truncUnit = isWeekly ? "day" : "month";

    let rangeStart: Date;
    let rangeEnd: Date;
    let allSlots: string[];

    if (isWeekly) {
        const { start, end } = getWeekRange();
        rangeStart = start;
        rangeEnd = end;
        allSlots = generateDaySlots(start, end);
    } else {
        const now = new Date();
        rangeStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        allSlots = generateMonthSlots(12);
    }

    const rows = await prisma.$queryRaw<
        Array<{ period_label: string; total_profit: Prisma.Decimal; my_profit: Prisma.Decimal }>
    >(
        Prisma.sql`
      SELECT
        TO_CHAR(DATE_TRUNC(${Prisma.raw(`'${truncUnit}'`)}, c."createdAt"), 'YYYY-MM-DD') AS period_label,
        COALESCE(SUM(c."totalProfit"), 0) AS total_profit,
        COALESCE(SUM(c."freelancerCut"), 0) AS my_profit
      FROM creatives c
      JOIN operations o ON c."operationId" = o.id
      WHERE o."userId" = ${userId}
        AND c."createdAt" >= ${rangeStart}
        AND c."createdAt" < ${rangeEnd}
      GROUP BY DATE_TRUNC(${Prisma.raw(`'${truncUnit}'`)}, c."createdAt")
      ORDER BY DATE_TRUNC(${Prisma.raw(`'${truncUnit}'`)}, c."createdAt") ASC
    `,
    );

    const rowMap = new Map(rows.map((r) => [r.period_label, r]));

    const data: CommissionsDataPoint[] = allSlots.map((slot) => {
        const r = rowMap.get(slot);
        return {
            label: slot,
            totalProfit: r ? Number(r.total_profit) : 0,
            myProfit: r ? Number(r.my_profit) : 0,
        };
    });

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
    const remaining = goalAmount !== null ? Math.max(goalAmount - achieved, 0) : 0;
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
