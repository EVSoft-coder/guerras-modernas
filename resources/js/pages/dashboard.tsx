import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { VillageDashboard } from '@/components/game/VillageDashboard';
import { WorldMapView } from '@/components/game/WorldMapView';
import { useGameMode } from '@/hooks/use-game-mode';
import { useGameEntities } from '@/hooks/use-game-entities';
import { resourceSystem } from '@src/game/systems/ResourceSystem';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Default: VILLAGE -> Dashboard UI
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={gameMode}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex flex-col"
                >
                    {gameMode === "WORLD_MAP" ? (
                        <WorldMapView 
                            playerBase={currentBase} 
                            troops={state.units ? state.units.map((u: any) => ({ unidade: u.name, quantidade: u.quantity })) : []} 
                            gameConfig={state.gameConfig || props.gameConfig} 
                        />
                    ) : (
                        <VillageDashboard 
                            {...state} 
                            base={currentBase} 
                            buildings={currentBuildings}
                            population={currentPopulation}
                            resources={resources}
                            units={currentUnits}
                            movements={currentMovements}
                            activeEvents={state.activeEvents || props.activeEvents || []}
                            gameConfig={state.gameConfig || props.gameConfig}
                            unitTypes={state.unitTypes || props.unitTypes}
                            unitQueue={state.unitQueue || props.unitQueue}
                            buildingQueue={state.buildingQueue || props.buildingQueue}
                            diplomaties={state.diplomaties || props.diplomaties}
                            reinforcements={state.reinforcements}
                            stationedOutside={state.stationedOutside}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </AppLayout>
    );
}
