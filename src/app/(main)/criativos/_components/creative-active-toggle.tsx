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
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {isActive ? "Ativo" : "Inativo"}
        </span>
        <div
          className={`w-10 h-5 ${
            isActive ? "bg-[#FFBB00]" : "bg-muted"
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
