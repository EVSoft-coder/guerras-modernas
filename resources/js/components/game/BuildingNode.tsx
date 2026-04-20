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
 * BuildingNode V69 — MIRA AZUL ELÉTRICO
 * Retículo de alta visibilidade contra concreto e areia.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick 
}) => {
    const DEBUG_MODE = true; 
    const size = 30; // Mira compacta

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
                zIndex: 9999,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 242, 255, 0.2)', // Brilho Azul
                borderRadius: '50%',
                border: '2px solid #00f2ff', // Mira Azul Elétrico
                boxShadow: '0 0 15px #00f2ff',
                pointerEvents: 'auto'
            }}
        >
            {/* RETÍCULO DE PRECISÃO */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', background: '#00f2ff' }} />
            <div style={{ position: 'absolute', width: '1px', height: '100%', background: '#00f2ff' }} />
            
            <span style={{ 
                position: 'absolute', 
                color: '#00f2ff', 
                fontSize: '9px', 
                fontWeight: '900', 
                textShadow: '0 0 4px black, 0 0 8px black',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                bottom: '-15px'
            }}>
                {type.toUpperCase()}
            </span>
        </div>
    );
};

export default BuildingNode;
