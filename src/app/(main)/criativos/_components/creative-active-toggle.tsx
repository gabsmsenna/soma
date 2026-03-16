"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { ActivateConfirmationDialog } from "@/components/ui/activate-confirmation-dialog";
import { activateCreative, deactivateCreative } from "../actions";

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
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [isActivating, startTransition] = useTransition();
  const router = useRouter();

  function handleToggleClick() {
    if (!isActive) {
      setActivateDialogOpen(true);
    } else {
      setDeactivateDialogOpen(true);
    }
  }

  async function handleDeactivateConfirm() {
    await deactivateCreative(creativeId);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleActivateConfirm() {
    await activateCreative(creativeId);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleToggleClick}
      >
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-muted dark:border-none dark:text-muted-foreground"}`}
        >
          {isActive ? "Ativo" : "Inativo"}
        </span>
        <div
          className={`w-10 h-5 ${isActive ? "bg-brand" : "bg-muted"
            } rounded-full relative shadow-inner`}
        >
          <div
            className={`absolute top-1 w-3 h-3 bg-white rounded-full ${isActive ? "right-1" : "left-1"
              }`}
          />
        </div>
      </button>

      <DeleteConfirmationDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        onConfirm={handleDeactivateConfirm}
        title="Inativar criativo"
        description={`Tem certeza que deseja inativar "${creativeName}"? O criativo deixará de aparecer como ativo.`}
        confirmLabel="Inativar"
      />

      {/* Re-using DeleteConfirmationDialog for now, but with different text and styles if possible, or just a simple ConfirmationDialog if it exists. Let's see if we can use it. Wait, DeleteConfirmationDialog usually has destructive colors (red). So it might not be ideal for Activation. Does the app have a generic ConfirmationDialog? I will check or just use this for now as user just said "modal de confirmacao igual quando inativar" */}
      <ActivateConfirmationDialog
        open={activateDialogOpen}
        onOpenChange={setActivateDialogOpen}
        onConfirm={handleActivateConfirm}
        title="Ativar criativo"
        description={`Tem certeza que deseja ativar "${creativeName}" novamente? Ele voltará a aparecer nos cards de criativos ativos.`}
        confirmLabel="Ativar"
      />
    </>
  );
}
