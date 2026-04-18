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
            {/* PASSO 4 — SHADOW SYSTEM (GROUND BLUR) - VISIBILIDADE FIXA */}
            <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[60%] h-[15%] bg-black/60 blur-[10px] rounded-[100%] z-[-1] opacity-60" 
                style={{ transform: 'translateX(-50%)' }}
            />

            {/* ASSET VISUAL REAL (PASSO 6 — OPACIDADE 0.9) */}
            {assetPath ? (
                <img 
                    src={assetPath} 
                    className={`w-full h-full object-contain pointer-events-none mix-blend-lighten transition-opacity
                        ${isConstructing ? 'brightness-50 grayscale opacity-40' : 'brightness-[1.1] opacity-90 group-hover/node:opacity-100'}
                    `}
                    alt={name}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/50 border border-white/10 rounded-xl backdrop-blur-md">
                    <span className="text-[10px] text-white/20 font-black uppercase text-center px-1 leading-none">{name}</span>
                </div>
            )}

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
