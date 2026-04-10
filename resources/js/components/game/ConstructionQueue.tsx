import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Hammer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Construcao {
    id: number;
    edificio_tipo: string;
    nivel_destino: number;
    concluido_em: string;
    created_at: string;
}

interface ConstructionQueueProps {
    construcoes: Construcao[];
}

export const ConstructionQueue: React.FC<ConstructionQueueProps> = ({ construcoes }) => {
    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
            <CardHeader className="py-3 bg-white/5 border-b border-white/10">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                    <Activity className="text-sky-500 animate-pulse" size={14} />
                    Fila de Produção Tática
                </CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {construcoes.length > 0 ? (
                        construcoes.map((c) => (
                            <QueueItem key={c.id} construcao={c} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl"
                        >
                            <Hammer className="mx-auto text-neutral-800 mb-2" size={24} />
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-widest">
                                Sem Atividade de Engenharia
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const QueueItem = ({ construcao }: { construcao: Construcao }) => {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateProgress = () => {
            const start = new Date(construcao.created_at).getTime();
            const end = new Date(construcao.concluido_em).getTime();
            const now = new Date().getTime();

            const total = end - start;
            const elapsed = now - start;
            const remaining = end - now;

            const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
            setProgress(percent);

            if (remaining > 0) {
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("CONCLUINDO...");
            }
        };

        const timer = setInterval(calculateProgress, 1000);
        calculateProgress();

        return () => clearInterval(timer);
    }, [construcao]);

    return (
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="group"
        >
            <div className="flex justify-between items-end mb-1.5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white tracking-tighter">
                        {construcao.edificio_tipo.replace('_', ' ')}
                    </span>
                    <span className="text-[8px] text-sky-500 font-bold uppercase">Upgrade para Nível {construcao.nivel_destino}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono font-bold text-orange-500 flex items-center gap-1">
                        <Clock size={10} />
                        {timeLeft}
                    </span>
                </div>
            </div>

            <div className="relative h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden shadow-inner">
                <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-600 to-sky-400 group-hover:from-orange-500 group-hover:to-orange-400 transition-colors duration-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 1 }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-progress-stripes opacity-30"></div>
                </motion.div>
            </div>
        </motion.div>
    );
};
