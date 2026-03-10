import type { CreativeMetrics } from "../_types";

interface CreativesMetricsProps {
  metrics: CreativeMetrics;
}

const metricItems = (metrics: CreativeMetrics) => [
  {
    label: "Total Ativos",
    badge: `${metrics.totalActive} criativos`,
    badgeColor: "text-brand",
    subLabel: "Qtd. Unidades",
    value: String(metrics.totalActive),
  },
  {
    label: "Lucro Gerado",
    badge: "Bruto Total",
    badgeColor: "text-green-400",
    subLabel: "Bruto Total",
    value: metrics.totalProfitFormatted,
  },
  {
    label: "Pagamento Pendente",
    badge: `${metrics.pendingCount} itens`,
    badgeColor: "text-brand",
    subLabel: "A Receber",
    value: metrics.pendingPaymentFormatted,
  },
  {
    label: "Média por Criativo",
    badge: "Global",
    badgeColor: "text-brand",
    subLabel: "Performance",
    value: metrics.averageFormatted,
  },
];

export function CreativesMetrics({ metrics }: CreativesMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricItems(metrics).map((m) => (
        <div
          key={m.label}
          className="bg-white dark:bg-[#111111] shadow-sm dark:shadow-none p-6 rounded-3xl border border-slate-200 dark:border-white/10 group transition-all duration-300 hover:border-brand/50 relative overflow-hidden text-slate-800 dark:text-white"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-600 dark:text-gray-300">
              {m.label} <span className={m.badgeColor}>{m.badge}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">
                {m.subLabel}
              </span>
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {m.value}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-brand/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
