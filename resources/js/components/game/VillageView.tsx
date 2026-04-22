import React from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { buildingConfigs } from '@src/game/config';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    const bConfigs = Object.values(buildingConfigs);
    const playerBuildings = React.useMemo(() => {
        return (base.edificios?.map(eb => {
            let type = (eb.buildingType || eb.tipo)?.toLowerCase();
            return { id: eb.id, type, level: eb.nivel };
        }) || []);
    }, [base.edificios]);

    const buildings = bConfigs.map(b => {
        const existing = playerBuildings?.find(pb => 
            pb.type.toLowerCase() === b.id.toLowerCase()
        );

        return {
            ...b,
            uniqueId: existing ? existing.id : `ghost-${b.id}`,
            level: existing ? existing.level : 0,
            isBuilt: !!existing,
            isUpgradingNow: (buildingQueue || []).some(q => q.type === b.id)
        };
    });


    return (
        <div className="relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/5 group">
            
            {/* GRID DE EDIFÍCIOS TÁCTICO - Estilo TribalWars Determinístico */}
            <div className="grid grid-cols-4 gap-6 p-8 overflow-y-auto">
                {buildings.map(b => {
                    return (
                        <BuildingNode
                            key={b.uniqueId}
                            buildingType={b.id}
                            nome={b.name}
                            nivel={b.level}
                            isConstructing={b.isUpgradingNow}
                            onClick={() => onBuildingClick({ ...b, buildingType: b.id })}
                            isLocked={!b.isBuilt && b.level === 0 && b.id !== 'hq' && b.id !== 'muralha'} // Exemplo de lock
                        />
                    );
                })}
            </div>

        </div>
    );
};
