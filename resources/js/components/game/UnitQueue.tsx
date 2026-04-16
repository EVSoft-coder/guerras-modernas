import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, Zap, ChevronRight, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UnitQueueItem {
    id: number;
    unit_type_id: number;
    unitType: {
        name: string;
    };
    quantity: number;
    started_at: string;
    finishes_at: string;
}

interface UnitQueueProps {
    queue: UnitQueueItem[];
}

export const UnitQueue: React.FC<UnitQueueProps> = ({ queue = [] }) => {
    return (
        <Card className="bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative">
            <CardHeader className="py-4 bg-white/[0.02] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2">
                    <Shield className="text-emerald-500 animate-pulse" size={16} />
                    Mobilização de Tropas
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 space-y-4">
                <AnimatePresence mode="popLayout">
                    {queue.length > 0 ? (
                        queue.map((item, index) => (
                            <QueueEntry key={item.id} item={item} isFirst={index === 0} />
                        ))
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-widest">Quartel em Espera</span>
                        </div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const QueueEntry = ({ item, isFirst }: { item: UnitQueueItem, isFirst: boolean }) => {
    const calculateProgress = () => {
        const start = new Date(item.started_at).getTime();
        const end = new Date(item.finishes_at).getTime();
        const now = new Date().getTime();

        const total = end - start;
        const elapsed = now - start;
        const remaining = end - now;

        if (remaining <= 0) return null;

        const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
        
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        
        const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;

        return { percent, timeStr };
    };

    const result = calculateProgress();
    if (!result) return null;
    const { percent, timeStr } = result;

    return (
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`relative p-3 rounded-xl border border-white/5 bg-white/[0.01] ${!isFirst ? 'opacity-40' : ''}`}
        >
            <div className="flex justify-between items-center mb-2">
                <div>
                    <span className="text-xs font-black text-white uppercase">{item.unitType?.name}</span>
                    <span className="text-[8px] text-neutral-500 ml-2 font-bold uppercase">x{item.quantity} Unidades</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-emerald-400">
                    {isFirst && <div className="size-1 bg-emerald-500 rounded-full animate-ping" />}
                    {timeStr}
                </div>
            </div>
            
            <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 1.5 }}
                />
            </div>
        </motion.div>
    );
};

export default UnitQueue;
