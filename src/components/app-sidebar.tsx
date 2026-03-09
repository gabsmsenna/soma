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
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

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
              {user?.name
                ? user.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">
              {user?.name ?? "..."}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {user?.email ?? "..."}
            </p>
          </div>
          <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-xs rounded-3xl p-6 text-center shadow-lg border-0 sm:rounded-[32px] overflow-hidden flex flex-col items-center"
              showCloseButton={false}
            >
              <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4 transition-transform hover:scale-105">
                <LogOut
                  className="h-7 w-7 text-red-600 dark:text-red-500"
                  strokeWidth={2.5}
                />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground mb-2">
                Sair do sistema
              </DialogTitle>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Tem certeza que deseja sair da sua conta? Você precisará fazer
                login novamente para acessar.
              </p>
              <div className="flex w-full gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 rounded-2xl h-12 font-bold bg-muted hover:bg-muted/80 text-foreground transition-all"
                  onClick={() => setIsLogoutOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 rounded-2xl h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all border-0 focus-visible:ring-red-500"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
