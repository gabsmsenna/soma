import { Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MonthlyGoal() {
  return (
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
              <span className="text-4xl font-black text-orange-500">85%</span>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Objetivo
                </p>
                <p className="text-lg font-bold">R$ 50.000,00</p>
              </div>
            </div>
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-[#FFBB00] w-[85%] rounded-full shadow-[0_0_20px_rgba(255,108,0,0.3)] transition-all duration-1000" />
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
              <p className="text-sm font-semibold">R$ 42.500,00 acumulados</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
