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
 * BuildingNode V97 — PRODUÇÃO CONSOLIDADA
 * Motor de renderização puro com suporte a offsets e rotação estática.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing
}) => {
    const [isInvalid, setIsInvalid] = useState(false);

    // Métricas
    const w = layout.w;
    const h = layout.h;
    
    // Recuperamos o offset do banco de dados de design
    const currentOffset = (BUILDING_OFFSETS[layout.id] as any) || { x: 0, y: 0, rotation: 0 };
    const rotation = currentOffset.rotation || 0;
    
    const left = layout.x - (w / 2) + (currentOffset.x || 0);
    const top = layout.y - h + (currentOffset.y || 0); 

    const assetPath = `/assets/buildings/${layout.assetName || type.toLowerCase() + '.png'}`;

    return (
        <div 
            className="building-node group"
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
                cursor: 'pointer',
                transform: rotation ? `rotate(${rotation}deg)` : 'none'
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
                    <div className="flex items-center justify-center w-full h-full bg-red-900/10 border border-red-500/50 text-[10px] text-red-500">
                        ERR_ASSET
                    </div>
                )}
            </div>

            {/* Badge de Nível (Compensa a rotação estática) */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
                background: 'rgba(0, 0, 0, 0.85)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                textTransform: 'uppercase',
                zIndex: 20
            }}>
                <span className="opacity-60">{type.replace(/_/g, ' ')}</span>
                <span className="ml-2 text-cyan-400">LVL {level}</span>
                {isConstructing && <span className="ml-2 animate-pulse text-yellow-400">🔨</span>}
            </div>
        </div>
    );
};
