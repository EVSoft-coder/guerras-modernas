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
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
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
        console.log("CLICK MUDANÇA DE MODO:", mode);
        eventBus.emit({
            type: Events.GAME_CHANGE_MODE,
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
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Operações</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => changeMode('VILLAGE')} className="group">
                                <Home className="text-neutral-500 group-hover:text-sky-500" />
                                <span className="font-bold uppercase tracking-tighter">Minha Base</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => changeMode('WORLD_MAP')} className="group">
                                <MapIcon className="text-neutral-500 group-hover:text-red-500" />
                                <span className="font-bold uppercase tracking-tighter">Mapa Mundial</span>
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
鼓鼓 [failed_replace_file_content_reminder]
