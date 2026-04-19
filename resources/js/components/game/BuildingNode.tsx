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
 * BuildingNode — ANCHOR FINAL V49
 * Implementação de coordenadas absolutas explícitas:
 * Left = X - W/2
 * Top  = Y - H
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    const DEBUG_MODE = false;

    // Dimensões do Layout (V40)
    const w = layout.w;
    const h = layout.h || layout.w;

    // CÁLCULO DE ÂNCORA FINAL (FASE 6)
    const exactLeft = layout.x - (w / 2);
    const exactTop = layout.y - h;

    return (
        <div 
            className="building-node"
            onClick={onClick}
            style={{ 
                position: 'absolute',
                left: `${exactLeft}px`,
                top: `${exactTop}px`,
                width: `${w}px`,
                height: `${h}px`,
                zIndex: Math.floor(layout.y),
                transition: 'none', // Estabilidade total no posicionamento
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'visible' // Garante que transparências de sobra não cortem
            }}
        >
            {/* PONTO DE DIAGNÓSTICO (ANCHOR REAL) */}
            {DEBUG_MODE && (
                <div className="anchor-point" 
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        width: '6px',
                        height: '6px',
                        background: '#ff0000',
                        borderRadius: '50%',
                        transform: 'translate(-50%, 50%)',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }} 
                />
            )}

            <img 
                src={`/images/buildings/${layout.assetName}`}
                alt={type}
                style={{
                    height: '100%',     
                    width: 'auto',       
                    maxWidth: '100%',   // Segurança contra distorsão
                    display: 'block',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    filter: isConstructing ? 'grayscale(0.8) opacity(0.7)' : 'none',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default BuildingNode;
