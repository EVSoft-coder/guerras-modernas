import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Hammer, Shield, ChevronUp, ChevronDown, X, Loader2, Sword } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';

interface QueueItemData {
    id: number;
    buildingType: 'construcao' | 'treino';
    label: string;
    sublabel: string;
    started_at?: string;
    ends_at?: string;
    duration: number;
    position: number;
    status: string;
    quantity?: number;
    quantity_remaining?: number;
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
    
    const unifiedQueue: QueueItemData[] = [
        ...construcoes.map(c => ({
            id: c.id,
            buildingType: 'construcao' as const,
            label: (c.buildingType || c.type || 'Estrutura').replace(/_/g, ' '),
            sublabel: `Upgrade para Nível ${c.target_level}`,
            started_at: c.started_at,
            ends_at: c.finishes_at,
            duration: c.duration || 0,
            position: c.position || 1,
            status: c.status || 'active'
        })),
        ...treinos.map(t => ({
            id: t.id,
            buildingType: 'treino' as const,
            label: (t.unitType?.name || t.unidade || 'Unidade').replace(/_/g, ' '),
            sublabel: `Recrutamento: ${t.quantity_remaining || t.quantity || t.quantidade}x`,
            started_at: t.started_at,
            ends_at: t.finishes_at,
            duration: t.duration_per_unit || (t.total_duration / t.quantity) || 0,
            position: t.position || 1,
            status: t.status || 'active',
            quantity: t.quantity,
            quantity_remaining: t.quantity_remaining
        }))
    ].sort((a, b) => a.position - b.position);

    const handleCancel = (id: number, type: string) => {
        if (type === 'construcao') {
            router.post(`/base/upgrade/cancelar/${id}`);
        } else {
            router.post(`/units/cancelar/${id}`);
        }
    };

    const handleMoveUp = (id: number, type: string) => {
        if (type === 'construcao') {
            router.post(`/base/upgrade/subir/${id}`);
        } else {
            router.post(`/units/subir/${id}`);
        }
    };

    const handleMoveDown = (id: number, type: string) => {
        if (type === 'construcao') {
            router.post(`/base/upgrade/descer/${id}`);
        } else {
            router.post(`/units/descer/${id}`);
        }
    };

    return (
        <Card className="bg-black/40 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group border-t-sky-500/30 border-t-2">
            <CardHeader className="py-4 bg-white/[0.02] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-sky-500 animate-pulse" size={16} />
                        Centro de Logística de Fila
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 space-y-4">
                <AnimatePresence mode="popLayout">
                    {unifiedQueue.length > 0 ? (
                        unifiedQueue.map((item, index) => (
                            <QueueItem 
                                key={`${item.buildingType}-${item.id}`} 
                                item={item} 
                                isFirst={item.position === 1} 
                                onCancel={() => handleCancel(item.id, item.buildingType)}
                                onMoveUp={() => handleMoveUp(item.id, item.buildingType)}
                                onMoveDown={() => handleMoveDown(item.id, item.buildingType)}
                                isLast={index === unifiedQueue.length - 1}
                            />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
                        >
                            <Hammer className="mx-auto text-neutral-800 mb-3 opacity-20" size={32} />
                            <span className="text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em] block">
                                Sem Operações de Engenharia ou Mobilização
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const QueueItem = ({ item, isFirst, onCancel, onMoveUp, onMoveDown, isLast }: any) => {
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().getTime()), 1000);
        return () => clearInterval(timer);
    }, []);

    const calculateProgress = () => {
        if (!isFirst || !item.ends_at) {
            const h = Math.floor(item.duration / 3600);
            const m = Math.floor((item.duration % 3600) / 60);
            const s = item.duration % 60;
            return { percent: 0, timeStr: `Aguardadndo (${h > 0 ? h + 'h ' : ''}${m}m ${s}s)` };
        }

        const start = new Date(item.started_at).getTime();
        const end = new Date(item.ends_at).getTime();
        const now = currentTime;

        const total = end - start;
        const remaining = end - now;

        const h = Math.max(0, Math.floor(remaining / 3600000));
        const m = Math.max(0, Math.floor((remaining % 3600000) / 60000));
        const s = Math.max(0, Math.floor((remaining % 60000) / 1000));
        
        const timeStr = remaining <= 0 ? 'Concluíndo...' : (h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
        
        // No caso de treino, o progresso é da UNIDADE ATUAL
        const percent = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));

        return { percent, timeStr };
    };

    const { percent, timeStr } = calculateProgress();

    return (
        <motion.div 
            layout
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`group relative p-4 rounded-xl transition-all duration-300 ${
                isFirst ? 'bg-white/[0.05] border border-white/10' : 'bg-black/20 border border-white/5 opacity-60 hover:opacity-100'
            }`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg flex items-center justify-center ${isFirst ? 'bg-sky-500/20 text-sky-400' : 'bg-neutral-800 text-neutral-500'}`}>
                         <span className="text-[10px] font-black">{item.position}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-white tracking-tighter flex items-center gap-2">
                             {item.buildingType === 'construcao' ? <Hammer size={10} /> : <Shield size={10} className="text-emerald-400" />}
                            {item.label}
                            {isFirst && <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>}
                        </span>
                        <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">{item.sublabel}</span>
                    </div>
                </div>

                {/* CONTROLOS TÁCTICOS */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isFirst && (
                        <button 
                            onClick={onMoveUp}
                            className="p-1.5 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white transition-colors"
                            title="Subir Prioridade"
                        >
                            <ChevronUp size={14} />
                        </button>
                    )}
                    {!isLast && (
                        <button 
                            onClick={onMoveDown}
                            className="p-1.5 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white transition-colors"
                            title="Descer Prioridade"
                        >
                            <ChevronDown size={14} />
                        </button>
                    )}
                    <button 
                        onClick={onCancel}
                        className="p-1.5 hover:bg-red-500/20 rounded-md text-neutral-500 hover:text-red-500 transition-colors"
                        title="Abortar Projeto"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">
                        {item.buildingType === 'construcao' ? 'Engenharia' : 'Mobilização'}
                    </span>
                    <span className={`text-[10px] font-mono font-black ${isFirst ? 'text-sky-400' : 'text-neutral-600'}`}>
                        {timeStr}
                    </span>
                </div>
                
                <div className="relative h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        className={`absolute inset-y-0 left-0 ${
                            isFirst ? (item.buildingType === 'construcao' ? 'bg-sky-500 shadow-[0_0_10px_#0ea5e9]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]') : 'bg-neutral-800'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};
