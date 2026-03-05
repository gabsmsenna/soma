"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { CreativeFilterDialog } from "./creative-filter-dialog";

export function CreativeFilterButton() {
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
            />
        </>
    );
}
