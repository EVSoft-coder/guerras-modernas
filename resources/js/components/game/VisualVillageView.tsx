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
export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    
    // PASSO 7 — ESCALA RESPONSIVA DINÂMICA
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                setScale(containerRef.current.clientWidth / REFERENCE_WIDTH);
            }
        };
        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);
        updateScale();
        return () => observer.disconnect();
    }, []);

    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        const b = base.edificios?.find(e => (e.buildingType || e.type || e.slug)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div className="w-full flex justify-center py-4"> {/* PASSO 2 — VILLAGE-ROOT */}
            
            <div 
                ref={containerRef}
                className="relative bg-[#010203] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl select-none"
                style={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    aspectRatio: '800/600' 
                }}
            >
                {/* PASSO 1 & 2 — VILLAGE-BG */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/structures/v2/terrain.png" 
                        className="w-full h-full object-cover brightness-[0.55] contrast-[1.1] saturate-[0.9]" 
                        alt="Village Background" 
                    />
                    {/* PASSO 5 — OVERLAY DE FOCO (RADIAL GRADIENT) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                </div>

                {/* PASSO 1 & 6 — VILLAGE-LAYER-BUILDINGS */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <TooltipProvider>
                        {Object.entries(BUILDING_LAYOUT).map(([type, layout]) => {
                            const level = getBuildingLevel(type);
                            const isConstructing = (buildingQueue || []).some(q => q.type === type);
                            const config = gameConfig?.buildings?.[type];
                            
                            // Apenas renderiza se o nível for > 0 ou em construção
                            if (level === 0 && !isConstructing) return null;

                            return (
                                <div key={type} className="pointer-events-auto">
                                    <BuildingNode
                                        type={type}
                                        level={level}
                                        scale={scale}
                                        isConstructing={isConstructing}
                                        name={config?.name || type}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                    />
                                </div>
                            );
                        })}
                    </TooltipProvider>
                </div>

                {/* PASSO 9 — UI SEPARATION (Apenas overlays táticos leves) */}
                <div className="absolute inset-x-8 top-8 flex justify-between items-start z-50 pointer-events-none opacity-50">
                    <div className="bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{base.nome}</span>
                    </div>
                </div>

                {/* SCANLINE EFFECT */}
                <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.03]" 
                     style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 4px' }} />
            </div>
        </div>
    );
};
