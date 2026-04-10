import React from 'react';
import { motion } from 'framer-motion';

interface BuildingNodeProps {
    tipo: string;
    nome: string;
    nivel: number;
    isConstructing?: boolean;
    onClick: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ tipo, nome, nivel, isConstructing, onClick }) => {
    // Escala Evolutiva de 6 Níveis (com fallbacks inteligentes)
    const getLevelImage = (lvl: number) => {
        if (lvl >= 6) return 6;
        if (lvl >= 5) return 5;
        if (lvl >= 4) return 4;
        if (lvl >= 3) return 3;
        if (lvl >= 2) return 2;
        return 1;
    };

    const imgLevel = getLevelImage(nivel);
    const imgUrl = `/images/edificios/${tipo}/lvl_${imgLevel}.png`;

    return (
        <motion.div 
            whileHover={{ 
                scale: 1.1,
                filter: "drop-shadow(0 0 15px rgba(249, 115, 22, 0.6))" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative cursor-pointer group flex flex-col items-center z-10"
        >
            {/* Imagem do Edifício com Brilho Tático */}
            <div className="relative">
                <img 
                    src={imgUrl} 
                    alt={nome}
                    className={`w-32 h-32 object-contain transition-all duration-700 
                        ${isConstructing ? 'opacity-40 grayscale animate-pulse' : 'opacity-100'} 
                        drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]
                        group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/edificios/qg/lvl_1.png';
                    }}
                />
                
                {/* Badge de Nível Militar */}
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-[11px] font-black px-2 py-0.5 rounded border-b-2 border-orange-800 shadow-2xl transform rotate-3">
                    LVL {nivel}
                </div>

                {/* Radar de Construção */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Rótulo Tático Premium */}
            <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 group-hover:border-orange-500 group-hover:bg-orange-950/40 transition-all duration-300">
                <span className="text-[10px] uppercase font-black text-white group-hover:text-orange-400 tracking-widest whitespace-nowrap">
                    {nome}
                </span>
            </div>
        </motion.div>
    );
};
