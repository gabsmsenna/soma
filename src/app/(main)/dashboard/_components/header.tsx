import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h2 className="text-xl font-bold">Dashboard Financeiro</h2>
          <p className="text-muted-foreground text-sm">
            Visão geral do seu desempenho e comissões.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 w-64 rounded-xl"
            placeholder="Buscar operações..."
            aria-label="Buscar operações (em breve)"
            disabled
          />
        </div>
        <button
          type="button"
          aria-label="Notificações (em breve)"
          disabled
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-orange-500" />
        </button>
      </div>
    </header>
  );
}
