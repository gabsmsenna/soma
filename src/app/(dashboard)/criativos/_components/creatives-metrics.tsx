import type { CreativeMetrics } from "../_types";

interface CreativesMetricsProps {
  metrics: CreativeMetrics;
}

const metricItems = (metrics: CreativeMetrics) => [
  {
    label: "Total Ativos",
    badge: `${metrics.totalActive} criativos`,
    badgeColor: "text-[#FFBB00]",
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
    badgeColor: "text-[#FFBB00]",
    subLabel: "A Receber",
    value: metrics.pendingPaymentFormatted,
  },
  {
    label: "Média por Criativo",
    badge: "Global",
    badgeColor: "text-[#FFBB00]",
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
          className="bg-[#111111] dark:bg-[#111111] p-6 rounded-3xl border border-white/10 group transition-all duration-300 hover:border-[#FFBB00]/50 relative overflow-hidden text-white"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              {m.label} <span className={m.badgeColor}>{m.badge}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium mb-1">
                {m.subLabel}
              </span>
              <span className="text-3xl font-bold tracking-tight">
                {m.value}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-[#FFBB00]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
