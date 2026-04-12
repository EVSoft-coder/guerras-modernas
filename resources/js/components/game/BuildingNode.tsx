import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getEvolutionLevelAsset } from '@/lib/game-utils';
import { getBuildingAsset } from '@/utils/assetMapper';

interface BuildingNodeProps {
    tipo: string;
    nome: string;
    nivel: number;
    gridPos: { x: number, y: number };
    isConstructing?: boolean;
    onClick: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ tipo, nome, nivel, gridPos, isConstructing, onClick }) => {
    const currentTryLevel = getEvolutionLevelAsset(nivel ?? 1);
    
    // Caminho da imagem de ativos reais ou placeholder tático
    const imgUrl = getBuildingAsset(tipo, currentTryLevel);

    return (
        <motion.div 
            style={{ 
                gridArea: `${(gridPos?.y ?? 0) + 1} / ${(gridPos?.x ?? 0) + 1} / span 1 / span 1` 
            }}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="relative flex flex-col items-center justify-center p-1 group cursor-pointer"
        >
            {/* CONTAINER DO EDIFÍCIO */}
            <div className="relative group/bldg transition-all duration-300">
                {/* GLOW DE FUNDO SUBTIL NO HOVER */}
                <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 blur-xl rounded-full transition-all duration-300" />
                
                <motion.img 
                    src={imgUrl} 
                    className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] group-hover/bldg:drop-shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all duration-500 relative z-10" 
                    alt={nome ?? 'STRUCTURE'}
                />

                {/* LEVEL BADGE TÁCTICO COMPACTO */}
                <div className="absolute -bottom-1 -right-1 bg-neutral-950 border border-sky-500/40 rounded-md px-1.5 py-0.5 shadow-xl backdrop-blur-md z-20">
                    <span className="text-[9px] font-mono font-black text-white">{nivel ?? 0}</span>
                </div>

                {/* INDICADOR DE CONSTRUÇÃO */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                         <div className="w-full h-full border-2 border-orange-500 border-t-transparent rounded-full animate-spin opacity-60"></div>
                    </div>
                )}
            </div>

            {/* NOME (SÓ APARECE NO HOVER OU MUITO PEQUENO) */}
            <div className="mt-1 flex flex-col items-center bg-black/40 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[7px] font-black uppercase text-neutral-300 tracking-tighter whitespace-nowrap">
                    {nome?.split?.(' / ')?.[0] ?? 'UNKNOWN'}
                </span>
            </div>
        </motion.div>
    );
};
