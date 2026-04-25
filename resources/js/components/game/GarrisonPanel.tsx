import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Shield, Target, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUnitAsset } from '@/utils/assetMapper';

interface GarrisonPanelProps {
    tropas: any[];
    gameConfig: any;
}

export const GarrisonPanel: React.FC<GarrisonPanelProps> = ({ tropas = [], gameConfig }) => {
    const unitsConfig = gameConfig?.units || {};

    return (
        <Card className="bg-[#050709]/60 border-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2rem] relative group border-t-emerald-500/20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
            
            <CardHeader className="py-5 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-[11px] uppercase font-black tracking-[0.3em] text-neutral-400 flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Users className="text-emerald-500" size={18} />
                        </div>
                        Guarnição Ativa
                    </CardTitle>
                    <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                        <Zap size={10} className="text-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Estado: Prontidão</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="py-6 min-h-[150px] relative">
                {/* DECORATIVE GRID */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {(tropas || []).map((t, idx) => {
                        const rawUnitName = t.tipo || t.unidade || 'Unidade';
                        const config = unitsConfig[rawUnitName] || {};
                        
                        // Humanização robusta se o nome não estiver no config
                        const displayName = config.name || rawUnitName
                            .replace(/_/g, ' ')
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase());

                        return (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="bg-gradient-to-br from-white/[0.04] to-transparent p-4 rounded-[1.5rem] border border-white/5 group/unit hover:border-emerald-500/40 transition-all duration-500 relative overflow-hidden"
                            >
                                {/* SCANLINE EFFECT ON HOVER */}
                                <div className="absolute inset-0 opacity-0 group-hover/unit:opacity-10 transition-opacity pointer-events-none" 
                                     style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #10b981 1px, #10b981 2px)', backgroundSize: '100% 4px' }} />

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center p-1.5 group-hover/unit:border-emerald-500/50 shadow-2xl transition-all duration-500 transform group-hover/unit:scale-110">
                                            <img 
                                                src={getUnitAsset(rawUnitName)} 
                                                className="w-full h-full object-contain brightness-75 group-hover/unit:brightness-125 transition-all" 
                                                alt={displayName}
                                                onError={(e) => (e.currentTarget.src = "/images/unidades/unidade.png")}
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[7px] font-black text-emerald-500 shadow-lg">
                                            <Shield size={8} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black uppercase text-white tracking-widest truncate">
                                                {displayName}
                                            </span>
                                            <div className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <span className="text-xs font-mono font-black text-emerald-400">
                                                    {t.quantidade.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    className="h-full bg-emerald-500/40"
                                                />
                                            </div>
                                            <span className="text-[7px] text-neutral-500 font-black uppercase italic tracking-tighter">Combat_Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {(!tropas || tropas.length === 0) && (
                        <div className="col-span-full py-16 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] relative overflow-hidden group/empty">
                            <motion.div 
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent pointer-events-none"
                            />
                            <div className="relative z-10">
                                <Activity className="mx-auto text-neutral-800 mb-4 opacity-20" size={40} />
                                <span className="text-[11px] uppercase font-black text-neutral-600 tracking-[0.4em] block">
                                    Setor_Vazio // Alerta_Garrison
                                </span>
                                <span className="text-[8px] text-neutral-800 uppercase mt-2 block font-mono">Status: Critical_Undermanned</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                    <span className="text-[7px] font-mono text-neutral-500 tracking-[0.5em] uppercase">Tactical_Garrison_Interface_V.4.2</span>
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-emerald-500/30 rounded-full" />)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
