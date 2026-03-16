"use client";

import { useState } from "react";
import { MarkPaidConfirmationDialog } from "./mark-paid-confirmation-dialog";
import { RegisterProfitDialog } from "./register-profit-dialog";

interface CreativeActionButtonsProps {
  creativeId: string;
  creativeName: string;
  freelancerCut: string;
  totalProfit: string;
  isActive: boolean;
}

export function CreativeActionButtons({
  creativeId,
  creativeName,
  freelancerCut,
  totalProfit,
  isActive,
}: CreativeActionButtonsProps) {
  const [profitDialogOpen, setProfitDialogOpen] = useState(false);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);

  const hasCommission = Number(freelancerCut) > 0;

  return (
    <div className="space-y-2">
      {hasCommission && (
        <button
          type="button"
          disabled={!isActive}
          onClick={() => setMarkPaidOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-green-700/10 hover:bg-green-700 text-green-700 hover:text-white font-bold py-2 rounded-xl transition-all border border-green-700/20 dark:bg-green-500/10 dark:text-green-500 dark:hover:bg-green-500 dark:hover:text-black dark:border-green-500/20 text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-700/10 disabled:hover:text-green-700 disabled:dark:hover:bg-green-500/10 disabled:dark:hover:text-green-500"
        >
          Marcar Pago
        </button>
      )}
      <button
        type="button"
        disabled={!isActive}
        onClick={() => setProfitDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-brand/20 hover:bg-brand text-[#997000] hover:text-black font-bold py-2 rounded-xl transition-all border border-brand/20 dark:bg-brand/10 dark:text-brand dark:hover:bg-brand dark:hover:text-black text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand/20 disabled:hover:text-[#997000] disabled:dark:hover:bg-brand/10 disabled:dark:hover:text-brand"
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
