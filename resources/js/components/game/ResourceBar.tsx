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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20">
            <ResourceItem 
                icon={<Box className="text-sky-400 group-hover:rotate-12 transition-transform" size={22} />} 
                label="Suprimentos" 
                value={current.suprimentos} 
                rate={(taxasPerSecond?.suprimentos ?? 0) * 60}
                color="text-sky-400"
            />
            <ResourceItem 
                icon={<Fuel className="text-orange-400 group-hover:rotate-12 transition-transform" size={22} />} 
                label="Combustível" 
                value={current.combustivel} 
                rate={(taxasPerSecond?.combustivel ?? 0) * 60}
                color="text-orange-400"
            />
            <ResourceItem 
                icon={<Rocket className="text-red-400 group-hover:rotate-12 transition-transform" size={22} />} 
                label="Munições" 
                value={current.municoes} 
                rate={(taxasPerSecond?.municoes ?? 0) * 60}
                color="text-red-400"
            />
            <ResourceItem 
                icon={<Users className="text-emerald-400 group-hover:rotate-12 transition-transform" size={22} />} 
                label="Guarnição" 
                value={current.pessoal} 
                rate={0}
                color="text-emerald-400"
                isStatic
            />
        </div>
    );
};

const ResourceItem = ({ icon, label, value, rate, color, isStatic = false }: any) => {
    return (
        <div className="flex flex-col items-center justify-center border-r border-white/5 last:border-0 px-2 group cursor-help transition-all duration-300 hover:bg-white/5 rounded-xl py-2 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1 z-10">
                {icon}
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-500 group-hover:text-neutral-300 transition-colors">{label}</span>
            </div>
            <motion.div 
                key={value}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-black font-mono tracking-tighter ${color} z-10`}
            >
                <AnimatedNumber value={value} />
            </motion.div>
            {!isStatic && (
                <div className="text-[10px] font-black text-neutral-600 group-hover:text-neutral-400 transition-colors z-10 flex items-center gap-1">
                    <span className="animate-pulse">▲</span> {Math.floor(rate).toLocaleString()} /h
                </div>
            )}
            
            {/* Background Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
