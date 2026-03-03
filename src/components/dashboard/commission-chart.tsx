"use client";

import { useState } from "react";

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

const weeklyData = [
  { name: "Seg", total: 120 },
  { name: "Ter", total: 180 },
  { name: "Qua", total: 90 },
  { name: "Qui", total: 200 },
  { name: "Sex", total: 150 },
  { name: "Sáb", total: 80 },
  { name: "Dom", total: 50 },
];

const monthlyData = [
  { name: "Jan", total: 100 },
  { name: "Fev", total: 190 },
  { name: "Mar", total: 150 },
  { name: "Abr", total: 130 },
  { name: "Mai", total: 80 },
  { name: "Jun", total: 50 },
  { name: "Jul", total: 240 },
  { name: "Ago", total: 240 },
];

export function CommissionChart() {
  const [viewMode, setViewMode] = useState<"semanal" | "mensal">("semanal");
  const data = viewMode === "semanal" ? weeklyData : monthlyData;

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
                tickFormatter={(value) => value.toUpperCase()}
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
                          R${" "}
                          {((payload[0].value as number) * 35).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 },
                          )}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#FFBB00"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="absolute top-8 right-1/4 bg-card px-3 py-1.5 rounded-xl shadow-lg border flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#FFBB00]" />
            <span className="text-[10px] font-bold">
              R$ {viewMode === "semanal" ? "8.400,00" : "8.400,00"} Peak
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
