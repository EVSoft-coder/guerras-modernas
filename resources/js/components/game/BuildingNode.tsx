import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getEvolutionLevelAsset } from '@/lib/game-utils';

interface BuildingNodeProps {
    tipo: string;
    nome: string;
    nivel: number;
    isConstructing?: boolean;
    onClick: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ tipo, nome, nivel, isConstructing, onClick }) => {
    const [currentTryLevel, setCurrentTryLevel] = useState(getEvolutionLevelAsset(nivel));
    const [usePlaceholder, setUsePlaceholder] = useState(false);
    
    // Caminho da imagem de resiliência absoluta
    const blueprintUrl = "/images/building_blueprint_placeholder.png";
    const imgUrl = usePlaceholder ? blueprintUrl : `/images/edificios/${tipo}/lvl_${currentTryLevel}.png`;

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
                        className="w-14 h-14 md:w-32 md:h-32 object-contain drop-shadow-[0_0_10px_rgba(14,165,233,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(14,165,233,0.6)] transition-all duration-300" 
                        alt={nome}
                        onError={() => {
                            if (usePlaceholder) return;
                            
                            // Fallback Simples e Robusto para evitar loops
                            if (currentTryLevel > 1) {
                                setCurrentTryLevel(1); // Salta direto para o Lvl 1 se o intermédio falhar
                            } else {
                                setUsePlaceholder(true); // Se o Lvl 1 falhar, ativamos o Blueprint
                            }
                        }}
                    />
                    
                    {/* Badge de Nível Tactical - POSICIONAMENTO INFERIOR V50 */}
                    <div className="absolute -bottom-3 -right-1 bg-neutral-900 border border-sky-500/50 text-sky-400 text-[6px] md:text-[8px] font-black px-1 md:px-1.5 py-0.5 rounded shadow-lg backdrop-blur-md group-hover:border-sky-400 group-hover:text-white transition-colors z-10">
                        LVL {nivel}
                    </div>
                </motion.div>

                {/* Sombra de Projeção na Grelha */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 md:w-10 h-1 md:h-2 bg-black/40 blur-md rounded-full z-0"></div>

                {/* Rótulo Tático Premium Adaptativo - POSICIONAMENTO SUPERIOR V50 */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max z-30 pointer-events-none">
                    <div className="bg-black/95 backdrop-blur-md px-1.5 md:px-3 py-0.5 md:py-1 rounded-full border border-white/20 group-hover:border-orange-500 group-hover:bg-orange-950/40 transition-all duration-300 shadow-2xl">
                        <span className="text-[6px] md:text-[10px] uppercase font-black text-white group-hover:text-orange-400 tracking-tighter md:tracking-widest text-center block whitespace-nowrap">
                            {nome}
                        </span>
                    </div>
                </div>
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

        </motion.div>
    );
};
