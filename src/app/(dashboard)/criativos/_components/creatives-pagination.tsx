"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PaginationMeta } from "../_types";

interface CreativesPaginationProps {
  pagination: PaginationMeta;
}

export function CreativesPagination({ pagination }: CreativesPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.replace(`/criativos?${params.toString()}`);
  }

  type PageItem =
    | { type: "page"; value: number }
    | { type: "ellipsis"; key: string };

  const items: PageItem[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++)
      items.push({ type: "page", value: i });
  } else {
    items.push({ type: "page", value: 1 });
    if (page > 3) items.push({ type: "ellipsis", key: "ellipsis-start" });
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      items.push({ type: "page", value: i });
    }
    if (page < totalPages - 2)
      items.push({ type: "ellipsis", key: "ellipsis-end" });
    items.push({ type: "page", value: totalPages });
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4 pb-4">
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span key={item.key} className="text-muted-foreground px-2 font-bold">
            ...
          </span>
        ) : (
          <button
            key={item.value}
            type="button"
            onClick={() => goToPage(item.value)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
              item.value === page
                ? "bg-[#FFBB00] text-black shadow-lg shadow-[#FFBB00]/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.value}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
