import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { TrendDirection } from "@/dtos/profit-report.dto";

const config: Record<
  TrendDirection,
  { label: string; icon: typeof TrendingUp; className: string }
> = {
  ascensao: {
    label: "Ascensão",
    icon: TrendingUp,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  queda: {
    label: "Queda",
    icon: TrendingDown,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  estavel: {
    label: "Estável",
    icon: Minus,
    className: "bg-muted text-muted-foreground",
  },
};

interface TrendBadgeProps {
  trend: TrendDirection;
}

export function TrendBadge({ trend }: TrendBadgeProps) {
  const { label, icon: Icon, className } = config[trend];
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
