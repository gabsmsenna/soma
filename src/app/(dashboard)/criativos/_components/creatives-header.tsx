"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CreativesHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.replace(`/criativos?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="w-full pl-10 rounded-xl"
            placeholder="Buscar criativos, campanhas ou lucros..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
