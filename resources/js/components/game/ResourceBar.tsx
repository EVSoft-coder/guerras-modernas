import React, { useState, useEffect } from 'react';
import { Shield, Fuel, Boxes, Zap, Triangle, Package, Layers, Target, Info, Users } from 'lucide-react';
import { Recurso } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ResourceBarProps {
    recursos: Recurso;
    taxasPerSecond: Record<string, number>;
    populacao?: any;
}

/**
 * Item Individual de Recurso (Tactical Command Edition)
 */
const ResourceItem = ({ label, value, icon, max, color, ratePerSecond, customValue }: any) => {
    const [simulatedValue, setSimulatedValue] = useState(value);
    
    useEffect(() => {
        setSimulatedValue(value);
    }, [value]);

    useEffect(() => {
        if (!ratePerSecond || ratePerSecond === 0) return;
        
        // Tick Suave de 250ms (Otimizado para performance)
        const tickIncrement = ratePerSecond / 4;
        const interval = setInterval(() => {
            setSimulatedValue((prevValue: number) => {
                const nextValue = prevValue + tickIncrement;
                return nextValue >= max ? max : nextValue;
            });
        }, 250);

        return () => clearInterval(interval);
    }, [ratePerSecond, max]);

    const percentage = Math.min(100, (simulatedValue / max) * 100);
    const isCritical = percentage > 90;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="flex-1 min-w-[140px] h-16 relative group"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl rounded-2xl border border-white/5 group-hover:border-white/10 transition-all overflow-hidden">
                {/* Dynamic Background Glow */}
                <div className={`absolute -inset-1 bg-${color}-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity`} />
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 3px' }} />
                
                <div className="relative h-full p-2.5 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-black/60 border border-white/5 text-${color}-400 group-hover:scale-110 transition-transform shadow-lg`}>
                                {React.cloneElement(icon, { size: 12 })}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-neutral-400 transition-colors">
                                    {label}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-black text-white text-military-mono tracking-tighter leading-none">
                                        {customValue || Math.floor(simulatedValue).toLocaleString()}
                                    </span>
                                    {!customValue && (
                                        <span className="text-[9px] text-neutral-600 font-bold leading-none">/ {max.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {ratePerSecond !== 0 && (
                            <div className={`text-[10px] font-military-mono font-black px-2 py-1.5 rounded-xl bg-black/60 border shadow-[0_0_20px_rgba(0,0,0,0.8)] ${ratePerSecond > 0 ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
                                {ratePerSecond > 0 ? '+' : ''}{Math.floor(Math.abs(ratePerSecond * 60)).toLocaleString()}/m
                            </div>
                        )}
                    </div>

                    {/* Tactical Progress Bar */}
                    <div className="relative w-full h-1 bg-black/60 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                            className={`absolute inset-y-0 left-0 ${isCritical ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : `bg-${color}-500 shadow-[0_0_8px_rgba(var(--${color}-500),0.3)]`}`}
                        />
                    </div>
                </div>
            </div>
            
            {/* Status Indicators */}
            {isCritical && (
                <div className="absolute -top-1 -right-1 flex">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export function ResourceBar({ recursos, taxasPerSecond, populacao }: ResourceBarProps) {
    if (!recursos) return null;

    const items = [
        { label: 'Suprimentos', value: recursos.suprimentos, max: recursos.suprimentos_max || 10000, color: 'sky', icon: <Package />, ratePerSecond: taxasPerSecond?.suprimentos || 0 },
        { label: 'Combustível', value: recursos.combustivel, max: recursos.combustivel_max || 10000, color: 'orange', icon: <Zap />, ratePerSecond: taxasPerSecond?.combustivel || 0 },
        { label: 'Metal', value: recursos.metal, max: recursos.metal_max || 10000, color: 'slate', icon: <Layers />, ratePerSecond: taxasPerSecond?.metal || 0 },
        { label: 'Munições', value: recursos.municoes, max: recursos.municoes_max || 10000, color: 'red', icon: <Target />, ratePerSecond: taxasPerSecond?.municoes || 0 },
        { label: 'Energia', value: recursos.energia, max: 1000, color: 'yellow', icon: <Zap />, ratePerSecond: taxasPerSecond?.energia || 0 },
        { 
            label: 'Guarnição', 
            value: recursos.pessoal, 
            max: populacao?.total || 1000, 
            color: 'emerald', 
            icon: <Users />, 
            ratePerSecond: 0,
            customValue: populacao ? `${Math.floor(populacao.used)} / ${populacao.total}` : null 
        },
    ];

    return (
        <div className="w-full h-20 bg-black/60 backdrop-blur-2xl border-b border-white/5 flex items-center px-4 gap-3 relative z-50 overflow-hidden">
            {/* Global Military Grid */}
            <div className="absolute inset-0 military-grid opacity-[0.03] pointer-events-none" />
            
            {/* Command Status */}
            <div className="hidden lg:flex flex-col items-start pr-6 border-r border-white/5 mr-2">
                <span className="text-[8px] font-black text-sky-500/60 uppercase tracking-[0.4em] mb-1">Command_Net</span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] font-military-mono text-white/70 font-black">ACTIVE_OPS</span>
                </div>
            </div>

            <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar py-2">
                {items.map((item) => (
                    <ResourceItem key={item.label} {...item} />
                ))}
            </div>
            
            {/* Action Tools */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/5">
                <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all text-neutral-500 hover:text-white group">
                    <Info size={16} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
    );
}
