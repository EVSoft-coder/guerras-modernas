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
    // PASSO 9 — Z-INDEX DINÂMICO BASEADO EM POSIÇÃO Y (OCLUSÃO ISOMÉTRICA)
    const dynamicZIndex = Math.floor(layout.y) + 100;

    // FUNÇÃO DE ABREVIATURA TÁTICA (HUD CLEAN-UP)
    const getTacticalName = (fullName: string) => {
        const mapping: Record<string, string> = {
            'Radar de Longo Alcance': 'Radar Est.',
            'Centro de Pesquisa & I&D': 'Pesquisa',
            'Fábrica de Munições': 'Fábrica Mun.',
            'Refinaria de Combustível': 'Refinaria',
            'Mina de Suprimentos': 'Suprimentos',
            'Mina de Metal': 'Mina Metal',
            'Quartel Regional': 'Quartel',
            'Complexo Residencial': 'Habitação',
            'Posto de Recrutamento': 'Recrut.',
            'Centro de Comando (QG)': 'Comando QG'
        };
        return mapping[fullName] || (fullName.length > 12 ? fullName.substring(0, 10) + '...' : fullName);
    };

    const tacticalName = getTacticalName(name);

    return (
        <div 
            className="group/node absolute cursor-pointer transition-transform duration-300"
            style={{ 
                left: `${left}px`, 
                top: `${top}px`, 
                width: `${width}px`, 
                height: `${height}px`,
                zIndex: dynamicZIndex, // PASSO 10 — Z-INDEX DINÂMICO
                pointerEvents: 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* SOMBRA ISOMÉTRICA (ANCORED) */}
            <div 
                className="absolute w-[80%] h-[30%] bg-black/60 blur-[12px] rounded-[100%] z-0" 
                style={{ bottom: '5%', left: '10%' }}
            />

            {/* ASSET VISUAL REAL (GRID MASTER V11.3 - SOLID MASS) */}
            {assetPath ? (
                <img 
                    src={assetPath} 
                    className={`w-full h-full object-contain pointer-events-none transition-all duration-500
                        ${isConstructing ? 'brightness-50 grayscale opacity-40' : 'brightness-[1.6] contrast-[1.4] saturate-[1.3] opacity-95 group-hover/node:opacity-100 group-hover/node:scale-105 group-hover/node:filter group-hover/node:drop-shadow-[0_0_20px_rgba(0,255,100,0.5)]'}
                    `}
                    alt={name}
                    style={{
                        mixBlendMode: (type === 'housing' || type === 'posto_recrutamento') ? 'multiply' : 'screen',
                        maskImage: 'radial-gradient(circle at center, black 80%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 80%, transparent 100%)'
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/80 border border-white/20 rounded-xl backdrop-blur-xl">
                    <span className="text-[10px] text-white/40 font-black uppercase text-center px-1 leading-none">{tacticalName}</span>
                </div>
            )}

            {/* HUD MILITAR MINIMALISTA V11.3 (TOP LAYER) */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-[5000] pointer-events-none">
                {/* NAME PLATE (COMPACT HUD STYLE) */}
                <div className="px-2 py-0.5 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-sm shadow-3xl group-hover/node:border-[#0f0]/60 transition-all">
                    <span className="text-[7.5px] font-black text-white/95 uppercase tracking-[0.2em] whitespace-nowrap">
                        {tacticalName}
                    </span>
                </div>
                
                {/* LEVEL BADGE (TACTICAL HUD) */}
                <div 
                    className="flex items-center justify-center bg-[#050608]/95 border border-[#0f0]/90 text-[#0f0] font-black shadow-[0_0_20px_rgba(0,255,0,0.3)] skew-x-[-12deg]"
                    style={{ 
                        width: `${22 * scale}px`,
                        height: `${14 * scale}px`,
                        fontSize: `${Math.max(8, 11 * scale)}px`,
                    }}
                >
                    <span className="skew-x-[12deg]">{(level || 0)}</span>
                </div>
            </div>

            {/* CONSTRUCTING STATUS */}
            {isConstructing && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[7.5px] font-black text-[#0f0] animate-pulse uppercase tracking-wider">
                    Engenharia...
                </div>
            )}

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
