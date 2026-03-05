"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  ArchiveX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { OperationFormDialog } from "./_components/operation-form-dialog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Creative {
  id: string;
  name: string;
  totalProfit: string;
  freelancerCut: string;
  isActive: boolean;
  isPaid: boolean;
  paidAt: string | null;
  operationId: string;
  createdAt: string;
  updatedAt: string;
}

interface Operation {
  id: string;
  name: string;
  freelancerCutPercentage: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  creatives: Creative[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface OperationsResponse {
  data: Operation[];
  pagination: PaginationInfo;
}

const ICON_COLORS = [
  "text-indigo-600",
  "text-amber-500",
  "text-emerald-600",
  "text-purple-600",
  "text-cyan-600",
  "text-orange-500",
  "text-rose-500",
  "text-teal-500",
];

function getIconColor(index: number) {
  return ICON_COLORS[index % ICON_COLORS.length];
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calcTotalProfit(creatives: Creative[]): number {
  return creatives.reduce((sum, c) => sum + Number(c.totalProfit), 0);
}

export default function OperacoesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "active";
  const [searchValue, setSearchValue] = useState(searchParam);

  const [operations, setOperations] = useState<Operation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null);

  const fetchOperations = useCallback(async (p: number, search?: string, status?: string) => {
    setLoading(true);
    try {
      const url = new URL("/api/operations", window.location.origin);
      url.searchParams.set("page", String(p));
      url.searchParams.set("limit", "10");
      if (search) {
        url.searchParams.set("search", search);
      }
      if (status) {
        url.searchParams.set("status", status);
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const json: OperationsResponse = await res.json();
        setOperations(json.data);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error("Erro ao buscar operações:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearchValue(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== searchParam) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
          params.set("search", searchValue);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, searchParam, searchParams, pathname, router]);

  useEffect(() => {
    fetchOperations(page, searchParam, statusParam);
  }, [page, searchParam, statusParam, fetchOperations]);

  function handlePageChange(newPage: number) {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    setPage(newPage);
  }

  function handleOperationCreated() {
    fetchOperations(page, searchParam, statusParam);
  }

  function handleOperationUpdated() {
    fetchOperations(page, searchParam, statusParam);
  }

  function handleEditClick(op: Operation) {
    setEditingOperation(op);
    setEditDialogOpen(true);
  }

  function handleDeleteClick(op: Operation) {
    setOperationToDelete(op);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!operationToDelete) return;

    try {
      const res = await fetch(`/api/operations/${operationToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Operação excluída", {
          description: `A operação "${operationToDelete.name}" foi removida com sucesso.`,
        });
        fetchOperations(page, searchParam, statusParam);
      } else {
        const data = await res.json();
        toast.error("Erro ao excluir", {
          description: data.detail ?? data.error ?? "Não foi possível remover a operação.",
        });
      }
    } catch {
      toast.error("Erro inesperado", {
        description: "Houve um problema ao excluir a operação. Tente novamente.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setOperationToDelete(null);
    }
  }

  function renderPaginationButtons() {
    if (!pagination || pagination.totalPages <= 1) return null;
    const pages: (number | "...")[] = [];
    const { totalPages } = pagination;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <span key={`dots-${idx}`} className="text-muted-foreground px-1">
          ...
        </span>
      ) : (
        <button
          key={p}
          type="button"
          onClick={() => handlePageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${p === page
            ? "bg-[#FFBB00] text-black shadow-md"
            : "bg-card border hover:bg-muted"
            }`}
        >
          {p}
        </button>
      ),
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-20 border-b flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-xl font-bold">Gestão de Operações</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Gerencie e monitore campanhas freelancer ativas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (statusParam === "active") {
                params.set("status", "inactive");
              } else {
                params.delete("status");
              }
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all whitespace-nowrap hidden md:block ${statusParam === "inactive"
              ? "bg-[#FFBB00] text-black border-[#FFBB00] shadow-sm"
              : "bg-transparent text-muted-foreground border-border hover:bg-muted focus:ring-2 focus:ring-[#FFBB00]"
              }`}
          >
            {statusParam === "inactive" ? "Ocultar Inativas" : "Mostrar Inativas"}
          </button>
          <div className="relative hidden md:flex items-center gap-3 bg-muted border rounded-full pl-4 pr-2 py-1.5">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input
              className="bg-transparent border-none text-xs focus-visible:ring-0 w-48 h-6 p-0"
              placeholder="Buscar operações..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Operations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-muted/50 rounded-3xl p-6 border animate-pulse min-h-[260px] flex items-center justify-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {operations.map((op, idx) => {
              const totalProfit = calcTotalProfit(op.creatives);
              const activeCreatives = op.creatives.filter(
                (c) => c.isActive,
              ).length;

              return (
                <div
                  key={op.id}
                  className="bg-muted/50 rounded-3xl p-6 border border-transparent hover:border-[#FFBB00]/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#FFBB00]/5 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center border shadow-sm">
                        <span
                          className={`${getIconColor(idx)} text-2xl font-bold`}
                        >
                          {op.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-[#FFBB00] transition-colors flex items-center gap-2">
                          {op.name}
                          {!op.active && (
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 flex items-center gap-1 opacity-80 cursor-default" title="Operação Inativa">
                              <ArchiveX className="w-3 h-3" />
                              <span className="hidden sm:inline">Inativa</span>
                            </Badge>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {op.creatives.length} criativo
                          {op.creatives.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(op)}
                        title="Editar operação"
                        className="p-2 hover:bg-card rounded-lg text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(op)}
                        title="Remover operação"
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg text-muted-foreground hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-card p-4 rounded-2xl border shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                        Porcentagem comissão
                      </p>
                      <span className="text-2xl font-black">
                        {op.freelancerCutPercentage}%
                      </span>
                    </div>
                    <div className="bg-card p-4 rounded-2xl border shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                        Lucro total
                      </p>
                      <span className={`text-lg font-bold ${totalProfit > 0 ? "text-emerald-500" :
                        totalProfit < 0 ? "text-orange-500" :
                          ""
                        }`}>
                        {formatBRL(totalProfit)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                        +{op.creatives.length}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold rounded-full"
                      >
                        {activeCreatives} ativo
                        {activeCreatives !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}

            <OperationFormDialog onCreated={handleOperationCreated}>
              <div className="border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:border-[#FFBB00]/50 transition-all cursor-pointer bg-muted/20 min-h-[200px]">
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

        {/* Edit Dialog (controlled) */}
        {editingOperation && (
          <OperationFormDialog
            operation={editingOperation}
            open={editDialogOpen}
            onOpenChange={(o) => {
              setEditDialogOpen(o);
              if (!o) setEditingOperation(null);
            }}
            onUpdated={handleOperationUpdated}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setOperationToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={operationToDelete?.name}
          title="Excluir Operação"
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" /> Anterior
            </button>
            <div className="flex items-center gap-2 mx-4">
              {renderPaginationButtons()}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              Próximo <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
