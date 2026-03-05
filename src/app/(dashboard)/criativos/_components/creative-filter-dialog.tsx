"use client";

import { ListFilter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { cn } from "@/lib/utils";

interface CreativeFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreativeFilterDialog({
  open,
  onOpenChange,
}: CreativeFilterDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [operation, setOperation] = useState("all");
  const [status, setStatus] = useState<"active" | "inactive" | "all">("active");

  // Sync state with url params when dialog opens
  useEffect(() => {
    if (open) {
      setSearch(searchParams.get("search") || "");
      setOperation(searchParams.get("operation") || "all");
      const statusParam = searchParams.get("status");
      if (
        statusParam === "active" ||
        statusParam === "inactive" ||
        statusParam === "all"
      ) {
        setStatus(statusParam as "active" | "inactive" | "all");
      } else {
        setStatus("active");
      }
    }
  }, [open, searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (operation && operation !== "all") {
      params.set("operation", operation);
    } else {
      params.delete("operation");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    // Reset to page 1 on filter
    params.set("page", "1");

    router.push(`?${params.toString()}`);
    onOpenChange(false);
  };

  const handleClear = () => {
    setSearch("");
    setOperation("all");
    setStatus("active");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 sm:max-w-[425px] p-0 overflow-hidden"
      >
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <DialogTitle className="text-xl font-bold dark:text-zinc-100">
              Filtrar Criativos
            </DialogTitle>
            <DialogClose className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="h-5 w-5 dark:text-zinc-400" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-zinc-100">
                Nome do Criativo
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o nome do criativo..."
                  className="pl-9 bg-transparent border-zinc-300 dark:border-zinc-800"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-zinc-100">
                Operação
              </Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="w-full bg-transparent border-zinc-300 dark:border-zinc-800">
                  <SelectValue placeholder="Todas as Operações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Operações</SelectItem>
                  {/* TODO: Add real operations here if needed, for now mocked */}
                  <SelectItem value="op1">Operação Alpha</SelectItem>
                  <SelectItem value="op2">Operação Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-zinc-100">
                Status
              </Label>
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-full transition-all",
                    status === "active"
                      ? "bg-[#FFB800] text-black shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
                  )}
                >
                  Ativos
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("inactive")}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-full transition-all",
                    status === "inactive"
                      ? "bg-[#FFB800] text-black shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
                  )}
                >
                  Inativos
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={handleClear}
          >
            Limpar Filtros
          </Button>
          <Button
            className="flex-1 bg-[#FFB800] hover:bg-[#e5a600] text-black font-semibold border-none"
            onClick={handleApply}
          >
            Aplicar Filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
