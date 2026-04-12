import React from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
}

export const VillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick }) => {
    // Mapeamento de posições fixas táticas para os tipos de edifícios
    const buildingPositions: Record<string, { x: number, y: number }> = {
        'quartel': { x: 2, y: 1 },
        'mina_suprimentos': { x: 0, y: 2 },
        'refinaria': { x: 4, y: 2 },
        'fabrica_municoes': { x: 1, y: 4 },
        'posto_recrutamento': { x: 3, y: 4 },
        'aerodromo': { x: 4, y: 0 },
        'centro_pesquisa': { x: 0, y: 0 },
        'muralha': { x: 2, y: 4 }
    };

    const buildingDisplayNames: Record<string, string> = {
        'quartel': 'Campo de Treino / Quartel',
        'mina_suprimentos': 'Centro de Logística / Mantimentos',
        'refinaria': 'Refinaria de Combustível',
        'fabrica_municoes': 'Arsenal de Munições',
        'posto_recrutamento': 'Gabinete de Recrutamento',
        'aerodromo': 'Base Aérea / Heliponto',
        'centro_pesquisa': 'Laboratório de I&D',
        'muralha': 'Perímetro Defensivo'
    };

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
            
            {/* Radar Sweep Effect (Discreto) */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-[2.5rem]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-[conic-gradient(from_0deg,transparent_0deg,rgba(14,165,233,0.05)_90deg,transparent_90deg)] animate-spin-slow origin-center opacity-40"></div>
            </div>
            <div className="absolute inset-2 z-20 grid grid-cols-5 grid-rows-5">
                {/* Renderizar QG */}
                <BuildingNode 
                    tipo="qg" 
                    nome="Quartel General" 
                    nivel={base.qg_nivel} 
                    gridPos={{ x: 2, y: 2 }} 
                    onClick={() => onBuildingClick({ tipo: 'qg', nome: 'Quartel General', nivel: base.qg_nivel, base: base })}
                />

                {/* Renderizar Edifícios da tabela edificios */}
                {(base.edificios || []).map(b => (
                    <BuildingNode 
                        key={b.id}
                        tipo={b.tipo}
                        nome={buildingDisplayNames[b.tipo] || b.tipo}
                        nivel={b.nivel}
                        gridPos={buildingPositions[b.tipo] || { x: 0, y: 0 }}
                        onClick={() => onBuildingClick({ ...b, nome: buildingDisplayNames[b.tipo] || b.tipo, base: base })}
                    />
                ))}
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
