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
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm overflow-hidden mb-6">
            <CardHeader className="py-3 bg-red-500/10 border-b border-red-500/10">
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-red-400 flex items-center gap-2">
                    <Zap className="animate-pulse" size={14} />
                    Monitor de Movimentações Militares
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                    {/* ATAQUES RECEBIDOS (AMEAÇAS) */}
                    {ataquesRecebidos?.map(atk => (
                        <div key={atk.id} className="p-4 flex items-center justify-between bg-red-950/20 group hover:bg-red-900/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                                    <PlaneLanding className="text-red-500" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-red-400 uppercase tracking-tighter">Invasão Hostil Detetada</h4>
                                    <p className="text-[9px] text-neutral-500 uppercase font-mono">Destino: Base Principal</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-red-500 font-mono text-sm font-black">
                                    <Clock size={14} />
                                    {getTimeLeft(atk.chegada_em)}
                                </div>
                                <div className="flex gap-1">
                                    {Object.entries(atk.tropas || {}).map(([u, q]: any) => q > 0 && (
                                        <div key={u} className="w-1 h-1 bg-red-500/50 rounded-full" title={`${q}x ${u}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* ATAQUES ENVIADOS (OFENSIVAS) */}
                    {ataquesEnviados?.map(atk => (
                        <div key={atk.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-sky-500/20 rounded-lg border border-sky-500/30">
                                    <PlaneTakeoff className="text-sky-500" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-tighter">Ofensiva em Curso</h4>
                                    <p className="text-[9px] text-neutral-500 uppercase font-mono">Tipo: {atk.tipo.toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-sky-400 font-mono text-sm font-black">
                                    <Clock size={14} />
                                    {getTimeLeft(atk.chegada_em)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest">Aproximação</span>
                                    <ChevronRight size={10} className="text-sky-500 animate-slide-right" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
