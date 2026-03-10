"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { registerProfitPayment } from "../actions";

interface MarkPaidConfirmationDialogProps {
  creativeId: string;
  creativeName: string;
  freelancerCut: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkPaidConfirmationDialog({
  creativeId,
  creativeName,
  freelancerCut,
  open,
  onOpenChange,
}: MarkPaidConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(freelancerCut));

  function handleConfirm() {
    startTransition(async () => {
      const result = await registerProfitPayment(creativeId);
      if (result.success) {
        toast.success("Pagamento registrado!", {
          description: `Comissão de ${formatted} registrada para ${creativeName}. Saldo zerado.`,
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error.title, {
          description: result.error.detail,
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Criativo:{" "}
            <span className="font-semibold text-foreground">
              {creativeName}
            </span>
          </p>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
              Valor a registrar
            </p>
            <p className="text-2xl font-bold text-brand">{formatted}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Ao confirmar, o valor de comissão será salvo no histórico e o saldo
            será zerado para novo acúmulo.
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            {isPending ? "Registrando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
