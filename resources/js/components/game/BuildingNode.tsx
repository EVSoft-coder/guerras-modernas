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
 * BuildingNode V70 — BALIZA DE FOGO EXTREMO
 * Máxima visibilidade para validação final de solo.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick 
}) => {
    const DEBUG_MODE = true; 
    const size = 40; // Baliza Grande

    const left = layout.x - (size / 2);
    const top = layout.y - (size / 2);

    if (!DEBUG_MODE) return null;

    return (
        <div 
            className="building-node"
            onClick={onClick}
            style={{ 
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: 10000,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ff0000', // Vermelho Puro
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
                pointerEvents: 'auto'
            }}
        >
            <span style={{ 
                color: 'white', 
                fontSize: '9px', 
                fontWeight: '900', 
                textShadow: '1px 1px 2px black',
                textAlign: 'center',
                pointerEvents: 'none',
                lineHeight: '1'
            }}>
                {type.replace('_', '\n').toUpperCase()}
            </span>
        </div>
    );
};

export default BuildingNode;
