import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, Zap, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UnitQueueItem {
    id: number;
    unit_type_id: number;
    unitType?: {
        name: string;
    };
    quantity: number;
    started_at: string;
    finishes_at: string;
    position: number;
}

interface UnitQueueProps {
    queue: UnitQueueItem[];
}

/**
 * UnitQueue — INTERFACE TÁTICA DETERMINÍSTICA
 * Usa apenas props do backend com ticker de tempo local para contagem decrescente.
 */
export const UnitQueue: React.FC<UnitQueueProps> = ({ queue = [] }) => {
    const [now, setNow] = useState(Date.now());

    // MOTOR DE TEMPO LOCAL (V19.6)
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Ordenar por posição para garantir sequência visual
    const sortedQueue = [...queue].sort((a, b) => a.position - b.position);

    return (
        <Card className="bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative">
            <CardHeader className="py-4 bg-white/[0.02] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2">
                    <Shield className="text-emerald-500 animate-pulse" size={16} />
                    Linha de Mobilização
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 space-y-3">
                <AnimatePresence mode="popLayout">
                    {sortedQueue.length > 0 ? (
                        sortedQueue.map((item) => (
                            <QueueEntry 
                                key={item.id} 
                                item={item} 
                                now={now} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-[0.4em]">Quartel em Espera</span>
                        </div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const QueueEntry = ({ item, now }: { item: UnitQueueItem, now: number }) => {
    const [hasTriggeredReload, setHasTriggeredReload] = React.useState(false);

    const start = new Date(item.started_at).getTime();
    const end = new Date(item.finishes_at).getTime();

    
    const total = end - start;
    const elapsed = now - start;
    const remainingMs = end - now;

    // Se já terminou mas ainda está na prop (aguardando refresh ou processamento do servidor)
    const isFinished = remainingMs <= 0;
    const percent = isFinished ? 100 : Math.min(100, Math.max(0, (elapsed / total) * 100));

    // Formatação de tempo (Determinístico)
    const seconds = Math.max(0, Math.floor(remainingMs / 1000));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const timeStr = h > 0 ? `${h}h ${m}m ${s}s` : (m > 0 ? `${m}m ${s}s` : `${s}s`);

    const unitName = item.unitType?.name || 'Unidade Desconhecida';

    // AUTO-RELOAD TRIGGER (V2.1)
    useEffect(() => {
        if (item.position !== 1 || hasTriggeredReload) return;
        if (isFinished) {
            setHasTriggeredReload(true);
            setTimeout(() => {
                router.reload({ 
                    only: ['state', 'base', 'resources', 'units', 'unitQueue'],
                    onSuccess: () => setHasTriggeredReload(false)
                });
            }, 1500);
        }
    }, [isFinished, item.position, hasTriggeredReload]);

    return (
        <motion.div 
            layout
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className={`
                relative p-4 rounded-[1.2rem] border transition-all duration-500
                ${item.position === 1 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.01] border-white/5 opacity-60'}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">{unitName}</span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Lote: x{item.quantity}</span>
                </div>
                
                {item.position !== 1 && (
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Aguardando ({h}m {s}s)</span>
                    </div>
                )}
                {item.position === 1 && !isFinished ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Clock className="text-emerald-500 animate-[spin_4s_linear_infinite]" size={12} />
                        <span className="text-[10px] font-mono font-black text-emerald-400">{timeStr}</span>
                    </div>
                ) : (
                    <div className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                        {isFinished ? 'Concluído' : `Posição #${item.position}`}
                    </div>
                )}
            </div>

            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                    className={`h-full ${item.position === 1 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-neutral-800'}`}
                    animate={{ width: `${percent}%` }}
                    transition={{ type: "tween", ease: "linear", duration: 1 }}
                />
            </div>
            
            {item.position === 1 && (
                <div className="absolute top-2 right-2 opacity-5">
                    <Target size={40} className="animate-pulse" />
                </div>
            )}
        </motion.div>
    );
};

export default UnitQueue;
