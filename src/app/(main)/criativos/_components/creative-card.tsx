import { Badge } from "@/components/ui/badge";
import type { CreativeViewModel } from "../_types";
import { CreativeActionButtons } from "./creative-action-buttons";
import { CreativeActiveToggle } from "./creative-active-toggle";

interface CreativeCardProps {
  creative: CreativeViewModel;
}

export function CreativeCard({ creative }: CreativeCardProps) {
  return (
    <div
      className={`bg-white dark:bg-card/30 backdrop-blur-sm border border-slate-200 dark:border-border shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col group hover:border-brand/50 hover:shadow-md dark:hover:shadow-none transition-all duration-300 ${!creative.isActive ? "opacity-70" : ""
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-brand/20 text-brand rounded-lg flex items-center justify-center">
          <span className="text-lg">🎨</span>
        </div>
        <CreativeActiveToggle
          creativeId={creative.id}
          isActive={creative.isActive}
          creativeName={creative.name}
        />
      </div>

      <h3 className="text-lg font-bold mb-1 group-hover:text-brand transition-colors text-slate-900 dark:text-white">
        {creative.name}
      </h3>
      <p className="text-xs text-slate-500 dark:text-muted-foreground mb-4 flex items-center gap-1">
        📢 Operação: {creative.operationName}
      </p>

      <div className="space-y-3 border-t border-slate-100 dark:border-border pt-4 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-muted-foreground">
            Lucro Total
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {creative.totalProfitFormatted}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-muted-foreground">
            Lucro Freelancer
          </span>
          <span className="text-brand font-bold">
            {creative.freelancerCutFormatted}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-muted-foreground">
            Pago?
          </span>
          <Badge
            variant="outline"
            className={`text-xs font-bold ${Number(creative.totalProfit) === 0
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-brand/10 dark:text-brand dark:border-brand/20"
              }`}
          >
            {Number(creative.totalProfit) === 0 ? "SIM" : "PENDENTE"}
          </Badge>
        </div>
      </div>

      <CreativeActionButtons
        creativeId={creative.id}
        creativeName={creative.name}
        freelancerCut={creative.freelancerCut}
        totalProfit={creative.totalProfit}
        isActive={creative.isActive}
      />

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-muted-foreground font-bold">
            Operação
          </span>
          <span className="text-xs text-slate-900 dark:text-white">
            {creative.operationName}
          </span>
        </div>
      </div>
    </div>
  );
}
