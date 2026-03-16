import { cn } from "@/lib/utils";

export function AppFooter({ className }: { className?: string }) {
  const version = process.env.npm_package_version ?? "0.0.0";

  return (
    <div
      className={cn(
        "mt-auto p-6 bg-white dark:bg-muted/50 border-t border-slate-200 dark:border-border",
        className,
      )}
    >
      <div className="text-xs text-slate-500 dark:text-muted-foreground text-right">
        Soma v{version} © 2026 Grid Management System
      </div>
    </div>
  );
}
