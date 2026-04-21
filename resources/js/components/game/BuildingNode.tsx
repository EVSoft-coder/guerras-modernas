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
    const [isInvalid, setIsInvalid] = useState(false);

    // Lógica de Ancoragem: A Base do edifício toca no Centro do Pad (layout.x, layout.y)
    const w = layout.w;
    const h = layout.h;
    
    // As coordenadas (layout.x, layout.y) marcam o centro PERFEITO do pad no chão.
    // Aplicamos xOffset/yOffset para corrigir o crop da imagem 3D de forma a que a sua "massa visual" 
    // se alinhe com o centro do pad, compensando assimetrias PNG.
    const left = layout.x - (w / 2) + (layout.xOffset || 0);
    const top = layout.y - h + (layout.yOffset || 0); 
    const labelY = -20; 

    // Protocolo de Sombras e Efeitos
    const buildingSlug = type.toLowerCase();
    const assetPath = `/assets/buildings/${layout.assetName || buildingSlug + '.png'}`;

    return (
        <div 
            className="building-node"
            onClick={onClick}
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${w}px`,
                height: `${h}px`,
                zIndex: Math.floor(layout.y),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isInvalid ? 'sepia(1) hue-rotate(-50deg) saturate(2)' : 'none',
                opacity: isInvalid ? 0.6 : 1,
            }}
        >
            {/* Asset Visual */}
            {!isInvalid ? (
                <img 
                    src={assetPath} 
                    alt={type}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: isConstructing ? 'grayscale(0.5) brightness(0.7)' : 'none',
                    }}
                    onError={() => setIsInvalid(true)}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,0,0,0.1)',
                    border: '1px dashed red',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'red'
                }}>
                    INVALID ASSET
                </div>
            )}

            {/* Tactical Label */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: `${labelY}px`,
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 20
            }}>
                <span style={{
                    background: 'rgba(0,0,0,0.7)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                    {type.replace(/_/g, ' ')} (Lvl {level})
                    {isConstructing && <span className="ml-1 text-yellow-400">🔨</span>}
                </span>
            </div>
        </div>
    );
};

export default BuildingNode;
