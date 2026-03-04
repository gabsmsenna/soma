import z from "zod";

// --- Query Params ---

export const commissionsPeriodSchema = z.object({
  period: z.enum(["weekly", "monthly"]),
});

export type CommissionsPeriodDto = z.infer<typeof commissionsPeriodSchema>;

// --- Monthly Goal ---

export const monthlyGoalSchema = z.object({
  amount: z.coerce.number().positive("O valor da meta deve ser positivo"),
});

export type MonthlyGoalDto = z.infer<typeof monthlyGoalSchema>;

// --- Response Types ---

export interface MetricCard {
  value: number;
  percentChange: number;
  trend: "up" | "down";
}

export interface SummaryResponse {
  totalProfit: MetricCard;
  activeCreatives: MetricCard;
  myProfit: MetricCard;
}

export interface CommissionsDataPoint {
  label: string;
  totalProfit: number;
  myProfit: number;
}

export interface CommissionsChartResponse {
  period: "weekly" | "monthly";
  data: CommissionsDataPoint[];
}

export interface RankingEntry {
  operationName: string;
  totalProfit: number;
}

export interface RankingResponse {
  data: RankingEntry[];
}

export interface GoalResponse {
  goal: number | null;
  achieved: number;
  remaining: number;
  percentAchieved: number;
}
