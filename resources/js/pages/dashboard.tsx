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
export default function Dashboard(props: DashboardProps) {
    const gameMode = useGameMode();
    const { entities } = useGameEntities() || { entities: [] };
    const hasActiveArmy = entities?.some(e => e.march) ?? false;
    
    // === RECURSOS: Usar props.resources como fonte da verdade (persistidos no backend) ===
    const [resources, setResources] = useState(props.resources ?? props.base?.recursos ?? {});

    useEffect(() => {
        // Quando props.resources muda (refresh), atualizar estado local
        const incoming = props.resources ?? props.gameData?.resources;
        if (incoming && typeof incoming === 'object') {
            setResources(incoming);
            resourceSystem.sync(incoming);
        }
    }, [props.resources, props.gameData?.resources]);



    // Montar base com recursos corretos
    const currentBase = props.base ? { ...props.base, recursos: resources } : props.base;
    const currentBuildings = props.gameData?.buildings ?? props.buildings ?? [];
    const currentPopulation = props.gameData?.population ?? props.population ?? null;

    if (gameMode === "WORLD_MAP") {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="SITREP: Mapa Mundial" />
                {props.base && (
                    <WorldMapView 
                        playerBase={currentBase} 
                        troops={props.gameData?.units ? props.gameData.units.map((u: any) => ({ unidade: u.type?.name, quantidade: u.quantity })) : props.base?.tropas} 
                        gameConfig={props.gameConfig} 
                    />
                )}
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
                 resources={resources}
            />
        </AppLayout>
    );
}
