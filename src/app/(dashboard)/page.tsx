import { ArrowUpRight, Bell, Rocket, Search, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

const recentCommissions = [
  {
    initials: "EC",
    name: "E-commerce XYZ",
    detail: "Hoje, 14:20 • Venda Direta #8821",
    amount: "+R$ 1.240,00",
    amountColor: "text-[#FFBB00]",
    status: "Disponível",
    statusColor: "bg-green-500/10 text-green-500",
    bgColor: "bg-[#FFBB00]/20 text-[#FFBB00]",
  },
  {
    initials: "SG",
    name: "SaaS Growth",
    detail: "Ontem • Assinatura Mensal Reversa",
    amount: "+R$ 450,00",
    amountColor: "",
    status: "Processando",
    statusColor: "bg-muted text-muted-foreground",
    bgColor: "bg-orange-500/20 text-orange-500",
  },
  {
    initials: "IP",
    name: "Imobiliária Premium",
    detail: "2 dias atrás • Lead Qualificado CPL",
    amount: "+R$ 3.100,00",
    amountColor: "",
    status: "Disponível",
    statusColor: "bg-green-500/10 text-green-500",
    bgColor: "bg-blue-500/20 text-blue-500",
  },
  {
    initials: "AM",
    name: "Agência Moda",
    detail: "3 dias atrás • Fechamento Direto",
    amount: "+R$ 890,00",
    amountColor: "",
    status: "Disponível",
    statusColor: "bg-green-500/10 text-green-500",
    bgColor: "bg-purple-500/20 text-purple-500",
  },
];

const distributionData = [
  { label: "E-commerce XYZ", pct: "50%", color: "bg-[#FFBB00]" },
  { label: "SaaS Growth", pct: "25%", color: "bg-orange-500" },
  { label: "Imobiliária Premium", pct: "15%", color: "bg-amber-300" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h2 className="text-xl font-bold">Dashboard Financeiro</h2>
            <p className="text-muted-foreground text-sm">
              Visão geral do seu desempenho e comissões.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 w-64 rounded-xl"
              placeholder="Buscar operações..."
            />
          </div>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-orange-500" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
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

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Commission Growth Chart */}
          <Card className="col-span-12 lg:col-span-8 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-lg">
                    Crescimento de Comissões
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Evolução do seu lucro como freelancer
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-xs bg-[#FFBB00] text-black font-semibold rounded-lg"
                  >
                    Semanal
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-xs bg-muted rounded-lg"
                  >
                    Mensal
                  </button>
                </div>
              </div>
              <div className="h-72 w-full relative">
                <svg
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 240"
                  role="img"
                  aria-label="Alguma coisa que vou revisar"
                >
                  <line
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="40"
                    y2="40"
                  />
                  <line
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="80"
                    y2="80"
                  />
                  <line
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="120"
                    y2="120"
                  />
                  <line
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="160"
                    y2="160"
                  />
                  <line
                    stroke="currentColor"
                    className="text-muted/30"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="200"
                    y2="200"
                  />
                  <defs>
                    <linearGradient
                      id="comGrad"
                      x1="0%"
                      x2="0%"
                      y1="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#FFBB00", stopOpacity: 0.2 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#FFBB00", stopOpacity: 0 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 200 Q 100 190, 200 150 T 400 130 T 600 80 T 800 50 L 800 240 L 0 240 Z"
                    fill="url(#comGrad)"
                  />
                  <path
                    d="M0 200 Q 100 190, 200 150 T 400 130 T 600 80 T 800 50"
                    fill="none"
                    stroke="#FFBB00"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute top-8 right-1/4 bg-card px-3 py-1.5 rounded-xl shadow-lg border flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFBB00]" />
                  <span className="text-[10px] font-bold">
                    R$ 8.400,00 Peak
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-bold px-2 uppercase tracking-widest">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Donut */}
          <Card className="col-span-12 lg:col-span-4 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg">Distribuição</h4>
              </div>
              <div className="relative flex justify-center items-center h-48 mb-6">
                <svg
                  className="w-40 h-40 transform -rotate-90"
                  viewBox="0 0 36 36"
                  role="img"
                  aria-label="Alguma coisa que vou revisar"
                >
                  <circle
                    className="text-muted"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke="currentColor"
                    strokeDasharray="100, 100"
                    strokeWidth="4"
                  />
                  <circle
                    className="text-[#FFBB00]"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke="currentColor"
                    strokeDasharray="50, 100"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <circle
                    className="text-orange-500"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke="currentColor"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-50"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <circle
                    className="text-amber-300"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke="currentColor"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-75"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold">Top 3</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                    Operações
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {distributionData.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${d.color}`} />
                      <span className="text-sm font-medium">{d.label}</span>
                    </div>
                    <span className="text-sm font-bold">{d.pct}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Monthly Goal */}
          <Card className="col-span-12 lg:col-span-5 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
            <CardContent className="p-8 flex flex-col h-full justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-6 bg-orange-500 rounded-full" />
                  <h4 className="font-bold text-lg">Meta de Lucro Mensal</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                  Faltam apenas R$ 7.500,00 para atingir sua meta pessoal.
                </p>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-4xl font-black text-orange-500">
                      85%
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        Objetivo
                      </p>
                      <p className="text-lg font-bold">R$ 50.000,00</p>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-orange-500 to-[#FFBB00] w-[85%] rounded-full shadow-[0_0_20px_rgba(255,108,0,0.3)] transition-all duration-1000" />
                  </div>
                </div>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
                      Status Atual
                    </p>
                    <p className="text-sm font-semibold">
                      R$ 42.500,00 acumulados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Commissions */}
          <Card className="col-span-12 lg:col-span-7 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-lg">Comissões Recentes</h4>
                  <p className="text-xs text-muted-foreground">
                    Histórico de entradas em tempo real
                  </p>
                </div>
                <button
                  type="button"
                  className="text-orange-500 text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  Ver extrato completo
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {recentCommissions.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${c.bgColor} flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform`}
                      >
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {c.detail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-bold ${c.amountColor}`}>
                        {c.amount}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-bold uppercase tracking-wider ${c.statusColor}`}
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
