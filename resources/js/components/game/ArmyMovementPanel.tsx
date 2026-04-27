import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaneTakeoff, PlaneLanding, Clock, Target, ShieldAlert, Zap, ChevronRight, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArmyMovementPanelProps {
    ataquesEnviados: any[];
    ataquesRecebidos: any[];
    gameConfig: any;
}

export const ArmyMovementPanel: React.FC<ArmyMovementPanelProps & { radarLevel?: number }> = ({ 
    ataquesEnviados, ataquesRecebidos, gameConfig, radarLevel = 0
}) => {
    const [now, setNow] = useState(Date.now());
    const [lastKnownAttackIds, setLastKnownAttackIds] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // AUTO-REFRESH ENGINE (FASE 14)
    // Quando qualquer movimento atinge 0, forçar um reload para processar no backend
    useEffect(() => {
        const allMovements = [...(ataquesEnviados || []), ...(ataquesRecebidos || [])];
        const hasOverdue = allMovements.some(m => new Date(m.arrival_time).getTime() <= now);
        
        // Se temos movimentos "no passado" que ainda estão como 'moving', precisamos de refresh
        if (hasOverdue) {
            const timer = setTimeout(() => {
                router.reload({ only: ['base', 'resources', 'ataquesEnviados', 'ataquesRecebidos', 'buildings', 'units'] });
            }, 1000); // Pequeno delay para garantir que o backend vê o tempo como passado
            return () => clearTimeout(timer);
        }
    }, [now, ataquesEnviados, ataquesRecebidos]);

    // ALERTA SONORO DE RADAR (FASE 12)
    useEffect(() => {
        // Apenas alertar para movimentos HOSTIS (attack)
        const hostileIncoming = (ataquesRecebidos || []).filter(a => a.type === 'attack');
        const currentIds = hostileIncoming.map(a => a.id);
        const hasNewAttack = currentIds.some(id => !lastKnownAttackIds.includes(id));

        if (hasNewAttack && lastKnownAttackIds.length > 0) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('SISTEMA: Áudio bloqueado pelo browser até interação.', e));
        }

        setLastKnownAttackIds(currentIds);
    }, [ataquesRecebidos]);

    const getTimeLeft = (targetTime: string) => {
        const diff = Math.max(0, new Date(targetTime).getTime() - now);
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // FILTRAGEM POR RADAR (FASE 12)
    // Sem radar: Só detecta ataques a < 5 minutos. Movimentos amigáveis sempre visíveis.
    const incomingMovements = (ataquesRecebidos || []).filter(atk => {
        const isFriendly = atk.type === 'return' || atk.type === 'support' || atk.type === 'transporte';
        if (isFriendly) return true;
        if (radarLevel >= 1) return true;
        
        const diff = new Date(atk.arrival_time).getTime() - now;
        return diff < 300000; // 5 minutos para hostis sem radar
    });

    const hostileIncoming = incomingMovements.filter(m => m.type === 'attack' || m.type === 'espionagem');
    const hasMovements = (ataquesEnviados?.length ?? 0) > 0 || (incomingMovements?.length ?? 0) > 0;

    if (!hasMovements) return null;

    return (
        <div className="tactical-glass border-white/5 backdrop-blur-3xl overflow-hidden mb-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group border">
            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${hostileIncoming.length > 0 ? 'via-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'via-cyan-500/50'} to-transparent`}></div>
            
            <div className="px-6 py-4 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${hostileIncoming.length > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                        <Sword className={hostileIncoming.length > 0 ? 'text-red-500 animate-pulse' : 'text-cyan-500'} size={18} />
                    </div>
                    <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500 font-military-mono">
                        Telemetria_Espaço_Aéreo
                    </h3>
                </div>
                {hostileIncoming.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full animate-pulse">
                        <ShieldAlert size={12} className="text-red-500" />
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Alerta_Invasão</span>
                    </div>
                )}
            </div>

            <div className="divide-y divide-white/[0.02]">
                {/* MOVIMENTOS RECEBIDOS (AMEAÇAS E REGRESSOS) */}
                <AnimatePresence>
                    {incomingMovements?.map(movement => {
                        const isHostile = movement.type === 'attack' || movement.type === 'espionagem';
                        const isReturn = movement.type === 'return';
                        
                        return (
                            <motion.div 
                                key={movement.id} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-6 flex items-center justify-between group/atk transition-all duration-700 relative overflow-hidden ${isHostile ? 'bg-red-500/[0.03] hover:bg-red-500/[0.06]' : 'hover:bg-white/[0.02]'}`}
                            >
                                <div className="absolute inset-0 scanline-effect opacity-[0.05]" />
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className={`size-12 rounded-2xl border flex items-center justify-center transition-all duration-700 ${isHostile ? 'bg-red-500/20 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/10 border-white/5 group-hover/atk:border-emerald-500/30'}`}>
                                        {isReturn ? (
                                            <PlaneLanding className="text-emerald-500" size={24} />
                                        ) : (
                                            <PlaneLanding className={isHostile ? 'text-red-500 animate-bounce' : 'text-white'} size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            {isHostile ? 'Vetor_Hostil' : isReturn ? 'Regresso_de_Tropas' : 'Movimento_Recebido'} 
                                            <span className={`${isHostile ? 'text-red-500' : 'text-neutral-500'} font-military-mono`}>
                                                #{(movement.origin?.id || '???').toString().padStart(4, '0')}
                                            </span>
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">
                                                Origem: <span className={`${isHostile ? 'text-white bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'} px-2 py-0.5 rounded border ml-1`}>
                                                    {movement.origin?.jogador?.username || (isHostile ? 'INSURGENTES' : 'LOGÍSTICA')}
                                                </span>
                                            </span>
                                            {isHostile && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 relative z-10">
                                    <div className={`font-military-mono text-3xl font-black tracking-tighter ${isHostile ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-white group-hover/atk:text-emerald-400'}`}>
                                        {isHostile ? '-' : ''}{getTimeLeft(movement.arrival_time)}
                                    </div>
                                    <div className={`text-[8px] font-black uppercase tracking-[0.3em] ${isHostile ? 'text-red-500/40' : 'text-neutral-600'}`}>
                                        {isHostile ? 'Impact_Countdown' : 'Arrival_ETA'}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* MOVIMENTOS ENVIADOS */}
                <AnimatePresence>
                    {ataquesEnviados?.map(movement => (
                        <motion.div 
                            key={movement.id} 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 flex items-center justify-between group/of hover:bg-white/[0.02] transition-all duration-700 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="size-12 rounded-2xl bg-cyan-500/10 border border-white/5 flex items-center justify-center group-hover/of:border-cyan-500/30 transition-all duration-700">
                                    <PlaneTakeoff className="text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-black text-white uppercase tracking-widest group-hover/of:text-cyan-400 transition-colors duration-500">
                                        Ofensiva_Ativa <span className="text-neutral-600 font-military-mono ml-2">[{movement.type.toUpperCase()}]</span>
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">
                                            Alvo: <span className="text-cyan-400 font-military-mono ml-1">{movement.target?.jogador?.username || movement.target?.nome || 'SETOR_X'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 relative z-10">
                                <div className="font-military-mono text-3xl font-black text-white group-hover:text-cyan-400 transition-colors duration-500 tracking-tighter shadow-cyan-500/20">
                                    {getTimeLeft(movement.arrival_time)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] text-neutral-600 font-black uppercase tracking-[0.3em]">Time_To_Target</span>
                                    <ChevronRight size={10} className="text-cyan-500 animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
