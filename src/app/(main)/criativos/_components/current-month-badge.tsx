"use client";

import { useEffect, useState } from "react";

export function CurrentMonthBadge() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(now);
    setLabel(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  if (!label) return null;

  return (
    <span className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
      {label}
    </span>
  );
}
