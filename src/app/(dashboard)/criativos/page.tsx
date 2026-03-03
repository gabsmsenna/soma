import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Filter,
    ArrowUpDown,
    Plus,
    Search,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const metrics = [
    { label: "Total Ativos", badge: "↑ 12%", badgeColor: "text-[#FFBB00]", subLabel: "Qtd. Unidades", value: "24" },
    { label: "Lucro Gerado", badge: "↑ 8.4%", badgeColor: "text-green-400", subLabel: "Bruto Total", value: "R$ 24,5k" },
    { label: "Pagamento Pendente", badge: "3 itens", badgeColor: "text-[#FFBB00]", subLabel: "A Receber", value: "R$ 3.1k" },
    { label: "Média por Criativo", badge: "Global", badgeColor: "text-[#FFBB00]", subLabel: "Performance", value: "R$ 840,0" },
];

const creatives = [
    {
        name: "Banner Black Friday V2",
        operation: "TechStore Global",
        totalProfit: "R$ 4.500,00",
        freelancerCut: "R$ 900,00",
        isPaid: true,
        isActive: true,
        lastUpdate: "Há 2 horas",
        iconBg: "bg-[#FFBB00]/20 text-[#FFBB00]",
    },
    {
        name: "Motion Video Launch",
        operation: "Fitness Pro App",
        totalProfit: "R$ 12.800,00",
        freelancerCut: "R$ 2.560,00",
        isPaid: false,
        isActive: true,
        lastUpdate: "Ontem",
        iconBg: "bg-blue-500/20 text-blue-500",
    },
    {
        name: "Carousel Ads Premium",
        operation: "Luxury Home Decor",
        totalProfit: "R$ 2.450,00",
        freelancerCut: "R$ 490,00",
        isPaid: true,
        isActive: true,
        lastUpdate: "3 dias atrás",
        iconBg: "bg-purple-500/20 text-purple-500",
    },
    {
        name: "Google Discovery Assets",
        operation: "SaaS Marketing Tool",
        totalProfit: "R$ 1.100,00",
        freelancerCut: "R$ 220,00",
        isPaid: false,
        isActive: true,
        lastUpdate: "Há 5 horas",
        iconBg: "bg-orange-500/20 text-orange-500",
    },
    {
        name: "Stories Promo Verão",
        operation: "Modas XYZ",
        totalProfit: "R$ 800,00",
        freelancerCut: "R$ 160,00",
        isPaid: true,
        isActive: false,
        lastUpdate: "1 mês atrás",
        iconBg: "bg-muted text-muted-foreground",
    },
    {
        name: "UGC Creator Review",
        operation: "SkinCare Daily",
        totalProfit: "R$ 5.900,00",
        freelancerCut: "R$ 1.180,00",
        isPaid: true,
        isActive: true,
        lastUpdate: "Ontem",
        iconBg: "bg-emerald-500/20 text-emerald-500",
    },
    {
        name: "LP Hero Animation",
        operation: "Crypto Dashboard",
        totalProfit: "R$ 9.200,00",
        freelancerCut: "R$ 1.840,00",
        isPaid: false,
        isActive: true,
        lastUpdate: "2 dias atrás",
        iconBg: "bg-cyan-500/20 text-cyan-500",
    },
];

export default function CriativosPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4 flex-1">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-6" />
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            className="w-full pl-10 rounded-xl"
                            placeholder="Buscar criativos, campanhas ou lucros..."
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="flex items-center gap-2 bg-[#FFBB00] hover:bg-[#FFBB00]/90 text-black font-bold py-2.5 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-[#FFBB00]/20"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="text-sm">Novo Criativo</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title */}
                <div>
                    <h2 className="text-3xl font-extrabold mb-2">
                        Gerenciamento de Criativos
                    </h2>
                    <p className="text-muted-foreground">
                        Monitore performance, pagamentos e registre novos lucros rapidamente.
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((m) => (
                        <div
                            key={m.label}
                            className="bg-[#111111] dark:bg-[#111111] p-6 rounded-3xl border border-white/10 group transition-all duration-300 hover:border-[#FFBB00]/50 relative overflow-hidden text-white"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    {m.label}{" "}
                                    <span className={m.badgeColor}>{m.badge}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 font-medium mb-1">
                                        {m.subLabel}
                                    </span>
                                    <span className="text-3xl font-bold tracking-tight">
                                        {m.value}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-[#FFBB00]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                        Todos os Criativos{" "}
                        <span className="text-muted-foreground font-normal ml-2 text-sm">
                            (24 totais)
                        </span>
                    </h3>
                    <div className="flex gap-3">
                        <button type="button" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Filter className="h-4 w-4" /> Filtros
                        </button>
                        <button type="button" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowUpDown className="h-4 w-4" /> Ordenar
                        </button>
                    </div>
                </div>

                {/* Creatives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {creatives.map((c) => (
                        <div
                            key={c.name}
                            className={`bg-card/50 dark:bg-card/30 backdrop-blur-sm border rounded-2xl p-5 flex flex-col group hover:border-[#FFBB00]/50 transition-all duration-300 ${!c.isActive ? "opacity-70" : ""
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-10 w-10 ${c.iconBg} rounded-lg flex items-center justify-center`}>
                                    <span className="text-lg">🎨</span>
                                </div>
                                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <Edit className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-[#FFBB00] transition-colors">
                                {c.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                                📢 Operação: {c.operation}
                            </p>
                            <div className="space-y-3 border-t pt-4 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Lucro Total</span>
                                    <span className="font-bold">{c.totalProfit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Lucro Freelancer</span>
                                    <span className="text-[#FFBB00] font-bold">
                                        {c.freelancerCut}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Pago?</span>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs font-bold ${c.isPaid
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-[#FFBB00]/10 text-[#FFBB00] border-[#FFBB00]/20"
                                            }`}
                                    >
                                        {c.isPaid ? "SIM" : "PENDENTE"}
                                    </Badge>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-full mb-4 flex items-center justify-center gap-2 bg-[#FFBB00]/10 hover:bg-[#FFBB00] text-[#FFBB00] hover:text-black font-bold py-2 rounded-xl transition-all border border-[#FFBB00]/20"
                            >
                                <span className="text-xs uppercase tracking-wider">
                                    Registrar Lucro
                                </span>
                            </button>
                            <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                                        Última Atualização
                                    </span>
                                    <span className="text-xs">{c.lastUpdate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                        {c.isActive ? "Ativo" : "Inativo"}
                                    </span>
                                    <div
                                        className={`w-10 h-5 ${c.isActive ? "bg-[#FFBB00]" : "bg-muted"
                                            } rounded-full relative cursor-pointer shadow-inner`}
                                    >
                                        <div
                                            className={`absolute top-1 w-3 h-3 bg-white rounded-full ${c.isActive ? "right-1" : "left-1"
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* New Creative Card */}
                    <div className="border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center group hover:border-[#FFBB00]/50 transition-all cursor-pointer bg-muted/20">
                        <div className="h-16 w-16 bg-[#FFBB00]/10 text-[#FFBB00] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="h-8 w-8" />
                        </div>
                        <p className="font-bold mb-1">Novo Criativo</p>
                        <p className="text-xs text-muted-foreground">
                            Adicione uma nova arte para começar a monitorar os lucros.
                        </p>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-4 pb-4">
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFBB00] text-black font-bold shadow-lg shadow-[#FFBB00]/20">
                        1
                    </button>
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground font-bold">
                        2
                    </button>
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground font-bold">
                        3
                    </button>
                    <span className="text-muted-foreground px-2 font-bold">...</span>
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground font-bold">
                        6
                    </button>
                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto p-6 bg-muted/50 border-t flex items-center justify-between">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total a Receber</p>
                        <p className="text-xl font-black text-[#FFBB00]">R$ 3.120,00</p>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Criativos Ativos</p>
                        <p className="text-xl font-black">14</p>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Taxa de Conversão</p>
                        <p className="text-xl font-black">8.4%</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground">
                    Soma v1.0.5 © 2024 Grid Management System
                </div>
            </footer>
        </div>
    );
}
