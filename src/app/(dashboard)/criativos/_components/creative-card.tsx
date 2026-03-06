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
      className={`bg-card/50 dark:bg-card/30 backdrop-blur-sm border rounded-2xl p-5 flex flex-col group hover:border-[#FFBB00]/50 transition-all duration-300 ${
        !creative.isActive ? "opacity-70" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-[#FFBB00]/20 text-[#FFBB00] rounded-lg flex items-center justify-center">
          <span className="text-lg">🎨</span>
        </div>
        <CreativeActiveToggle
          creativeId={creative.id}
          isActive={creative.isActive}
          creativeName={creative.name}
        />
      </div>

      <h3 className="text-lg font-bold mb-1 group-hover:text-[#FFBB00] transition-colors">
        {creative.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        📢 Operação: {creative.operationName}
      </p>

      <div className="space-y-3 border-t pt-4 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lucro Total</span>
          <span className="font-bold">{creative.totalProfitFormatted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lucro Freelancer</span>
          <span className="text-[#FFBB00] font-bold">
            {creative.freelancerCutFormatted}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pago?</span>
          <Badge
            variant="outline"
            className={`text-xs font-bold ${
              creative.isPaid
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-[#FFBB00]/10 text-[#FFBB00] border-[#FFBB00]/20"
            }`}
          >
            {creative.isPaid ? "SIM" : "PENDENTE"}
          </Badge>
        </div>
      </div>

      <CreativeActionButtons
        creativeId={creative.id}
        isPaid={creative.isPaid}
      />

      <div className="mt-auto pt-4 border-t flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Operação
          </span>
          <span className="text-xs">{creative.operationName}</span>
        </div>
      </div>
    </div>
  );
}
