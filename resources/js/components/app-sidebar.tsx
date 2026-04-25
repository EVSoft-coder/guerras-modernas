import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Map as MapIcon, Home, Target, Mail, Shield } from 'lucide-react';
import AppLogo from './app-logo';
import { eventBus, Events } from '@src/core/EventBus';

const mainNavItems: NavItem[] = [
    {
        title: 'TERMINAL',
        url: '/dashboard',
        icon: Target,
    },
    {
        title: 'ALIANÇAS',
        url: '/alianca',
        icon: Shield,
    },
    {
        title: 'MENSAGENS',
        url: '/mensagens',
        icon: Mail,
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
                    <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400 mb-4 px-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                        COMMAND_PROTOCOLS
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={() => changeMode('VILLAGE')} 
                                className="sidebar-tactical-item h-12 px-4 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-r-2 border-transparent hover:border-sky-500"
                            >
                                <Home className="text-neutral-400 group-hover:text-sky-400 transition-colors" />
                                <span className="font-black uppercase tracking-widest text-[11px] text-white/90 group-hover:text-white transition-colors">Sector_Alfa (Base)</span>
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
                                className="sidebar-tactical-item h-12 px-4 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-r-2 border-transparent hover:border-red-500"
                            >
                                <MapIcon className="text-neutral-400 group-hover:text-red-500 transition-colors" />
                                <span className="font-black uppercase tracking-widest text-[11px] text-white/90 group-hover:text-white transition-colors">Globo_Tático (Mapa)</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="sidebar-tactical-item h-12 px-4 group opacity-20 cursor-not-allowed">
                                <Target className="text-neutral-600" />
                                <span className="font-black uppercase tracking-widest text-[11px] text-neutral-500">Obj_Primários</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/5 bg-black/20 pb-4">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <div className="px-4">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

