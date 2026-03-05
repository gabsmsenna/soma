"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { CommissionsChartResponse } from "@/dtos/dashboard.dto";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatLabel(dateStr: string, period: "weekly" | "monthly"): string {
  const date = new Date(dateStr + "T00:00:00");
  if (period === "weekly") {
    const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
    const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });
    return `${weekday} ${day}`;
  }
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

export function CommissionChart() {
  const [viewMode, setViewMode] = useState<"semanal" | "mensal">("semanal");
  const [chartData, setChartData] = useState<CommissionsChartResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const period = viewMode === "semanal" ? "weekly" : "monthly";

    fetch(`/api/dashboard/commissions?period=${period}`)
      .then((res) => res.json())
      .then((json: CommissionsChartResponse) => setChartData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [viewMode]);

  const data =
    chartData?.data.map((d) => ({
      name: formatLabel(d.label, chartData.period),
      totalProfit: d.totalProfit,
      myProfit: d.myProfit,
    })) ?? [];

  return (
    <Card className="col-span-12 lg:col-span-8 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-bold text-lg">Crescimento de Comissões</h4>
            <p className="text-xs text-muted-foreground">
              Evolução do seu lucro como freelancer
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("semanal")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === "semanal"
                  ? "bg-[#FFBB00] text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Semanal
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mensal")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === "mensal"
                  ? "bg-[#FFBB00] text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Mensal
            </button>
          </div>
        </div>
        <div className="h-[310px] w-full relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                Nenhum dado de comissão disponível.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFBB00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFBB00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted))"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => String(value).toUpperCase()}
                  style={{
                    fontWeight: "bold",
                    letterSpacing: "0.1em",
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card px-3 py-1.5 rounded-xl shadow-lg border flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FFBB00]" />
                          <span className="text-[10px] font-bold">
                            {formatBRL(payload[0].value as number)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="myProfit"
                  stroke="#FFBB00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
