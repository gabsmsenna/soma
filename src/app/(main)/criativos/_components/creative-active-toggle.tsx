"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { deactivateCreative } from "../actions";

interface CreativeActiveToggleProps {
  creativeId: string;
  isActive: boolean;
  creativeName: string;
}

export function CreativeActiveToggle({
  creativeId,
  isActive,
  creativeName,
}: CreativeActiveToggleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleToggleClick() {
    if (!isActive) return;
    setDialogOpen(true);
  }

  async function handleConfirm() {
    await deactivateCreative(creativeId);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2 cursor-default disabled:cursor-default"
        onClick={handleToggleClick}
        disabled={!isActive}
      >
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-muted dark:border-none dark:text-muted-foreground"}`}
        >
          {isActive ? "Ativo" : "Inativo"}
        </span>
        <div
          className={`w-10 h-5 ${
            isActive ? "bg-brand" : "bg-muted"
          } rounded-full relative shadow-inner`}
        >
          <div
            className={`absolute top-1 w-3 h-3 bg-white rounded-full ${
              isActive ? "right-1" : "left-1"
            }`}
          />
        </div>
      </button>

      <DeleteConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
        title="Inativar criativo"
        description={`Tem certeza que deseja inativar "${creativeName}"? O criativo deixará de aparecer como ativo.`}
        confirmLabel="Inativar"
      />
    </>
  );
}
