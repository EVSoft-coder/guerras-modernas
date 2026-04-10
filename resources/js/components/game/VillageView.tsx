import React from 'react';
import { BuildingNode } from './BuildingNode';
import { Base, Edificio } from '@/types';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
}

export const VillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick }) => {
    // Determinar o Fundo Evolutivo baseado no QG
    const getBaseBackground = (qgLvl: number) => {
        if (qgLvl >= 13) return '/images/base_fase_c.png';
        if (qgLvl >= 6) return '/images/base_fase_b.png';
        return '/images/base_fase_a.png';
    };

    const currentBg = getBaseBackground(base.qg_nivel);

    // Mapeamento de posições fixas táticas para os tipos de edifícios
    // Coordenadas [col, row] em uma grid 12x12
    const buildingPositions: Record<string, [number, number]> = {
        'qg': [5, 4],
        'mina_suprimentos': [2, 3],
        'refinaria': [2, 6],
        'fabrica_municoes': [4, 8],
        'posto_recrutamento': [8, 3],
        'quartel': [8, 5],
        'aerodromo': [9, 8],
        'radar_estrategico': [5, 1],
        'centro_pesquisa': [3, 1],
        'muralha': [1, 1],
    };

    const getBuildingName = (tipo: string) => {
        const names: Record<string, string> = {
            'qg': 'Centro de Comando (QG)',
            'mina_suprimentos': 'Extrator de Suprimentos',
            'refinaria': 'Refinaria de Combustível',
            'fabrica_municoes': 'Arsenal de Munições',
            'posto_recrutamento': 'Centro de Alistamento',
            'quartel': 'Quartel de Infantaria',
            'aerodromo': 'Base Aérea / Heliponto',
            'radar_estrategico': 'Radar de Longo Alcance',
            'centro_pesquisa': 'Laboratório de I&D',
            'muralha': 'Perímetro Defensivo'
        };
        return names[tipo] || tipo;
    };

    return (
        <div 
            className="relative w-full aspect-square md:aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-inner bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${currentBg})` }}
        >
            {/* Overlay de Scanline e Sombra tática */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                    backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                 }}></div>
            
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 p-4">
                {/* Renderizar QG (que é uma coluna da base, não um Edificio na tabela por enquanto) */}
                <div style={{ gridColumn: buildingPositions.qg[0], gridRow: buildingPositions.qg[1] }}>
                    <BuildingNode 
                        tipo="qg"
                        nome={getBuildingName('qg')}
                        nivel={base?.qg_nivel}
                        onClick={() => onBuildingClick({ tipo: 'qg', nivel: base?.qg_nivel, nome: getBuildingName('qg') })}
                        isConstructing={(base?.construcoes ?? []).some(c => c.edificio_tipo === 'qg')}
                    />
                </div>

                {/* Renderizar Edifícios da tabela edificios */}
                {(base?.edificios ?? []).map((ed) => {
                    const pos = buildingPositions[ed.tipo];
                    if (!pos) return null;

                    return (
                        <div key={ed.id} style={{ gridColumn: pos[0], gridRow: pos[1] }}>
                            <BuildingNode 
                                tipo={ed.tipo}
                                nome={getBuildingName(ed.tipo)}
                                nivel={ed.nivel}
                                onClick={() => onBuildingClick({ ...ed, nome: getBuildingName(ed.tipo) })}
                                isConstructing={(base?.construcoes ?? []).some(c => c.edificio_tipo === ed.tipo)}
                            />
                        </div>
                    );
                })}

                {/* Muralha (Coluna da base) */}
                <div style={{ gridColumn: buildingPositions.muralha[0], gridRow: buildingPositions.muralha[1] }}>
                    <BuildingNode 
                        tipo="muralha"
                        nome={getBuildingName('muralha')}
                        nivel={base?.muralha_nivel}
                        onClick={() => onBuildingClick({ tipo: 'muralha', nivel: base?.muralha_nivel, nome: getBuildingName('muralha') })}
                        isConstructing={(base?.construcoes ?? []).some(c => c.edificio_tipo === 'muralha')}
                    />
                </div>
            </div>

            {/* Bússola Tática / HUD sobreposto ao mapa */}
            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-sky-500/50 bg-black/40 px-2 py-1 rounded border border-white/5 pointer-events-none">
                GRID_SECTOR_ALPHA_01 // LAT: {base.coordenada_x} LON: {base.coordenada_y}
            </div>
        </div>
    );
};
