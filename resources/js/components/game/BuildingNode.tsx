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
                    }}
                    alt={type}
                />
            )}
        </div>
    );
};

export default BuildingNode;
