import type { Creative } from "../_types/types";

const ICON_COLORS = [
  "text-indigo-600",
  "text-amber-500",
  "text-emerald-600",
  "text-purple-600",
  "text-cyan-600",
  "text-orange-500",
  "text-rose-500",
  "text-teal-500",
];

export function getIconColor(index: number) {
  return ICON_COLORS[index % ICON_COLORS.length];
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function calcTotalProfit(creatives: Creative[]): number {
  return creatives.reduce((sum, c) => sum + Number(c.totalProfit), 0);
}
