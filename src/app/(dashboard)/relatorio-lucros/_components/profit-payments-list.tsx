"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CreativeEntry {
  creativeId: string;
  creativeName: string;
  lucreTotalCriativo: number;
  comissaoFreelancer: number;
  dataPagamento: Date;
}

interface OperationGroup {
  operationId: string;
  operationName: string;
  totalLucro: number;
  totalComissao: number;
  creatives: CreativeEntry[];
}

interface ProfitPaymentsListProps {
  groups: OperationGroup[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProfitPaymentsList({ groups }: ProfitPaymentsListProps) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">
          Nenhum pagamento encontrado para o período selecionado.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {groups.map((group) => (
        <AccordionItem
          key={group.operationId}
          value={group.operationId}
          className="rounded-lg border bg-card px-4 last:border-b"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-1 items-center justify-between pr-4">
              <span className="font-semibold text-base">
                {group.operationName}
              </span>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Lucro total</p>
                  <p className="font-medium">
                    {formatCurrency(group.totalLucro)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Comissão</p>
                  <p className="font-semibold text-[#FFBB00]">
                    {formatCurrency(group.totalComissao)}
                  </p>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="border-t pt-3 space-y-2">
              <div className="grid grid-cols-3 gap-4 px-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Criativo</span>
                <span className="text-right hidden sm:block">
                  Lucro do criativo
                </span>
                <span className="text-right">Comissão paga</span>
              </div>
              {group.creatives.map((creative) => (
                <div
                  key={`${creative.creativeId}-${creative.dataPagamento}`}
                  className="grid grid-cols-3 gap-4 rounded-md bg-muted/40 px-2 py-2.5 text-sm"
                >
                  <span className="font-medium truncate">
                    {creative.creativeName}
                  </span>
                  <span className="text-right hidden sm:block text-muted-foreground">
                    {formatCurrency(creative.lucreTotalCriativo)}
                  </span>
                  <span className="text-right font-semibold">
                    {formatCurrency(creative.comissaoFreelancer)}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
