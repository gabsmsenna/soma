import type { ProfitReportOperationGroup } from "@/dtos/profit-report.dto";
import { OperationCard } from "./operation-card";

interface OperationsListProps {
  operations: ProfitReportOperationGroup[];
}

export function OperationsList({ operations }: OperationsListProps) {
  if (operations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <p className="text-sm">
          Nenhum dado encontrado para o período selecionado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {operations.map((group) => (
        <OperationCard key={group.operationId} group={group} />
      ))}
    </div>
  );
}
