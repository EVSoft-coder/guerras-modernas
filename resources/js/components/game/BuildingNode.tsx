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
 * BuildingNode V68 — MIRA DE PRECISÃO
 * Diagnóstico final com retículo de sniper para alinhamento de solo.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick 
}) => {
    // MODO DIAGNÓSTICO ATIVO
    const DEBUG_MODE = true; 

    // Dimensões da Mira (32x32)
    const size = 32;

    // Centralização absoluta no ponto (X, Y)
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
                background: 'rgba(255, 255, 255, 0.4)', // Vidro de Mira
                borderRadius: '50%',
                border: '2px solid red', // Retículo
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)',
                pointerEvents: 'auto'
            }}
        >
            {/* LINHAS DE RETÍCULO */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'red' }} />
            <div style={{ position: 'absolute', width: '1px', height: '100%', background: 'red' }} />
            
            <span style={{ 
                position: 'absolute', 
                color: 'white', 
                fontSize: '10px', 
                fontWeight: 'bold', 
                textShadow: '0 0 3px black, 0 0 6px black',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
            }}>
                {type.toUpperCase()}
            </span>
        </div>
    );
};

export default BuildingNode;
