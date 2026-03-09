"use client";

import { useState } from "react";
import { MarkPaidConfirmationDialog } from "./mark-paid-confirmation-dialog";
import { RegisterProfitDialog } from "./register-profit-dialog";

interface CreativeActionButtonsProps {
  creativeId: string;
  creativeName: string;
  freelancerCut: string;
  totalProfit: string;
}

export function CreativeActionButtons({
  creativeId,
  creativeName,
  freelancerCut,
  totalProfit,
}: CreativeActionButtonsProps) {
  const [profitDialogOpen, setProfitDialogOpen] = useState(false);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);

  const hasCommission = Number(freelancerCut) > 0;

  return (
    <div className="space-y-2">
      {hasCommission && (
        <button
          type="button"
          onClick={() => setMarkPaidOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-green-700/10 hover:bg-green-700 text-green-700 hover:text-white font-bold py-2 rounded-xl transition-all border border-green-700/20 dark:bg-green-500/10 dark:text-green-500 dark:hover:bg-green-500 dark:hover:text-black dark:border-green-500/20 text-xs uppercase tracking-wider"
        >
          Marcar Pago
        </button>
      )}
      <button
        type="button"
        onClick={() => setProfitDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#FFBB00]/20 hover:bg-[#FFBB00] text-[#997000] dark:bg-[#FFBB00]/10 dark:text-[#FFBB00] hover:text-black font-bold py-2 rounded-xl transition-all border border-[#FFBB00]/20 text-xs uppercase tracking-wider"
      >
        Registrar Lucro
      </button>
      <RegisterProfitDialog
        creativeId={creativeId}
        currentProfit={totalProfit}
        open={profitDialogOpen}
        onOpenChange={setProfitDialogOpen}
      />
      <MarkPaidConfirmationDialog
        creativeId={creativeId}
        creativeName={creativeName}
        freelancerCut={freelancerCut}
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
      />
    </div>
  );
}
