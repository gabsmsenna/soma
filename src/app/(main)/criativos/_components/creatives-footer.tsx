import { Separator } from "@/components/ui/separator";
import type { CreativeMetrics } from "../_types";

interface CreativesFooterProps {
  metrics: CreativeMetrics;
}

export function CreativesFooter({ metrics }: CreativesFooterProps) {
  return (
    <footer className="mt-auto p-6 bg-muted/50 border-t flex items-center justify-between">
      <div className="flex gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Total a Receber
          </p>
          <p className="text-xl font-black text-[#FFBB00]">
            {metrics.pendingPaymentFormatted}
          </p>
        </div>
        <Separator orientation="vertical" className="h-10" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Criativos Ativos
          </p>
          <p className="text-xl font-black">{metrics.totalActive}</p>
        </div>
        <Separator orientation="vertical" className="h-10" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Lucro Total
          </p>
          <p className="text-xl font-black">{metrics.totalProfitFormatted}</p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Soma v1.0.5 © 2024 Grid Management System
      </div>
    </footer>
  );
}
