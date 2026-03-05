"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Excluir",
  description,
  itemName,
}: DeleteConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirm();
    });
  };

  const desc =
    description ??
    `Tem certeza que deseja excluir ${itemName ? `"${itemName}"` : "este item"}? Esta ação não pode ser desfeita.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="sm:max-w-xs rounded-3xl p-6 text-center shadow-lg border-0 sm:rounded-[32px] overflow-hidden flex flex-col items-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4 transition-transform hover:scale-105">
          <Trash2
            className="h-7 w-7 text-red-600 dark:text-red-500"
            strokeWidth={2.5}
          />
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {desc}
        </p>

        {/* Buttons */}
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 rounded-2xl h-12 font-bold bg-muted hover:bg-muted/80 text-foreground transition-all"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-2xl h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all border-0 focus-visible:ring-red-500"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
