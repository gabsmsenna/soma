"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const distributionData = [
  {
    label: "E-commerce XYZ",
    value: 50,
    color: "bg-[#FFBB00]",
    fill: "#FFBB00",
  },
  { label: "SaaS Growth", value: 25, color: "bg-orange-500", fill: "#f97316" },
  {
    label: "Imobiliária Premium",
    value: 15,
    color: "bg-amber-300",
    fill: "#fcd34d",
  },
];

export function DistributionChart() {
  return (
    <Card className="col-span-12 lg:col-span-4 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg">Distribuição</h4>
        </div>
        <div className="relative flex justify-center items-center h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                dataKey="value"
              >
                {distributionData.map((entry) => (
                  <Cell key={`cell-${entry.label}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center pointer-events-none">
            <span className="text-2xl font-bold">Top 3</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
              Operações
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {distributionData.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${d.color}`} />
                <span className="text-sm font-medium">{d.label}</span>
              </div>
              <span className="text-sm font-bold">{d.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
