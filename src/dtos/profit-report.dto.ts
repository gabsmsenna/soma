export type TrendDirection = "ascensao" | "queda" | "estavel";

export interface ProfitReportKpis {
  totalProfit: number;
  myProfit: number;
  percentChange: number;
  topCreative: {
    name: string;
    operationName: string;
    totalProfit: number;
  } | null;
  bottomCreative: {
    name: string;
    operationName: string;
    totalProfit: number;
  } | null;
}

export interface ProfitReportCreativeEntry {
  creativeId: string;
  creativeName: string;
  totalProfit: number;
  commission: number;
  paidAt: Date | null;
  isPaid: boolean;
  trend: TrendDirection;
}

export interface ProfitReportOperationGroup {
  operationId: string;
  operationName: string;
  freelancerCutPercentage: number;
  totalProfit: number;
  myProfit: number;
  creatives: ProfitReportCreativeEntry[];
}

export interface ProfitReportResponse {
  kpis: ProfitReportKpis;
  operations: ProfitReportOperationGroup[];
}
