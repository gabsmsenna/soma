"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreativeViewModel } from "../_types";
import { createCreative, updateCreative } from "../actions";

interface Operation {
  id: string;
  name: string;
}

interface CreateMode {
  mode?: "create";
  creative?: never;
  operations?: Operation[];
  children?: React.ReactNode;
}

interface EditMode {
  mode: "edit";
  creative: CreativeViewModel;
  operations?: never;
  children?: React.ReactNode;
}

type CreativeFormDialogProps = CreateMode | EditMode;

export function CreativeFormDialog({
  mode = "create",
  creative,
  operations = [],
  children,
}: CreativeFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [operationId, setOperationId] = useState("");
  const router = useRouter();

  const isEdit = mode === "edit" && creative !== undefined;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setOperationId("");
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isEdit && !operationId) {
      setError("Por favor, selecione uma operação.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const totalProfit = Number(formData.get("totalProfit"));

    startTransition(async () => {
      const result = isEdit
        ? await updateCreative(creative.id, { name, totalProfit })
        : await createCreative({ name, totalProfit, operationId });

      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error.detail);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="flex items-center gap-2 bg-brand hover:bg-brand/90 text-black dark:bg-brand dark:hover:bg-brand/90 dark:text-black font-bold py-2.5 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-brand/20">
            <Plus className="h-5 w-5" />
            <span className="text-sm">Novo Criativo</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Criativo" : "Novo Criativo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome do criativo"
              defaultValue={isEdit ? creative.name : ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalProfit">Lucro Total (R$)</Label>
            <Input
              id="totalProfit"
              name="totalProfit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              defaultValue={isEdit ? creative.totalProfit : ""}
              required
            />
          </div>
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="operationId">Operação</Label>
              <Select
                name="operationId"
                onValueChange={setOperationId}
                value={operationId}
              >
                <SelectTrigger id="operationId" className="w-full">
                  <SelectValue placeholder="Selecione uma operação" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-60">
                  {operations.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand hover:bg-brand/90 text-black font-bold"
          >
            {isPending ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
