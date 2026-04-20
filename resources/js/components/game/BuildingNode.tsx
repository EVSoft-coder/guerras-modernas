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
 * BuildingNode V72 — RENDERIZAÇÃO FINAL
 * Fim do diagnóstico. Ativação dos ativos táticos sobre a grelha calibrada.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    // DESLIGANDO DIAGNÓSTICO PARA PRODUÇÃO
    const DEBUG_MODE = false; 
    const [imgError, setImgError] = useState(false);

    // Lógica de Ancoragem: A Base do edifício toca no Centro do Pad (layout.x, layout.y)
    const w = layout.w;
    const h = layout.h;
    const left = layout.x - (w / 2);
    const top = layout.y - h; 

    // Protocolo de Sombras e Efeitos
    const buildingSlug = type.toLowerCase();
    const assetPath = `/assets/buildings/${layout.assetName || buildingSlug + '.png'}`;

    return (
        <div 
            className={`building-node building-${buildingSlug}`}
            onClick={onClick}
            style={{ 
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${w}px`,
                height: `${h}px`,
                zIndex: Math.floor(layout.y), // Depth Sorting Automático
                cursor: 'pointer',
                transition: 'transform 0.2s ease-out, filter 0.2s',
                filter: isConstructing ? 'grayscale(0.5) contrast(0.8)' : 'none'
            }}
        >
            {/* O Edifício Real */}
            {!imgError ? (
                <img 
                    src={assetPath}
                    alt={type}
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        // Sombra Isométrica Suave
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'
                    }}
                    onError={() => setImgError(true)}
                />
            ) : (
                // Placeholder de fallback de alta fidelidade
                <div style={{ 
                    width: '100%', height: '100%', 
                    background: 'rgba(255,255,255,0.1)', 
                    border: '1px dashed white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '8px', color: 'white' }}>MISSING_{type}</span>
                </div>
            )}

            {/* Nome do Edifício (Elegante) */}
            <div style={{
                position: 'absolute',
                bottom: '-15px',
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px black',
                opacity: 0.8
            }}>
                {type.replace('_', ' ').toUpperCase()} (Lvl {level})
            </div>

            {/* Efeitos de Construção */}
            {isConstructing && (
                <div className="construction-ring" style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '60px', height: '30px', 
                    border: '2px solid gold', borderRadius: '50%',
                    animation: 'spin 2s linear infinite'
                }} />
            )}
        </div>
    );
};

export default BuildingNode;
