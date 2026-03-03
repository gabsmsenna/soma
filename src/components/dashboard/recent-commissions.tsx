import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

export function RecentCommissions() {
  return (
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
  );
}
