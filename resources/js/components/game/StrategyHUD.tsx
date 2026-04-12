/**
 * resources/js/components/game/StrategyHUD.tsx
 * Painel de Controlo TÃ¡ctico Integrado para OperÃ§Ãµes Globais.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Box, Crosshair, Target, Map as MapIcon, ChevronRight } from 'lucide-react';

interface StrategyHUDProps {
    resources: { wood: number, stone: number, iron: number };
    coordinates: { x: number, y: number };
    selectedEntity?: any;
    miniMapData: any[];
}

export const StrategyHUD: React.FC<StrategyHUDProps> = ({ 
    resources, 
    coordinates, 
    selectedEntity,
    miniMapData 
}) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6">
            {/* TOPO: RECURSOS E STATUS ESTRATÉGICO */}
            <div className="flex justify-between items-start w-full">
                <div className="flex gap-4 pointer-events-auto">
                    <ResourceNode icon={<Box size={14} />} label="WOOD" value={resources.wood} color="text-amber-400" />
                    <ResourceNode icon={<Shield size={14} />} label="STONE" value={resources.stone} color="text-slate-400" />
                    <ResourceNode icon={<Zap size={14} />} label="IRON" value={resources.iron} color="text-sky-400" />
                </div>

                <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 pointer-events-auto shadow-2xl">
                    <div className="flex items-center gap-2">
                        <Crosshair size={16} className="text-sky-500 animate-pulse" />
                        <span className="font-mono text-sm text-white tracking-widest">{coordinates.x}:{coordinates.y}</span>
                    </div>
                </div>
            </div>

            {/* MEIO: TOOLTIPS / NOTIFICAÇÕES (Simulado por AnimatePresence) */}

            {/* BASE: MINI-MAPA E INFO DE UNIDADE */}
            <div className="flex justify-between items-end w-full">
                {/* MINI-MAPA TÁCTICO */}
                <div className="bg-neutral-900/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] w-48 h-48 pointer-events-auto shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="grid grid-cols-20 grid-rows-20 w-full h-full gap-0.5">
                        {Array.from({ length: 400 }).map((_, i) => (
                            <div key={i} className="bg-white/5 rounded-[1px]" />
                        ))}
                    </div>
                    {/* Indicador de posição atual */}
                    <motion.div 
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute w-4 h-4 border border-sky-400 rounded-sm"
                        style={{ 
                            left: `${(coordinates.x / 1000) * 100}%`, 
                            top: `${(coordinates.y / 1000) * 100}%` 
                        }}
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em]">SATELLITE_LINK</div>
                </div>

                {/* INFO DA UNIDADE SELECCIONADA */}
                <AnimatePresence>
                    {selectedEntity && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-black/90 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] w-80 pointer-events-auto shadow-2xl space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1 block">Unidade Seleccionada</span>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter">ID_{selectedEntity.id}</h4>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <Target size={20} className="text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-mono text-neutral-400 uppercase">
                                    <span>Integridade</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <InfoBit label="STATUS" value="MOVING" color="text-emerald-400" />
                                <InfoBit label="FUEL" value="84%" color="text-orange-400" />
                            </div>

                            <button className="w-full py-3 bg-white text-black font-black uppercase text-xs rounded-xl hover:bg-sky-400 transition-colors">
                                Abrir Painel de Comando
                            </button>
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
