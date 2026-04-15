import React, { useState, useEffect } from 'react';
import { Shield, Fuel, Rocket, Users, Boxes, Zap } from 'lucide-react';
import { Recurso } from '@/types';
import { motion, animate } from 'framer-motion';

interface ResourceBarProps {
    recursos: Recurso;
    taxasPerSecond: Record<string, number>;
}

export const ResourceBar: React.FC<ResourceBarProps & { populacao?: any }> = ({ recursos, taxasPerSecond, populacao }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full z-20">
            <ResourceItem 
                icon={<Shield className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" size={24} />} 
                label="Suprimentos" 
                value={recursos?.suprimentos ?? 0} 
                rate={taxasPerSecond?.suprimentos ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-sky-400"
            />
            <ResourceItem 
                icon={<Fuel className="text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]" size={24} />} 
                label="Combustível" 
                value={recursos?.combustivel ?? 0} 
                rate={taxasPerSecond?.combustivel ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-orange-500"
            />
            <ResourceItem 
                icon={<Boxes className="text-zinc-400 drop-shadow-[0_0_12px_rgba(161,161,170,0.5)]" size={24} />} 
                label="Metal" 
                value={recursos?.metal ?? 0} 
                rate={taxasPerSecond?.metal ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-zinc-500"
            />
            <ResourceItem 
                icon={<Rocket className="text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]" size={24} />} 
                label="Munições" 
                value={recursos?.municoes ?? 0} 
                rate={taxasPerSecond?.municoes ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-red-500"
            />
            <ResourceItem 
                icon={<Zap className="text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" size={24} />} 
                label="Energia" 
                value={recursos?.energia ?? 0} 
                rate={taxasPerSecond?.energia ?? 0}
                cap={recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-yellow-500"
            />
            <ResourceItem 
                icon={<Users className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" size={24} />} 
                label="Guarnição" 
                value={recursos?.pessoal ?? 0} 
                customValue={populacao ? `${Math.floor(populacao.used)} / ${populacao.total}` : null}
                rate={taxasPerSecond?.pessoal ?? 0}
                cap={populacao?.total ?? recursos?.cap ?? 10000}
                color="text-white"
                accentColor="bg-emerald-500"
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
    isStatic?: boolean;
    customValue?: string | null;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon, label, value, rate, cap, color, accentColor, isStatic = false, customValue }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group cursor-help transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* TACTICAL TOOLTIP */}
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-50 pointer-events-none scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0">
                <div className="bg-neutral-900 border border-white/10 px-5 py-4 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,1)] flex flex-col items-center min-w-[220px]">
                    <span className="text-[10px] font-black uppercase text-white tracking-[0.3em] mb-2">{label}</span>
                    <div className="flex flex-col gap-1 w-full text-[9px] font-mono uppercase text-neutral-400">
                        <div className="flex justify-between">
                            <span>Fluxo/Hora:</span>
                            <span className="text-emerald-400 font-black">+{(rate * 3600).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-1 mt-1">
                            <span>Eficiência:</span>
                            <span className="text-sky-400 font-black">{Math.min(100, (Number(value) / cap) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="text-[7px] text-neutral-600 mt-2 text-center italic">
                             Sensor ótico de monitorização estratégica ativado
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2.5 mb-3 opacity-60 group-hover:opacity-100 transition-all duration-300">
                {icon}
                <span className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 group-hover:text-white transition-colors">{label}</span>
            </div>
            
            <motion.div 
                key={value}
                className={`text-4xl font-black font-mono tracking-tighter ${color} drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
            >
                {Math.floor(value).toLocaleString()}
            </motion.div>

            <div className="mt-3 w-full">
                {!isStatic ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                            <span className={`text-[9px] font-black ${rate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                 {rate >= 0 ? '+' : ''}{rate.toFixed(1)} <span className="text-[7px] opacity-40">/S</span>
                            </span>
                            <span className="text-[8px] font-mono text-neutral-500 uppercase">
                                MAX: {cap.toLocaleString()}
                            </span>
                        </div>
                        {/* Progress Bar Tática */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                className={`h-full ${accentColor}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (value / cap) * 100)}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Ativo</span>
                    </div>
                )}
            </div>
            
            <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent ${accentColor} to-transparent opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
        </div>
    );
};

const AnimatedNumber = ({ value, customValue }: { value: number, customValue?: string | null }) => {
    if (customValue) return <span>{customValue}</span>;
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const controls = animate(displayValue, value, {
            duration: 0.8,
            onUpdate: (latest) => setDisplayValue(latest)
        });
        return () => controls.stop();
    }, [value]);

    return <span>{Math.floor(displayValue).toLocaleString()}</span>;
};
