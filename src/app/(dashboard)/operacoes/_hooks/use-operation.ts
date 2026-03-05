import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Operation,
  OperationsResponse,
  PaginationInfo,
} from "../_types/types";

export function useOperations(
  page: number,
  searchParam: string,
  statusParam: string,
) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOperations = useCallback(
    async (p: number, search?: string, status?: string) => {
      setLoading(true);
      try {
        const url = new URL("/api/operations", window.location.origin);
        url.searchParams.set("page", String(p));
        url.searchParams.set("limit", "10");
        if (search) url.searchParams.set("search", search);
        if (status) url.searchParams.set("status", status);

        const res = await fetch(url.toString());
        if (res.ok) {
          const json: OperationsResponse = await res.json();
          setOperations(json.data);
          setPagination(json.pagination);
        }
      } catch (err) {
        console.error("Erro ao buscar operações:", err);
        toast.error("Erro ao carregar dados da API.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchOperations(page, searchParam, statusParam);
  }, [page, searchParam, statusParam, fetchOperations]);

  const deleteOperation = async (operationId: string) => {
    try {
      const res = await fetch(`/api/operations/${operationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Operação excluída com sucesso.");
        fetchOperations(page, searchParam, statusParam);
        return true;
      }
      const data = await res.json();
      toast.error("Erro ao excluir", {
        description: data.detail ?? data.error,
      });
      return false;
    } catch {
      toast.error("Erro inesperado ao excluir a operação.");
      return false;
    }
  };

  const refresh = () => fetchOperations(page, searchParam, statusParam);

  return { operations, pagination, loading, deleteOperation, refresh };
}
