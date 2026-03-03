"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
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
        url: "/",
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

    const isDark = theme === "dark";

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFBB00] text-black font-bold text-xl shadow-lg shadow-[#FFBB00]/20">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight uppercase">
                            Soma
                        </h1>
                        <p className="text-xs text-muted-foreground">Micro SaaS</p>
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
                                    (item.url !== "/" &&
                                        pathname.startsWith(item.url));
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
                                <SidebarMenuButton
                                    onClick={() => setTheme(isDark ? "light" : "dark")}
                                    tooltip={isDark ? "Modo Claro" : "Modo Escuro"}
                                >
                                    {isDark ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                    <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
                                    <Switch
                                        checked={isDark}
                                        className="ml-auto"
                                        aria-label="Alternar tema"
                                    />
                                </SidebarMenuButton>
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
