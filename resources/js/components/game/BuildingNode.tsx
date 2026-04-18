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
            className="building-node group transition-transform duration-200 ease-out hover:scale-[1.08]"
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
            {/* SOMBRA DE CONTACTO AAA */}
            <div 
                style={{ 
                    position: 'absolute',
                    bottom: '-5px',
                    left: '20%',
                    width: '60%',
                    height: '20px',
                    background: 'rgba(0,0,0,0.45)',
                    filter: 'blur(8px)',
                    borderRadius: '100%',
                    zIndex: -1,
                    pointerEvents: 'none'
                }} 
            />

            {/* ASSET (NORMALIZADO COM BLENDING LIGHTEN) */}
            {assetPath && (
                <img 
                    src={assetPath} 
                    style={{ 
                        display: 'block',
                        width: '100%', 
                        height: '100%',
                        pointerEvents: 'none',
                        mixBlendMode: 'lighten',
                        background: 'transparent',
                        filter: 'contrast(1.1)',
                        opacity: isConstructing ? 0.5 : 1
                    }}
                    alt={name}
                />
            )}

            {/* HUD / LEVEL BADGE (OFF-SET PARA EVITAR SOBREPOSIÇÃO) */}
            <div 
                style={{ 
                    position: 'absolute',
                    width: '140%',
                    left: '-20%',
                    bottom: '-10px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            >
                <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    border: '1px solid rgba(0,255,0,0.2)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    <span style={{ 
                        color: '#fff', 
                        fontSize: '8px', 
                        fontWeight: '800', 
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {name}
                    </span>
                    <span style={{ 
                        color: '#0f0', 
                        fontSize: '9px', 
                        fontWeight: 'bold',
                        paddingLeft: '4px',
                        borderLeft: '1px solid rgba(0,255,0,0.3)'
                    }}>
                        {level}
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
