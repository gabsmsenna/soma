"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerProfit } from "../actions";

interface RegisterProfitDialogProps {
  creativeId: string;
  currentProfit: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterProfitDialog({
  creativeId,
  currentProfit,
  open,
  onOpenChange,
}: RegisterProfitDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleOpenChange(value: boolean) {
    if (!value) setError(null);
    onOpenChange(value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));

    startTransition(async () => {
      const result = await registerProfit(creativeId, { amount });

      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error.detail);
      }
    });
  }

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(currentProfit));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Registrar Lucro</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Lucro atual: <span className="font-semibold">{formatted}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor a adicionar (R$)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
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
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#FFBB00] hover:bg-[#FFBB00]/90 text-black font-bold"
            >
              {isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
