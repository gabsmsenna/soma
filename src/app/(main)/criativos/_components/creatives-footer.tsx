import { AppFooter } from "@/components/app-footer";
import { Separator } from "@/components/ui/separator";
import type { CreativeMetrics } from "../_types";

interface CreativesFooterProps {
  metrics: CreativeMetrics;
}

export function CreativesFooter({ metrics }: CreativesFooterProps) {
  return (
    <footer className="mt-auto p-6 bg-white dark:bg-muted/50 border-t border-slate-200 dark:border-border flex items-center justify-between">
      <div className="flex gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-muted-foreground font-bold">
            Total a Receber
          </p>
          <p className="text-xl font-black text-brand">
            {metrics.pendingPaymentFormatted}
          </p>
        </div>
        <Separator
          orientation="vertical"
          className="h-10 border-slate-200 dark:border-border"
        />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-muted-foreground font-bold">
            Criativos Ativos
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.totalActive}
          </p>
        </div>
        <Separator
          orientation="vertical"
          className="h-10 border-slate-200 dark:border-border"
        />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-muted-foreground font-bold">
            Lucro Total
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.totalProfitFormatted}
          </p>
        </div>
      </div>
      <AppFooter className="mt-0 p-0 border-none bg-transparent dark:bg-transparent" />
    </footer>
  );
}
