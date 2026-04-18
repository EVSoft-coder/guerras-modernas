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
                        mixBlendMode: 'lighten',
                    }}
                    alt={name}
                />
            )}
        </div>
    );
};
