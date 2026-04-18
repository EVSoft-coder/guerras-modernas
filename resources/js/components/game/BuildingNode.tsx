import React from 'react';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';
import { BUILDING_ASSETS } from '@/config/buildingAssets';

interface BuildingNodeProps {
    type: string;
    level: number;
    scale: number;
    isConstructing: boolean;
    name: string;
    onClick: () => void;
}

/**
 * BuildingNode — COMPONENTE DETERMINÍSTICO V12
 * Proibido: transform: translate, margins, percentages.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, 
    level, 
    isConstructing, 
    name, 
    onClick 
}) => {
    const layout = BUILDING_LAYOUT[type];
    if (!layout) return null;

    // CÁLCULO DE ANCORAGEM MÁSTER (V12.4 + V13 metadata)
    const assetConfig = BUILDING_ASSETS[type] || { width: 100, height: 100, anchor: 'bottom' };
    const width = assetConfig.width;
    const height = assetConfig.height;

    const left = layout.x - (width / 2);
    const top = layout.y - height; // Forçado para Bottom Alignment

    const assetPath = layout.assetName 
        ? `/images/buildings/${layout.assetName}`
        : null;

    // Z-INDEX TÁTICO: BASEADO NO LIMITE INFERIOR (Y)
    const staticZ = Math.floor(layout.y);

    return (
        <div 
            id={`node-${type}`}
            className="building-node"
            style={{ 
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: staticZ,
                cursor: 'pointer',
                pointerEvents: 'auto',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: '0'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* SINALIZADOR DE PRECISÃO (DEBUG - PONTO VERMELHO NA BASE) */}
            <div 
                style={{ 
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    width: '6px',
                    height: '6px',
                    background: 'red',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    pointerEvents: 'none',
                    boxShadow: '0 0 5px red'
                }} 
            />

            {/* SOMBRA DE CONTACTO (ALPHA) */}
            <div 
                style={{ 
                    position: 'absolute',
                    bottom: '-2px',
                    left: '25%',
                    width: '50%',
                    height: '10px',
                    background: 'rgba(0,0,0,0.2)',
                    filter: 'blur(10px)',
                    borderRadius: '100%',
                    zIndex: -1,
                    pointerEvents: 'none'
                }} 
            />

            {/* IMAGEM DO EDIFÍCIO - SEM QUALQUER FUNDO */}
            {assetPath && (
                <img 
                    src={assetPath} 
                    style={{ 
                        display: 'block',
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        mixBlendMode: 'lighten',
                        background: 'transparent',
                    }}
                    alt={name}
                />
            )}

            {/* HUD / LEVEL BADGE (MINIMALISTA ABSOLUTO - SEM CAIXAS) */}
            <div 
                style={{ 
                    position: 'absolute',
                    width: '100%',
                    bottom: '-5px',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}
            >
                <div style={{ 
                    display: 'inline-block',
                    color: '#0f0', 
                    fontSize: '10px', 
                    fontWeight: '900', 
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    textShadow: '1px 1px 2px black'
                }}>
                    {name.split(' ')[0]} L{level}
                </div>
            </div>

            {/* INDICADOR DE CONSTRUÇÃO */}
            {isConstructing && (
                <div style={{ 
                    position: 'absolute',
                    inset: 0,
                    border: '1px dashed #0f0',
                    animation: 'pulse 2s infinite'
                }} />
            )}
        </div>
    );
};
