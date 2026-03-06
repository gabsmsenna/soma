import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CreativesHeader() {
  return (
    <header className="h-20 shrink-0 flex items-center px-6 border-b sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
      </div>
    </header>
  );
}
