import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { VillageDashboard } from '@/components/game/VillageDashboard';
import { WorldMapView } from '@/components/game/WorldMapView';
import { useGameMode } from '@/hooks/use-game-mode';
import PollingService from '@src/services/PollingService';

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

    useEffect(() => {
        const handlePolling = () => {
            if (document.hidden) {
                PollingService.stop();
                return;
            }

            const delay = gameMode === "WORLD_MAP" ? 5000 : 10000;

            PollingService.start(() => {
                router.reload({
                    only: ["base", "bases", "relatorios", "ataquesEnviados", "ataquesRecebidos"]
                });
            }, delay);
        };

        handlePolling();

        document.addEventListener("visibilitychange", handlePolling);
        
        return () => {
            PollingService.stop();
            document.removeEventListener("visibilitychange", handlePolling);
        };
    }, [gameMode]);


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
