import React, { useState, useRef, useEffect } from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { BUILDING_LAYOUT, REFERENCE_WIDTH } from '@/config/buildingLayout';
import { TooltipProvider } from "@/components/ui/tooltip";

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

/**
 * VillageCanvas — FASE UI PROFISSIONAL (Passo 1)
 * Sistema de renderização absoluta independente (Passo 9)
 */
/**
 * VillageCanvas — FASE CORE DETERMINÍSTICO
 * Proibido: % , flex, grid, margin-auto para posicionamento interno.
 */
export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        const b = base.edificios?.find(e => (e.buildingType || e.tipo)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div className="w-full flex justify-center py-8 bg-[#050608]">
            {/* 
               PASSO 1: CONTAINER FIXO 800x600 
               Este é o 'Canvas' que não muda de layout no resize.
            */}
            <div 
                id="VillageCanvas"
                style={{ 
                    width: '800px', 
                    height: '600px', 
                    position: 'relative', 
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    boxShadow: '0 0 50px rgba(0,0,0,0.8)'
                }}
            >
                {/* CAMADA 1: background-layer */}
                <div 
                    id="background-layer" 
                    style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                >
                    <img 
                        src="/assets/structures/v2/terrain.png" 
                        style={{ width: '800px', height: '600px', objectFit: 'cover' }}
                        alt="Terreno" 
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent, rgba(0,0,0,0.4))' }} />
                </div>

                {/* CAMADA 2: buildings-layer */}
                <div 
                    id="buildings-layer" 
                    style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                >
                    <TooltipProvider>
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
                                    scale={1} // LOCK SCALE AT 1 FOR DETERMINISTIC
                                    isConstructing={isConstructing}
                                    name={config?.name || type}
                                    onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                />
                            );
                        })}
                    </TooltipProvider>
                </div>

                {/* CAMADA 3: ui-layer */}
                <div 
                    id="ui-layer" 
                    style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
                >
                    {/* Overlay de HUD Tático */}
                    <div style={{ position: 'absolute', left: '20px', top: '20px', pointerEvents: 'none' }}>
                         <div style={{ 
                             backgroundColor: 'rgba(0,0,0,0.7)', 
                             padding: '8px 16px', 
                             borderLeft: '3px solid #0f0',
                             color: '#fff',
                             fontSize: '12px',
                             fontFamily: 'monospace',
                             textTransform: 'uppercase'
                         }}>
                            Sinal: {base.nome} | Setor: Alpha-1
                         </div>
                    </div>
                    
                    {/* Linhas de scanline fixas */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)', 
                        backgroundSize: '100% 4px' 
                    }} />
                </div>
            </div>
        </div>
    );
};
