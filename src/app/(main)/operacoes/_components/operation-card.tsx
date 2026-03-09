import { ArchiveX, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Operation } from "../_types/types";
import { calcTotalProfit, formatBRL, getIconColor } from "../_utils/formatter";

interface OperationCardProps {
  operation: Operation;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function OperationCard({
  operation,
  index,
  onEdit,
  onDelete,
}: OperationCardProps) {
  const totalProfit = calcTotalProfit(operation.creatives);
  const activeCreatives = operation.creatives.filter((c) => c.isActive).length;

  return (
    <div className="bg-muted/50 rounded-3xl p-6 border border-transparent hover:border-[#FFBB00]/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#FFBB00]/5 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center border shadow-sm">
            <span className={`${getIconColor(index)} text-2xl font-bold`}>
              {operation.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold group-hover:text-[#FFBB00] transition-colors flex items-center gap-2">
              {operation.name}
              {!operation.active && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-5 px-1.5 flex items-center gap-1 opacity-80 cursor-default"
                  title="Operação Inativa"
                >
                  <ArchiveX className="w-3 h-3" />
                  <span className="hidden sm:inline">Inativa</span>
                </Badge>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {operation.creatives.length} criativo
              {operation.creatives.length !== 1 && "s"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            title="Editar operação"
            className="p-2 hover:bg-card rounded-lg text-muted-foreground hover:text-foreground transition-all"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Remover operação"
            className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg text-muted-foreground hover:text-red-600 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card p-4 rounded-2xl border shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
            Porcentagem comissão
          </p>
          <span className="text-2xl font-black">
            {operation.freelancerCutPercentage}%
          </span>
        </div>
        <div className="bg-card p-4 rounded-2xl border shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
            Lucro total
          </p>
          <span
            className={`text-lg font-bold ${
              totalProfit > 0
                ? "text-emerald-500"
                : totalProfit < 0
                  ? "text-orange-500"
                  : ""
            }`}
          >
            {formatBRL(totalProfit)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground">
            +{operation.creatives.length}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-bold rounded-full"
          >
            {activeCreatives} ativo{activeCreatives !== 1 && "s"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
