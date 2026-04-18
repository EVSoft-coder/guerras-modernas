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

    // CÁLCULO DE POSIÇÃO BASEADO EM ÂNCORA E ESCALA (PASSO 4 & 7)
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

    // MAPEAR ASSET PATH
    const assetPath = `/assets/structures/v2/${
        type === 'qg' ? 'hq' : 
        type === 'quartel' ? 'barracks' : 
        type === 'fabrica_municoes' ? 'factory' :
        type === 'refinaria' ? 'factory' :
        type.replace('central_', '').replace('mina_', '')
    }.png`.replace('pesquisa', 'research').replace('suprimentos', 'mine').replace('metal', 'mine');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            onClick={onClick}
            className="absolute cursor-pointer transition-transform group/node"
            style={{
                left,
                top,
                width,
                height,
                zIndex: Math.floor(layout.y) // PASSO 4 — Z-INDEX DINÂMICO
            }}
        >
            {/* PASSO 5 — IMAGEM BUILDING */}
            <img 
                src={assetPath} 
                className={`w-full h-full object-contain pointer-events-none mix-blend-screen transition-all
                    ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.2] group-hover/node:brightness-[1.4]'}
                `}
                alt={name}
            />

            {/* PASSO 5 — BUILDING LEVEL HUD */}
            <div 
                className="absolute top-0 right-0 bg-black/90 border border-[#0f0]/30 text-[#0f0] font-black font-mono rounded-full shadow-[0_0_10px_rgba(0,255,0,0.2)] flex items-center justify-center backdrop-blur-md"
                style={{ 
                    padding: `${2 * scale}px ${6 * scale}px`,
                    fontSize: `${Math.max(8, 11 * scale)}px`,
                    transform: 'translate(30%, -30%)'
                }}
            >
                L.{level}
            </div>

            {/* STATUS LABEL (Opcional, apenas em hover para UI limpa) */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] text-white font-black whitespace-nowrap uppercase tracking-widest border border-white/10">
                {name}
            </div>

            {/* DEBUG OUTLINE (PASSO 8 — TEMPORÁRIO) */}
            {/* <div className="absolute inset-0 border border-red-500/20 pointer-events-none" /> */}
        </motion.div>
    );
};
