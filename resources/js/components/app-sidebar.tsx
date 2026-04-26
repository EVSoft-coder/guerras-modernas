import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Map as MapIcon, Home, Target, Mail, Shield, Award } from 'lucide-react';
import AppLogo from './app-logo';
import { eventBus, Events } from '@src/core/EventBus';

const mainNavItems: NavItem[] = [
    {
        title: 'TERMINAL',
        url: '/dashboard',
        icon: Target,
    },
    {
        title: 'GENERAL',
        url: '/general',
        icon: Award,
    },
    {
        title: 'ALIANÇAS',
        url: '/alianca',
        icon: Shield,
    },
    {
        title: 'ALTO COMANDO',
        url: '/command-center',
        icon: LayoutGrid,
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
            <SidebarHeader className="border-b border-white/5 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                
                {/* SYSTEM STATUS PRE-HEADER */}
                <div className="px-4 mt-4 space-y-3">
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-neutral-600">
                        <span>SYSTEM_STATUS</span>
                        <span className="text-emerald-500">OPERATIONAL</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 1, 1, 1, 0.4].map((op, i) => (
                            <div key={i} className="h-[2px] flex-1 bg-sky-500" style={{ opacity: op }} />
                        ))}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={mainNavItems} />

                {/* GAME CONTROLS */}
                <SidebarGroup className="py-6">
                    <SidebarGroupLabel className="text-[9px] font-black uppercase tracking-[0.5em] text-sky-500/60 mb-4 px-4 flex items-center gap-2">
                        <div className="w-1 h-1 bg-sky-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                        COMMAND_PROTOCOLS
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex gap-1.5 bg-black/40 p-2 rounded-2xl border border-white/5 shadow-inner mx-2">
                                <button 
                                    onClick={() => changeMode('VILLAGE')}
                                    className="flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 group/btn transition-all border border-transparent hover:bg-white/[0.03] hover:border-white/10 active:scale-95"
                                >
                                    <Home size={16} className="text-sky-500/80 group-hover/btn:text-sky-400 transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors">LOCAL_OPS</span>
                                </button>
                                <button 
                                    onClick={() => changeMode('WORLD_MAP')}
                                    className="flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 group/btn transition-all border border-transparent hover:bg-white/[0.03] hover:border-white/10 active:scale-95"
                                >
                                    <MapIcon size={16} className="text-sky-500/80 group-hover/btn:text-sky-400 transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors">WORLD_NET</span>
                                </button>
                            </div>
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
