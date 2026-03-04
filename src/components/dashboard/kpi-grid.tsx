"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SummaryResponse } from "@/dtos/dashboard.dto";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function KpiGrid() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((json: SummaryResponse) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-center h-[140px]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const kpiCards = [
    {
      label: "Lucro Total Gerado",
      value: formatBRL(data.totalProfit.value),
      change: `${data.totalProfit.percentChange >= 0 ? "+" : ""}${data.totalProfit.percentChange}%`,
      trend: data.totalProfit.trend,
      subtitle: "Volume total em operações de clientes",
      iconBg: "bg-[#FFBB00]/20",
      iconColor: "text-[#FFBB00]",
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
      label: "Projetos Ativos",
      value: String(data.activeProjects.value),
      change:
        data.activeProjects.percentChange !== 0
          ? `${data.activeProjects.percentChange >= 0 ? "+" : ""}${data.activeProjects.percentChange}%`
          : "Ativos",
      trend: data.activeProjects.trend,
      subtitle: "Operações em andamento este mês",
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
                className={`text-xs font-bold flex items-center gap-1 ${kpi.trend === "up"
                    ? "text-green-500"
                    : "text-muted-foreground"
                  }`}
              >
                {kpi.change}
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : kpi.change !== "Ativos" ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : null}
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
