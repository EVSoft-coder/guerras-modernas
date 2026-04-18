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

    // RESOLVER PATH DO ATIVO (USANDO ASSET_NAME DO LAYOUT)
    const assetPath = layout.assetName 
        ? `/assets/structures/v2/${layout.assetName}`
        : null;

    // PASSO 3 — Z-INDEX AVANÇADO (CENTRO DE MASSA VISUAL)
    let dynamicZIndex = Math.floor(layout.y + (layout.h * 0.5));
    if (type === 'muralha') dynamicZIndex = 1;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, zIndex: 9999 }}
            onClick={onClick}
            className="absolute cursor-pointer transition-all hover:filter hover:brightness-110 group/node"
            style={{
                left,
                top,
                width,
                height,
                zIndex: dynamicZIndex
            }}
        >
            {/* PASSO 4 — SHADOW SYSTEM (GROUND BLUR) - VISIBILIDADE FIXA REFORÇADA */}
            <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-[15%] bg-black/80 blur-[8px] rounded-[100%] z-[-1] opacity-70" 
                style={{ transform: 'translateX(-50%)' }}
            />

            {/* ASSET VISUAL REAL (SVG ALPHA PURGE ENGINE) */}
            {assetPath ? (
                <img 
                    src={assetPath} 
                    className={`w-full h-full object-contain pointer-events-none transition-all duration-500
                        ${isConstructing ? 'brightness-50 grayscale opacity-40' : 'brightness-[1.1] contrast-[1.2] opacity-95 group-hover/node:opacity-100 group-hover/node:scale-105 active:scale-95'}
                    `}
                    alt={name}
                    style={{
                        filter: 'url(#alpha-purge) drop-shadow(0 0 20px rgba(0,0,0,0.8))'
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/80 border border-white/20 rounded-xl backdrop-blur-xl">
                    <span className="text-[10px] text-white/40 font-black uppercase text-center px-1 leading-none">{name}</span>
                </div>
            )}

            {/* LEVEL BADGE — TRIBAL MINIMALIST STYLE */}
            <div 
                className="absolute bottom-2 right-2 bg-black/90 border border-[#0f0]/60 text-[#0f0] font-black font-mono rounded-full shadow-2xl flex items-center justify-center backdrop-blur-md"
                style={{ 
                    width: `${22 * scale}px`,
                    height: `${22 * scale}px`,
                    fontSize: `${Math.max(8, 12 * scale)}px`,
                    zIndex: 100
                }}
            >
                {(level || 0)}
            </div>

            {/* HOVER LABEL */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all bg-black/90 px-3 py-1 rounded text-[9px] text-white font-black uppercase tracking-widest border border-white/10 shadow-2xl z-[10000]">
                {name}
            </div>
        </motion.div>
    );
};
