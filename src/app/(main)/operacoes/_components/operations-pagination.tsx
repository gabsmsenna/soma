"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationInfo } from "../_types/types";

interface OperationsPaginationProps {
  pagination: PaginationInfo | null;
  currentPage: number;
}

export function OperationsPagination({
  pagination,
  currentPage,
}: OperationsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pagination || pagination.totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderPaginationButtons = () => {
    const pages: (number | "...")[] = [];
    const { totalPages } = pagination;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, index) =>
      p === "..." ? (
        <span key={`dots-${index}-${p}`} className="text-muted-foreground px-1">
          ...
        </span>
      ) : (
        <button
          key={`page-${p}`}
          type="button"
          onClick={() => handlePageChange(p as number)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
            p === currentPage
              ? "bg-[#FFBB00] text-black shadow-md"
              : "bg-card border hover:bg-muted"
          }`}
        >
          {p}
        </button>
      ),
    );
  };

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-all disabled:opacity-50"
      >
        <ChevronLeft className="h-3 w-3" /> Anterior
      </button>

      <div className="flex items-center gap-2 mx-4">
        {renderPaginationButtons()}
      </div>

      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagination.totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-all disabled:opacity-50"
      >
        Próximo <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
