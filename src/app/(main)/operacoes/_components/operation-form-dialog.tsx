"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
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
import type { Operation } from "../_types/types";
import { createOperation, updateOperation } from "../actions";

interface OperationFormDialogProps {
  children?: React.ReactNode;
  /** Quando fornecido, o dialog entra em modo edição */
  operation?: Operation;
  onCreated?: () => void;
  onUpdated?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OperationFormDialog({
  children,
  operation,
  onCreated,
  onUpdated,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: OperationFormDialogProps) {
  const isEditMode = !!operation;
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  // Reset error when dialog opens
  useEffect(() => {
    if (open) setError(null);
  }, [open]);

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
        const result = isEditMode
          ? await updateOperation(operation.id, {
              name,
              freelancerCutPercentage,
            })
          : await createOperation({ name, freelancerCutPercentage });

        if (!result.success) {
          setError(result.error.detail);
          toast.error("Erro ao salvar", {
            description: result.error.detail,
          });
          return;
        }

        setOpen(false);
        router.refresh();
        if (isEditMode) {
          toast.success("Operação atualizada", {
            description: "As alterações foram salvas com sucesso.",
          });
          onUpdated?.();
        } else {
          toast.success("Operação criada", {
            description: "A nova operação foi criada com sucesso.",
          });
          onCreated?.();
        }
      } catch {
        const errorMessage = "Erro ao salvar operação. Tente novamente.";
        setError(errorMessage);
        toast.error("Erro inesperado", { description: errorMessage });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      {!children && !isEditMode && (
        <DialogTrigger asChild>
          <button
            type="button"
            className="bg-[#FFBB00] hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#FFBB00]/20 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 font-bold" />
            Nova Operação
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Operação" : "Nova Operação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome da operação"
              defaultValue={operation?.name ?? ""}
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
              defaultValue={operation?.freelancerCutPercentage ?? ""}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#FFBB00] hover:bg-[#FFBB00]/90 text-black font-bold"
          >
            {isPending
              ? isEditMode
                ? "Salvando..."
                : "Criando..."
              : isEditMode
                ? "Salvar Alterações"
                : "Criar Operação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
