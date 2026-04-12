/**
 * resources/js/components/game/StrategyHUD.tsx
 * Painel de Controlo TÃ¡ctico Integrado para OperÃ§Ãµes Globais.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveMovements } from './ActiveMovements';

interface StrategyHUDProps {
    resources: { wood: number, stone: number, iron: number };
    coordinates: { x: number, y: number };
    selectedEntity?: any;
    miniMapData: any[];
    villages: Array<{ id: number, name: string, x: number, y: number }>;
    onJump: (x: number, y: number) => void;
}

export const StrategyHUD: React.FC<StrategyHUDProps> = ({ 
    resources, 
    coordinates, 
    selectedEntity,
    miniMapData,
    villages,
    onJump
}) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-8">
            {/* BARRA SUPERIOR: RECURSOS (CENTRO) E COORDENADAS (DIREITA) */}
            <div className="flex justify-between items-start w-full gap-8">
                {/* LISTA DE VILAS: FLUTUANTE ESQUERDA (Pós-Sidebar) */}
                <div className="w-1/4 pt-16">
                    <div className="bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-3xl pointer-events-auto shadow-2xl space-y-3">
                        <div className="flex items-center gap-2 px-2">
                            <MapIcon size={12} className="text-sky-500" />
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">ACTIVE_COLONIES</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {villages.map(v => (
                                <button 
                                    key={v.id}
                                    onClick={() => onJump(v.x, v.y)}
                                    className="bg-neutral-900/40 hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all group w-full"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{v.name}</span>
                                    <span className="text-[8px] font-mono text-neutral-500 ml-auto group-hover:text-sky-400">{v.x}:{v.y}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MOVIMENTOS ATIVOS (Radar Militar) */}
                    <ActiveMovements />
                </div>

                {/* RECURSOS: CENTRADO E PREMIUM */}
                <div className="flex gap-2 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-3xl shadow-2xl">
                    <ResourceNode icon={<Box size={14} />} label="WOOD" value={resources.wood} color="text-amber-400" />
                    <ResourceNode icon={<Shield size={14} />} label="STONE" value={resources.stone} color="text-slate-400" />
                    <ResourceNode icon={<Zap size={14} />} label="IRON" value={resources.iron} color="text-sky-400" />
                </div>

                {/* STATUS DE COORDENADAS: TOP RIGHT */}
                <div className="bg-black/80 backdrop-blur-2xl border border-sky-500/20 px-6 py-3 rounded-[2rem] flex items-center gap-4 pointer-events-auto shadow-2xl hover:border-sky-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Crosshair size={18} className="text-sky-500" />
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-sky-500 rounded-full"
                            />
                        </div>
                        <span className="font-mono text-base text-white tracking-[0.2em] font-bold">{coordinates.x}:{coordinates.y}</span>
                    </div>
                </div>
            </div>

            {/* BASE: RADAR E INFO DE UNIDADE */}
            <div className="flex justify-between items-end w-full gap-8">
                {/* MINI-MAPA TÁCTICO (RADAR STYLE) */}
                <div className="bg-neutral-950/90 backdrop-blur-3xl border-2 border-white/5 p-3 rounded-[2.5rem] w-64 h-64 pointer-events-auto shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1),transparent_70%)]" />
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    
                    {/* Radar Sweep Effect */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-conic-to-r from-sky-500/20 via-transparent to-transparent opacity-40 pointer-events-none"
                    />

                    {/* Entities on Radar */}
                    {miniMapData.map((e, idx) => (
                        <div 
                            key={idx}
                            className={`absolute w-1 h-1 rounded-full ${e.type === 'unit' ? 'bg-sky-400' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}
                            style={{ 
                                left: `${(e.x / 1000) * 100}%`, 
                                top: `${(e.y / 1000) * 100}%` 
                            }}
                        />
                    ))}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-sky-500/50 uppercase tracking-[0.4em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-pulse" />
                        SCAN_ACTIVE
                    </div>
                </div>

                {/* INFO DA UNIDADE SELECCIONADA (PREMIUM CARD) */}
                <AnimatePresence>
                    {selectedEntity && (
                        <motion.div 
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className="bg-neutral-900/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] w-96 pointer-events-auto shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">SIGNAL_DETECTED</span>
                                    </div>
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                                        {selectedEntity.type?.replace('Unit', '') || 'TARGET'}<span className="text-sky-500">_SECURE</span>
                                    </h4>
                                    <p className="text-[10px] font-mono text-neutral-500 mt-1">UUID: {selectedEntity.id.toString(16).toUpperCase()}</p>
                                </div>
                                <div className="p-4 bg-sky-500/10 rounded-3xl border border-sky-500/20">
                                    <Target size={24} className="text-sky-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoBit label="ARMOR_COV" value="OPTIMAL" color="text-sky-400" />
                                <InfoBit label="LOGISTICS" value="ACTIVE" color="text-emerald-400" />
                                <InfoBit label="POSITION" value={`${Math.round(selectedEntity.x)}:${Math.round(selectedEntity.y)}`} color="text-white font-mono" />
                                <InfoBit label="THREAT_LVL" value="MINIMAL" color="text-neutral-500" />
                            </div>

                            <div className="pt-2">
                                <button className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase text-xs rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                                    EXECUTE_COMMAND_PROTOCOL
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ResourceNode = ({ icon, label, value, color }: any) => (
    <div className="bg-neutral-900 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl group hover:border-white/20 transition-all cursor-help relative">
        <div className={`p-1.5 bg-white/5 rounded-lg ${color}`}>{icon}</div>
        <div>
            <span className="text-[8px] font-black text-neutral-500 uppercase block tracking-tighter">{label}</span>
            <span className="text-sm font-black text-white font-mono tracking-tighter">{Math.floor(value).toLocaleString()}</span>
        </div>
        
        {/* Simple Tooltip */}
        <div className="absolute top-full mt-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-[8px] text-white p-2 rounded-lg border border-white/10 z-50 w-32">
            Disponibilidade imediata de recursos para operaÃ§Ãµes de base.
        </div>
    </div>
);

const InfoBit = ({ label, value, color }: any) => (
    <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
        <span className="text-[8px] font-black text-neutral-600 uppercase block mb-0.5">{label}</span>
        <span className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>{value}</span>
    </div>
);

const InfoBitWithIcon = ({ icon, value }: any) => (
    <div className="flex items-center gap-2">
        {icon}
        <span className="font-mono text-xs text-white">{value}</span>
    </div>
);
