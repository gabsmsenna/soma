import {
  ArrowUpRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const operations = [
  {
    name: "Alpha Stream",
    manager: "@AlexRiver",
    commission: "15.5%",
    commissionChange: "+2.4%",
    profit: "+R$ 4.230",
    profitPositive: true,
    tags: ["UGC", "Paid Media"],
    iconColor: "text-indigo-600",
    hoverBorder: "hover:border-[#FFBB00]/50",
    hoverShadow: "hover:shadow-[#FFBB00]/5",
  },
  {
    name: "Beta Launch",
    manager: "@JaneCreative",
    commission: "12.0%",
    commissionChange: "Stable",
    profit: "-R$ 1.120",
    profitPositive: false,
    tags: ["Vertical Video", "Influencer"],
    iconColor: "text-amber-500",
    hoverBorder: "hover:border-orange-500/50",
    hoverShadow: "hover:shadow-orange-500/5",
  },
  {
    name: "Search Peak",
    manager: "@KimSearch",
    commission: "22.0%",
    commissionChange: "+8.1%",
    profit: "+R$ 9.880",
    profitPositive: true,
    tags: ["Display", "Search"],
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-[#FFBB00]/50",
    hoverShadow: "hover:shadow-[#FFBB00]/5",
  },
  {
    name: "Token Growth",
    manager: "@MarcusDev",
    commission: "18.2%",
    commissionChange: "+1.5%",
    profit: "+R$ 2.840",
    profitPositive: true,
    tags: ["Web3", "Social"],
    iconColor: "text-purple-600",
    hoverBorder: "hover:border-[#FFBB00]/50",
    hoverShadow: "hover:shadow-[#FFBB00]/5",
  },
  {
    name: "Viral Pulse",
    manager: "@Sandi_V",
    commission: "10.0%",
    commissionChange: "-2.1%",
    profit: "-R$ 840",
    profitPositive: false,
    tags: ["Reels", "TikTok"],
    iconColor: "text-cyan-600",
    hoverBorder: "hover:border-orange-500/50",
    hoverShadow: "hover:shadow-orange-500/5",
  },
  {
    name: "Market Flow",
    manager: "@EcomExpert",
    commission: "20.0%",
    commissionChange: "+5.5%",
    profit: "+R$ 12.300",
    profitPositive: true,
    tags: ["E-com", "Direct Response"],
    iconColor: "text-orange-500",
    hoverBorder: "hover:border-[#FFBB00]/50",
    hoverShadow: "hover:shadow-[#FFBB00]/5",
  },
];

const recentActivity = [
  {
    id: "#OP-9482",
    network: "Meta Network",
    dotColor: "bg-blue-500",
    lastSync: "2 mins ago",
    volume: "$45,200.00",
    health: "Optimal",
    healthColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
  },
  {
    id: "#OP-9480",
    network: "TikTok Ads",
    dotColor: "bg-orange-500",
    lastSync: "14 mins ago",
    volume: "$12,840.44",
    health: "Review",
    healthColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
  },
];

export default function OperacoesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-20 border-b flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-xl font-bold">Gestão de Operações</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Gerencie e monitore campanhas freelancer ativas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center gap-3 bg-muted border rounded-full pl-4 pr-2 py-1.5">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input
              className="bg-transparent border-none text-xs focus-visible:ring-0 w-48 h-6 p-0"
              placeholder="Buscar operações..."
            />
          </div>
          <button
            type="button"
            className="relative p-2.5 text-muted-foreground hover:bg-muted rounded-full transition-all"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-background" />
          </button>
          <Separator orientation="vertical" className="h-6" />
          <button
            type="button"
            className="bg-[#FFBB00] hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#FFBB00]/20 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 font-bold" />
            Nova Operação
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              className="px-5 py-2 bg-foreground text-background rounded-full text-xs font-semibold shadow-md"
            >
              Todas (86)
            </button>
            <button
              type="button"
              className="px-5 py-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full text-xs font-semibold transition-colors"
            >
              Ativas
            </button>
            <button
              type="button"
              className="px-5 py-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full text-xs font-semibold transition-colors"
            >
              Pausadas
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Ordenar por:</span>
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-bold bg-card border px-4 py-2 rounded-lg hover:bg-muted transition-colors shadow-sm"
            >
              Margem de Lucro
              <ChevronRight className="h-3 w-3 rotate-90" />
            </button>
          </div>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {operations.map((op) => (
            <div
              key={op.name}
              className={`bg-muted/50 rounded-3xl p-6 border border-transparent ${op.hoverBorder} transition-all duration-300 shadow-sm hover:shadow-lg ${op.hoverShadow} group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center border shadow-sm">
                    <span className={`${op.iconColor} text-2xl font-bold`}>
                      {op.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#FFBB00] transition-colors">
                      {op.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Gerenciado por {op.manager}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-card rounded-lg text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg text-muted-foreground hover:text-red-600 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card p-4 rounded-2xl border shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                    Porcentagem comissão
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black">{op.commission}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        op.commissionChange.startsWith("+")
                          ? "text-emerald-600"
                          : op.commissionChange.startsWith("-")
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {op.commissionChange}
                    </span>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                    Lucro total recente
                  </p>
                  <span
                    className={`text-lg font-bold ${op.profitPositive ? "" : "text-orange-500"}`}
                  >
                    {op.profit}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                    +{Math.floor(Math.random() * 20) + 3}
                  </div>
                </div>
                <div className="flex gap-2">
                  {op.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] font-bold rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-all"
          >
            <ChevronLeft className="h-3 w-3" /> Anterior
          </button>
          <div className="flex items-center gap-2 mx-4">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FFBB00] text-black font-bold text-sm shadow-md"
            >
              1
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border hover:bg-muted font-bold text-sm transition-all"
            >
              2
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border hover:bg-muted font-bold text-sm transition-all"
            >
              3
            </button>
            <span className="text-muted-foreground px-1">...</span>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border hover:bg-muted font-bold text-sm transition-all"
            >
              14
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-all"
          >
            Próximo <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-muted/50">
            <h3 className="font-bold flex items-center gap-2">
              <span className="text-[#FFBB00]">⏱</span>
              Atividade Recente
            </h3>
            <button
              type="button"
              className="text-xs font-bold text-[#FFBB00] uppercase tracking-widest hover:underline"
            >
              Ver Todos
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                <TableHead className="px-8">Operation ID</TableHead>
                <TableHead className="px-8">Network</TableHead>
                <TableHead className="px-8">Last Sync</TableHead>
                <TableHead className="px-8 text-right">Volume</TableHead>
                <TableHead className="px-8 text-center">Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((a) => (
                <TableRow
                  key={a.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="px-8 py-5 text-sm font-medium">
                    {a.id}
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${a.dotColor}`} />
                      <span className="text-sm">{a.network}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-sm text-muted-foreground">
                    {a.lastSync}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-sm font-bold text-right">
                    {a.volume}
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-black uppercase border ${a.healthColor}`}
                      >
                        {a.health}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
