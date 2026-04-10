import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Hammer, Shield, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';

interface QueueItemData {
    id: number;
    tipo: 'construcao' | 'treino';
    label: string;
    sublabel: string;
    started_at: string;
    ends_at: string;
}

interface ProductionQueueProps {
    construcoes: any[];
    treinos: any[];
}

export const ProductionQueue: React.FC<ProductionQueueProps> = ({ construcoes = [], treinos = [] }) => {
    // Unificar e ordenar as filas pelo tempo de conclusão
    const unifiedQueue: QueueItemData[] = [
        ...construcoes.map(c => ({
            id: c.id,
            tipo: 'construcao' as const,
            label: c.edificio_tipo?.replace(/_/g, ' ') || 'Estrutura',
            sublabel: `Upgrade para Nível ${c.nivel_destino}`,
            started_at: c.created_at,
            ends_at: c.completado_em
        })),
        ...treinos.map(t => ({
            id: t.id,
            tipo: 'treino' as const,
            label: t.unidade?.replace(/_/g, ' ') || 'Unidade',
            sublabel: `Recrutamento: ${t.quantidade}x`,
            started_at: t.created_at,
            ends_at: t.completado_em
        }))
    ].sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());

    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
            <CardHeader className="py-3 bg-white/5 border-b border-white/10">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-sky-500 animate-pulse" size={14} />
                        Fila de Produção Tática
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {unifiedQueue.length > 0 ? (
                        unifiedQueue.map((item, index) => (
                            <QueueItem key={`${item.tipo}-${item.id}`} item={item} isFirst={index === 0} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl"
                        >
                            <Hammer className="mx-auto text-neutral-800 mb-2" size={24} />
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-widest">
                                Sem Atividade de Engenharia ou Recrutamento
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const QueueItem = ({ item, isFirst }: { item: QueueItemData, isFirst: boolean }) => {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");

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
                        router.reload({ only: ['base', 'jogador'] });
                    }, 500);
                }
            }
        };

        const timer = setInterval(calculateProgress, 1000);
        calculateProgress();

        return () => clearInterval(timer);
    }, [item, isFirst]);

    return (
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`group relative ${!isFirst ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all' : ''}`}
        >
            <div className="flex justify-between items-end mb-1.5 px-1">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        {item.tipo === 'construcao' ? (
                            <Hammer size={10} className="text-orange-500" />
                        ) : (
                            <Shield size={10} className="text-sky-500" />
                        )}
                        <span className="text-[10px] font-black uppercase text-white tracking-tighter">
                            {item.label}
                        </span>
                    </div>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase pl-4">{item.sublabel}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-mono font-bold flex items-center gap-1 ${isFirst ? 'text-orange-500' : 'text-neutral-500'}`}>
                        {isFirst && <Clock className="animate-pulse" size={10} />}
                        {timeLeft}
                    </span>
                </div>
            </div>

            <div className="relative h-1.5 bg-black/60 rounded-full border border-white/5 overflow-hidden shadow-inner">
                <motion.div 
                    className={`absolute inset-y-0 left-0 transition-colors duration-500 ${
                        item.tipo === 'construcao' ? 'bg-gradient-to-r from-orange-600 to-orange-400' : 'bg-gradient-to-r from-sky-600 to-sky-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 1 }}
                >
                    {isFirst && (
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.4)_75%,transparent_75%,transparent)] bg-[length:40px_40px] animate-progress-stripes opacity-40"></div>
                    )}
                </motion.div>
            </div>
            
            {!isFirst && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                    <ChevronRight size={10} className="text-neutral-700" />
                </div>
            )}
        </motion.div>
    );
};
