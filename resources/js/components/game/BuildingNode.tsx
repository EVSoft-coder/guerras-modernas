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
    // Lógica para selecionar a imagem baseada no nível (1, 3, 5, etc)
    const getLevelImage = (lvl: number) => {
        if (lvl >= 5) return 5;
        if (lvl >= 3) return 3; // Fallback para 3 se tivermos, senão 1
        return 1;
    };

    const imgLevel = getLevelImage(nivel);
    // Nota: Usamos public/images/edificios/{tipo}/lvl_{imgLevel}.png
    const imgUrl = `/images/edificios/${tipo}/lvl_${imgLevel}.png`;

    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative cursor-pointer group flex flex-col items-center"
        >
            {/* Imagem do Edifício */}
            <div className="relative">
                <img 
                    src={imgUrl} 
                    alt={nome}
                    className={`w-28 h-28 object-contain transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(14,165,233,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.5)] ${isConstructing ? 'opacity-50 grayscale animate-pulse' : ''}`}
                    onError={(e) => {
                        // Fallback para uma imagem geral se a específica falhar
                        (e.target as HTMLImageElement).src = '/images/edificios/qg/lvl_1.png';
                    }}
                />
                
                {/* Badge de Nível */}
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded border border-white/20 shadow-lg">
                    LVL {nivel}
                </div>

                {/* Overlay de Construção */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Rótulo Tático */}
            <div className="mt-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 group-hover:border-orange-500/50 transition-colors">
                <span className="text-[9px] uppercase font-bold text-white/80 group-hover:text-orange-400 tracking-tighter whitespace-nowrap">
                    {nome}
                </span>
            </div>
        </motion.div>
    );
};
