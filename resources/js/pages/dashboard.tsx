import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head } from '@inertiajs/react';
import { VillageDashboard } from '@/components/game/VillageDashboard';
import { WorldMapView } from '@/components/game/WorldMapView';
import { useGameMode } from '@/hooks/use-game-mode';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Comando',
        href: '/dashboard',
    },
];

/**
 * ROOT UI: Orquestrador de Vistas TÃ¡cticas.
 * Gere a transiÃ§Ã£o entre Dashboard (Vila) e WorldMapView baseado no estado ECS.
 */
export default function Dashboard(props: DashboardProps) {
    const mode = useGameMode();

    // RenderizaÃ§Ã£o Condicional baseada no Modo de Jogo
    if (mode === "WORLD_MAP") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Mapa Mundial TÃ¡ctico" />
                <WorldMapView />
            </AppLayout>
        );
    }

    // Default: VILLAGE
    if (mode === "VILLAGE") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <VillageDashboard {...props} />
            </AppLayout>
        );
    }

    // Fallback de SeguranÃ§a
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex items-center justify-center min-h-screen bg-black text-green-500 font-mono">
                SINAL_INTERROMPIDO: RECONECTANDO_AO_MOTOR_NUCLEAR...
            </div>
        </AppLayout>
    );
}
