export interface Creative {
  id: string;
  name: string;
  totalProfit: string;
  freelancerCut: string;
  isActive: boolean;
  isPaid: boolean;
  paidAt: string | null;
  operationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Operation {
  id: string;
  name: string;
  freelancerCutPercentage: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  creatives: Creative[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OperationsResponse {
  data: Operation[];
  pagination: PaginationInfo;
}
