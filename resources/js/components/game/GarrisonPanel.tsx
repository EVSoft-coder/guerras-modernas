import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Shield, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GarrisonPanelProps {
    tropas: any[];
    gameConfig: any;
}

export const GarrisonPanel: React.FC<GarrisonPanelProps> = ({ tropas = [], gameConfig }) => {
    const unitsConfig = gameConfig?.units || {};

    return (
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-3 bg-white/5 border-b border-white/5">
                <CardTitle className="text-xs uppercase font-black tracking-widest text-neutral-400 flex items-center gap-2">
                    <Users className="text-emerald-500" size={18} /> Guarnição Ativa
                </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-3">
                    {(tropas || []).map((t, i) => {
                        const config = unitsConfig[t.tipo] || { name: t.tipo };
                        return (
                            <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-white truncate w-24">
                                            {config.name}
                                        </span>
                                        <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">
                                            Mobilizado
                                        </span>
                                    </div>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border-emerald-500/20">
                                        {t.quantidade}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-neutral-600">
                                    <Shield size={10} className="text-emerald-600" /> 
                                    <span>Prontidão de Combate: 100%</span>
                                </div>
                            </div>
                        );
                    })}
                    {(!tropas || tropas.length === 0) && (
                        <div className="col-span-2 py-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
                            <Target className="mx-auto text-neutral-800 mb-2" size={24} />
                            <span className="text-[9px] uppercase font-black text-neutral-700 tracking-widest">
                                Sem Unidades Mobilizadas
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
