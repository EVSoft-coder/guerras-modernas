import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Flag, Shield, TreePine, Flame, Zap, Home, Users, 
    Crosshair, Plane, Radar, Microscope, Landmark, Factory, Pickaxe
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BuildingPos {
    top: string;
    left: string;
    icon: React.ElementType;
    color: string;
}

const POSITION_MAP: Record<string, BuildingPos> = {
    qg: { top: '38%', left: '46%', icon: Flag, color: 'text-orange-500' },
    muralha: { top: '5%', left: '85%', icon: Shield, color: 'text-blue-500' },
    mina_suprimentos: { top: '15%', left: '15%', icon: TreePine, color: 'text-emerald-500' },
    refinaria: { top: '15%', left: '77%', icon: Flame, color: 'text-orange-600' },
    fabrica_municoes: { top: '72%', left: '15%', icon: Factory, color: 'text-neutral-400' },
    mina_metal: { top: '72%', left: '77%', icon: Pickaxe, color: 'text-sky-400' },
    central_energia: { top: '10%', left: '46%', icon: Zap, color: 'text-yellow-400' },
    housing: { top: '58%', left: '28%', icon: Home, color: 'text-indigo-400' },
    posto_recrutamento: { top: '58%', left: '64%', icon: Users, color: 'text-rose-400' },
    quartel: { top: '35%', left: '18%', icon: Crosshair, color: 'text-red-500' },
    aerodromo: { top: '65%', left: '46%', icon: Plane, color: 'text-cyan-400' },
    radar_estrategico: { top: '12%', left: '28%', icon: Radar, color: 'text-blue-400' },
    centro_pesquisa: { top: '12%', left: '64%', icon: Microscope, color: 'text-purple-400' },
    parlamento: { top: '82%', left: '46%', icon: Landmark, color: 'text-amber-500' },
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
        <div className="relative w-full aspect-video bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
            {/* Blueprint Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5"></div>
            
            {/* Tactical Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square border border-dashed border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] aspect-square border border-white/5 rounded-full pointer-events-none"></div>

            <TooltipProvider>
                {Object.entries(POSITION_MAP).map(([type, pos]) => {
                    const level = getBuildingLevel(type);
                    const isConstructing = (buildingQueue || []).some(q => q.type === type);
                    const config = gameConfig?.buildings?.[type];
                    const isLocked = level === 0 && type !== 'qg' && type !== 'muralha';

                    return (
                        <div 
                            key={type}
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                            style={{ top: pos.top, left: pos.left }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.1, zIndex: 50 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                        className={`
                                            relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300
                                            ${level > 0 ? 'bg-black/60 border-white/10 hover:border-white/40' : 'bg-black/20 border-white/5 opacity-40 hover:opacity-100'}
                                            ${isConstructing ? 'ring-2 ring-orange-500/50' : ''}
                                        `}
                                    >
                                        <div className={`p-3 rounded-xl bg-white/5 ${pos.color} relative`}>
                                            <pos.icon size={24} />
                                            {isConstructing && (
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                                    className="absolute -inset-1 border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 whitespace-nowrap">
                                                {config?.name?.split(' ')[0] || type}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-white">
                                                Lvl {level}
                                            </span>
                                        </div>

                                        {/* Status Indicators */}
                                        {isConstructing && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                                        )}
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-neutral-900 border-white/10 text-white p-3 rounded-xl">
                                    <div className="flex flex-col gap-1">
                                        <div className="font-black uppercase text-[10px] text-orange-500">{config?.name || type}</div>
                                        <div className="text-[10px] text-neutral-400">Nível Atual: {level}</div>
                                        {isConstructing && <div className="text-[10px] text-orange-400 animate-pulse font-bold">EM CONSTRUÇÃO...</div>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })}
            </TooltipProvider>

            {/* Tactical Overlays */}
            <div className="absolute bottom-6 left-8 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-white">Setor_Seguro</span>
                </div>
            </div>
        </div>
    );
};
