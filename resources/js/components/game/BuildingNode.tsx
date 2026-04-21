import React, { useState } from 'react';
import { BuildingLayout, BUILDING_OFFSETS } from '@/config/buildingLayout';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    onClick: () => void;
    isConstructing?: boolean;
}

/**
 * BuildingNode V92 — MASTERPIECE V22
 * Renderização isométrica determinística com offsets persistidos para o novo terreno.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    const [isInvalid, setIsInvalid] = useState(false);

    // Lógica de Ancoragem
    const w = layout.w;
    const h = layout.h;
    
    // Recuperamos o offset do BUILDING_OFFSETS (V92 VALIDAÇÃO TÁTICA)
    const baseOffset = BUILDING_OFFSETS[layout.id] || { x: 0, y: 0 };
    
    const left = layout.x - (w / 2) + baseOffset.x;
    const top = layout.y - h + baseOffset.y; 

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
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isInvalid ? 'sepia(1) hue-rotate(-50deg) saturate(2)' : 'none',
                opacity: isInvalid ? 0.6 : 1,
                cursor: 'pointer'
            }}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {!isInvalid ? (
                    <img 
                        src={assetPath}
                        alt={type}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            filter: isConstructing ? 'grayscale(0.5) brightness(0.7)' : 'none'
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
                
                {/* Badge de Nível Tactical V92 */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    textTransform: 'uppercase'
                }}>
                    {type.replace(/_/g, ' ')} LVL {level}
                    {isConstructing && <span className="ml-1 text-yellow-400">🔨</span>}
                </div>
            </div>
        </div>
    );
};
