import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CurrentMonthBadge } from "./current-month-badge";

export function CreativesHeader() {
  return (
    <header className="h-20 shrink-0 flex items-center px-6 border-b border-slate-200 dark:border-border sticky top-0 bg-[#F8F9FB]/80 dark:bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6 bg-slate-200 dark:bg-border" />
        <CurrentMonthBadge />
      </div>
    </header>
  );
}
