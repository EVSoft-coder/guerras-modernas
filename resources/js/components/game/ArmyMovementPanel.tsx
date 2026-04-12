import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaneTakeoff, PlaneLanding, Clock, Target, ShieldAlert, Zap, ChevronRight, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArmyMovementPanelProps {
    ataquesEnviados: any[];
    ataquesRecebidos: any[];
}

export const ArmyMovementPanel: React.FC<ArmyMovementPanelProps> = ({ 
    ataquesEnviados, ataquesRecebidos 
}) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getTimeLeft = (targetTime: string) => {
        const diff = Math.max(0, new Date(targetTime).getTime() - now);
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const hasMovements = (ataquesEnviados?.length ?? 0) > 0 || (ataquesRecebidos?.length ?? 0) > 0;

    if (!hasMovements) return null;

    return (
        <Card className="bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden mb-8 rounded-[1.5rem] shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
            <CardHeader className="py-4 bg-red-500/[0.03] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-red-500/80 flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                        <Zap className="animate-pulse" size={14} />
                    </div>
                    Monitor de Espaço Aéreo e Fronteira
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                    {/* ATAQUES RECEBIDOS (AMEAÇAS) */}
                    <AnimatePresence>
                        {ataquesRecebidos?.map(atk => (
                            <motion.div 
                                key={atk.id} 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-5 flex items-center justify-between bg-red-950/20 group/atk hover:bg-red-900/30 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                        <PlaneLanding className="text-red-500 animate-bounce" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-red-400 uppercase tracking-tight">Invasão Hostil Detetada</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] text-neutral-500 uppercase font-mono tracking-tighter">Vetor de Ataque: <span className="text-white">{atk.origem?.username}</span></span>
                                            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg font-mono text-lg font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                                        -{getTimeLeft(atk.chegada_em)}
                                    </div>
                                    <div className="text-[7px] text-neutral-600 font-black uppercase tracking-[0.2em]">Tempo até Impacto</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* ATAQUES ENVIADOS (OFENSIVAS) */}
                    <AnimatePresence>
                        {ataquesEnviados?.map(atk => (
                            <motion.div 
                                key={atk.id} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-5 flex items-center justify-between group/of hover:bg-white/[0.02] transition-all duration-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)] group-hover/of:border-sky-500/40 transition-colors">
                                        <PlaneTakeoff className="text-sky-500" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-tight group-hover/of:text-sky-400 transition-colors">Ofensiva em Curso</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] text-neutral-500 uppercase font-mono">Missão: {atk.tipo.replace(/_/g, ' ')} / Alvo: {atk.destino?.username}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="px-3 py-1 bg-sky-500/5 border border-sky-500/10 rounded-lg font-mono text-lg font-black text-sky-400 group-hover/of:border-sky-500/30 transition-all">
                                        {getTimeLeft(atk.chegada_em)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[7px] text-neutral-600 font-black uppercase tracking-[0.2em]">ETR_TIME</span>
                                        <ChevronRight size={8} className="text-sky-500 animate-slide-right" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
