"use client";

import { ChevronDown, ChevronUp, Palette, Rocket } from "lucide-react";
import { useState } from "react";
import type { ProfitReportOperationGroup } from "@/dtos/profit-report.dto";
import { PaymentStatusBadge } from "./payment-status-badge";
import { TrendBadge } from "./trend-badge";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface OperationCardProps {
  group: ProfitReportOperationGroup;
}

export function OperationCard({ group }: OperationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 rounded-2xl p-6 overflow-hidden hover:border-[#ffbb00]/30 transition-all">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffbb00]/20 to-[#ffbb00]/5 flex items-center justify-center border border-[#ffbb00]/20">
            <Rocket className="text-[#ffbb00] h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {group.operationName}
            </h3>
            <p className="text-sm text-slate-400">
              {group.creatives.length} criativo
              {group.creatives.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Lucro Total Op.
            </p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(group.totalProfit)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Meu Lucro ({group.freelancerCutPercentage}%)
            </p>
            <p
              className="text-xl font-bold text-[#ffbb00]"
              style={{ textShadow: "0 0 10px rgba(255, 187, 0, 0.3)" }}
            >
              {formatCurrency(group.myProfit)}
            </p>
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Desempenho dos Criativos
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="py-3 px-4 font-medium uppercase tracking-wider">
                    Criativo
                  </th>
                  <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                    Lucro Total
                  </th>
                  <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                    Meu Lucro
                  </th>
                  <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                    Data Pagamento
                  </th>
                  <th className="py-3 px-4 font-medium uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-3 px-4 font-medium uppercase tracking-wider text-center">
                    Tendência
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-300">
                {group.creatives.map((creative) => (
                  <tr
                    key={`${creative.creativeId}-${creative.paidAt?.toString() ?? "unpaid"}`}
                    className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <td className="py-4 px-4">
                      <p className="font-bold text-white">
                        {creative.creativeName}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {formatCurrency(creative.totalProfit)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-white">
                      {formatCurrency(creative.commission)}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-400">
                      {creative.paidAt
                        ? new Date(creative.paidAt).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <PaymentStatusBadge isPaid={creative.isPaid} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <TrendBadge trend={creative.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
