"use client";

import { ListFilter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreativeFilterDialog } from "./creative-filter-dialog";

interface CreativeFilterButtonProps {
  operations: { id: string; name: string }[];
}

export function CreativeFilterButton({
  operations,
}: CreativeFilterButtonProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 border-zinc-200 dark:border-zinc-800"
        onClick={() => setIsFilterOpen(true)}
      >
        <ListFilter className="h-4 w-4" />
        Filtrar
      </Button>

      <CreativeFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        operations={operations}
      />
    </>
  );
}
