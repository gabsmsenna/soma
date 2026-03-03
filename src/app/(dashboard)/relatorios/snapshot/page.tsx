import {
  Bell,
  Calendar,
  Download,
  Search,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const kpis = [
  {
    label: "Lucro Bruto",
    value: "R$ 45.230,00",
    change: "+15%",
    positive: true,
    iconBg: "bg-[#FFBB00]/10 text-[#FFBB00]",
  },
  {
    label: "Comissões Recebidas",
    value: "R$ 12.500,00",
    change: "+8%",
    positive: true,
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Comissões Pendentes",
    value: "R$ 3.450,00",
    change: "-2%",
    positive: false,
    iconBg: "bg-orange-500/10 text-orange-500",
  },
  {
    label: "ROI Médio",
    value: "320%",
    change: "+5%",
    positive: true,
    iconBg: "bg-purple-500/10 text-purple-500",
  },
];

const distribution = [
  { label: "E-commerce A", pct: "35%", color: "bg-[#FFBB00]" },
  { label: "SaaS B2B", pct: "25%", color: "bg-blue-500" },
  { label: "Consulting", pct: "20%", color: "bg-purple-500" },
];

const barChart = [
  { label: "Nov 01", height: 40, value: "R$ 12k" },
  { label: "Nov 05", height: 55, value: "R$ 18k" },
  { label: "Nov 10", height: 45, value: "R$ 15k" },
  { label: "Nov 15", height: 70, value: "R$ 32k" },
  { label: "Nov 20", height: 60, value: "R$ 28k" },
  { label: "Nov 25", height: 85, value: "R$ 45k", highlight: true },
  { label: "Goal", height: 95, isDashed: true },
];

const tableData = [
  {
    initials: "EC",
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-600",
    name: "E-commerce Alpha",
    category: "Retail",
    profit: "R$ 15.240,00",
    commission: "R$ 3.048,00",
    roi: "450%",
    roiPositive: true,
    status: "Active",
  },
  {
    initials: "SB",
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    name: "SaaS B2B Tech",
    category: "Software",
    profit: "R$ 8.450,00",
    commission: "R$ 1.690,00",
    roi: "320%",
    roiPositive: true,
    status: "Active",
  },
  {
    initials: "LC",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-teal-600",
    name: "Local Consulting",
    category: "Services",
    profit: "R$ 4.120,00",
    commission: "R$ 824,00",
    roi: "180%",
    roiPositive: false,
    status: "Review",
  },
  {
    initials: "DF",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-500",
    name: "Dropshipping Fast",
    category: "Retail",
    profit: "R$ 2.800,00",
    commission: "R$ 560,00",
    roi: "210%",
    roiPositive: true,
    status: "Active",
  },
];

export default function SnapshotPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h2 className="text-2xl font-bold tracking-tight">
            Financial Snapshot
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="h-10 w-64 rounded-lg pl-10"
              placeholder="Search reports..."
            />
          </div>
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Subtitle + Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
              Performance Overview
            </p>
            <h3 className="text-3xl font-bold">Novembro 2023</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center h-10 px-4 rounded-lg border bg-card hover:bg-muted transition-colors text-sm font-semibold"
            >
              <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
            </button>
            <button
              type="button"
              className="flex items-center h-10 px-4 rounded-lg bg-[#FFBB00] text-black hover:bg-[#FFBB00]/90 transition-colors text-sm font-bold shadow-lg shadow-[#FFBB00]/20"
            >
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </button>
            <button
              type="button"
              className="flex items-center h-10 px-4 rounded-lg bg-card text-[#FFBB00] border border-[#FFBB00]/30 hover:bg-[#FFBB00]/10 transition-colors text-sm font-bold"
            >
              <Table2 className="mr-2 h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <Card
              key={k.label}
              className="hover:border-[#FFBB00]/50 transition-colors group"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${k.iconBg}`}>
                    {k.positive ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs font-bold flex items-center gap-1 ${k.positive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {k.positive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {k.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">
                    {k.label}
                  </p>
                  <p className="text-2xl font-bold">{k.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut */}
          <Card>
            <CardContent className="p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg">Distribuição de Lucro</h4>
              </div>
              <div className="flex-1 flex items-center justify-center relative min-h-[240px]">
                <div
                  className="relative w-48 h-48 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#ffbb00 0% 35%, #3b82f6 35% 60%, #a855f7 60% 80%, var(--muted) 80% 100%)",
                  }}
                >
                  <div className="absolute inset-0 m-auto w-32 h-32 bg-card rounded-full flex flex-col items-center justify-center">
                    <span className="text-muted-foreground text-xs font-medium">
                      Total Profit
                    </span>
                    <span className="text-xl font-bold">100%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                {distribution.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${d.color}`} />
                      <span className="text-muted-foreground">{d.label}</span>
                    </div>
                    <span className="font-bold">{d.pct}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-lg">Meta de Lucro Mensal</h4>
                  <p className="text-muted-foreground text-sm">
                    Progresso vs Meta (R$ 50k)
                  </p>
                </div>
                <select className="bg-muted border text-sm rounded-lg p-2 focus:ring-[#FFBB00] focus:border-[#FFBB00]">
                  <option>This Month</option>
                  <option>Last Quarter</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex-1 flex items-end gap-2 h-64 w-full px-2 pb-2 relative border-b border-l border-border/50">
                {barChart.map((b) => (
                  <div
                    key={b.label}
                    className={`flex-1 flex flex-col justify-end items-center gap-2 group ${b.isDashed ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`w-full max-w-[40px] rounded-t-sm relative ${
                        b.highlight
                          ? "bg-[#FFBB00] shadow-[0_0_15px_rgba(255,187,0,0.3)]"
                          : b.isDashed
                            ? "bg-[#FFBB00]/10 border border-[#FFBB00]/20 border-dashed"
                            : "bg-[#FFBB00]/20 hover:bg-[#FFBB00]/40 transition-all"
                      }`}
                      style={{ height: `${b.height}%` }}
                    />
                    <span
                      className={`text-xs ${b.highlight ? "text-[#FFBB00] font-bold" : "text-muted-foreground"}`}
                    >
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <div className="p-6 border-b flex justify-between items-center">
            <h4 className="font-bold text-lg">Resumo por Operação</h4>
            <button
              type="button"
              className="text-[#FFBB00] text-sm font-semibold hover:underline"
            >
              Ver tudo
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-xs uppercase tracking-wider text-muted-foreground">
                <TableHead className="px-6 py-4">Operação</TableHead>
                <TableHead className="px-6 py-4">Total Profit (30d)</TableHead>
                <TableHead className="px-6 py-4">Commission (30d)</TableHead>
                <TableHead className="px-6 py-4">ROI</TableHead>
                <TableHead className="px-6 py-4 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((t) => (
                <TableRow
                  key={t.initials}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded bg-gradient-to-br ${t.gradientFrom} ${t.gradientTo} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold">
                    {t.profit}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {t.commission}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${t.roiPositive ? "text-green-500" : "text-red-500"}`}
                    >
                      {t.roi}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${
                        t.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
