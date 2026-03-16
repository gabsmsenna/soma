import { Plus } from "lucide-react";
import type { CreativeViewModel } from "../_types";
import { CreativeCard } from "./creative-card";
import { CreativeFilterButton } from "./creative-filter-button";
import { CreativeFormDialog } from "./creative-form-dialog";

interface CreativesGridProps {
  creatives: CreativeViewModel[];
  total: number;
  operations: { id: string; name: string }[];
}

export function CreativesGrid({
  creatives,
  total,
  operations,
}: CreativesGridProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Todos os Criativos{" "}
          <span className="text-slate-500 dark:text-muted-foreground font-normal ml-2 text-sm">
            ({total} totais)
          </span>
        </h3>

        <div className="flex items-center gap-3">
          <CreativeFilterButton operations={operations} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creatives.map((c) => (
          <CreativeCard key={c.id} creative={c} />
        ))}

        <CreativeFormDialog operations={operations}>
          <div className="border-2 border-dashed border-slate-300 dark:border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center group hover:border-brand/50 dark:hover:border-brand/50 hover:bg-brand/5 dark:hover:bg-brand/5 transition-all cursor-pointer bg-white/50 dark:bg-muted/20 h-full min-h-[200px]">
            <div className="h-16 w-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand/20 dark:group-hover:bg-brand/20 transition-all shadow-sm dark:shadow-none">
              <Plus className="h-8 w-8" />
            </div>
            <p className="font-bold mb-1 text-slate-800 dark:text-foreground">
              Novo Criativo
            </p>
            <p className="text-xs text-slate-500 dark:text-muted-foreground">
              Adicione uma nova arte para começar a monitorar os lucros.
            </p>
          </div>
        </CreativeFormDialog>
      </div>
    </>
  );
}
