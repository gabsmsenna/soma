"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const MAX_DAYS = 30;

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") + "T12:00:00")
      : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate")
      ? new Date(searchParams.get("endDate") + "T12:00:00")
      : undefined,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startDate && endDate) {
      const diffMs = endDate.getTime() - startDate.getTime();
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
    if (startDate) params.set("startDate", format(startDate, "yyyy-MM-dd"));
    if (endDate) params.set("endDate", format(endDate, "yyyy-MM-dd"));
    router.push(`/relatorio-lucros?${params.toString()}`);
  }

  function handleClear() {
    setStartDate(undefined);
    setEndDate(undefined);
    setError(null);
    router.push("/relatorio-lucros");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-end gap-4 bg-card backdrop-blur-md border border-border rounded-2xl p-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Data inicial
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-44 justify-start text-left font-normal bg-background border-input text-foreground",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione...</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Data final
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-44 justify-start text-left font-normal bg-background border-input text-foreground",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione...</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!!error}
          size="sm"
          className="bg-[#FFBB00] text-primary-foreground hover:bg-[#FFBB00]/80 font-bold"
        >
          Filtrar
        </Button>
        {(startDate || endDate) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Limpar
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-400 sm:self-end">{error}</p>}
    </form>
  );
}
