import React from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { buildingConfigs } from '@src/game/config';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
}

export const VillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig }) => {
    const bConfigs = Object.values(buildingConfigs);
    const playerBuildings = React.useMemo(() => {
        const list = [
            { id: 'qg-core', type: 'qg', level: base.qg_nivel ?? 1 },
            { id: 'muralha-core', type: 'muralha', level: base.muralha_nivel ?? 1 },
            ...(base.edificios?.filter(eb => {
                const t = eb.buildingType?.toLowerCase();
                return t !== 'qg' && t !== 'muralha';
            }).map(eb => {
                let type = eb.buildingType?.toLowerCase();
                return { id: eb.id, type, level: eb.nivel };
            }) || [])
        ];
        return list;
    }, [base.qg_nivel, base.muralha_nivel, base.edificios]);

    const buildings = bConfigs.map(b => {
        const existing = playerBuildings?.find(pb => 
            pb.type.toLowerCase() === b.id.toLowerCase()
        );

        return {
            ...b,
            uniqueId: existing ? existing.id : `ghost-${b.id}`,
            level: existing ? existing.level : 0,
            isBuilt: !!existing
        };
    });


    return (
        <div className="relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/5 group">
            {/* Background Map com Grid Tática */}
            <div className="absolute inset-0 bg-[url('/images/maps/village_base_v2.png')] bg-cover bg-center transition-all duration-1000 group-hover:scale-110 opacity-40 contrast-150"></div>
            
            {/* Grid Overlay Subtil */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10%_16.6%] pointer-events-none opacity-50"></div>
            
            {/* Overlay de Scanline e Vinheta */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-10"></div>
            
            {/* Scanline CRT Effect */}
            <div className="absolute inset-0 scanline-overlay opacity-[0.15] z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent h-20 animate-scanline z-10 pointer-events-none"></div>
            
            {/* GRID DE EDIFÍCIOS TÁCTICO - Estilo TribalWars Determinístico */}
            <div className="absolute inset-0 z-20 grid grid-cols-5 auto-rows-max p-8 md:p-12 lg:p-16 gap-4 overflow-y-auto custom-scrollbar">
                {buildings.map(b => {
                    return (
                        <BuildingNode
                            key={b.uniqueId}
                            buildingType={b.id}
                            nome={b.name}
                            nivel={b.level}
                            onClick={() => onBuildingClick({ ...b, buildingType: b.id })}
                            isLocked={!b.isBuilt && b.level === 0 && b.id !== 'qg' && b.id !== 'muralha'} // Exemplo de lock
                        />
                    );
                })}
            </div>

            {/* Bússola Tática / HUD sobreposto ao mapa */}
            <div className="absolute top-8 left-8 z-30 flex items-center gap-4 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
                <div className="p-2 border border-sky-500/30 rounded-full animate-spin-slow">
                     <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                </div>
                <div className="flex flex-col">
                    <div className="text-[10px] font-black uppercase text-sky-500 tracking-[0.4em] leading-none">Sector_Active</div>
                    <div className="text-[8px] font-mono text-neutral-500 mt-1 uppercase">Holographic_Downlink_1.8b</div>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 z-30 text-right pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
                <div className="text-[14px] font-black text-white leading-none">GRID_{base.coordenada_x}:{base.coordenada_y}</div>
                <div className="text-[8px] font-black text-sky-500 uppercase mt-1 tracking-widest">Sinal GPS Estável</div>
            </div>
        </div>
    );
};
