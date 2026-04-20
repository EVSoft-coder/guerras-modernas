import React, { useState, useEffect } from 'react';
import { BuildingLayout } from '@/config/buildingLayout';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    onClick: () => void;
    isConstructing?: boolean;
}

/**
 * BuildingNode V66 — ULTRA-CALIBRAÇÃO
 * Modo de diagnóstico via Balizas Vermelhas Gigantes.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    // MODO DIAGNÓSTICO ATIVO
    const DEBUG_MODE = true; 
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // No modo de calibração V66, focamos apenas no Red Dot
    const objW = 20; 
    const objH = 20;

    // CÁLCULO DE POSIÇÃO ABSOLUTA
    const left = layout.x - (objW / 2);
    const top = layout.y - (objH / 2); // Centralizado no ponto (X, Y)

    useEffect(() => {
        if (DEBUG_MODE) return;
        // ... Logica de imagem omitida para diagnóstico puro ...
    }, [layout.assetName]);

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
                background: 'red',
                borderRadius: '50%',
                boxShadow: '0 0 20px 5px rgba(255, 0, 0, 0.6)',
                border: '2px solid white'
            }}
        >
            <span style={{ position: 'absolute', top: '-25px', color: 'white', fontSize: '10px', fontWeight: 'bold', textShadow: '1px 1px 2px black', whiteSpace: 'nowrap' }}>
                {type.toUpperCase()}
            </span>
        </div>
    );
};

export default BuildingNode;
