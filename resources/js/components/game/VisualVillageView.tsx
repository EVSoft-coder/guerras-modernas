import React from 'react';
import { Base } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Flag, Shield, TreePine, Flame, Zap, Home, Users, 
    Crosshair, Plane, Radar, Microscope, Landmark, Factory, Pickaxe,
    Activity, Cpu, Radio, Target, Zap as EnergyIcon, AlertTriangle
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
    // ALINHAMENTO TÁTICO BASEADO NOS PADS DO TERRENO
    qg:                 { top: '50%', left: '52%', size: '320px', icon: Flag, color: 'text-orange-500', assetUrl: '/assets/structures/v2/hq.png', zIndex: 30 },
    central_energia:    { top: '12%', left: '50%', size: '150px', icon: EnergyIcon, color: 'text-yellow-400', assetUrl: '/assets/structures/v2/energy.png', zIndex: 10 },
    mina_suprimentos:   { top: '18%', left: '16%', size: '150px', icon: Pickaxe, color: 'text-emerald-500', assetUrl: '/assets/structures/v2/mine.png', zIndex: 11 },
    mina_metal:         { top: '82%', left: '84%', size: '150px', icon: Pickaxe, color: 'text-sky-400', assetUrl: '/assets/structures/v2/mine.png', zIndex: 45 },
    radar_estrategico:  { top: '12%', left: '32%', size: '120px', icon: Radar, color: 'text-blue-400', assetUrl: '/assets/structures/v2/radar.png', zIndex: 12 },
    centro_pesquisa:    { top: '22%', left: '78%', size: '160px', icon: Microscope, color: 'text-purple-400', assetUrl: '/assets/structures/v2/research.png', zIndex: 13 },
    quartel:            { top: '38%', left: '26%', size: '180px', icon: Crosshair, color: 'text-red-500', assetUrl: '/assets/structures/v2/barracks.png', zIndex: 20 },
    fabrica_municoes:   { top: '75%', left: '22%', size: '200px', icon: Factory, color: 'text-neutral-400', assetUrl: '/assets/structures/v2/factory.png', zIndex: 40 },
    refinaria:          { top: '38%', left: '88%', size: '160px', icon: Flame, color: 'text-orange-600', assetUrl: '/assets/structures/v2/factory.png', zIndex: 21 },
    aerodromo:          { top: '82%', left: '48%', size: '220px', icon: Plane, color: 'text-cyan-400', assetUrl: '/assets/structures/v2/aerodrome.png', zIndex: 42 },
    housing:            { top: '55%', left: '24%', size: '130px', icon: Home, color: 'text-indigo-400', assetUrl: '/assets/structures/v2/housing.png', zIndex: 25 },
    posto_recrutamento: { top: '65%', left: '78%', size: '130px', icon: Users, color: 'text-rose-400', assetUrl: '/assets/structures/v2/housing.png', zIndex: 43 },
    muralha:            { top: '5%', left: '92%', size: '100px', icon: Shield, color: 'text-blue-500', zIndex: 5 },
    parlamento:         { top: '92%', left: '50%', size: '110px', icon: Landmark, color: 'text-amber-500', zIndex: 50 },
};

interface VisualVillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VisualVillageView: React.FC<VisualVillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    
    React.useEffect(() => {
        console.log(">>> VILLAGE_COMMAND_HUD_V6_ULTRA_PREMIUM_FIX_ACTIVE <<<");
    }, []);

    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        const b = base.edificios?.find(e => {
            const bt = e.buildingType || e.type || e.slug; // Tenta vários campos de identificação
            return bt?.toLowerCase() === type.toLowerCase();
        });
        return b?.nivel || 0;
    };

    return (
        <div className="relative w-full aspect-video bg-[#010203] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,1)] group font-sans select-none">
            
            {/* TERRENO DE FUNDO — MAIOR ESCURIDÃO PARA CONTRASTE */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/assets/structures/v2/terrain.png" 
                    className="w-full h-full object-cover brightness-[0.45] contrast-[1.3] saturate-[0.6]" 
                    alt="Tactical Terrain" 
                />
            </div>

            {/* VIGNETTE E GRID TÁTICA */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <TooltipProvider>
                {Object.entries(POSITION_MAP).map(([type, pos]) => {
                    const level = getBuildingLevel(type);
                    const isConstructing = (buildingQueue || []).some(q => q.type === type);
                    const config = gameConfig?.buildings?.[type];
                    
                    if (level === 0 && !isConstructing) {
                        return (
                             <div 
                                key={type}
                                className="absolute -translate-x-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-all z-10"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <div className="p-3 border border-white/10 rounded-full backdrop-blur-md bg-white/5"><Target size={12} className="text-neutral-700" /></div>
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
                                        whileHover={{ scale: 1.08, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                                        className="relative group/building cursor-pointer p-2 rounded-[2.5rem]"
                                        style={{ width: pos.size, height: pos.size }}
                                    >
                                        {/* GLOW DE BASE PARA VISIBILIDADE */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] opacity-0 group-hover/building:opacity-100 transition-opacity" />

                                        {/* ATIVO DO EDIFÍCIO — ALTO CONTRASTE, SEM CHROMA KEY AGRESSIVO */}
                                        <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_30px_60px_rgba(0,0,0,1)]">
                                            {pos.assetUrl ? (
                                                <img 
                                                    src={pos.assetUrl} 
                                                    className={`w-full h-full object-contain transition-all duration-500
                                                        ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.25] contrast-[1.2] group-hover/building:brightness-[1.4]'}
                                                    `} 
                                                    style={{ 
                                                        transform: 'scale(1.8)',
                                                        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))'
                                                    }}
                                                    onError={(e) => {
                                                        console.error("FAILED_TO_LOAD_ASSET:", type);
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement?.classList.add('broken-asset');
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center w-3/4 h-3/4 bg-[#050709]/95 backdrop-blur-3xl rounded-[2.5rem] border-2 border-white/20 shadow-2xl">
                                                    <pos.icon size={32} className={`${pos.color} mb-3`} />
                                                    <span className="text-[9px] font-black uppercase text-white tracking-widest">{config?.name || type}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ETIQUETA DE STATUS — INTEGRADA AO EDIFÍCIO */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-50">
                                            <div className="bg-[#050709]/90 border border-white/10 px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-2xl flex items-center gap-3 group-hover/building:border-white/30 transition-all">
                                                <div className={`w-2 h-2 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} />
                                                <span className="text-[12px] font-black font-mono text-white tracking-tighter">L.{(level || 0)}</span>
                                                <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest border-l border-white/10 pl-3">{type.split('_')[0]}</span>
                                            </div>
                                        </div>

                                        {/* INDICADOR DE CONSTRUÇÃO */}
                                        {isConstructing && (
                                            <div className="absolute inset-x-0 -bottom-8 flex justify-center">
                                                <div className="bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-[7px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Activity size={10} className="animate-pulse" /> Operação_Engenharia
                                                </div>
                                            </div>
                                        )}
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-black/95 border-white/10 text-white p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-3xl min-w-[260px] z-[1000] border-t-white/30">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><pos.icon size={22} className={pos.color} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest leading-none">Authorization_Code</span>
                                                <span className="font-black uppercase text-xl tracking-tighter leading-none mt-1">{config?.name || type}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-black">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-neutral-500 text-[8px]">Status_Geral</span>
                                                <span className={isConstructing ? 'text-orange-400' : 'text-emerald-400'}>{isConstructing ? 'Construção_Ativa' : 'Sistema_Operacional'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 text-right">
                                                <span className="text-neutral-500 text-[8px]">Integridade</span>
                                                <span className="text-white">{(92 + level).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })}
            </TooltipProvider>

            {/* ELEMENTOS DE HUD INTEGRADOS NA MOLDURA */}
            <div className="absolute top-10 left-10 z-[100] pointer-events-none">
                <div className="flex items-center gap-5 bg-black/60 px-7 py-4 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
                    <Radio size={18} className="text-sky-400 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1.5">Satellite // Node_{base.id}</span>
                        <span className="text-[8px] font-mono text-sky-400 uppercase tracking-[0.4em] opacity-80">Link_Stability: 99.4% // Crypto_Online</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-10 right-10 z-[100] pointer-events-none">
                 <div className="flex items-center gap-4 bg-black/60 px-7 py-4 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
                    <Activity size={18} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Base_Integrity: <span className="text-emerald-500">MAXIMUM</span></span>
                 </div>
            </div>

            <div className="absolute bottom-10 left-10 z-[100] pointer-events-none">
                <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-[1em]">Tactical_Command_Interface_V6_Premium</span>
            </div>

            {/* SCANLINE CINEMÁTICA */}
            <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[80px] bg-gradient-to-b from-transparent via-white/[0.05] to-transparent pointer-events-none z-[110]"
            />
        </div>
    );
};
