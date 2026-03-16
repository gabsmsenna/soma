"use client";

import { Power } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ActivateConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
}

export function ActivateConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Ativar",
  description,
  itemName,
  confirmLabel = "Ativar",
}: ActivateConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirm();
    });
  };

  const desc =
    description ??
    `Tem certeza que deseja ativar ${itemName ? `"${itemName}"` : "este item"}?`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs rounded-3xl p-6 text-center shadow-lg border-0 sm:rounded-[32px] overflow-hidden flex flex-col items-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-brand/10 flex items-center justify-center mb-4 transition-transform hover:scale-105">
          <Power className="h-7 w-7 text-brand" strokeWidth={2.5} />
        </div>

        <DialogTitle className="text-xl font-bold text-foreground mb-2">
          {title}
        </DialogTitle>
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
            className="flex-1 rounded-2xl h-12 font-bold bg-brand hover:bg-brand/90 text-black shadow-md shadow-brand/20 transition-all border-0 focus-visible:ring-brand"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? `${confirmLabel}...` : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
