import React from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

/**
 * VisualVillageView V97 — ESTADO FINAL DE PRODUÇÃO
 * Renderização pura e performática da base militar V22.
 */
export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    
    const getBuildingLevel = (type: string) => {
        const b = base.edificios?.find(e => (e.buildingType || e.tipo)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div className="w-full flex flex-col items-center py-12 bg-[#050608]">
            <div 
                id="VillageCanvas"
                className="village-root shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-gray-900/50"
                style={{ 
                    position: 'relative', 
                    width: '800px', 
                    height: '600px', 
                    margin: '0 auto',
                    borderRadius: '12px',
                    backgroundColor: '#0a0c10',
                    overflow: 'hidden'
                }}
            >
                <style>{`
                    .village-root {
                        all: initial;
                        position: relative;
                        display: block;
                        width: 800px;
                        height: 600px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        overflow: hidden;
                    }
                    .village-root * {
                        box-sizing: border-box;
                        background: transparent !important;
                    }
                    .village-root div {
                        position: absolute;
                    }
                    .village-root .building-node {
                        pointer-events: auto;
                    }
                    .building-node:hover {
                        filter: brightness(1.2) drop-shadow(0 0 10px rgba(0, 255, 255, 0.2)) !important;
                    }
                `}</style>

                {/* CAMADA 1: TERRENO MILITAR V22 */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <img 
                        src="/images/village/terrain_v22.png" 
                        style={{ width: '800px', height: '600px', objectFit: 'fill' }}
                        alt="Tactical Terrain V22"
                    />
                </div>

                {/* CAMADA 2: EDIFÍCIOS DE ELITE */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                    {Object.entries(BUILDING_LAYOUT).map(([type, layout]) => {
                        const level = getBuildingLevel(type);
                        const isConstructing = (buildingQueue || []).some(q => q.type === type);
                        const config = gameConfig?.buildings?.[type];
                        
                        if (level === 0 && !isConstructing) return null;

                        return (
                            <BuildingNode
                                key={type}
                                type={type}
                                level={level}
                                layout={layout}
                                isConstructing={isConstructing}
                                onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Rodapé Tático */}
            <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
                    Sincronização Tática V22 - Operacional
                </span>
            </div>
        </div>
    );
};
