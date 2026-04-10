import React, { useState, useEffect } from 'react';
import { Box, Fuel, Rocket, Users } from 'lucide-react';
import { Recurso } from '@/types';

interface ResourceBarProps {
    recursos: Recurso;
    taxasPerSecond: Record<string, number>;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ recursos, taxasPerSecond }) => {
    const [current, setCurrent] = useState({
        suprimentos: recursos.suprimentos,
        combustivel: recursos.combustivel,
        municoes: recursos.municoes,
        pessoal: recursos.pessoal
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => ({
                suprimentos: prev.suprimentos + (taxasPerSecond.suprimentos || 0),
                combustivel: prev.combustivel + (taxasPerSecond.combustivel || 0),
                municoes: prev.municoes + (taxasPerSecond.municoes || 0),
                pessoal: prev.pessoal // Pessoal é estático até treino
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [taxasPerSecond]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
            <ResourceItem 
                icon={<Box className="text-sky-400" size={20} />} 
                label="Suprimentos" 
                value={current.suprimentos} 
                rate={taxasPerSecond.suprimentos * 60}
                color="text-sky-400"
            />
            <ResourceItem 
                icon={<Fuel className="text-orange-400" size={20} />} 
                label="Combustível" 
                value={current.combustivel} 
                rate={taxasPerSecond.combustivel * 60}
                color="text-orange-400"
            />
            <ResourceItem 
                icon={<Rocket className="text-red-400" size={20} />} 
                label="Munições" 
                value={current.municoes} 
                rate={taxasPerSecond.municoes * 60}
                color="text-red-400"
            />
            <ResourceItem 
                icon={<Users className="text-emerald-400" size={20} />} 
                label="Guarnição" 
                value={current.pessoal} 
                rate={0}
                color="text-emerald-400"
                isStatic
            />
        </div>
    );
};

const ResourceItem = ({ icon, label, value, rate, color, isStatic = false }: any) => (
    <div className="flex flex-col items-center justify-center border-r border-white/5 last:border-0 px-2 group cursor-help transition-all duration-300 hover:bg-white/5 rounded-lg py-2">
        <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors">{label}</span>
        </div>
        <div className={`text-xl font-bold font-mono tracking-tighter ${color}`}>
            {Math.floor(value).toLocaleString()}
        </div>
        {!isStatic && (
            <div className="text-[9px] font-bold text-neutral-600">
                +{Math.floor(rate)}/min
            </div>
        )}
    </div>
);
