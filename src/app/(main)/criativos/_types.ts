export interface CreativeViewModel {
  id: string;
  name: string;
  totalProfitFormatted: string;
  freelancerCutFormatted: string;
  totalProfit: string;
  freelancerCut: string;
  isActive: boolean;
  isPaid: boolean;
  paidAt: string | null;
  operationId: string;
  operationName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreativeMetrics {
  totalActive: number;
  totalProfitFormatted: string;
  pendingPaymentFormatted: string;
  pendingCount: number;
  averageFormatted: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type CreativeStatus = "active" | "inactive" | "all";
export type PaymentStatus = "paid" | "unpaid" | "all";

export type { ActionResult } from "@/types/action-result";
