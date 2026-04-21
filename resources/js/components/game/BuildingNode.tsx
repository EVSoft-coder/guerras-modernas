import React, { useState, useEffect } from 'react';
import { BuildingLayout, BUILDING_OFFSETS } from '@/config/buildingLayout';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    onClick: () => void;
    isConstructing?: boolean;
    isDraggable?: boolean;
    onDrag?: (id: string, deltaX: number, deltaY: number) => void;
    offset?: { x: number, y: number };
}

/**
 * BuildingNode V94 — MURALHA V2 UPGRADE
 * Renderização isométrica com suporte a calibração para o novo perímetro.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing, isDraggable, onDrag, offset
}) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isDraggable) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !onDrag) return;
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;
            onDrag(layout.id, deltaX, deltaY);
            setDragStart({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart, onDrag, layout.id]);

    // Lógica de Ancoragem
    const w = layout.w;
    const h = layout.h;
    
    // Recuperamos o offset
    const currentOffset = offset || BUILDING_OFFSETS[layout.id] || { x: 0, y: 0 };
    
    const left = layout.x - (w / 2) + currentOffset.x;
    const top = layout.y - h + currentOffset.y; 

    // Protocolo de Sombras e Efeitos
    const buildingSlug = type.toLowerCase();
    const assetPath = `/assets/buildings/${layout.assetName || buildingSlug + '.png'}`;

    return (
        <div 
            className={`building-node ${isDragging ? 'is-dragging' : ''}`}
            onClick={!isDraggable ? onClick : undefined}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${w}px`,
                height: `${h}px`,
                zIndex: isDragging ? 1000 : Math.floor(layout.y),
                transition: isDragging ? 'none' : 'transform 0.2s',
                filter: isInvalid ? 'sepia(1) hue-rotate(-50deg) saturate(2)' : 'none',
                opacity: isInvalid ? 0.6 : (isDragging ? 0.8 : 1),
                cursor: isDraggable ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                userSelect: 'none'
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
                            filter: isConstructing ? 'grayscale(0.5) brightness(0.7)' : 'none',
                            mixBlendMode: type === 'muralha' ? 'screen' : 'normal'
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
            </div>

            {/* Badge de Nível (Fora do transform) */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isDragging ? '#ff0055' : 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                textTransform: 'uppercase',
                zIndex: 20
            }}>
                {type.replace(/_/g, ' ')} LVL {level}
                {isConstructing && <span className="ml-1 text-yellow-400">🔨</span>}
                {isDraggable && <span className="ml-2">[X:{currentOffset.x} Y:{currentOffset.y}]</span>}
            </div>
        </div>
    );
};
