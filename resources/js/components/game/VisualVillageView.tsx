import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Flag, Shield, TreePine, Flame, Zap, Home, Users, 
    Crosshair, Plane, Radar, Microscope, Landmark, Factory, Pickaxe,
    Activity, Cpu, Radio, Target, Zap as EnergyIcon, Boxes
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
    rotation?: string;
}

const POSITION_MAP: Record<string, BuildingPos> = {
    // BACK ROW (Highest z-index bottom, Lowest z-index top)
    central_energia:    { top: '15%', left: '50%', size: '130px', icon: EnergyIcon, color: 'text-yellow-400', assetUrl: '/assets/structures/v2/energy.png', zIndex: 10 },
    mina_suprimentos:   { top: '22%', left: '18%', size: '130px', icon: Pickaxe, color: 'text-emerald-500', assetUrl: '/assets/structures/v2/mine.png', zIndex: 11 },
    radar_estrategico:  { top: '16%', left: '34%', size: '110px', icon: Radar, color: 'text-blue-400', assetUrl: '/assets/structures/v2/radar.png', zIndex: 12 },
    centro_pesquisa:    { top: '22%', left: '68%', size: '130px', icon: Microscope, color: 'text-purple-400', assetUrl: '/assets/structures/v2/research.png', zIndex: 13 },
    
    // MID ROW
    quartel:            { top: '35%', left: '26%', size: '150px', icon: Crosshair, color: 'text-red-500', assetUrl: '/assets/structures/v2/barracks.png', zIndex: 20 },
    refinaria:          { top: '35%', left: '80%', size: '130px', icon: Flame, color: 'text-orange-600', assetUrl: '/assets/structures/v2/factory.png', zIndex: 21 },
    housing:            { top: '45%', left: '38%', size: '110px', icon: Home, color: 'text-indigo-400', assetUrl: '/assets/structures/v2/housing.png', zIndex: 22 },
    
    // CENTERPIECE
    qg:                 { top: '48%', left: '54%', size: '280px', icon: Flag, color: 'text-orange-500', assetUrl: '/assets/structures/v2/hq.png', zIndex: 30 },
    
    // FRONT ROW
    fabrica_municoes:   { top: '70%', left: '22%', size: '180px', icon: Factory, color: 'text-neutral-400', assetUrl: '/assets/structures/v2/factory.png', zIndex: 40 },
    mina_metal:         { top: '75%', left: '82%', size: '150px', icon: Pickaxe, color: 'text-sky-400', assetUrl: '/assets/structures/v2/mine.png', zIndex: 41 },
    aerodromo:          { top: '72%', left: '50%', size: '190px', icon: Plane, color: 'text-cyan-400', assetUrl: '/assets/structures/v2/aerodrome.png', zIndex: 42 },
    posto_recrutamento: { top: '65%', left: '72%', size: '110px', icon: Users, color: 'text-rose-400', assetUrl: '/assets/structures/v2/housing.png', zIndex: 43 },
    
    // MARGINALS (Integrated into frame)
    muralha:            { top: '8%', left: '92%', size: '100px', icon: Shield, color: 'text-blue-500', zIndex: 5 },
    parlamento:         { top: '92%', left: '50%', size: '100px', icon: Landmark, color: 'text-amber-500', zIndex: 50 },
};

interface VisualVillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VisualVillageView: React.FC<VisualVillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    
    React.useEffect(() => {
        console.log(">>> VILLAGE_COMMAND_HUD_ULTRA_PREMIUM_V5_ACTIVE <<<");
    }, []);

    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        return base.edificios?.find(e => e.buildingType?.toLowerCase() === type.toLowerCase())?.nivel || 0;
    };

    return (
        <div className="relative w-full aspect-video bg-[#020405] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] group font-sans select-none ring-1 ring-white/10">
            
            {/* AMBIENT LAYERS */}
            <div className="absolute inset-0 z-0 brightness-75 contrast-[1.1] saturate-[0.7]">
                <img src="/assets/structures/v2/terrain.png" className="w-full h-full object-cover" alt="Terrain" />
            </div>
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)] z-[5] pointer-events-none" />
            
            {/* FRAME OVERLAY */}
            <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none z-[60] backdrop-blur-[1px]" />
            <div className="absolute inset-4 border border-white/[0.03] rounded-[2rem] pointer-events-none z-[61]" />

            <TooltipProvider>
                {Object.entries(POSITION_MAP).map(([type, pos]) => {
                    const level = getBuildingLevel(type);
                    const isConstructing = (buildingQueue || []).some(q => q.type === type);
                    const config = gameConfig?.buildings?.[type];
                    
                    if (level === 0 && !isConstructing) {
                        return (
                             <div 
                                key={type}
                                className="absolute -translate-x-1/2 -translate-y-1/2 opacity-10 hover:opacity-100 transition-all duration-1000 z-10"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <div className="p-2 border border-white/5 rounded-lg backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full" />
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
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                        className="relative group/building flex flex-col items-center justify-center"
                                        style={{ width: pos.size, height: pos.size }}
                                    >
                                        <AnimatePresence>
                                            {isConstructing && (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent_70%)] blur-2xl animate-pulse"
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* OPTICAL CHROMA BLOCK */}
                                        <div className="relative w-full h-full flex flex-col items-center justify-center drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)]">
                                            {pos.assetUrl ? (
                                                <img 
                                                    src={pos.assetUrl} 
                                                    className={`w-full h-full object-contain transition-all duration-1000
                                                        ${isConstructing ? 'brightness-50 grayscale contrast-150' : 'brightness-[1.1] contrast-[1.1] group-hover/building:brightness-[1.2]'}
                                                    `} 
                                                    style={{ 
                                                        filter: 'url(#chroma-key-black) drop-shadow(0 0 20px rgba(255,255,255,0.05))',
                                                        transform: `scale(1.5) ${pos.rotation || ''}`
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center w-2/3 h-2/3 bg-black/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 group-hover/building:border-white/50 transition-all shadow-3xl">
                                                    <pos.icon size={28} className={`${pos.color} group-hover/building:scale-125 transition-transform mb-2 drop-shadow-[0_0_15px_currentColor] opacity-60 group-hover:opacity-100`} />
                                                    <span className="text-[8px] font-black uppercase text-neutral-400 tracking-[0.3em]">{config?.name?.split(' ')[0] || type}</span>
                                                </div>
                                            )}

                                            {/* FLOATING HUD LABEL — LEVEL */}
                                            <div className="absolute -bottom-4 bg-black/80 border border-white/20 px-4 py-1.5 rounded-2xl shadow-2xl backdrop-blur-3xl group-hover/building:border-white/50 transition-all">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_currentColor]'} transition-all`} />
                                                    <span className="text-[11px] font-black font-mono text-white tracking-widest">{level.toString().padStart(2, '0')}</span>
                                                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-tighter">SEC_{type.slice(0,3)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-black/95 border-white/10 text-white p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,1)] min-w-[240px] z-[1000] border-t-white/20">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><pos.icon size={20} className={pos.color} /></div>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest leading-none">Command_Authorization</span>
                                                <span className="font-black uppercase text-lg tracking-tighter leading-none">{config?.name || type}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-black tracking-widest">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-neutral-500 text-[8px]">Status</span>
                                                <span className={isConstructing ? 'text-orange-400' : 'text-emerald-400'}>{isConstructing ? 'Construction' : 'Operational'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 text-right">
                                                <span className="text-neutral-500 text-[8px]">Precision</span>
                                                <span className="text-white">{(89 + level).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })}
            </TooltipProvider>

            {/* INTEGRATED HUD FRAME ELEMENTS */}
            <div className="absolute top-8 left-8 z-[70] pointer-events-none">
                <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
                    <Radio size={16} className="text-sky-400 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Satellite_Link</span>
                        <span className="text-[8px] font-mono text-sky-400 uppercase tracking-widest">Signal_Strength: 98% // Node: {base.id}</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-8 right-8 z-[70] pointer-events-none">
                 <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
                    <Activity size={16} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">System_Integrity: <span className="text-emerald-500">OPTIMAL</span></span>
                 </div>
            </div>

            <div className="absolute bottom-8 right-8 z-[70] pointer-events-none">
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.4em]">Military_Grid_Status</span>
                    <div className="flex gap-1">
                        {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-1.5 h-1.5 bg-sky-500/20 rounded-full" />)}
                    </div>
                </div>
            </div>

            {/* VERSION HUD */}
            <div className="absolute bottom-8 left-8 z-[70] pointer-events-none">
                <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-[0.8em]">Command_Interface_V5.Premium</span>
            </div>

            {/* SCANNING SCANLINE */}
            <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none z-[80]"
            />

            {/* CHROMA KEY FILTER */}
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
