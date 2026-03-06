"use client";

import {
  BarChart3,
  DollarSign,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Moon,
  Network,
  Palette,
  Settings,
  Sun,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Operações",
    url: "/operacoes",
    icon: Network,
  },
  {
    title: "Criativos",
    url: "/criativos",
    icon: Palette,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Relatório de Lucros",
    url: "/relatorio-lucros",
    icon: DollarSign,
  },
];

const settingsNavItems = [
  {
    title: "Ajustes",
    url: "/ajustes",
    icon: Settings,
  },
  {
    title: "Ajuda",
    url: "/ajuda",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFBB00] text-black font-bold text-xl shadow-lg shadow-[#FFBB00]/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight uppercase">Soma</h1>
            <p className="text-xs text-muted-foreground">
              Gestão de Freelancing
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div
                  role="group"
                  aria-label="Alternar tema"
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-[width,height,padding] h-8 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                >
                  {mounted ? (
                    isDark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>
                    {mounted
                      ? isDark
                        ? "Modo Claro"
                        : "Modo Escuro"
                      : "Modo Claro"}
                  </span>
                  <Switch
                    checked={mounted ? isDark : false}
                    className="ml-auto"
                    aria-label="Alternar tema"
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
          <Avatar className="h-10 w-10 border-2 border-[#FFBB00]">
            <AvatarFallback className="bg-muted text-sm font-semibold">
              AR
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">Alex Rivera</p>
            <p className="text-[10px] text-muted-foreground">Freelancer Pro</p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
