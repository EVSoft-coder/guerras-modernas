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
import { BaseData, ResourceSet, Unit, UnitType } from '@/types/game';

interface DashboardState {
    base?: BaseData;
    resources?: ResourceSet;
    buildings?: any[];
    units?: Unit[];
    movements?: any[];
    unitTypes?: UnitType[];
    gameConfig?: any;
    diplomaties?: any[];
    myAllianceId?: number;
    general?: any;
    population?: any;
    activeEvents?: any[];
    unitQueue?: any[];
    buildingQueue?: any[];
    reinforcements?: any[];
    stationedOutside?: any[];
    nobleInfo?: {
        moedas: number;
        capacidade: number;
        emUso: number;
        disponiveis: number;
        moedasParaProximo: number;
    };
}

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
export default function Dashboard(props: { state?: DashboardState } & any) {
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
    const unitTypes = state.unitTypes || props.unitTypes || [];

    // Default: VILLAGE -> Dashboard UI
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="tactical-crt-overlay" />
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={gameMode}
                    initial={{ opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.01, filter: 'blur(10px)' }}
                    transition={{ 
                        duration: 0.5, 
                        ease: [0.22, 1, 0.36, 1],
                        filter: { duration: 0.8 }
                    }}
                    className="flex-1 flex flex-col relative"
                >
                    {gameMode === "WORLD_MAP" ? (
                        <WorldMapView 
                            playerBase={currentBase} 
                            troops={(currentUnits.length > 0 ? currentUnits : (currentBase?.tropas || [])).map((u: any) => {
                                const unitType = u.type || unitTypes.find((ut: any) => Number(ut.id) === Number(u.unit_type_id));
                                return { 
                                    unit_type_id: u.unit_type_id,
                                    tipo: unitType?.name || u.name || u.unidade || u.tipo || 'unidade', 
                                    quantity: u.quantity || u.quantidade || 0 
                                };
                            })} 
                            gameConfig={state.gameConfig || props.gameConfig} 
                            unitTypes={unitTypes}
                            diplomaties={state.diplomaties || props.diplomaties}
                            myAllianceId={state.myAllianceId || props.myAllianceId}
                            general={state.general || props.general}
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
                            unitTypes={unitTypes}
                            troops={(currentUnits.length > 0 ? currentUnits : (currentBase?.tropas || [])).map((u: any) => {
                                const unitType = u.type || unitTypes.find((ut: any) => Number(ut.id) === Number(u.unit_type_id));
                                return { 
                                    unit_type_id: u.unit_type_id,
                                    tipo: unitType?.name || u.name || u.unidade || u.tipo || 'unidade', 
                                    quantity: u.quantity || u.quantidade || 0 
                                };
                            })}
                            unitQueue={state.unitQueue || props.unitQueue}
                            buildingQueue={state.buildingQueue || props.buildingQueue}
                            diplomaties={state.diplomaties || props.diplomaties}
                            reinforcements={state.reinforcements}
                            stationedOutside={state.stationedOutside}
                            nobleInfo={state.nobleInfo || props.nobleInfo}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </AppLayout>
    );
}
