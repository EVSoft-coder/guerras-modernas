import React, { useState, useRef, useEffect } from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT_CONFIG, REFERENCE_WIDTH } from '@/config/buildingLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Radio } from 'lucide-react';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    
    // PASSO 3 — IMPLEMENTAR SCALE DINÂMICO
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                setScale(width / REFERENCE_WIDTH);
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
        const b = base.edificios?.find(e => {
            const bt = e.buildingType || e.type || e.slug;
            return bt?.toLowerCase() === type.toLowerCase();
        });
        return b?.nivel || 0;
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-video bg-[#010203] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl select-none"
        >
            {/* PASSO 2 — IMAGEM BASE */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/structures/v2/terrain.png" 
                    className="w-full h-full object-cover brightness-[0.5] contrast-[1.2]" 
                    alt="Terrain" 
                />
            </div>

            {/* LAYER DE EDIFÍCIOS PIXEL PERFECT */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <TooltipProvider>
                    {Object.entries(BUILDING_LAYOUT_CONFIG).map(([type, layout]) => {
                        const level = getBuildingLevel(type);
                        const isConstructing = (buildingQueue || []).some(q => q.type === type);
                        const config = gameConfig?.buildings?.[type];
                        
                        if (level === 0 && !isConstructing) return null;

                        // PASSO 4 — POSICIONAMENTO CALCULADO COM SCALE
                        const scaledX = layout.x * scale;
                        const scaledY = layout.y * scale;
                        const scaledW = layout.w * scale;
                        const scaledH = layout.h * scale;

                        return (
                            <div 
                                key={type}
                                className="absolute pointer-events-auto"
                                style={{ 
                                    top: scaledY, 
                                    left: scaledX, 
                                    zIndex: layout.zIndex,
                                    width: scaledW,
                                    height: scaledH,
                                    transform: 'translate(-50%, -50%)', // PASSO 4 — CENTER ANCHOR
                                }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                            className={`relative w-full h-full cursor-pointer group/building outline-none
                                                ${process.env.NODE_ENV === 'development' ? 'border border-blue-500/20' : ''} 
                                            `} // PASSO 6 — DEBUG OUTLINE TEMPORÁRIO
                                        >
                                            {/* PASSO 5 — CSS OPTIMIZED */}
                                            {layout.assetPath ? (
                                                <img 
                                                    src={layout.assetPath} 
                                                    className={`w-full h-full object-contain mix-blend-screen transition-all
                                                        ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.2] group-hover/building:brightness-[1.4]'}
                                                    `}
                                                    style={{ transform: 'scale(1.2)' }}
                                                    alt={type}
                                                />
                                            ) : (
                                                <div className="w-1/2 h-1/2 mx-auto mt-[25%] bg-black/60 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                                                    <span className="text-[10px] font-black text-white/40">{type.slice(0,3)}</span>
                                                </div>
                                            )}

                                            {/* HUD TAG */}
                                            <div 
                                                className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/90 border border-white/20 px-2 py-0.5 rounded-full shadow-2xl backdrop-blur-xl transition-all"
                                                style={{ fontSize: Math.max(8, 12 * scale) }}
                                            >
                                                <div className="flex items-center gap-1.5 px-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_currentColor]'}`} />
                                                    <span className="font-black font-mono text-white">L.{level}</span>
                                                </div>
                                            </div>
                                        </motion.button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-black/95 border-white/10 text-white p-4 rounded-3xl shadow-3xl backdrop-blur-3xl z-[1000]">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{type}</span>
                                            <h3 className="font-black uppercase text-sm tracking-tighter">{config?.name || type}</h3>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        );
                    })}
                </TooltipProvider>
            </div>

            {/* MOLDURA HUD */}
            <div className="absolute top-6 left-6 z-[100] pointer-events-none" style={{ transform: `scale(${Math.max(0.7, scale)})`, transformOrigin: 'top left' }}>
                <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-2xl">
                    <Radio size={16} className="text-sky-400 animate-pulse" />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{base.nome} // COMMAND_PIXEL_PERFECT</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-[100] pointer-events-none" style={{ transform: `scale(${Math.max(0.7, scale)})`, transformOrigin: 'top right' }}>
                 <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-2xl">
                    <Activity size={16} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Base_Integrity: 100%</span>
                 </div>
            </div>
        </div>
    );
};
