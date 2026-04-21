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
    onRotate?: (id: string, deltaDeg: number) => void;
    offset?: { x: number, y: number, rotation?: number };
}

/**
 * BuildingNode V96 — MURALHA V2 TRANSPARENTE + ROTAÇÃO MANUAL
 * Suporte a calibração total: arraste e rotação.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing, isDraggable, onDrag, onRotate, offset
}) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isDraggable) return;
        e.preventDefault();
        e.stopPropagation();
        
        // Clique direito (ou Ctrl + Click) para rotar
        if (e.button === 2 || e.ctrlKey) {
            if (onRotate) onRotate(layout.id, 45);
            return;
        }

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    // Prevenir menu de contexto em modo de calibração
    const handleContextMenu = (e: React.MouseEvent) => {
        if (isDraggable) {
            e.preventDefault();
            if (onRotate) onRotate(layout.id, -45);
        }
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
    
    // Recuperamos o offset (agora com suporte a rotation)
    const currentOffset = offset || (BUILDING_OFFSETS[layout.id] as any) || { x: 0, y: 0, rotation: 0 };
    const rotation = currentOffset.rotation || 0;
    
    const left = layout.x - (w / 2) + (currentOffset.x || 0);
    const top = layout.y - h + (currentOffset.y || 0); 

    const assetPath = `/assets/buildings/${layout.assetName || type.toLowerCase() + '.png'}`;

    return (
        <div 
            className={`building-node ${isDragging ? 'is-dragging' : ''}`}
            onClick={!isDraggable ? onClick : undefined}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
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
                userSelect: 'none',
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

            {/* Badge de Nível (Compensar a rotação para ficar legível) */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
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
                {isDraggable && <span className="ml-2">[X:{currentOffset.x} Y:{currentOffset.y} R:{rotation}º]</span>}
            </div>
        </div>
    );
};
