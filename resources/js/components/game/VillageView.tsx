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
        <div className="relative w-full aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 group">
            {/* Background Map com Grid Tática */}
            <div className="absolute inset-0 bg-[url('/images/maps/village_base_v2.png')] bg-cover bg-center brightness-50 contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"></div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:5%_8.33%] pointer-events-none opacity-40"></div>
            
            {/* Overlay de Scanline e Sombra tática */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none z-10"></div>
            
            {/* Edifícios Interativos */}
            <div className="absolute inset-0 z-20">
                {/* Renderizar QG (que é uma coluna da base, não um Edificio na tabela por enquanto) */}
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
            <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-1 pointer-events-none opacity-60">
                <div className="text-[10px] font-black uppercase text-sky-500 tracking-[0.3em]">Sector_Map_Active</div>
                <div className="text-[8px] font-mono text-neutral-500">LAT: {base.coordenada_x} | LON: {base.coordenada_y}</div>
            </div>
        </div>
    );
};
