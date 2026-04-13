import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { VillageDashboard } from '@/components/game/VillageDashboard';
import { WorldMapView } from '@/components/game/WorldMapView';
import { useGameMode } from '@/hooks/use-game-mode';
import { useGameEntities } from '@/hooks/use-game-entities';
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
    const { entities } = useGameEntities() || { entities: [] };
    const hasActiveArmy = entities?.some(e => e.march) ?? false;
    
    // Semáforo de Recarga via State
    const [isReloading, setIsReloading] = useState(false);
    
    // Controlo de Sincronização
    const [lastSync, setLastSync] = useState<Date>(new Date());
    const [secondsSinceSync, setSecondsSinceSync] = useState(0);

    // Gestão de Polling Estável (Instância Única)
    useEffect(() => {
        // Intervalo Controlado: 12 segundos (Regime 10-15s)
        const POLL_INTERVAL = 12000;

        PollingService.start(() => {
            if (document.hidden || isReloading) return;

            setIsReloading(true);
            router.reload({
                only: ["gameData"],
                onSuccess: () => {
                    setLastSync(new Date());
                },
                onFinish: () => {
                    // Protecção de Concorrência
                    setTimeout(() => setIsReloading(false), 1000);
                }
            });
        }, POLL_INTERVAL);

        return () => PollingService.stop();
    }, [isReloading]); // Apenas re-vincula se o estado de recarga mudar drasticamente

    // Timer visual de sincronização
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsSinceSync(Math.floor((new Date().getTime() - lastSync.getTime()) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [lastSync]);

    const SyncIndicator = (
        <div className="fixed bottom-4 right-4 z-50 rounded-full bg-black/80 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-500 shadow-lg backdrop-blur-sm border border-emerald-500/20 flex flex-col items-end">
            <div className="flex items-center">
                <span className="mr-1 inline-block h-1 w-1 animate-pulse rounded-full bg-emerald-500"></span>
                Sync: {secondsSinceSync}s ago
            </div>
            <div className="text-[6px] text-neutral-600 mt-0.5 tracking-normal">BUILD_VER: 2026.04.12.2101</div>
        </div>
    );

    // Protecção de Props durante carregamento parcial
    const currentBase = props.gameData?.resources ? { ...props.base, recursos: props.gameData.resources } : props.base;

    if (gameMode === "WORLD_MAP") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="SITREP: Mapa Mundial" />
                {props.base && (
                    <WorldMapView 
                        playerBase={currentBase} 
                        troops={props.gameData?.units ?? props.base?.tropas} 
                        gameConfig={props.gameConfig} 
                    />
                )}
                {SyncIndicator}
            </AppLayout>
        );
    }

    // Default: VILLAGE -> Dashboard UI
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <VillageDashboard {...props} base={currentBase} />
            {SyncIndicator}
        </AppLayout>
    );
}
