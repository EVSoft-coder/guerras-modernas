import React, { useState, useEffect } from 'react';
import { BuildingLayout, BUILDING_OFFSETS } from '@/config/buildingLayout';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    onClick: () => void;
    isConstructing?: boolean;
}

/**
 * BuildingNode V86 — DEBUG PROFISSIONAL
 * Modo de calibração em tempo real p/ ajuste fino de offsets.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    // MODO DE CALIBRAÇÃO DESATIVADO (OFFSETS PERSISTIDOS V87)
    const CALIBRATION_MODE = false; 
    
    const [isInvalid, setIsInvalid] = useState(false);
    
    // Estado local para calibração em tempo real (não persiste no arquivo, mas ajuda a encontrar os valores)
    const initialOffset = BUILDING_OFFSETS[layout.id] || { x: 0, y: 0 };
    const [calibratedX, setCalibratedX] = useState(initialOffset.x);
    const [calibratedY, setCalibratedY] = useState(initialOffset.y);

    const handleInteraction = (e: React.MouseEvent) => {
        if (!CALIBRATION_MODE) {
            onClick();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'click') {
            // Click Esquerdo: Desce o edifício
            setCalibratedY(prev => prev + 2);
        } else if (e.type === 'contextmenu') {
            // Click Direito: Sobe o edifício
            setCalibratedY(prev => prev - 2);
        }
    };

    // Lógica de Ancoragem: A Base do edifício toca no Centro do Pad (layout.x, layout.y)
    const w = layout.w;
    const h = layout.h;
    
    // Cálculo de Posição Normalizado: Centro do Pad + Offset Calibrado
    const left = layout.x - (w / 2) + calibratedX;
    const top = layout.y - h + calibratedY; 
    const labelY = -20; 

    // Protocolo de Sombras e Efeitos
    const buildingSlug = type.toLowerCase();
    const assetPath = `/assets/buildings/${layout.assetName || buildingSlug + '.png'}`;

    return (
        <div 
            className="building-node"
            onClick={handleInteraction}
            onContextMenu={handleInteraction}
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${w}px`,
                height: `${h}px`,
                zIndex: Math.floor(layout.y),
                transition: CALIBRATION_MODE ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isInvalid ? 'sepia(1) hue-rotate(-50deg) saturate(2)' : 'none',
                opacity: isInvalid ? 0.6 : 1,
                cursor: CALIBRATION_MODE ? 'crosshair' : 'pointer'
            }}
        >
            {/* Overlay de Calibração */}
            {CALIBRATION_MODE && (
                <div style={{
                    position: 'absolute',
                    bottom: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ff0055',
                    color: 'white',
                    fontSize: '9px',
                    padding: '1px 3px',
                    borderRadius: '2px',
                    zIndex: 100,
                    pointerEvents: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(255,0,85,0.5)'
                }}>
                    X:{calibratedX} Y:{calibratedY}
                </div>
            )}

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
