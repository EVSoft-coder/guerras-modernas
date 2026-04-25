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
        <Card className="tactical-glass overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] rounded-[2.5rem] relative group border-t-sky-500/30">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
            
            <CardHeader className="py-5 bg-white/[0.01] border-b border-white/5">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="text-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]" size={18} />
                        Diretoria_Logística
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-6 space-y-4 relative">
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]"
                        >
                            <Hammer className="mx-auto text-neutral-800 mb-4 opacity-20" size={40} />
                            <span className="text-[11px] uppercase font-black text-neutral-700 tracking-[0.4em] block">
                                Inatividade_Operacional
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
    const [hasTriggeredReload, setHasTriggeredReload] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().getTime()), 1000);
        return () => clearInterval(timer);
    }, []);


    const calculateProgress = () => {
        if (!isFirst || !item.ends_at) {
            const h = Math.floor(item.duration / 3600);
            const m = Math.floor((item.duration % 3600) / 60);
            const s = item.duration % 60;
            return { percent: 0, timeStr: `Pendente (${h > 0 ? h + 'h ' : ''}${m}m ${s}s)` };
        }

        const start = new Date(item.started_at).getTime();
        const end = new Date(item.ends_at).getTime();
        const now = currentTime;

        const total = end - start;
        const remaining = end - now;

        const h = Math.max(0, Math.floor(remaining / 3600000));
        const m = Math.max(0, Math.floor((remaining % 3600000) / 60000));
        const s = Math.max(0, Math.floor((remaining % 60000) / 1000));
        
        const timeStr = remaining <= 0 ? 'Protocolo Final' : (h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
        const percent = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));

        return { percent, timeStr };
    };

    const { percent, timeStr } = calculateProgress();

    // AUTO-RELOAD TRIGGER (V2.1)
    useEffect(() => {
        if (!isFirst || !item.ends_at || hasTriggeredReload) return;

        const end = new Date(item.ends_at).getTime();
        const now = currentTime;
        const remaining = end - now;

        if (remaining <= 0) {
            setHasTriggeredReload(true);
            setTimeout(() => {
                router.reload({ 
                    only: ['state', 'base', 'resources', 'buildings', 'buildingQueue', 'unitQueue'],
                    onSuccess: () => setHasTriggeredReload(false)
                });
            }, 1500);
        }
    }, [currentTime, isFirst, item.ends_at, hasTriggeredReload]);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            className={`group relative p-4 rounded-2xl transition-all duration-500 border overflow-hidden ${
                isFirst ? 'bg-white/[0.04] border-white/10 shadow-xl' : 'bg-black/20 border-white/5 opacity-40 hover:opacity-100'
            }`}
        >
            {isFirst && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />}
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className={`size-9 rounded-xl flex items-center justify-center border font-mono ${isFirst ? 'bg-sky-500/20 border-sky-500/30 text-sky-400' : 'bg-black/40 border-white/5 text-neutral-600'}`}>
                         <span className="text-[11px] font-black">{item.position}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase text-white tracking-widest flex items-center gap-3">
                             {item.buildingType === 'construcao' ? <Hammer size={12} className="text-sky-400" /> : <Shield size={12} className="text-emerald-400" />}
                            {item.label}
                            {isFirst && <div className="size-1.5 bg-sky-500 rounded-full animate-ping"></div>}
                        </span>
                        <span className="text-[8px] text-neutral-500 font-black uppercase tracking-[0.2em] mt-0.5">{item.sublabel}</span>
                    </div>
                </div>

                {/* CONTROLOS TÁCTICOS */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {!isFirst && (
                        <button 
                            onClick={onMoveUp}
                            className="p-1.5 bg-white/5 hover:bg-sky-500/20 rounded-lg text-neutral-500 hover:text-sky-400 transition-all border border-transparent hover:border-sky-500/20"
                        >
                            <ChevronUp size={14} />
                        </button>
                    )}
                    {!isLast && (
                        <button 
                            onClick={onMoveDown}
                            className="p-1.5 bg-white/5 hover:bg-sky-500/20 rounded-lg text-neutral-500 hover:text-sky-400 transition-all border border-transparent hover:border-sky-500/20"
                        >
                            <ChevronDown size={14} />
                        </button>
                    )}
                    <button 
                        onClick={onCancel}
                        className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-neutral-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em]">
                        Status: <span className={isFirst ? 'text-sky-400/60' : ''}>{item.buildingType === 'construcao' ? 'Engenharia' : 'Logística'}</span>
                    </span>
                    <span className={`text-xs font-black font-military-mono tracking-tighter ${isFirst ? 'text-sky-400' : 'text-neutral-700'}`}>
                        {timeStr}
                    </span>
                </div>
                
                <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                        className={`absolute inset-y-0 left-0 ${
                            isFirst ? (item.buildingType === 'construcao' ? 'bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]') : 'bg-neutral-800'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5 }}
                    />
                    {isFirst && <div className="absolute inset-0 bg-white/[0.05] scanline-effect" />}
                </div>
            </div>
        </motion.div>
    );
};
