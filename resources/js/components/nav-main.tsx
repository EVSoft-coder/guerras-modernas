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
                            className={`h-11 px-4 transition-all duration-300 group/nav relative overflow-hidden rounded-xl border border-transparent ${item.url === page.url ? 'bg-sky-500/10 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' : 'hover:bg-white/5 hover:border-white/10'}`}
                        >
                            <Link href={item.url} prefetch className="flex items-center gap-3">
                                {item.icon && <item.icon className={`size-4 transition-colors ${item.url === page.url ? 'text-sky-400' : 'text-neutral-500 group-hover/nav:text-sky-300'}`} />}
                                <span className={`font-black uppercase tracking-[0.2em] text-[10px] transition-colors ${item.url === page.url ? 'text-white' : 'text-neutral-500 group-hover/nav:text-neutral-100'}`}>
                                    {item.title}
                                </span>
                                {item.url === page.url && (
                                    <div className="absolute left-0 w-1 h-1/2 bg-sky-500 rounded-r-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
