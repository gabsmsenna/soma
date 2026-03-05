import { useCallback, useEffect, useState } from "react";
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

  const refresh = () => fetchOperations(page, searchParam, statusParam);

  return { operations, pagination, loading, refresh };
}
