import React from 'react';
import { useGameEntities } from '@/hooks/use-game-entities';
import { motion } from 'framer-motion';
import { Target, Clock, ArrowRightLeft } from 'lucide-react';

export const ActiveMovements: React.FC = () => {
    const { entities } = useGameEntities() || { entities: [] };
    const movements = entities.filter(e => e.march);

    if (movements.length === 0) return null;

    return (
        <div className="pointer-events-auto space-y-3 mt-4">
            <div className="flex items-center gap-2 px-2">
                <Target size={12} className="text-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">ACTIVE_MOVEMENTS</span>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-3xl shadow-2xl space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {movements.map(m => (
                    <div key={m.id} className="bg-neutral-900/40 border border-white/5 p-3 rounded-2xl space-y-2 group transition-all hover:border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-white uppercase truncate w-32 tracking-tighter">
                                {m.status === 'returning' ? 'RETREAT_PROTOCOL' : 'STRIKE_COMMAND'}
                            </span>
                            <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${m.status === 'returning' ? 'bg-sky-500/20 text-sky-400' : 'bg-red-500/20 text-red-500'}`}>
                                {m.status?.toUpperCase() || 'TRANSIT'}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-neutral-500">
                             <ArrowRightLeft size={10} className="group-hover:text-white transition-colors" />
                             <span className="text-[9px] font-mono tracking-tighter">GPS: {m.march?.target.x}:{m.march?.target.y}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 text-neutral-400">
                                <Clock size={10} />
                                <span className="text-[10px] font-mono font-bold tracking-widest text-white">
                                    {Math.max(0, Math.floor(m.march?.remainingTime || 0))}s
                                </span>
                            </div>
                            
                            {/* Visual Transit Progress */}
                             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${m.status === 'returning' ? 'bg-sky-500' : 'bg-red-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (1 - (m.march?.remainingTime / m.march?.totalTime)) * 100)}%` }}
                                    transition={{ ease: "linear" }}
                                />
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
