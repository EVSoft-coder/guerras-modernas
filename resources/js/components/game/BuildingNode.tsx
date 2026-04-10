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
    const [imgExt, setImgExt] = React.useState('webp');
    const imgUrl = `/images/edificios/${tipo}/lvl_${imgLevel}.${imgExt}`;

    return (
        <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`relative cursor-pointer group flex flex-col items-center z-10 p-1 md:p-2 rounded-xl transition-all duration-500 select-none
                bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/20 shadow-2xl hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]`}
        >
            {/* Imagem do Edifício com Brilho Tático */}
            <div className="relative">
                {/* Elemento de Hover Militar (Glow) */}
                <motion.div 
                    whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative z-10"
                >
                    <img 
                        src={imgUrl} 
                        className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-[0_0_10px_rgba(14,165,233,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(14,165,233,0.6)] transition-all duration-300" 
                        alt={nome}
                        onError={(e) => {
                            if (imgExt === 'webp') {
                                setImgExt('png');
                                return;
                            }
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('lvl_1.png')) {
                                target.src = `/images/edificios/${tipo}/lvl_1.png`;
                            }
                        }}
                    />
                    
                    {/* Badge de Nível Tactical */}
                    <div className="absolute -top-1 -right-1 bg-neutral-900 border border-sky-500/50 text-sky-400 text-[6px] md:text-[8px] font-black px-1 md:px-1.5 py-0.5 rounded shadow-lg backdrop-blur-md group-hover:border-sky-400 group-hover:text-white transition-colors">
                        LVL {nivel}
                    </div>
                </motion.div>

                {/* Sombra de Projeção na Grelha */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-10 h-1.5 md:h-2 bg-black/40 blur-md rounded-full -z-0"></div>

                {/* Radar de Construção */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Rótulo Tático Premium Adaptativo */}
            <div className="mt-1 md:mt-2 bg-black/80 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/20 group-hover:border-orange-500 group-hover:bg-orange-950/40 transition-all duration-300 max-w-[80px] md:max-w-none">
                <span className="text-[7px] md:text-[10px] uppercase font-black text-white group-hover:text-orange-400 tracking-widest text-center leading-tight">
                    {nome}
                </span>
            </div>
        </motion.div>
    );
};
