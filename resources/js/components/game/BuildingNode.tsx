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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, zIndex: 9999 }}
            onClick={onClick}
            className="absolute cursor-pointer transition-all hover:filter hover:brightness-125 group/node"
            style={{
                left,
                top,
                width,
                height,
                zIndex: Math.floor(layout.y)
            }}
        >
            {/* ASSET VISUAL REAL */}
            {assetPath ? (
                <img 
                    src={assetPath} 
                    className={`w-full h-full object-contain pointer-events-none mix-blend-screen
                        ${isConstructing ? 'brightness-50 grayscale' : 'brightness-[1.1] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]'}
                    `}
                    alt={name}
                    onError={(e) => {
                        console.error(`Asset mismatch: ${assetPath}`);
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/40 border border-white/10 rounded-xl backdrop-blur-sm">
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
