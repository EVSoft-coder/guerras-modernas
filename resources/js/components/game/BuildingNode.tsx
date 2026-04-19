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
 * BuildingNode — PUREZA TOTAL V24
 * Renderização atómica sem elementos de UI ou estilos residuais.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, layout, onClick 
}) => {
    const width = layout.w;
    const height = layout.h;

    // POSICIONAMENTO PURO
    const left = layout.x - (width / 2);
    const top = layout.anchor === 'bottom' 
        ? layout.y - height 
        : layout.y - (height / 2);

    // Z-INDEX DE PROFUNDIDADE (Doutrina V24)
    const staticZ = Math.floor(layout.y + height);

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
                zIndex: staticZ,
                cursor: 'pointer',
                pointerEvents: 'auto',
                // PUREZA TOTAL: Reset Forçado
                background: 'none',
                boxShadow: 'none',
                padding: 0,
                border: 'none',
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
