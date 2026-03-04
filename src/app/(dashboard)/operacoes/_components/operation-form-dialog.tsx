"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OperationFormDialogProps {
  children?: React.ReactNode;
  onCreated?: () => void;
}

export function OperationFormDialog({ children, onCreated }: OperationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const freelancerCutPercentage = Number(
      formData.get("freelancerCutPercentage"),
    );

    startTransition(async () => {
      try {
        const response = await fetch("/api/operations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, freelancerCutPercentage }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.detail ?? data.error ?? "Erro ao criar operação");
          return;
        }

        setOpen(false);
        onCreated?.();
      } catch {
        setError("Erro ao criar operação. Tente novamente.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <button
            type="button"
            className="bg-[#FFBB00] hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#FFBB00]/20 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 font-bold" />
            Nova Operação
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Operação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome da operação"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freelancerCutPercentage">
              Percentual de Comissão (%)
            </Label>
            <Input
              id="freelancerCutPercentage"
              name="freelancerCutPercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0.00"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#FFBB00] hover:bg-[#FFBB00]/90 text-black font-bold"
          >
            {isPending ? "Criando..." : "Criar Operação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
