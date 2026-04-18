import React from 'react';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';

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

    // CÁLCULO DE ANCORAGEM (V12.1)
    const left = layout.x - (layout.w / 2);
    const top = layout.y - (layout.anchor === 'bottom' ? layout.h : layout.h / 2);

    const assetPath = layout.assetName 
        ? `/images/buildings/${layout.assetName}`
        : null;

    // Z-INDEX TÁTICO: BASEADO NO LIMITE INFERIOR (Y + H)
    const staticZ = Math.floor(layout.y + layout.h);

    return (
        <div 
            id={`node-${type}`}
            className="building-node"
            style={{ 
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${layout.w}px`,
                height: `${layout.h}px`,
                zIndex: staticZ,
                cursor: 'pointer',
                pointerEvents: 'auto',
                background: 'transparent'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* ASSET (FIX TEMPORÁRIO PARA TRANSPARÊNCIA) */}
            {assetPath && (
                <img 
                    src={assetPath} 
                    style={{ 
                        display: 'block',
                        width: `${layout.w}px`, 
                        height: `${layout.h}px`,
                        pointerEvents: 'none',
                        // PASSO 1 — MIX BLEND LIGHTEN
                        mixBlendMode: 'lighten',
                        background: 'transparent',
                        opacity: isConstructing ? 0.5 : 1
                    }}
                    alt={name}
                />
            )}

            {/* HUD (ABSOLUTO EM RELAÇÃO AO NODO) */}
            <div 
                style={{ 
                    position: 'absolute',
                    width: '100%',
                    top: '-15px',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}
            >
                <div style={{ 
                    display: 'inline-block',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(0,255,0,0.4)',
                    padding: '2px 6px',
                    borderRadius: '2px'
                }}>
                    <span style={{ 
                        color: '#0f0', 
                        fontSize: '9px', 
                        fontWeight: 'bold', 
                        fontFamily: 'monospace',
                        textTransform: 'uppercase'
                    }}>
                        {name} [LVL {level}]
                    </span>
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
