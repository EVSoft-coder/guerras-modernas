import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-4">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 px-3">Comando Central</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            asChild 
                            isActive={item.url === page.url}
                            className="sidebar-tactical-item h-11 px-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] group/nav"
                        >
                            <Link href={item.url} prefetch>
                                {item.icon && <item.icon className={item.url === page.url ? 'text-sky-400' : 'text-neutral-300 group-hover/nav:text-sky-300 transition-colors'} />}
                                <span className={`font-black uppercase tracking-wider text-[11px] transition-colors ${item.url === page.url ? 'text-white' : 'text-neutral-100 group-hover/nav:text-white'}`}>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
