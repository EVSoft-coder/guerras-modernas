import React from 'react';
import { BuildingLayout } from '@/config/buildingLayout';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    onClick: () => void;
    isConstructing?: boolean;
}

/**
 * BuildingNode — RESET V21
 * Implementação purista: posicionamento absoluto sem lógicas secundárias.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    const width = layout.w;
    const height = layout.h;

    // CÁLCULO DE POSIÇÃO RADICAL (Sem Offsets)
    const left = layout.x - (width / 2);
    const top = layout.anchor === 'bottom' 
        ? layout.y - height 
        : layout.y - (height / 2);

    const assetPath = layout.assetName 
        ? `/images/buildings/${layout.assetName}`
        : null;

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
                zIndex: Math.floor(layout.y),
                cursor: 'pointer',
                pointerEvents: 'auto',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {assetPath && (
                <img 
                    src={assetPath} 
                    style={{ 
                        display: 'block',
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        mixBlendMode: 'screen',
                    }}
                    alt={type}
                />
            )}
            
            {/* ETILQUETA DE NÍVEL SIMPLIFICADA */}
            <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                fontSize: '9px',
                padding: '1px 4px',
                borderRadius: '3px',
                pointerEvents: 'none',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap'
            }}>
                LVL {level}
            </div>
        </div>
    );
};

export default BuildingNode;
