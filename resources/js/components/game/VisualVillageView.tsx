import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Flag, Shield, TreePine, Flame, Zap, Home, Users, 
    Crosshair, Plane, Radar, Microscope, Landmark, Factory, Pickaxe,
    Activity, Cpu, Radio, Target
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BuildingPos {
    top: string;
    left: string;
    size: string;
    icon: React.ElementType;
    color: string;
    assetUrl?: string;
    zIndex?: number;
}

const POSITION_MAP: Record<string, BuildingPos> = {
    qg: { top: '50%', left: '50%', size: '220px', icon: Flag, color: 'text-orange-500', assetUrl: '/assets/structures/v2/hq.png', zIndex: 30 },
    quartel: { top: '35%', left: '28%', size: '140px', icon: Crosshair, color: 'text-red-500', assetUrl: '/assets/structures/v2/barracks.png' },
    mina_suprimentos: { top: '15%', left: '15%', size: '130px', icon: Pickaxe, color: 'text-emerald-500', assetUrl: '/assets/structures/v2/mine.png' },
    mina_metal: { top: '80%', left: '85%', size: '130px', icon: Pickaxe, color: 'text-sky-400', assetUrl: '/assets/structures/v2/mine.png' },
    central_energia: { top: '18%', left: '48%', size: '130px', icon: Zap, color: 'text-yellow-400', assetUrl: '/assets/structures/v2/energy.png' },
    centro_pesquisa: { top: '22%', left: '72%', size: '140px', icon: Microscope, color: 'text-purple-400', assetUrl: '/assets/structures/v2/research.png' },
    fabrica_municoes: { top: '78%', left: '18%', size: '150px', icon: Factory, color: 'text-neutral-400', assetUrl: '/assets/structures/v2/factory.png' },
    refinaria: { top: '35%', left: '85%', size: '120px', icon: Flame, color: 'text-orange-600', assetUrl: '/assets/structures/v2/factory.png' },
    aerodromo: { top: '70%', left: '48%', size: '160px', icon: Plane, color: 'text-cyan-400' },
    muralha: { top: '5%', left: '90%', size: '80px', icon: Shield, color: 'text-blue-500' },
    housing: { top: '58%', left: '25%', size: '90px', icon: Home, color: 'text-indigo-400' },
    posto_recrutamento: { top: '62%', left: '78%', size: '90px', icon: Users, color: 'text-rose-400' },
    radar_estrategico: { top: '12%', left: '35%', size: '100px', icon: Radar, color: 'text-blue-400' },
    parlamento: { top: '88%', left: '50%', size: '90px', icon: Landmark, color: 'text-amber-500' },
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
        <div className="relative w-full aspect-video bg-[#010203] rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)] group font-sans select-none">
            
            {/* AMBIENT FOG LAYER */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#010203] via-transparent to-[#010203]/40 z-40 pointer-events-none" />

            {/* BASE TERRAIN WITH PREDETERMINED CONTRAST */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/structures/v2/terrain.png" 
                    className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] saturate-[0.8]" 
                    alt="Tactical Terrain" 
                />
            </div>

            {/* RADAR VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,12,24,0.6)_100%)] z-10 pointer-events-none" />

            <TooltipProvider>
                {Object.entries(POSITION_MAP).map(([type, pos]) => {
                    const level = getBuildingLevel(type);
                    const isConstructing = (buildingQueue || []).some(q => q.type === type);
                    const config = gameConfig?.buildings?.[type];
                    
                    if (level === 0 && !isConstructing) {
                        return (
                             <div 
                                key={type}
                                className="absolute -translate-x-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-all duration-700 z-10"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <div className="p-3 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 backdrop-blur-sm group/slot">
                                    <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full group-hover/slot:bg-white" />
                                    <span className="text-[6px] text-neutral-600 font-black uppercase tracking-widest hidden group-hover/slot:block transition-all">Planeamento_{type}</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={type}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ top: pos.top, left: pos.left, zIndex: pos.zIndex || 20 }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                        className="relative group/building"
                                        style={{ width: pos.size, height: pos.size }}
                                    >
                                        <AnimatePresence>
                                            {isConstructing && (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 z-0"
                                                >
                                                    <div className="absolute inset-0 bg-orange-500/10 blur-2xl animate-pulse rounded-full" />
                                                    <div className="absolute inset-x-0 bottom-4 h-1 bg-orange-500/60 shadow-[0_0_15px_#f97316] animate-pulse rounded-full" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* HIGH-END BUILDING BLOCK */}
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            {pos.assetUrl ? (
                                                <img 
                                                    src={pos.assetUrl} 
                                                    className={`w-full h-full object-contain transition-all duration-700 drop-shadow-2xl ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.1] contrast-[1.1] group-hover/building:brightness-[1.2] group-hover/building:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`} 
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center w-2/3 h-2/3 bg-[#050709]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 group-hover/building:border-white/30 transition-all shadow-2xl relative">
                                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#fff_0%,transparent_70%)] rounded-[2rem]" />
                                                    <pos.icon size={22} className={`${pos.color} group-hover/building:scale-110 transition-transform mb-1.5`} />
                                                    <span className="text-[7px] font-black uppercase text-neutral-400 tracking-[0.2em]">{config?.name?.split(' ')[0] || type}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* HOLOGRAPHIC LEVEL BADGE */}
                                        <div className="absolute -bottom-1 -right-1 z-50">
                                            <div className="bg-[#050709]/90 border border-white/20 px-3 py-1.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex items-center gap-2 group-hover/building:border-white/40 transition-all">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                                                <span className="text-[10px] font-black font-mono text-white tracking-tighter">
                                                    {(level || 0).toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* DECORATIVE SCANLINES FOR ACTIVE SECTORS */}
                                        {level > 0 && (
                                            <div className="absolute inset-0 opacity-[0.03] group-hover/building:opacity-[0.1] transition-opacity pointer-events-none" 
                                                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 4px' }} />
                                        )}
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#010203]/95 border-white/10 text-white p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,1)] min-w-[220px] z-[100] border-t-white/20">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10"><pos.icon size={18} className={pos.color} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Protocolo_{type.slice(0,5)}</span>
                                                <span className="font-black uppercase text-sm tracking-tighter leading-none">{config?.name || type}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-[9px] uppercase font-bold">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-neutral-600 tracking-widest">Estado</span>
                                                <span className={isConstructing ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isConstructing ? 'Em Expansão' : 'Operacional'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-neutral-600 tracking-widest">Eficiência</span>
                                                <span className="text-white">{(88 + (level || 0) * 1.2).toFixed(1)}%</span>
                                            </div>
                                        </div>

                                        {isConstructing && (
                                            <div className="bg-orange-500/5 p-3 rounded-2xl text-[8px] text-orange-400 flex items-center gap-3 border border-orange-500/10 font-black uppercase tracking-tighter">
                                                <Activity size={12} className="text-orange-500" /> Engenharia_Estrutural_Ativa
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })}
            </TooltipProvider>

            {/* MINIMAL HUD ELEMENTS */}
            <div className="absolute top-10 left-10 z-50 pointer-events-none">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-[#010203]/40 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-md">
                        <Radio size={14} className="text-sky-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">SIGINT // UPLINK_ESTABLISHED</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 z-50 pointer-events-none">
                 <div className="bg-[#010203]/40 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest leading-none mb-1.5">Sector_Stability</span>
                        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '91%' }}
                                className="h-full bg-sky-500 shadow-[0_0_10px_#0ea5e9]"
                            />
                        </div>
                    </div>
                    <Cpu size={14} className="text-neutral-500" />
                 </div>
            </div>

            {/* CORNER DECORATIONS TACTICAL */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-white/5 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-white/5 pointer-events-none" />
        </div>
    );
};
