import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const kpiCards = [
  {
    label: "Lucro Total Gerado",
    value: "R$ 482.241,00",
    change: "+18%",
    changePositive: true,
    subtitle: "Volume total em operações de clientes",
    iconBg: "bg-[#FFBB00]/20",
    iconColor: "text-[#FFBB00]",
    icon: TrendingUp,
  },
  {
    label: "Meu Lucro de Comissão",
    value: "R$ 48.224,10",
    change: "+12.4%",
    changePositive: true,
    subtitle: "Sua fatia líquida (10% média)",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-500",
    icon: TrendingUp,
  },
  {
    label: "Projetos Ativos",
    value: "12",
    change: "Ativos",
    changePositive: false,
    subtitle: "Operações em andamento este mês",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-500",
    icon: TrendingUp,
  },
];

export function KpiGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiCards.map((kpi) => (
        <Card key={kpi.label} className="backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
              </div>
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  kpi.changePositive
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              >
                {kpi.change}
                {kpi.changePositive && <ArrowUpRight className="h-3 w-3" />}
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
