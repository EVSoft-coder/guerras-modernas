import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Hammer, Shield, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';

interface QueueItemData {
    id: number;
    buildingType: 'construcao' | 'treino';
    label: string;
    sublabel: string;
    started_at: string;
    ends_at: string;
}

interface ProductionQueueProps {
    construcoes: any[];
    treinos: any[];
    gameConfig: any;
}

export const ProductionQueue: React.FC<ProductionQueueProps> = ({ 
    construcoes = [], 
    treinos = [], 
    gameConfig 
}) => {
    // PASSO 4 — DEBUG
    console.log('[PRODUCTION_QUEUE] Data:', { construcoes, treinos });
    // Unificar e ordenar as filas pelo tempo de conclusão
    const unifiedQueue: QueueItemData[] = [
        ...construcoes.map(c => ({
            id: c.id,
            buildingType: 'construcao' as const,
            label: (c.buildingType || c.type || 'Estrutura').replace(/_/g, ' '),
            sublabel: `Upgrade para Nível ${c.nivel_destino || c.target_level}`,
            started_at: c.created_at || c.started_at,
            ends_at: c.completado_em || c.finishes_at
        })),
        ...treinos.map(t => ({
            id: t.id,
            buildingType: 'treino' as const,
            label: t.unidade?.replace(/_/g, ' ') || 'Unidade',
            sublabel: `Recrutamento: ${t.quantidade}x`,
            started_at: t.created_at,
            ends_at: t.completado_em
        }))
    ].sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());

    return (
        <Card className="bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <CardHeader className="py-4 bg-white/[0.02] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-sky-500 animate-pulse" size={16} />
                        Comandos em Execução
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 space-y-6">
                <AnimatePresence mode="popLayout">
                    {unifiedQueue.length > 0 ? (
                        unifiedQueue.map((item, index) => (
                            <QueueItem key={`${item.buildingType}-${item.id}`} item={item} isFirst={index === 0} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
                        >
                            <Hammer className="mx-auto text-neutral-800 mb-3 opacity-20" size={32} />
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em] block">
                                Sistemas em Espera
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const QueueItem = ({ item, isFirst }: { item: QueueItemData, isFirst: boolean }) => {
    const lastReloadTime = React.useRef(0);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");

    const checkAndReload = () => {
        const now = Date.now();
        // Throttle: No more than 1 reload every 5 seconds
        if (now - lastReloadTime.current < 5000) return;
        
        lastReloadTime.current = now;
        router.reload();
    };

    useEffect(() => {
        const calculateProgress = () => {
            const start = new Date(item.started_at).getTime();
            const end = new Date(item.ends_at).getTime();
            const now = new Date().getTime();

            const total = end - start;
            const elapsed = now - start;
            const remaining = end - now;

            const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
            setProgress(percent);

            if (remaining > 0) {
                const h = Math.floor(remaining / 3600000);
                const m = Math.floor((remaining % 3600000) / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                
                if (h > 0) {
                    setTimeLeft(`${h}h ${m}m`);
                } else {
                    setTimeLeft(`${m}m ${s}s`);
                }
            } else {
                setTimeLeft("CONCLUÍDO");
                if (isFirst) {
                    // Refresh automático do DASHBOARD quando o primeiro item da fila termina
                    setTimeout(() => {
                        checkAndReload();
                    }, 500);
                }
            }
        };

        const timer = setInterval(calculateProgress, 1000);
        calculateProgress();

        return () => clearInterval(timer);
    }, [item.id, item.ends_at, isFirst]);

    return (
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`group relative ${!isFirst ? 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500' : ''}`}
        >
            <div className="flex justify-between items-end mb-2 px-1">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-white tracking-tighter">
                            {item.label}
                        </span>
                    </div>
                    <span className="text-[8px] text-neutral-500 font-bold uppercase pl-3.5 tracking-wider">{item.sublabel}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-mono font-black flex items-center gap-1.5 ${isFirst ? 'text-white' : 'text-neutral-500'}`}>
                        {isFirst && <div className="size-1 bg-red-500 rounded-full animate-ping"></div>}
                        {timeLeft}
                    </span>
                </div>
            </div>

            <div className="relative h-1 bg-neutral-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                <motion.div 
                    className={`absolute inset-y-0 left-0 ${
                        item.buildingType === 'construcao' ? 'bg-gradient-to-r from-orange-600 to-orange-400' : 'bg-gradient-to-r from-sky-600 to-sky-400'
                    } shadow-[0_0_10px_rgba(14,165,233,0.3)]`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 1.5 }}
                />
            </div>
            
            {isFirst && (
                <div className="absolute -inset-x-2 -inset-y-3 bg-white/[0.02] rounded-xl -z-10 group-hover:bg-white/[0.04] transition-colors"></div>
            )}
        </motion.div>
    );
};
