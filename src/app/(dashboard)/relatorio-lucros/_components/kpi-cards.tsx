import { TrendingDown, TrendingUp } from "lucide-react";
import type { ProfitReportKpis } from "@/dtos/profit-report.dto";

function formatCurrency(value: number): { main: string; cents: string } {
  const formatted = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const parts = formatted.split(",");
  return { main: parts[0], cents: `,${parts[1] ?? "00"}` };
}

interface KpiCardsProps {
  kpis: ProfitReportKpis;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const totalFormatted = formatCurrency(kpis.totalProfit);
  const myFormatted = formatCurrency(kpis.myProfit);
  const isPositiveChange = kpis.percentChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Lucro Total */}
      <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ffbb00]/10 rounded-full blur-2xl group-hover:bg-[#ffbb00]/20 transition-all" />
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Lucro Total (Operações)
          </p>
          <h3 className="text-3xl font-bold text-white">
            {totalFormatted.main}
            <span className="text-lg text-slate-500 font-normal">
              {totalFormatted.cents}
            </span>
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              isPositiveChange
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositiveChange ? "+" : ""}
            {kpis.percentChange}%
          </div>
          <svg
            role="img"
            aria-label="Gráfico de lucro total"
            fill="none"
            height="30"
            viewBox="0 0 80 30"
            width="80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Gráfico de lucro total</title>
            <path
              d="M1 25L15 18L25 22L40 10L55 15L79 1"
              stroke="#ffbb00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M1 25L15 18L25 22L40 10L55 15L79 1V30H1V25Z"
              fill="url(#grad1)"
              opacity="0.2"
            />
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="grad1"
                x1="40"
                x2="40"
                y1="0"
                y2="30"
              >
                <stop stopColor="#ffbb00" />
                <stop offset="1" stopColor="#ffbb00" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Meu Lucro */}
      <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ffbb00]/10 rounded-full blur-2xl group-hover:bg-[#ffbb00]/20 transition-all" />
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Meu Lucro (Comissão)
          </p>
          <h3 className="text-3xl font-bold text-white">
            {myFormatted.main}
            <span className="text-lg text-slate-500 font-normal">
              {myFormatted.cents}
            </span>
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              isPositiveChange
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositiveChange ? "+" : ""}
            {kpis.percentChange}%
          </div>
          <svg
            role="img"
            aria-label="Gráfico do meu lucro"
            fill="none"
            height="30"
            viewBox="0 0 80 30"
            width="80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Gráfico do meu lucro</title>
            <path
              d="M1 20L20 25L40 15L60 18L79 5"
              stroke="#ffbb00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M1 20L20 25L40 15L60 18L79 5V30H1V20Z"
              fill="url(#grad2)"
              opacity="0.2"
            />
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="grad2"
                x1="40"
                x2="40"
                y1="0"
                y2="30"
              >
                <stop stopColor="#ffbb00" />
                <stop offset="1" stopColor="#ffbb00" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Criativo + Lucrativo */}
      <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Criativo + Lucrativo
          </p>
          {kpis.topCreative ? (
            <>
              <h3 className="text-2xl font-bold text-white truncate">
                {kpis.topCreative.name}
              </h3>
              <p className="text-emerald-400 text-sm font-medium mt-1">
                {formatCurrency(kpis.topCreative.totalProfit).main}
              </p>
            </>
          ) : (
            <h3 className="text-lg font-bold text-slate-500">Sem dados</h3>
          )}
        </div>
        <div className="flex items-end justify-between">
          {kpis.topCreative && (
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              {kpis.topCreative.operationName}
            </div>
          )}
          <svg
            role="img"
            aria-label="Gráfico de criativo mais lucrativo"
            fill="none"
            height="30"
            viewBox="0 0 80 30"
            width="80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Gráfico de criativo mais lucrativo</title>
            <path
              d="M1 28L15 20L30 22L50 10L65 12L79 2"
              stroke="#34d399"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Criativo - Lucrativo */}
      <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Criativo - Lucrativo
          </p>
          {kpis.bottomCreative ? (
            <>
              <h3 className="text-2xl font-bold text-white truncate">
                {kpis.bottomCreative.name}
              </h3>
              <p className="text-red-400 text-sm font-medium mt-1">
                {formatCurrency(kpis.bottomCreative.totalProfit).main}
              </p>
            </>
          ) : (
            <h3 className="text-lg font-bold text-slate-500">Sem dados</h3>
          )}
        </div>
        <div className="flex items-end justify-between">
          {kpis.bottomCreative && (
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              {kpis.bottomCreative.operationName}
            </div>
          )}
          <svg
            role="img"
            aria-label="Gráfico de criativo menos lucrativo"
            fill="none"
            height="30"
            viewBox="0 0 80 30"
            width="80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Gráfico de criativo menos lucrativo</title>
            <path
              d="M1 10L20 8L40 15L60 20L79 25"
              stroke="#ef4444"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
