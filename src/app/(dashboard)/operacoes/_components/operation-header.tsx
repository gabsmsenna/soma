import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface OperationsHeaderProps {
  statusParam: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleStatus: () => void;
}

export function OperationsHeader({
  statusParam,
  searchValue,
  onSearchChange,
  onToggleStatus,
}: OperationsHeaderProps) {
  return (
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
          onClick={onToggleStatus}
          className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all whitespace-nowrap hidden md:block ${
            statusParam === "inactive"
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
