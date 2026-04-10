import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Sword, Navigation, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Troop {
    id: number;
    unidade: string;
    quantidade: number;
}

interface GarrisonPanelProps {
    tropas: Troop[];
    gameConfig: any;
}

export const GarrisonPanel: React.FC<GarrisonPanelProps> = ({ tropas, gameConfig }) => {
    const unitIcons: Record<string, React.ReactNode> = {
        'infantaria': <Users className="text-emerald-500" size={16} />,
        'blindado_apc': <Navigation className="text-blue-500" size={16} />,
        'tanque_combate': <Shield className="text-orange-500" size={16} />,
        'helicoptero_ataque': <Sword className="text-red-500" size={16} />,
        'agente_espiao': <Users className="text-purple-500" size={16} />,
    };

    return (
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-3 bg-white/5 border-b border-white/5">
                <CardTitle className="text-xs uppercase font-black tracking-widest text-neutral-400 flex items-center gap-2">
                    <Shield className="text-emerald-500" size={18} />
                    Guarnição Ativa
                </CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-3">
                <div className="space-y-3">
                    {(tropas?.length ?? 0) > 0 ? (
                        tropas.map((t, idx) => (
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                key={t.id} 
                                className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-default group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black/40 rounded border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                        {unitIcons[t.unidade] || <Users size={16} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">
                                            {gameConfig.units[t.unidade]?.name || t.unidade}
                                        </span>
                                        <span className="text-[8px] font-bold text-neutral-500 uppercase mt-1 tracking-tighter">
                                            Prontidão de Combate: 100%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-emerald-400 font-mono leading-none">
                                        {t.quantidade.toLocaleString()}
                                    </div>
                                    <div className="text-[8px] font-bold text-neutral-600 uppercase">UNIDADES</div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-xl">
                            <p className="text-[10px] uppercase font-black text-neutral-700 italic">Sem contingente mobilizado</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
