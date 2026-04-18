import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Flag, Shield, TreePine, Flame, Zap, Home, Users, 
    Crosshair, Plane, Radar, Microscope, Landmark, Factory, Pickaxe,
    Activity, Cpu, Radio
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BuildingPos {
    top: string;
    left: string;
    icon: React.ElementType;
    color: string;
    glow: string;
}

const POSITION_MAP: Record<string, BuildingPos> = {
    qg: { top: '38%', left: '46%', icon: Flag, color: 'text-orange-500', glow: 'shadow-orange-500/20' },
    muralha: { top: '5%', left: '85%', icon: Shield, color: 'text-blue-500', glow: 'shadow-blue-500/20' },
    mina_suprimentos: { top: '15%', left: '15%', icon: TreePine, color: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
    refinaria: { top: '15%', left: '77%', icon: Flame, color: 'text-orange-600', glow: 'shadow-orange-600/20' },
    fabrica_municoes: { top: '72%', left: '15%', icon: Factory, color: 'text-neutral-400', glow: 'shadow-neutral-400/20' },
    mina_metal: { top: '72%', left: '77%', icon: Pickaxe, color: 'text-sky-400', glow: 'shadow-sky-400/20' },
    central_energia: { top: '10%', left: '46%', icon: Zap, color: 'text-yellow-400', glow: 'shadow-yellow-400/20' },
    housing: { top: '58%', left: '28%', icon: Home, color: 'text-indigo-400', glow: 'shadow-indigo-400/20' },
    posto_recrutamento: { top: '58%', left: '64%', icon: Users, color: 'text-rose-400', glow: 'shadow-rose-400/20' },
    quartel: { top: '35%', left: '18%', icon: Crosshair, color: 'text-red-500', glow: 'shadow-red-500/20' },
    aerodromo: { top: '65%', left: '46%', icon: Plane, color: 'text-cyan-400', glow: 'shadow-cyan-400/20' },
    radar_estrategico: { top: '12%', left: '28%', icon: Radar, color: 'text-blue-400', glow: 'shadow-blue-400/20' },
    centro_pesquisa: { top: '12%', left: '64%', icon: Microscope, color: 'text-purple-400', glow: 'shadow-purple-400/20' },
    parlamento: { top: '82%', left: '46%', icon: Landmark, color: 'text-amber-500', glow: 'shadow-amber-500/20' },
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
        <div className="relative w-full aspect-video bg-[#05080a] rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] group font-sans">
            
            {/* ADVANCED BACKGROUND ENGINE */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
                 style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px' 
                 }}>
            </div>

            {/* RADAR SCANNER EFFECT */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square opacity-10 pointer-events-none"
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(14, 165, 233, 0.4) 30deg, transparent 60deg)' }}
            />

            {/* TACTICAL OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />
            
            {/* ORBITAL RINGS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] aspect-square border border-white/[0.03] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square border border-white/[0.05] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] aspect-square border border-white/[0.1] rounded-full pointer-events-none" />

            <TooltipProvider>
                {Object.entries(POSITION_MAP).map(([type, pos]) => {
                    const level = getBuildingLevel(type);
                    const isConstructing = (buildingQueue || []).some(q => q.type === type);
                    const config = gameConfig?.buildings?.[type];
                    
                    return (
                        <div 
                            key={type}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            style={{ top: pos.top, left: pos.left }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                        className={`
                                            relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-500 backdrop-blur-md
                                            ${level > 0 
                                                ? 'bg-neutral-900/40 border-white/10 shadow-2xl hover:border-white/30' 
                                                : 'bg-black/40 border-white/5 opacity-30 hover:opacity-100 grayscale hover:grayscale-0'
                                            }
                                            ${isConstructing ? 'ring-1 ring-orange-500/50' : ''}
                                            ${pos.glow}
                                        `}
                                    >
                                        <div className={`p-2.5 rounded-xl bg-gradient-to-br from-white/10 to-transparent ${pos.color} group-hover:scale-110 transition-transform`}>
                                            <pos.icon size={20} strokeWidth={2.5} />
                                            {isConstructing && (
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                    className="absolute -inset-1.5 border-2 border-t-orange-400 border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-[0_0_10px_rgba(251,146,60,0.4)]"
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors">
                                                {config?.name?.split(' ')[0] || type}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500/50 animate-pulse" />
                                                <span className="text-[9px] font-mono font-bold text-neutral-300">
                                                    LVL_{level.toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* DECORATIVE DATA BARS */}
                                        {level > 0 && (
                                            <div className="mt-1 flex gap-0.5 w-full justify-center opacity-40">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className={`h-0.5 rounded-full transition-all duration-1000 ${i <= (level % 4) + 1 ? 'w-2 bg-white/20' : 'w-1 bg-white/5'}`} />
                                                ))}
                                            </div>
                                        )}
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-neutral-950/90 border-white/10 text-white p-4 rounded-3xl backdrop-blur-2xl shadow-2xl min-w-[180px]">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                            <pos.icon size={16} className={pos.color} />
                                            <span className="font-black uppercase text-[10px] tracking-widest">{config?.name || type}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-[8px] uppercase font-bold text-neutral-400">
                                            <div>Status: <span className="text-emerald-400">Online</span></div>
                                            <div>Efficiency: <span className="text-white">{(85 + level).toFixed(1)}%</span></div>
                                            <div>Load: <span className="text-white">{(12 + level*2)}%</span></div>
                                            <div>ID: <span className="text-white font-mono">#{type.slice(0,3)}</span></div>
                                        </div>
                                        {isConstructing && (
                                            <div className="mt-2 bg-orange-500/20 p-2 rounded-xl text-[8px] text-orange-400 flex items-center gap-2 animate-pulse font-black uppercase tracking-tighter">
                                                <Activity size={10} />
                                                Structural_Expansion_In_Progress
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })}
            </TooltipProvider>

            {/* AMBIENT INTERFACE ELEMENTS */}
            <div className="absolute top-8 left-10 flex flex-col gap-1 pointer-events-none">
                <div className="flex items-center gap-3 bg-black/40 px-5 py-2 rounded-full border border-white/10 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">
                    <Radio size={12} className="text-sky-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-white">Secure_Uplink: <span className="text-sky-400 font-mono">ESTABLISHED</span></span>
                </div>
                <div className="px-5 text-[7px] font-mono text-neutral-500 uppercase tracking-widest">Lat: 38.7223 | Long: -9.1393 | Alt: 104m</div>
            </div>

            <div className="absolute bottom-10 right-10 flex items-center gap-4 bg-black/60 px-6 py-3 rounded-[2rem] border border-white/5 backdrop-blur-2xl pointer-events-none">
                <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">Base_Integrity</span>
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '92%' }}
                            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                        />
                    </div>
                </div>
                <Cpu size={16} className="text-neutral-500" />
            </div>

            {/* SCANNING SCANLINE */}
            <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-sky-500/5 to-transparent pointer-events-none z-50"
            />
        </div>
    );
};
