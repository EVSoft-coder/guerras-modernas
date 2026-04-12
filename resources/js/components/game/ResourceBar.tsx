import React, { useState, useEffect } from 'react';
import { Box, Fuel, Rocket, Users } from 'lucide-react';
import { Recurso } from '@/types';
import { motion, animate } from 'framer-motion';

interface ResourceBarProps {
    recursos: Recurso;
    taxasPerSecond: Record<string, number>;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ recursos, taxasPerSecond }) => {
    const [current, setCurrent] = useState({
        suprimentos: recursos?.suprimentos ?? 0,
        combustivel: recursos?.combustivel ?? 0,
        municoes: recursos?.municoes ?? 0,
        pessoal: recursos?.pessoal ?? 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => ({
                suprimentos: prev.suprimentos + (taxasPerSecond?.suprimentos ?? 0),
                combustivel: prev.combustivel + (taxasPerSecond?.combustivel ?? 0),
                municoes: prev.municoes + (taxasPerSecond?.municoes ?? 0),
                pessoal: prev.pessoal
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [taxasPerSecond]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full bg-black/40 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"></div>
            <ResourceItem 
                icon={<Box className="text-sky-400" size={20} />} 
                label="Suprimentos" 
                value={current.suprimentos} 
                rate={(taxasPerSecond?.suprimentos ?? 0) * 3600}
                color="text-white"
                accentColor="bg-sky-500"
            />
            <ResourceItem 
                icon={<Fuel className="text-orange-400" size={20} />} 
                label="Combustível" 
                value={current.combustivel} 
                rate={(taxasPerSecond?.combustivel ?? 0) * 3600}
                color="text-white"
                accentColor="bg-orange-500"
            />
            <ResourceItem 
                icon={<Rocket className="text-red-400" size={20} />} 
                label="Munições" 
                value={current.municoes} 
                rate={(taxasPerSecond?.municoes ?? 0) * 3600}
                color="text-white"
                accentColor="bg-red-500"
            />
            <ResourceItem 
                icon={<Users className="text-emerald-400" size={20} />} 
                label="Guarnição" 
                value={current.pessoal} 
                rate={0}
                color="text-white"
                accentColor="bg-emerald-500"
                isStatic
            />
        </div>
    );
};

const ResourceItem = ({ icon, label, value, rate, color, accentColor, isStatic = false }: any) => {
    return (
        <div className="flex flex-col items-center justify-center border-r border-white/5 last:border-0 px-4 group cursor-help transition-all duration-500 hover:bg-white/[0.03] py-3 relative">
            {/* TACTICAL TOOLTIP */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-50 pointer-events-none scale-95 group-hover:scale-100 translate-y-4 group-hover:translate-y-0">
                <div className="bg-neutral-900/95 backdrop-blur-3xl border border-white/10 px-4 py-3 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col items-center min-w-[180px]">
                    <div className="w-full flex justify-between items-center mb-2 pb-1.5 border-b border-white/5">
                        <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">Resource_Node</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">{label}</span>
                    <div className="text-[7px] text-neutral-500 mt-2 font-mono uppercase tracking-tighter text-center leading-relaxed">
                         Monitorização em tempo real de fluxos logísticos e reservas estratégicas do setor operacional
                    </div>
                </div>
                <div className="w-2.5 h-2.5 bg-neutral-900 border-r border-b border-white/10 rotate-45 -mt-1.5 mx-auto relative z-10"></div>
            </div>

            <div className="flex items-center gap-2 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                {icon}
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-neutral-400">{label}</span>
            </div>
            
            <motion.div 
                key={value}
                initial={{ scale: 1.05, opacity: 0.9 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-3xl font-black font-mono tracking-tighter ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
            >
                <AnimatedNumber value={value} />
            </motion.div>

            <div className="mt-2 flex items-center gap-3">
                {!isStatic ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5 opacity-50">
                        <span className="text-[9px] font-bold text-neutral-400">
                             {Math.floor(rate).toLocaleString()} <span className="text-[7px] opacity-50">/H</span>
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/5 shadow-[inset_0_1px_10px_rgba(16,185,129,0.05)] border border-emerald-500/10">
                         <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter opacity-70">Operacional</span>
                    </div>
                )}
            </div>
            
            {/* Hover Indicator */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] ${accentColor} group-hover:w-1/2 transition-all duration-500 opacity-50`}></div>
        </div>
    );
};

const AnimatedNumber = ({ value }: { value: number }) => {
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
