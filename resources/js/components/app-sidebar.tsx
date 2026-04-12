import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Map as MapIcon, Home, Target } from 'lucide-react';
import AppLogo from './app-logo';
import { eventBus, Events } from '@src/core/EventBus';

const mainNavItems: NavItem[] = [
    {
        title: 'TERMINAL',
        url: '/dashboard',
        icon: Target,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Manifesto de Guerra',
        url: 'https://github.com/EVSoft-coder/guerras-modernas',
        icon: Folder,
    },
    {
        title: 'Infopédia Militar',
        url: '/manual',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const changeMode = (mode: 'VILLAGE' | 'WORLD_MAP') => {
        if (mode === 'WORLD_MAP') console.log("CLICK MAPA");
        console.log("CLICK MUDANÇA DE MODO:", mode);
        (window as any).eventBus.emit("GAME:CHANGE_MODE", {
            timestamp: Date.now(),
            data: { mode }
        });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {/* GAME CONTROLS */}
                <SidebarGroup className="px-2 py-4">
                    <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2 px-3">Protocolos de Operação</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={() => changeMode('VILLAGE')} 
                                className="sidebar-tactical-item h-11 px-3 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Home className="text-neutral-300 group-hover:text-sky-400 transition-colors" />
                                <span className="font-black uppercase tracking-widest text-[11px] text-white group-hover:text-white transition-colors">Zona de Base</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={() => {
                                    (window as any).eventBus.emit("GAME:CHANGE_MODE", {
                                        timestamp: Date.now(),
                                        data: { mode: "WORLD_MAP" }
                                    });
                                }}
                                className="sidebar-tactical-item h-11 px-3 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <MapIcon className="text-neutral-300 group-hover:text-red-400 transition-colors" />
                                <span className="font-black uppercase tracking-widest text-[11px] text-white group-hover:text-white transition-colors">Mapa Mundial</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="sidebar-tactical-item h-11 px-3 group opacity-30 cursor-not-allowed">
                                <Target className="text-neutral-600" />
                                <span className="font-black uppercase tracking-wider text-[11px] text-neutral-500">Objetivos</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

