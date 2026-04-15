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
    console.log('INITIAL RESOURCES FROM BACKEND', props.resources);
    const gameMode = useGameMode();
    const { entities } = useGameEntities() || { entities: [] };
    const hasActiveArmy = entities?.some(e => e.march) ?? false;
    
    // Semáforo de Recarga via Ref (Garante valor atualizado sem disparar re-renders)
    const reloadingRef = useRef(false);
    const [lastSync, setLastSync] = useState<Date>(new Date());
    const [secondsSinceSync, setSecondsSinceSync] = useState(0);

    // Gestão de Polling Estável (Instância Única)
    useEffect(() => {
        // Intervalo Táctico: 15 segundos (Reduz carga no servidor e colisões)
        const POLL_INTERVAL = 15000;

        PollingService.start(() => {
            if (document.hidden || reloadingRef.current) return;

            // Bloqueio de Segurança Instantâneo
            reloadingRef.current = true;
            
            router.reload({
                only: ["gameData", "base"],
                onSuccess: () => {
                    setLastSync(new Date());
                },
                onError: (err) => {
                    // Ignorar erros de concorrência silenciosamente para não poluir logs
                    if (err?.message?.includes('409')) return;
                    console.warn("[SYNC] Sincronização parcial falhou:", err);
                },
                onFinish: () => {
                    // Liberação segura após estabilização de rede
                    setTimeout(() => {
                        reloadingRef.current = false;
                    }, 3000);
                }
            });
        }, POLL_INTERVAL);

        return () => PollingService.stop();
    }, []); // Executa apenas no mount inicial

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
    const currentBuildings = props.gameData?.buildings ?? props.buildings ?? [];
    const currentPopulation = props.gameData?.population ?? props.population ?? null;
    const currentResources = props.gameData?.resources ?? props.resources ?? {};

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
            <VillageDashboard 
                 {...props} 
                 base={currentBase} 
                 buildings={currentBuildings}
                 population={currentPopulation}
                 resources={currentResources}
            />
            {SyncIndicator}
        </AppLayout>
    );
}
