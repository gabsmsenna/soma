"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_DAYS = 30;

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") ?? "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startDate && endDate) {
      const diffMs =
        new Date(endDate).getTime() - new Date(startDate).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > MAX_DAYS) {
        setError(`O intervalo máximo de busca é de ${MAX_DAYS} dias.`);
      } else if (diffDays < 0) {
        setError("A data final deve ser posterior à data inicial.");
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  }, [startDate, endDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (error) return;

    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    router.push(`/relatorio-lucros?${params.toString()}`);
  }

  function handleClear() {
    setStartDate("");
    setEndDate("");
    setError(null);
    router.push("/relatorio-lucros");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-end gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="startDate" className="text-xs font-medium">
          Data inicial
        </Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-44"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="endDate" className="text-xs font-medium">
          Data final
        </Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-44"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!!error} size="sm">
          Filtrar
        </Button>
        {(startDate || endDate) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            Limpar
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive sm:self-end">{error}</p>}
    </form>
  );
}
