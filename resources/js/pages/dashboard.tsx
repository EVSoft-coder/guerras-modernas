import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { VillageDashboard } from '@/components/game/VillageDashboard';
import { WorldMapView } from '@/components/game/WorldMapView';
import { useGameMode } from '@/hooks/use-game-mode';
import { useGameEntities } from '@/hooks/use-game-entities';
import { resourceSystem } from '@src/game/systems/ResourceSystem';

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
export default function Dashboard(props: any) {
    console.log("FRONTEND_DEBUG: buildings", props.buildings);
    const gameMode = useGameMode();
    const state = props.state || {}; // FASE LIMPEZA: Prioridade ao estado unificado
    
    const { entities } = useGameEntities() || { entities: [] };
    const hasActiveArmy = entities?.some(e => e.march) ?? false;
    
    // === RECURSOS: Usar state.resources como fonte da verdade (persistidos no backend) ===
    const [resources, setResources] = useState(state.resources ?? props.resources ?? props.base?.recursos ?? {});

    useEffect(() => {
        // Quando props muda (refresh), atualizar estado local
        const incoming = state.resources ?? props.resources ?? props.gameData?.resources;
        if (incoming && typeof incoming === 'object') {
            setResources(incoming);
            resourceSystem.sync(incoming);
        }
    }, [state.resources, props.resources, props.gameData?.resources]);

    // Montar base com recursos corretos
    const currentBase = state.base ?? props.base;
    const currentBuildings = state.buildings ?? props.buildings ?? [];
    const currentPopulation = state.population ?? props.population ?? null;
    const currentUnits = state.units ?? props.units ?? [];
    const currentMovements = state.movements ?? props.movements ?? [];

    if (gameMode === "WORLD_MAP") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="SITREP: Mapa Mundial" />
                {state.base && (
                    <WorldMapView 
                        playerBase={currentBase} 
                        troops={state.units ? state.units.map((u: any) => ({ unidade: u.type?.name, quantidade: u.quantity })) : []} 
                        gameConfig={props.gameConfig} 
                    />
                )}
            </AppLayout>
        );
    }

    // Default: VILLAGE -> Dashboard UI
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="fixed top-20 left-4 z-[9999] bg-black/80 p-4 border border-orange-500 text-[10px] font-mono text-orange-500 rounded-xl pointer-events-none">
                <div className="font-black mb-2 uppercase tracking-widest border-b border-orange-500/20 pb-1">Debug_Infra_Monitor</div>
                {currentBuildings.length === 0 ? (
                    <div className="text-red-500">NO_BUILDINGS_DETECTED</div>
                ) : (
                    currentBuildings.map((b: any) => (
                        <div key={b.id}>
                            > {b.type ?? b.tipo} [LVL_{b.level ?? b.nivel}]
                        </div>
                    ))
                )}
            </div>
            <VillageDashboard 
                 {...state} 
                 base={currentBase} 
                 buildings={currentBuildings}
                 population={currentPopulation}
                 resources={resources}
            />
        </AppLayout>
    );
}
