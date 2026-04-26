import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset className="bg-[#020408] relative overflow-hidden flex flex-col" {...props}>
                {/* Global Tactical Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.08)_0%,transparent_50%)] pointer-events-none z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none mix-blend-overlay z-0" />
                
                <div className="relative z-10 flex flex-col flex-1">
                    {children}
                </div>
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            {children}
        </main>
    );
}
