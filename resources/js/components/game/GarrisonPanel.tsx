import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Shield, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { getUnitAsset } from '@/utils/assetMapper';

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
                    <Users className="text-emerald-500" size={16} />
                    Guarnição Ativa
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 min-h-[150px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(tropas || []).map((t, idx) => {
                        const unitName = t.tipo || t.unidade || 'Unidade';
                        const config = unitsConfig[unitName] || { name: unitName };
                        return (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-1 group-hover:border-emerald-500/30 transition-all">
                                        <img 
                                            src={getUnitAsset(unitName)} 
                                            className="w-full h-full object-contain brightness-75 group-hover:brightness-110 transition-all" 
                                            alt={config.name}
                                            onError={(e) => (e.currentTarget.src = "/assets/placeholders/unit_unknown.svg")}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-black uppercase text-white tracking-tight truncate">
                                                {config.name}
                                            </span>
                                            <span className="text-sm font-mono font-black text-emerald-400">
                                                {t.quantidade}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Shield size={8} className="text-emerald-600/50" />
                                            <span className="text-[7px] text-neutral-600 font-bold uppercase tracking-widest">
                                                Guarnição
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {(!tropas || tropas.length === 0) && (
                        <div className="col-span-full py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
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
