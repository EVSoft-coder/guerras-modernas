import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT_CONFIG } from '@/config/buildingLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Radio } from 'lucide-react';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

/**
 * VillageView Component (Tribalwars Style)
 * Professional Absolute Positioning System
 */
export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    
    React.useEffect(() => {
        console.log(">>> VILLAGE_VIEW_PREMIUM_INITIALIZED <<<");
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
        <div className="relative w-full aspect-video bg-[#010203] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,1)] select-none">
            
            {/* PASSO 2 — CONTAINER BASE COM IMAGEM */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/structures/v2/terrain.png" 
                    className="w-full h-full object-cover brightness-[0.5] contrast-[1.2]" 
                    alt="Base Terrain" 
                />
            </div>

            {/* PASSO 3 — LAYER DE EDIFÍCIOS (ABSOLUTA) */}
            <div className="absolute inset-0 z-20">
                <TooltipProvider>
                    {Object.entries(BUILDING_LAYOUT_CONFIG).map(([type, layout]) => {
                        const level = getBuildingLevel(type);
                        const isConstructing = (buildingQueue || []).some(q => q.type === type);
                        const config = gameConfig?.buildings?.[type];
                        
                        // Não renderiza se o edifício não existe e não está em construção
                        if (level === 0 && !isConstructing) return null;

                        return (
                            <div 
                                key={type}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ 
                                    top: layout.top, 
                                    left: layout.left, 
                                    zIndex: layout.zIndex,
                                    width: layout.width,
                                    height: layout.height 
                                }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                            className="relative w-full h-full cursor-pointer group/building outline-none"
                                        >
                                            {/* PASSO 6 — CSS (OBJECT-FIT: CONTAIN) */}
                                            {layout.assetPath ? (
                                                <img 
                                                    src={layout.assetPath} 
                                                    className={`w-full h-full object-contain transition-all duration-500 mix-blend-screen
                                                        ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.2] group-hover/building:brightness-[1.4]'}
                                                    `}
                                                    alt={type}
                                                />
                                            ) : (
                                                <div className="w-1/2 h-1/2 bg-black/60 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                                                    <span className="text-[10px] font-black text-white opacity-40">{type.slice(0,3)}</span>
                                                </div>
                                            )}

                                            {/* HUD TAG — NIVEL */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-3 py-1 bg-black/90 border border-white/20 rounded-full shadow-2xl backdrop-blur-xl group-hover/building:border-white/40 transition-all opacity-80 group-hover:opacity-100">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_currentColor]'}`} />
                                                    <span className="text-[10px] font-black font-mono text-white tracking-widest">{level}</span>
                                                </div>
                                            </div>

                                            {/* EFEITO DE CONSTRUÇÃO */}
                                            {isConstructing && (
                                                <div className="absolute inset-0 bg-orange-500/5 animate-pulse rounded-full blur-2xl" />
                                            )}
                                        </motion.button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-black/95 border-white/10 text-white p-6 rounded-[2.5rem] shadow-3xl min-w-[200px] backdrop-blur-3xl z-[1000]">
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest leading-none">Authorization_Ref_{type}</span>
                                            <h3 className="font-black uppercase text-xl tracking-tighter leading-none">{config?.name || type}</h3>
                                            <div className="h-px bg-white/5" />
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                                <span className="text-neutral-500">Status</span>
                                                <span className={isConstructing ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>
                                                    {isConstructing ? 'Em Expansão' : 'Operacional'}
                                                </span>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        );
                    })}
                </TooltipProvider>
            </div>

            {/* MOLDURA TÁTICA (HUD) — PASSO EXTRA ULTRA PREMIUM */}
            <div className="absolute top-10 left-10 z-[100] pointer-events-none">
                <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-2xl">
                    <Radio size={16} className="text-sky-400 animate-pulse" />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{base.nome} // SECTOR_ACTIVE</span>
                </div>
            </div>

            <div className="absolute top-10 right-10 z-[100] pointer-events-none">
                 <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-2xl">
                    <Activity size={16} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Base_Integrity: <span className="text-emerald-500">OPTIMAL</span></span>
                 </div>
            </div>

            {/* SCANLINE */}
            <div className="absolute inset-0 z-[110] pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 4px' }} />
            
            {/* SVG CHROMA FILTER (Mantido para limpeza de ativos) */}
            <svg style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>
                <filter id="chroma-key-black">
                    <feColorMatrix type="matrix" values="1 0 0 0 0
                                                        0 1 0 0 0
                                                        0 0 1 0 0
                                                        1.8 1.8 1.8 0 -0.8" />
                </filter>
            </svg>
        </div>
    );
};
