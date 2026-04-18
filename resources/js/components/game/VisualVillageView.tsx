import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Flag, Shield, TreePine, Flame, Zap, Home, Users, 
    Crosshair, Plane, Radar, Microscope, Landmark, Factory, Pickaxe,
    Activity, Cpu, Radio, Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BuildingPos {
    top: string;
    left: string;
    size: string;
    icon: React.ElementType;
    color: string;
    assetUrl?: string;
}

const POSITION_MAP: Record<string, BuildingPos> = {
    qg: { top: '45%', left: '50%', size: '180px', icon: Flag, color: 'text-orange-500', assetUrl: '/assets/structures/v2/hq.png' },
    quartel: { top: '35%', left: '25%', size: '120px', icon: Crosshair, color: 'text-red-500', assetUrl: '/assets/structures/v2/barracks.png' },
    muralha: { top: '10%', left: '85%', size: '80px', icon: Shield, color: 'text-blue-500' },
    mina_suprimentos: { top: '20%', left: '15%', size: '80px', icon: TreePine, color: 'text-emerald-500' },
    refinaria: { top: '20%', left: '75%', size: '80px', icon: Flame, color: 'text-orange-600' },
    fabrica_municoes: { top: '75%', left: '20%', size: '80px', icon: Factory, color: 'text-neutral-400' },
    mina_metal: { top: '75%', left: '80%', size: '80px', icon: Pickaxe, color: 'text-sky-400' },
    central_energia: { top: '15%', left: '50%', size: '80px', icon: Zap, color: 'text-yellow-400' },
    housing: { top: '60%', left: '30%', size: '80px', icon: Home, color: 'text-indigo-400' },
    posto_recrutamento: { top: '60%', left: '70%', size: '80px', icon: Users, color: 'text-rose-400' },
    aerodromo: { top: '70%', left: '50%', size: '110px', icon: Plane, color: 'text-cyan-400' },
    radar_estrategico: { top: '15%', left: '30%', size: '80px', icon: Radar, color: 'text-blue-400' },
    centro_pesquisa: { top: '15%', left: '70%', size: '80px', icon: Microscope, color: 'text-purple-400' },
    parlamento: { top: '85%', left: '50%', size: '80px', icon: Landmark, color: 'text-amber-500' },
};

interface VisualVillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VisualVillageView: React.FC<VisualVillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    
    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        return base.edificios?.find(e => e.buildingType?.toLowerCase() === type.toLowerCase())?.nivel || 0;
    };

    return (
        <div className="relative w-full aspect-video bg-[#020406] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group font-sans">
            
            {/* BASE TERRAIN BACKGROUND */}
            <div className="absolute inset-0 opacity-40">
                <img 
                    src="/assets/structures/v2/terrain.png" 
                    className="w-full h-full object-cover grayscale-[0.5] contrast-[1.2]" 
                    alt="Base Terrain" 
                />
            </div>

            {/* TACTICAL GRID OVERLAY */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px' 
                 }}>
            </div>

            {/* SCANNING SCANLINE */}
            <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[80px] bg-gradient-to-b from-transparent via-sky-500/10 to-transparent pointer-events-none z-40"
            />

            <TooltipProvider>
                {Object.entries(POSITION_MAP).map(([type, pos]) => {
                    const level = getBuildingLevel(type);
                    const isConstructing = (buildingQueue || []).some(q => q.type === type);
                    const config = gameConfig?.buildings?.[type];
                    
                    if (level === 0 && !isConstructing) {
                        return (
                             <div 
                                key={type}
                                className="absolute -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <div className="w-6 h-6 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={type}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            style={{ top: pos.top, left: pos.left }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                        className="relative group/building"
                                        style={{ width: pos.size, height: pos.size }}
                                    >
                                        <AnimatePresence>
                                            {isConstructing && (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0 z-0"
                                                >
                                                    <div className="absolute inset-0 bg-orange-500/10 blur-xl animate-pulse rounded-full" />
                                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-500 shadow-[0_0_10px_#f97316] animate-pulse" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* INTEGRATED BUILDING IMAGE OR HIGH-TECH CARD */}
                                        {pos.assetUrl ? (
                                            <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                                <img 
                                                    src={pos.assetUrl} 
                                                    className={`w-full h-full object-contain transition-all duration-500 ${isConstructing ? 'brightness-50' : 'brightness-90 group-hover/building:brightness-125'}`} 
                                                    style={{ filter: level === 0 ? 'grayscale(1) opacity(0.5)' : 'none' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-neutral-900/60 backdrop-blur-md rounded-3xl border border-white/10 group-hover/building:border-white/40 transition-all shadow-2xl">
                                                <pos.icon size={24} className={`${pos.color} group-hover/building:scale-110 transition-transform`} />
                                                <span className="text-[8px] font-black uppercase text-neutral-400 mt-2 tracking-widest">{config?.name?.split(' ')[0] || type}</span>
                                            </div>
                                        )}

                                        {/* LEVEL BADGE TACTICAL */}
                                        <div className="absolute -bottom-2 -right-2 bg-[#050709] border border-white/10 px-3 py-1 rounded-full shadow-2xl flex items-center gap-2 z-20">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                                            <span className="text-[9px] font-black font-mono text-white">L.{(level || 0).toString().padStart(2, '0')}</span>
                                        </div>

                                        {/* INTERACTIVE HOVER RING */}
                                        <div className="absolute inset-0 rounded-full border border-white/0 group-hover/building:border-white/20 transition-all scale-110 pointer-events-none" />
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#050709]/95 border-white/10 text-white p-5 rounded-[2rem] backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] min-w-[200px] z-[100]">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                            <div className={`p-2 rounded-xl bg-white/5 ${pos.color}`}><pos.icon size={16} /></div>
                                            <span className="font-black uppercase text-[11px] tracking-[0.2em]">{config?.name || type}</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 text-[9px] uppercase font-bold text-neutral-500">
                                            <div className="flex flex-col">
                                                <span>Status</span>
                                                <span className={isConstructing ? 'text-orange-400' : 'text-emerald-400'}>{isConstructing ? 'Expandindo' : 'Operacional'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>Eficiência</span>
                                                <span className="text-white">{(85 + (level || 0) * 1.5).toFixed(1)}%</span>
                                            </div>
                                        </div>

                                        {isConstructing && (
                                            <div className="bg-orange-500/10 p-2.5 rounded-xl text-[8px] text-orange-400 flex items-center gap-2 border border-orange-500/20 font-black uppercase">
                                                <Activity size={10} className="animate-pulse" /> Operação_Engenharia_Iniciada
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })}
            </TooltipProvider>

            {/* AMBIENT INTELLIGENCE */}
            <div className="absolute top-10 left-10 z-50 pointer-events-none hidden md:block">
                <div className="flex items-center gap-4 bg-[#050709]/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl">
                    <Radio size={14} className="text-sky-400 animate-pulse" />
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Base_Surveillance</span>
                        <span className="text-[7px] font-mono text-sky-400 mt-1 uppercase">Freq: 824.5 MHz | Node: {base.id}</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 z-50 pointer-events-none hidden md:block">
                 <div className="bg-[#050709]/60 px-6 py-4 rounded-[2rem] border border-white/10 backdrop-blur-xl flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Structural_Integrity</span>
                        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '94%' }}
                                className="h-full bg-gradient-to-r from-emerald-600 to-sky-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-full"><Cpu size={14} className="text-neutral-500" /></div>
                 </div>
            </div>
        </div>
    );
};
