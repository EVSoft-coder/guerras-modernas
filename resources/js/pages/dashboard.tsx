import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head } from '@inertiajs/react';
import { VillageDashboard } from '@/components/game/VillageDashboard';
import { WorldMapView } from '@/components/game/WorldMapView';
import { useGameMode } from '@/hooks/use-game-mode';
import { gameStateService } from '@src/services/GameStateService';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Comando',
        href: '/dashboard',
    },
];

/**
 * ROOT UI: Orquestrador de Vistas Tácticas.
 * Gere a transição entre Dashboard (Vila) e WorldMapView baseado no estado ECS.
 */
export default function Dashboard(props: DashboardProps) {
    const gameMode = useGameMode();
    console.log("RENDER MODE:", gameMode);

    if (gameMode === "WORLD_MAP") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="SITREP: Mapa Mundial" />
                <WorldMapView 
                    playerBase={props.base} 
                    troops={props.base?.tropas} 
                    gameConfig={props.gameConfig} 
                />
            </AppLayout>
        );
    }

    // Default: VILLAGE -> Dashboard UI
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <VillageDashboard {...props} />
        </AppLayout>
    );
}
