"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCreative, markAsPaid } from "../actions";

interface CreativeActionButtonsProps {
  creativeId: string;
  isPaid: boolean;
  projectId: string;
  creativeName: string;
}

export function CreativeActionButtons({
  creativeId,
  isPaid,
  creativeName,
}: CreativeActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMarkAsPaid() {
    startTransition(async () => {
      await markAsPaid(creativeId);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm(`Deletar "${creativeName}"?`)) return;
    startTransition(async () => {
      await deleteCreative(creativeId);
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
          className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black font-bold py-2 rounded-xl transition-all border border-green-500/20 text-xs uppercase tracking-wider disabled:opacity-50"
        >
          {isPending ? "..." : "Marcar Pago"}
        </button>
      )}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-[#FFBB00]/10 hover:bg-[#FFBB00] text-[#FFBB00] hover:text-black font-bold py-2 rounded-xl transition-all border border-[#FFBB00]/20 text-xs uppercase tracking-wider"
      >
        Registrar Lucro
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20 text-xs disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          Deletar
        </button>
      </div>
    </div>
  );
}
