import React, { useState, useRef, useEffect } from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT_CONFIG, REFERENCE_WIDTH } from '@/config/buildingLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Radio, Target } from 'lucide-react';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [debug, setDebug] = useState(false); // Alternar para true para ver limites táticos
    
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
        <div 
            ref={containerRef}
            className="relative w-full aspect-video bg-[#010203] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] select-none"
        >
            {/* TERRENO DE FUNDO CINEMÁTICO */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/structures/v2/terrain.png" 
                    className="w-full h-full object-cover brightness-[0.55] contrast-[1.2] saturate-[0.8]" 
                    alt="Tactical Terrain" 
                />
            </div>

            {/* GRID DE COORDENADAS PIXEL PERFECT */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <TooltipProvider>
                    {Object.entries(BUILDING_LAYOUT_CONFIG).map(([type, layout]) => {
                        const level = getBuildingLevel(type);
                        const isConstructing = (buildingQueue || []).some(q => q.type === type);
                        const config = gameConfig?.buildings?.[type];
                        
                        if (level === 0 && !isConstructing) return null;

                        // CÁLCULO DE POSIÇÃO COM OFFSET E SCALE
                        const finalX = (layout.x + (layout.offsetX || 0)) * scale;
                        const finalY = (layout.y + (layout.offsetY || 0)) * scale;
                        const finalW = layout.w * scale;
                        const finalH = layout.h * scale;

                        // PASSO 5 — Z-INDEX DINÂMICO BASEADO EM Y
                        const dynamicZIndex = layout.zIndex || Math.floor(layout.y);

                        return (
                            <div 
                                key={type}
                                className="absolute pointer-events-auto"
                                style={{ 
                                    top: finalY, 
                                    left: finalX, 
                                    zIndex: dynamicZIndex,
                                    width: finalW,
                                    height: finalH,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                            className={`relative w-full h-full cursor-pointer group/building outline-none transition-all
                                                ${debug ? 'border border-sky-400/30' : ''}
                                            `}
                                        >
                                            {/* CENTRO VISUAL (DEBUG) */}
                                            {debug && <div className="absolute inset-0 flex items-center justify-center"><div className="w-1 h-1 bg-red-500 rounded-full" /></div>}

                                            {/* ASSET DO EDIFÍCIO */}
                                            {layout.assetPath ? (
                                                <img 
                                                    src={layout.assetPath} 
                                                    className={`w-full h-full object-contain mix-blend-screen transition-all duration-700
                                                        ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.25] group-hover/building:brightness-[1.45]'}
                                                    `}
                                                    style={{ transform: `scale(${layout.scale || 1.2})` }}
                                                    alt={type}
                                                />
                                            ) : (
                                                <div className="w-2/3 h-2/3 mx-auto mt-[15%] bg-black/80 rounded-[2rem] border-2 border-white/20 flex flex-col items-center justify-center backdrop-blur-3xl shadow-2xl">
                                                    <Target size={24} className="text-white/20 mb-1" />
                                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{type}</span>
                                                </div>
                                            )}

                                            {/* STATUS TAG INTEGRADA */}
                                            <div 
                                                className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 px-3 py-1 rounded-full shadow-3xl backdrop-blur-2xl transition-all"
                                                style={{ fontSize: Math.max(9, 13 * scale) }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_currentColor]'}`} />
                                                    <span className="font-black font-mono text-white tracking-tighter">L.{level}</span>
                                                </div>
                                            </div>

                                            {/* ENGINEERING VORTEX */}
                                            {isConstructing && (
                                                <div className="absolute inset-0 bg-orange-500/5 animate-pulse rounded-full blur-[40px] z-[-1]" />
                                            )}
                                        </motion.button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-black/98 border-white/20 text-white p-6 rounded-[2.5rem] shadow-3xl backdrop-blur-[50px] z-[2000] border-t-white/40 min-w-[240px]">
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em]">Sector_Authorization</span>
                                                <h3 className="font-black uppercase text-2xl tracking-tighter">{config?.name || type}</h3>
                                            </div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
                                                <span className={isConstructing ? 'text-orange-400' : 'text-emerald-500'}>
                                                    {isConstructing ? 'Construction_Active' : 'Fully_Operational'}
                                                </span>
                                                <span className="text-white/40">v.{(base.id + level + 90).toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        );
                    })}
                </TooltipProvider>
            </div>

            {/* HUD DE COMANDO INTEGRADO */}
            <div className="absolute top-8 left-8 z-[200] pointer-events-none" style={{ transform: `scale(${Math.max(0.7, scale)})`, transformOrigin: 'top left' }}>
                <div className="flex items-center gap-5 bg-black/60 px-8 py-4 rounded-full border border-white/10 backdrop-blur-3xl shadow-2xl">
                    <Radio size={20} className="text-sky-400 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-white uppercase tracking-[0.3em] leading-none mb-1.5">{base.nome}</span>
                        <span className="text-[9px] font-mono text-sky-400 uppercase tracking-widest opacity-70 italic">UPLINK_STABLE // SECURE_GRID_ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-8 right-8 z-[200] pointer-events-none" style={{ transform: `scale(${Math.max(0.7, scale)})`, transformOrigin: 'top right' }}>
                 <div className="flex items-center gap-5 bg-black/60 px-8 py-4 rounded-full border border-white/10 backdrop-blur-3xl shadow-2xl">
                    <Activity size={20} className="text-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Grid_Integrity: <span className="text-emerald-500">OPTIMAL</span></span>
                 </div>
            </div>

            {/* SCANLINE CINEMÁTICO */}
            <div className="absolute inset-0 z-[300] pointer-events-none opacity-[0.02]" 
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)', backgroundSize: '100% 4px' }} />
        </div>
    );
};
