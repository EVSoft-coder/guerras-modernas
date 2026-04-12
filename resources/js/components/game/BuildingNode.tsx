import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getEvolutionLevelAsset } from '@/lib/game-utils';

interface BuildingNodeProps {
    tipo: string;
    nome: string;
    nivel: number;
    gridPos: { x: number, y: number };
    isConstructing?: boolean;
    onClick: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ tipo, nome, nivel, gridPos, isConstructing, onClick }) => {
    const [currentTryLevel, setCurrentTryLevel] = useState(getEvolutionLevelAsset(nivel));
    const [usePlaceholder, setUsePlaceholder] = useState(false);
    
    // Caminho da imagem de resiliência absoluta
    const blueprintUrl = "/images/building_blueprint_placeholder.png";
    const imgUrl = usePlaceholder ? blueprintUrl : `/images/edificios/${tipo.toLowerCase()}/lvl_${currentTryLevel}.png`;

    return (
        <motion.div 
            style={{ 
                gridArea: `${gridPos.y + 1} / ${gridPos.x + 1} / span 1 / span 1` 
            }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative flex flex-col items-center justify-center p-2 group"
        >
            {/* TACTICAL TOOLTIP */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none scale-90 group-hover:scale-100 translate-y-2 group-hover:translate-y-0">
                <div className="bg-neutral-900/95 backdrop-blur-xl border border-sky-500/30 px-4 py-2 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col items-center min-w-[140px]">
                    <div className="w-full flex justify-between items-center mb-1.5 pb-1 border-b border-white/5">
                        <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">Unit_Intel</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{nome}</span>
                    <span className="text-[7px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1.5">Nível de Acesso: {nivel}</span>
                </div>
                {/* Arrow */}
                <div className="w-2 h-2 bg-neutral-900/95 border-r border-b border-sky-500/30 rotate-45 -mt-1 mx-auto relative z-10"></div>
            </div>

            {/* CONTAINER DO EDIFÍCIO */}
            <div className="relative group/bldg">
                <motion.img 
                    src={imgUrl} 
                    className="w-20 h-20 md:w-36 md:h-36 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover/bldg:drop-shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all duration-500" 
                    alt={nome}
                    onError={() => {
                        if (usePlaceholder) return;
                        if (currentTryLevel > 1) setCurrentTryLevel(1);
                        else setUsePlaceholder(true);
                    }}
                />

                {/* LEVEL BADGE TÁCTICO */}
                <div className="absolute -bottom-2 -right-2 bg-neutral-950 border border-sky-500/50 rounded-lg px-2 py-1 shadow-2xl backdrop-blur-md z-40 transform group-hover/bldg:scale-110 transition-transform">
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-[6px] text-sky-500 font-black uppercase tracking-tighter">LVL</span>
                        <span className="text-sm font-mono font-black text-white">{nivel}</span>
                    </div>
                </div>

                {/* INDICADOR DE CONSTRUÇÃO */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-full h-full border-2 border-orange-500 border-t-transparent rounded-full animate-spin opacity-50"></div>
                         <div className="absolute inset-0 bg-orange-500/10 animate-pulse rounded-full"></div>
                    </div>
                )}
            </div>

            {/* NOME SEMPRE VISÍVEL (SUBTIL) */}
            <span className="mt-2 text-[8px] font-black uppercase text-neutral-500 tracking-widest group-hover:text-sky-400 transition-colors">
                {nome.split(' / ')[0]}
            </span>
        </motion.div>
    );
};
