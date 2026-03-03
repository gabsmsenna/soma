export interface CreativeViewModel {
  id: string;
  name: string;
  totalProfitFormatted: string;
  freelancerCutFormatted: string;
  totalProfit: string;
  freelancerCut: string;
  isPaid: boolean;
  paidAt: string | null;
  projectId: string;
  projectName: string;
  projectIsActive: boolean;
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

export type ActionResult<T = void> =
  | { success: true; data: T }
  | {
      success: false;
      error: { title: string; detail: string; status: number };
    };
