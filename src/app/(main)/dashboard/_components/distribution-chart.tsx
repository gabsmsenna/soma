"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { RankingEntry } from "@/dtos/dashboard.dto";
import { formatBRL } from "@/lib/format";

const COLORS = ["#FFBB00", "#f97316", "#fcd34d", "#3b82f6", "#a855f7"];
const COLOR_CLASSES = [
  "bg-brand",
  "bg-orange-500",
  "bg-amber-300",
  "bg-blue-500",
  "bg-purple-500",
];

interface DistributionChartProps {
  ranking: RankingEntry[];
}

export function DistributionChart({ ranking }: DistributionChartProps) {
  const total = ranking.reduce((sum, r) => sum + r.totalProfit, 0);

  const chartData = ranking.map((r, i) => ({
    label: r.operationName,
    value: r.totalProfit,
    fill: COLORS[i % COLORS.length],
    colorClass: COLOR_CLASSES[i % COLOR_CLASSES.length],
    percent: total > 0 ? Math.round((r.totalProfit / total) * 100) : 0,
  }));

  return (
    <Card className="col-span-12 lg:col-span-4 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg">Top Operações</h4>
        </div>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm text-muted-foreground">
              Nenhuma operação encontrada.
            </p>
          </div>
        ) : (
          <>
            <div className="relative flex justify-center items-center h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    dataKey="value"
                  >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.label}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-2xl font-bold">
                  Top {chartData.length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                  Operações
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {chartData.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${d.colorClass}`} />
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {d.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {d.percent}%
                    </span>
                    <span className="text-sm font-bold">
                      {formatBRL(d.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
