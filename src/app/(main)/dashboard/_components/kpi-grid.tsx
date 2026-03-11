import { ArrowDownRight, ArrowUpRight, Minus, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SummaryResponse } from "@/dtos/dashboard.dto";
import { formatBRL } from "@/lib/format";

interface KpiGridProps {
  data: SummaryResponse;
}

export function KpiGrid({ data }: KpiGridProps) {
  const kpiCards = [
    {
      label: "Lucro Total Gerado",
      value: formatBRL(data.totalProfit.value),
      change: `${data.totalProfit.percentChange >= 0 ? "+" : ""}${data.totalProfit.percentChange}%`,
      trend: data.totalProfit.trend,
      subtitle: "Volume total em operações de clientes",
      iconBg: "bg-brand/20",
      iconColor: "text-brand",
    },
    {
      label: "Meu Lucro de Comissão",
      value: formatBRL(data.myProfit.value),
      change: `${data.myProfit.percentChange >= 0 ? "+" : ""}${data.myProfit.percentChange}%`,
      trend: data.myProfit.trend,
      subtitle: "Sua fatia líquida de comissões",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-500",
    },
    {
      label: "Criativos Ativos",
      value: String(data.activeCreatives.value),
      change:
        data.activeCreatives.trend !== "neutral"
          ? `${data.activeCreatives.percentChange >= 0 ? "+" : ""}${data.activeCreatives.percentChange}%`
          : "Ativos",
      trend: data.activeCreatives.trend,
      subtitle: "Criativos em andamento este mês",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiCards.map((kpi) => (
        <Card key={kpi.label} className="backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <TrendingUp className={`h-5 w-5 ${kpi.iconColor}`} />
              </div>
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  kpi.trend === "up"
                    ? "text-green-500"
                    : kpi.trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }`}
              >
                {kpi.change}
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : kpi.trend === "down" ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : null}
                {kpi.trend === "neutral" && kpi.change !== "Ativos" && (
                  <Minus className="h-3 w-3" />
                )}
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
              {kpi.label}
            </p>
            <h3 className="text-3xl font-bold">{kpi.value}</h3>
            <p className="text-[10px] text-muted-foreground mt-2 italic">
              {kpi.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
