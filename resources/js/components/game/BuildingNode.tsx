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
            {/* SHADOW SYSTEM V11 (DUAL ISOMETRIC SHADOW) */}
            <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-[20%] bg-black/90 blur-[10px] rounded-[100%] z-[-2] opacity-80" 
                style={{ transform: 'translateX(-40%)' }} // Desvio isométrico
            />
            <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[60%] h-[10%] bg-black/100 blur-[4px] rounded-[100%] z-[-1] opacity-90" 
                style={{ transform: 'translateX(-45%)' }}
            />

            {/* ASSET VISUAL REAL (HYBRID BLENDING V11.2 - NO-GHOST) */}
            {assetPath ? (
                <img 
                    src={assetPath} 
                    className={`w-full h-full object-contain pointer-events-none transition-all duration-500
                        ${isConstructing ? 'brightness-50 grayscale opacity-40' : 'brightness-[1.3] contrast-[1.2] saturate-[1.1] opacity-95 group-hover/node:opacity-100 group-hover/node:scale-110 group-hover/node:filter group-hover/node:drop-shadow-[0_0_15px_rgba(0,255,150,0.4)]'}
                    `}
                    alt={name}
                    style={{
                        mixBlendMode: (type === 'housing' || type === 'posto_recrutamento') ? 'multiply' : 'screen',
                        maskImage: 'radial-gradient(circle at center, black 70%, transparent 98%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 70%, transparent 98%)'
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

            {/* HUD TÁTICO V11.2 (HIGH-POSITIONED) */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[1000]">
                {/* NAME PLATE (CRISP READABILITY) */}
                <div className="px-2 py-0.5 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-sm shadow-2xl group-hover/node:border-[#0f0]/60 transition-colors">
                    <span className="text-[8px] font-black text-white/90 uppercase tracking-widest whitespace-nowrap">{name}</span>
                </div>
                
                {/* LEVEL BADGE (HUD STYLE) */}
                <div 
                    className="flex items-center justify-center bg-[#0a0c10]/95 border border-[#0f0]/80 text-[#0f0] font-black shadow-[0_0_15px_rgba(0,255,0,0.3)] skew-x-[-15deg]"
                    style={{ 
                        width: `${24 * scale}px`,
                        height: `${16 * scale}px`,
                        fontSize: `${Math.max(9, 12 * scale)}px`,
                    }}
                >
                    <span className="skew-x-[15deg]">{(level || 0)}</span>
                </div>
            </div>

            {/* CONSTRUCTING OVERLAY (SUBTLE) */}
            {isConstructing && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="w-10 h-10 border-2 border-[#0f0]/30 border-t-[#0f0] rounded-full animate-spin" />
                </div>
            )}

            {/* CONSTRUCTING OVERLAY */}
            {isConstructing && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="w-12 h-12 border-2 border-[#0f0]/40 border-t-[#0f0] rounded-full animate-spin shadow-[0_0_15px_rgba(0,255,0,0.3)]" />
                </div>
            )}
        </motion.div>
    );
};
