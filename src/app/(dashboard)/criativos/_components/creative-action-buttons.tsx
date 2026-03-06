"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { markAsPaid } from "../actions";

interface CreativeActionButtonsProps {
  creativeId: string;
  isPaid: boolean;
}

export function CreativeActionButtons({
  creativeId,
  isPaid,
}: CreativeActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMarkAsPaid() {
    startTransition(async () => {
      await markAsPaid(creativeId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      {!isPaid && (
        <button
          type="button"
          onClick={handleMarkAsPaid}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-green-700/10 hover:bg-green-700 text-green-700 hover:text-white font-bold py-2 rounded-xl transition-all border border-green-700/20 dark:bg-green-500/10 dark:text-green-500 dark:hover:bg-green-500 dark:hover:text-black dark:border-green-500/20 text-xs uppercase tracking-wider disabled:opacity-50"
        >
          {isPending ? "..." : "Marcar Pago"}
        </button>
      )}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-[#FFBB00]/20 hover:bg-[#FFBB00] text-[#997000] dark:bg-[#FFBB00]/10 dark:text-[#FFBB00] hover:text-black font-bold py-2 rounded-xl transition-all border border-[#FFBB00]/20 text-xs uppercase tracking-wider"
      >
        Registrar Lucro
      </button>
    </div>
  );
}
