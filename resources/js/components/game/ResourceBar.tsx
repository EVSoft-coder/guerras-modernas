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
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                        <div className={`w-1 h-1 rounded-full ${accentColor} animate-pulse`}></div>
                        <span className="text-[9px] font-bold text-neutral-500">
                             +{Math.floor(rate).toLocaleString()} <span className="text-[7px] opacity-50">/H</span>
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                         <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                         <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">Operacional</span>
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
