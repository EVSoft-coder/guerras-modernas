import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Shield, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface GarrisonPanelProps {
    tropas: any[];
    gameConfig: any;
}

export const GarrisonPanel: React.FC<GarrisonPanelProps> = ({ tropas = [], gameConfig }) => {
    const unitsConfig = gameConfig?.units || {};

    return (
        <Card className="bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
            <CardHeader className="py-4 bg-white/[0.02] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Users className="text-emerald-500" size={14} />
                    </div>
                    Guarnição Ativa
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 min-h-[150px]">
                <div className="grid grid-cols-1 gap-3">
                    {(tropas || []).map((t, i) => {
                        const config = unitsConfig[t.tipo] || { name: t.tipo };
                        return (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-white tracking-tight">
                                            {config.name}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">
                                                Status: Prontidão
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xl font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                                            {t.quantidade}
                                        </span>
                                        <span className="text-[7px] text-neutral-600 font-black uppercase">Unidades</span>
                                    </div>
                                </div>
                                <div className="w-full h-[1px] bg-white/5 mb-2"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-neutral-500">
                                        <Shield size={10} className="text-emerald-600" /> 
                                        Potencial Defensivo: <span className="text-white">ALTO</span>
                                    </div>
                                    <div className="text-[8px] font-mono text-emerald-500/50 group-hover:text-emerald-500 transition-colors">
                                        REF_{Math.random().toString(36).substr(2, 4).toUpperCase()}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {(!tropas || tropas.length === 0) && (
                        <div className="col-span-1 py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                            <Target className="mx-auto text-neutral-800 mb-3 opacity-20" size={32} />
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em] block">
                                Setor Desguarnecido
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
