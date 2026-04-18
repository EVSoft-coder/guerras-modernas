import React, { useState, useEffect } from 'react';
import { Shield, Fuel, Rocket, Users, Boxes, Zap, Triangle } from 'lucide-react';
import { Recurso } from '@/types';
import { motion, animate } from 'framer-motion';

interface ResourceBarProps {
    recursos: Recurso;
    taxasPerSecond: Record<string, number>;
}

export const ResourceBar: React.FC<ResourceBarProps & { populacao?: any }> = ({ recursos, taxasPerSecond, populacao }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 w-full z-20 px-2">
            <ResourceItem 
                icon={<Shield className="text-sky-400" size={20} />} 
                label="Suprimentos" 
                value={recursos?.suprimentos ?? 0} 
                rate={taxasPerSecond?.suprimentos ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-sky-500"
                glowColor="shadow-sky-500/40"
            />
            <ResourceItem 
                icon={<Fuel className="text-orange-400" size={20} />} 
                label="Combustível" 
                value={recursos?.combustivel ?? 0} 
                rate={taxasPerSecond?.combustivel ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-orange-500"
                glowColor="shadow-orange-500/40"
            />
            <ResourceItem 
                icon={<Boxes className="text-zinc-400" size={20} />} 
                label="Metal" 
                value={recursos?.metal ?? 0} 
                rate={taxasPerSecond?.metal ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-zinc-500"
                glowColor="shadow-zinc-500/40"
            />
            <ResourceItem 
                icon={<Rocket className="text-red-400" size={20} />} 
                label="Munições" 
                value={recursos?.municoes ?? 0} 
                rate={taxasPerSecond?.municoes ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-red-500"
                glowColor="shadow-red-500/40"
            />
            <ResourceItem 
                icon={<Zap className="text-yellow-400" size={20} />} 
                label="Energia" 
                value={recursos?.energia ?? 0} 
                rate={taxasPerSecond?.energia ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-yellow-500"
                glowColor="shadow-yellow-500/40"
            />
            <ResourceItem 
                icon={<Users className="text-emerald-400" size={20} />} 
                label="Guarnição" 
                value={recursos?.pessoal ?? 0} 
                customValue={populacao ? `${Math.floor(populacao.used)} / ${populacao.total}` : null}
                rate={taxasPerSecond?.pessoal ?? 0}
                cap={populacao?.total ?? recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-emerald-500"
                glowColor="shadow-emerald-500/40"
            />
        </div>
    );
};

interface ResourceItemProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    rate: number;
    cap: number;
    color: string;
    accentColor: string;
    glowColor: string;
    isStatic?: boolean;
    customValue?: string | null;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon, label, value, rate, cap, color, accentColor, glowColor, isStatic = false, customValue }) => {
    const [simulatedValue, setSimulatedValue] = useState(value);

    useEffect(() => {
        if (value > 0 || simulatedValue === 0) setSimulatedValue(value);
    }, [value]);

    useEffect(() => {
        if (isStatic || rate === 0) return;
        const interval = setInterval(() => {
            setSimulatedValue(prev => Math.min(cap, prev + rate));
        }, 1000);
        return () => clearInterval(interval);
    }, [rate, cap, isStatic]);

    const percentage = Math.min(100, (simulatedValue / cap) * 100);

    return (
        <div className="relative group perspective-1000">
            {/* AMBIENT BACKGROUND GLOW */}
            <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl rounded-[2.5rem] ${accentColor}`} />
            
            <div className="relative flex flex-col bg-black/40 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all duration-700 hover:bg-neutral-900/40 hover:border-white/10 hover:-translate-y-1 overflow-hidden group">
                
                {/* DECORATIVE CORNERS */}
                <div className="absolute top-4 left-4 w-1.5 h-1.5 border-t border-l border-white/20" />
                <div className="absolute top-4 right-4 w-1.5 h-1.5 border-t border-r border-white/20" />

                <div className="flex items-center gap-2.5 mb-2 px-1">
                    <div className={`p-1.5 rounded-lg bg-white/5 ${glowColor} shadow-lg transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-500 group-hover:text-neutral-300 transition-colors">{label}</span>
                </div>
                
                <div className={`text-3xl font-black font-mono tracking-tighter ${color} mb-2 px-1 relative`}>
                    <AnimatedNumber value={simulatedValue} customValue={customValue} />
                    {rate !== 0 && (
                        <div className={`absolute -right-2 top-0 text-[10px] font-black ${rate > 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-0.5`}>
                             <Triangle className={rate > 0 ? 'fill-emerald-500' : 'rotate-180 fill-rose-500'} size={6} />
                             {Math.abs(rate).toFixed(1)}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 px-1">
                    <div className="flex justify-between items-center text-[8px] font-bold text-neutral-600 uppercase">
                        <span className="group-hover:text-neutral-400 transition-colors">Storage_Status</span>
                        <span className="font-mono text-[9px] text-neutral-500">{percentage.toFixed(0)}%</span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/5 rounded-full p-[1px] border border-white/[0.03]">
                        <motion.div 
                            className={`h-full rounded-full ${accentColor} ${glowColor} shadow-[0_0_8px_rgba(255,255,255,0.1)]`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>
                    
                    <div className="flex justify-between items-center text-[7px] font-mono text-neutral-700 tracking-tighter">
                        <span>L: 0%</span>
                        <span>M: 50%</span>
                        <span>F: {cap.toLocaleString()}</span>
                    </div>
                </div>

                {/* SCANLINE OVERLAY */}
                <div className="absolute pointer-events-none inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" 
                     style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, white 1px, white 2px)', backgroundSize: '100% 4px' }} 
                />
            </div>
        </div>
    );
};

const AnimatedNumber = ({ value, customValue }: { value: number, customValue?: string | null }) => {
    if (customValue) return <span>{customValue}</span>;
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const controls = animate(displayValue, value, {
            duration: 1.2,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(latest)
        });
        return () => controls.stop();
    }, [value]);

    return <span>{Math.floor(displayValue).toLocaleString()}</span>;
};
