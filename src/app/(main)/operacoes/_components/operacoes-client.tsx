"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import type { Operation, PaginationInfo } from "../_types/types";
import { deleteOperation } from "../actions";
import { OperationCard } from "./operation-card";
import { OperationFormDialog } from "./operation-form-dialog";
import { OperationsHeader } from "./operation-header";
import { OperationsPagination } from "./operations-pagination";

interface OperacoesClientProps {
  operations: Operation[];
  pagination: PaginationInfo;
  searchParam: string;
  statusParam: string;
  currentPage: number;
}

export function OperacoesClient({
  operations,
  pagination,
  searchParam,
  statusParam,
  currentPage,
}: OperacoesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParam);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(
    null,
  );
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(
    null,
  );
  const [, startDeleteTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== searchParam) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) params.set("search", searchValue);
        else params.delete("search");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, searchParam, searchParams, pathname, router]);

  const handleToggleStatus = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", statusParam === "active" ? "inactive" : "active");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleConfirmDelete = async () => {
    if (!operationToDelete) return;
    await new Promise<void>((resolve) => {
      startDeleteTransition(async () => {
        const result = await deleteOperation(operationToDelete.id);
        if (result.success) {
          toast.success("Operação excluída com sucesso.");
          setOperationToDelete(null);
          router.refresh();
        } else {
          toast.error("Erro ao excluir", {
            description: result.error.detail,
          });
        }
        resolve();
      });
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] dark:bg-background text-slate-800 dark:text-foreground">
      <OperationsHeader
        statusParam={statusParam}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onToggleStatus={handleToggleStatus}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {operations.map((op, idx) => (
            <OperationCard
              key={op.id}
              operation={op}
              index={idx}
              onEdit={() => setEditingOperation(op)}
              onDelete={() => setOperationToDelete(op)}
            />
          ))}

          <OperationFormDialog>
            <div className="border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:border-[#FFBB00]/50 transition-all cursor-pointer bg-muted/20 min-h-50">
              <div className="h-16 w-16 bg-[#FFBB00]/10 text-[#FFBB00] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8" />
              </div>
              <p className="font-bold mb-1">Nova Operação</p>
              <p className="text-xs text-muted-foreground">
                Adicione uma nova operação para começar a monitorar os lucros.
              </p>
            </div>
          </OperationFormDialog>
        </div>

        <OperationsPagination
          pagination={pagination}
          currentPage={currentPage}
        />

        {editingOperation && (
          <OperationFormDialog
            operation={editingOperation}
            open={!!editingOperation}
            onOpenChange={(open) => !open && setEditingOperation(null)}
          />
        )}

        <DeleteConfirmationDialog
          open={!!operationToDelete}
          onOpenChange={(open) => !open && setOperationToDelete(null)}
          onConfirm={handleConfirmDelete}
          itemName={operationToDelete?.name}
          title="Excluir Operação"
        />
      </div>
    </div>
  );
}
