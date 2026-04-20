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
 * BuildingNode V67 — BALIZA NEON PULSE
 * Diagnóstico de alta visibilidade com pulsação tática.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick 
}) => {
    // MODO DIAGNÓSTICO ATIVO
    const DEBUG_MODE = true; 

    // Baliza Centralizada de 16x16
    const objW = 16; 
    const objH = 16;

    // Pouso Exato no ponto (X, Y)
    const left = layout.x - (objW / 2);
    const top = layout.y - (objH / 2);

    if (!DEBUG_MODE) return null; // Não renderiza nada fora do debug V67

    return (
        <div 
            className="building-node"
            onClick={onClick}
            style={{ 
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${objW}px`,
                height: `${objH}px`,
                zIndex: 9999,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ccff00', // Neon Yellow-Green
                borderRadius: '50%',
                boxShadow: '0 0 20px #ccff00, 0 0 40px rgba(204, 255, 0, 0.4)',
                border: '2px solid white',
                animation: 'pulse 1.5s infinite ease-in-out'
            }}
        >
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
            
            <span style={{ 
                position: 'absolute', 
                top: '20px', // Texto abaixo da baliza agora
                color: '#ccff00', 
                fontSize: '11px', 
                fontWeight: '900', 
                textShadow: '0 0 5px black, 0 0 10px black',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
            }}>
                {type.toUpperCase()}
            </span>
        </div>
    );
};

export default BuildingNode;
