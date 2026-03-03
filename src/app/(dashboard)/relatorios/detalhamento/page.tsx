import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const kpis = [
  {
    label: "Lucro Total",
    value: "R$ 45.230,00",
    change: "+15%",
    positive: true,
  },
  {
    label: "Meu Lucro",
    value: "R$ 12.500,00",
    change: "+8%",
    positive: true,
  },
  {
    label: "Criativo + Lucrativo",
    value: "Banner BF V2",
    change: "R$ 4.500",
    positive: true,
  },
  {
    label: "Criativo - Lucrativo",
    value: "Stories Verão",
    change: "R$ 200",
    positive: false,
  },
];

const operations = [
  {
    name: "TechStore Global",
    totalProfit: "R$ 18.200,00",
    commission: "R$ 3.640,00",
    creativeCount: 4,
    changePositive: true,
    changeValue: "+12%",
    accentColor: "border-l-[#FFBB00]",
    creatives: [
      {
        name: "Banner Black Friday V2",
        totalProfit: "R$ 4.500,00",
        freelancerCut: "R$ 900,00",
        paid: true,
      },
      {
        name: "Carousel Summer Sale",
        totalProfit: "R$ 3.200,00",
        freelancerCut: "R$ 640,00",
        paid: true,
      },
      {
        name: "Video UGC Launch",
        totalProfit: "R$ 8.100,00",
        freelancerCut: "R$ 1.620,00",
        paid: false,
      },
      {
        name: "Static Display Set",
        totalProfit: "R$ 2.400,00",
        freelancerCut: "R$ 480,00",
        paid: true,
      },
    ],
  },
  {
    name: "Fitness Pro App",
    totalProfit: "R$ 12.800,00",
    commission: "R$ 2.560,00",
    creativeCount: 3,
    changePositive: true,
    changeValue: "+8.4%",
    accentColor: "border-l-blue-500",
    creatives: [
      {
        name: "Motion Video Launch",
        totalProfit: "R$ 6.200,00",
        freelancerCut: "R$ 1.240,00",
        paid: false,
      },
      {
        name: "Instagram Stories Pack",
        totalProfit: "R$ 3.800,00",
        freelancerCut: "R$ 760,00",
        paid: true,
      },
      {
        name: "Reels Workout Series",
        totalProfit: "R$ 2.800,00",
        freelancerCut: "R$ 560,00",
        paid: true,
      },
    ],
  },
  {
    name: "Luxury Home Decor",
    totalProfit: "R$ 5.430,00",
    commission: "R$ 1.086,00",
    creativeCount: 2,
    changePositive: false,
    changeValue: "-3.2%",
    accentColor: "border-l-purple-500",
    creatives: [
      {
        name: "Carousel Ads Premium",
        totalProfit: "R$ 2.450,00",
        freelancerCut: "R$ 490,00",
        paid: true,
      },
      {
        name: "Display Campaign Set",
        totalProfit: "R$ 2.980,00",
        freelancerCut: "R$ 596,00",
        paid: false,
      },
    ],
  },
  {
    name: "SaaS Marketing Tool",
    totalProfit: "R$ 3.100,00",
    commission: "R$ 620,00",
    creativeCount: 2,
    changePositive: true,
    changeValue: "+15%",
    accentColor: "border-l-orange-500",
    creatives: [
      {
        name: "Google Discovery Assets",
        totalProfit: "R$ 1.100,00",
        freelancerCut: "R$ 220,00",
        paid: false,
      },
      {
        name: "LinkedIn Campaign B2B",
        totalProfit: "R$ 2.000,00",
        freelancerCut: "R$ 400,00",
        paid: true,
      },
    ],
  },
];

export default function DetalhamentoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-xl font-bold">Detalhamento Analítico</h1>
            <p className="text-muted-foreground text-sm">
              Resumo completo dos últimos 30 dias
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center h-10 px-4 rounded-lg border bg-card hover:bg-muted transition-colors text-sm font-semibold"
          >
            <Calendar className="mr-2 h-4 w-4" /> Últimos 30 dias
          </button>
          <button
            type="button"
            className="flex items-center h-10 px-4 rounded-lg bg-[#FFBB00] text-black hover:bg-[#FFBB00]/90 transition-colors text-sm font-bold shadow-lg shadow-[#FFBB00]/20"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <Card key={k.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm font-medium">
                    {k.label}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-bold ${
                      k.positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {k.positive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {k.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{k.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Operations Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">
            Detalhamento por Operação{" "}
            <span className="text-muted-foreground font-normal text-sm ml-2">
              ({operations.length} operações)
            </span>
          </h3>

          {operations.map((op) => (
            <Card
              key={op.name}
              className={`border-l-4 ${op.accentColor} overflow-hidden`}
            >
              <CardContent className="p-0">
                {/* Operation Header */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-lg">
                      {op.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{op.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {op.creativeCount} criativos •{" "}
                        <span
                          className={
                            op.changePositive
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {op.changeValue}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        Lucro Total
                      </p>
                      <p className="text-lg font-bold">{op.totalProfit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        Minha Comissão
                      </p>
                      <p className="text-lg font-bold text-[#FFBB00]">
                        {op.commission}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Creatives Table */}
                <div className="border-t">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                        <th className="text-left px-6 py-3 font-medium">
                          Criativo
                        </th>
                        <th className="text-left px-6 py-3 font-medium">
                          Lucro Total
                        </th>
                        <th className="text-left px-6 py-3 font-medium">
                          Minha Comissão
                        </th>
                        <th className="text-right px-6 py-3 font-medium">
                          Status Pgto.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {op.creatives.map((c) => (
                        <tr
                          key={c.name}
                          className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-3 text-sm font-medium">
                            {c.name}
                          </td>
                          <td className="px-6 py-3 text-sm">{c.totalProfit}</td>
                          <td className="px-6 py-3 text-sm text-[#FFBB00] font-medium">
                            {c.freelancerCut}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-bold ${
                                c.paid
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-[#FFBB00]/10 text-[#FFBB00]"
                              }`}
                            >
                              {c.paid ? "PAGO" : "PENDENTE"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFBB00] text-black font-bold shadow-lg shadow-[#FFBB00]/20"
          >
            1
          </button>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground font-bold"
          >
            2
          </button>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
