import React from 'react';
import { motion } from 'framer-motion';
import { getEvolutionLevelAsset } from '@/lib/game-utils';
import { getBuildingAsset } from '@/utils/assetMapper';

interface BuildingNodeProps {
    buildingType: string;
    nome: string;
    nivel: number;
    gridPos: { x: number, y: number } | null;
    isConstructing?: boolean;
    isLocked?: boolean;
    onClick: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ buildingType, nome, nivel, gridPos, isConstructing, isLocked, onClick }) => {
    const isGhost = nivel === 0;
    const currentTryLevel = getEvolutionLevelAsset(nivel ?? 1);
    const imgUrl = getBuildingAsset(buildingType, isGhost ? 1 : currentTryLevel);

    return (
        <motion.div 
            style={gridPos ? { 
                gridArea: `${(gridPos?.y ?? 0) + 1} / ${(gridPos?.x ?? 0) + 1} / span 1 / span 1` 
            } : {}}
            whileHover={!isLocked ? { scale: 1.1, zIndex: 100 } : {}}
            whileTap={!isLocked ? { scale: 0.9 } : {}}
            onClick={!isLocked ? onClick : undefined}
            className={`relative flex flex-col items-center justify-center p-1 group ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'} ${isLocked ? 'opacity-20 grayscale' : (isGhost ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : '')}`}
        >
            {/* CONTAINER DO EDIFÍCIO */}
            <div className="relative group/bldg transition-all duration-300">
                {/* GLOW DE FUNDO SUBTIL NO HOVER */}
                {!isLocked && <div className={`absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 blur-xl rounded-full transition-all duration-300 ${isGhost ? 'group-hover:bg-orange-500/10' : ''}`} />}
                
                <motion.img 
                    src={imgUrl} 
                    className={`w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] ${!isLocked ? 'group-hover/bldg:drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]' : ''} transition-all duration-500 relative z-10 ${isGhost ? 'border-2 border-dashed border-white/10 rounded-xl p-1' : ''}`} 
                    alt={nome ?? 'STRUCTURE'}
                />

                {/* LEVEL BADGE TÁCTICO COMPACTO */}
                <div className={`absolute -bottom-1 -right-1 bg-neutral-950 border ${isLocked ? 'border-red-500/40' : (isGhost ? 'border-orange-500/40' : 'border-sky-500/40')} rounded-md px-1.5 py-0.5 shadow-xl backdrop-blur-md z-20`}>
                    <span className={`text-[9px] font-mono font-black text-white ${isLocked ? 'text-red-500' : (isGhost ? 'text-orange-500' : '')}`}>
                        {isLocked ? '🔒' : (isGhost ? '+' : (nivel ?? 0))}
                    </span>
                </div>

                {/* INDICADOR DE CONSTRUÇÃO */}
                {isConstructing && !isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                         <div className="w-full h-full border-2 border-orange-500 border-t-transparent rounded-full animate-spin opacity-60"></div>
                    </div>
                )}
            </div>

            {/* NOME (SÓ APARECE NO HOVER OU MUITO PEQUENO) */}
            <div className={`mt-1 flex flex-col items-center bg-black/40 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm ${!isLocked ? 'opacity-60 group-hover:opacity-100' : 'opacity-40'} transition-opacity`}>
                <span className="text-[7px] font-black uppercase text-neutral-300 tracking-tighter whitespace-nowrap">
                    {nome ?? 'UNKNOWN'}
                </span>
            </div>
        </motion.div>
    );
};
