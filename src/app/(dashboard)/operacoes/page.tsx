"use client";

import { Loader2, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { OperationCard } from "./_components/operation-card";
import { OperationFormDialog } from "./_components/operation-form-dialog";
import { OperationsHeader } from "./_components/operation-header";
import { OperationsPagination } from "./_components/operations-pagination";
import { useOperations } from "./_hooks/use-operation";
import type { Operation } from "./_types/types";

function OperacoesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "active";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchValue, setSearchValue] = useState(searchParam);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(
    null,
  );
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(
    null,
  );

  const { operations, pagination, loading, deleteOperation, refresh } =
    useOperations(pageParam, searchParam, statusParam);

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
    const success = await deleteOperation(operationToDelete.id);
    if (success) setOperationToDelete(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <OperationsHeader
        statusParam={statusParam}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onToggleStatus={handleToggleStatus}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {["s-1", "s-2", "s-3", "s-4", "s-5", "s-6"].map((sKey) => (
              <div
                key={sKey}
                className="bg-muted/50 rounded-3xl p-6 border animate-pulse min-h-65 flex justify-center items-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
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

            <OperationFormDialog onCreated={refresh}>
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
        )}

        <OperationsPagination pagination={pagination} currentPage={pageParam} />

        {editingOperation && (
          <OperationFormDialog
            operation={editingOperation}
            open={!!editingOperation}
            onOpenChange={(open) => !open && setEditingOperation(null)}
            onUpdated={refresh}
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

// 2. Criamos o componente principal apenas como um "wrapper" com Suspense
export default function OperacoesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <OperacoesContent />
    </Suspense>
  );
}
