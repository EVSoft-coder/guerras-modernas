import React from 'react';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';
import { motion } from 'framer-motion';

interface BuildingNodeProps {
    type: string;
    level: number;
    scale: number;
    isConstructing: boolean;
    name: string;
    onClick: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ type, level, scale, isConstructing, name, onClick }) => {
    const layout = BUILDING_LAYOUT[type];
    if (!layout) return null;

    // CÁLCULO DE POSIÇÃO DE PRECISÃO (PASSO 2, 7 & 10)
    let left = layout.x * scale;
    let top = layout.y * scale;
    const width = layout.w * scale;
    const height = layout.h * scale;

    if (layout.anchor === 'center') {
        left -= width / 2;
        top -= height / 2;
    }

    if (layout.anchor === 'bottom') {
        left -= width / 2;
        top -= height;
    }

    // RESOLVER PATH DO ATIVO
    const assetPath = `/assets/structures/v2/${
        type === 'qg' ? 'hq' : 
        type === 'quartel' ? 'barracks' : 
        type === 'fabrica_municoes' ? 'factory' :
        type === 'refinaria' ? 'factory' :
        type.replace('central_', '').replace('mina_', '')
    }.png`.replace('pesquisa', 'research').replace('suprimentos', 'mine').replace('metal', 'mine');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.08, zIndex: 9999 }} // PASSO 3 — PRIORIDADE MÁXIMA NO HOVER
            onClick={onClick}
            className="absolute cursor-pointer transition-all hover:filter hover:brightness-125 group/node"
            style={{
                left,
                top,
                width,
                height,
                zIndex: Math.floor(layout.y) // PASSO 3 — PROFUNDIDADE DINÂMICA
            }}
        >
            {/* PASSO 4 — ESTILO VISUAL REAL SEM QUADRADOS PRETOS */}
            <img 
                src={assetPath} 
                className={`w-full h-full object-contain pointer-events-none mix-blend-screen
                    ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.1] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]'}
                `}
                alt={name}
            />

            {/* LEVEL BADGE — POSIÇÃO TÁTICA CORRIGIDA */}
            <div 
                className="absolute top-0 right-0 bg-[#050709] border border-[#0f0]/40 text-[#0f0] font-black font-mono rounded-lg shadow-xl flex items-center justify-center backdrop-blur-xl"
                style={{ 
                    padding: `${1 * scale}px ${4 * scale}px`,
                    fontSize: `${Math.max(8, 11 * scale)}px`,
                    transform: 'translate(20%, -20%)'
                }}
            >
                L.{(level || 0)}
            </div>

            {/* HOVER LABEL */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all bg-black/90 px-3 py-1 rounded text-[9px] text-white font-black uppercase tracking-widest border border-white/10 shadow-2xl z-[10000]">
                {name}
            </div>
        </motion.div>
    );
};
