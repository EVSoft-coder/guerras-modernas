import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BuildingLayout, BUILDING_OFFSETS } from '@/config/buildingLayout';
import { TransparentImage } from '@/components/ui/TransparentImage';

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
    
    // Recuperamos o offset do banco de dados de design (Retrocompatibilidade)
    const currentOffset = (BUILDING_OFFSETS[layout.id] as any) || { x: 0, y: 0, rotation: 0 };
    const rotation = layout.rotation !== undefined ? layout.rotation : (currentOffset.rotation || 0);
    
    const left = layout.x - (w / 2) + (currentOffset.x || 0);
    const top = layout.y - (h / 2) + (currentOffset.y || 0); 

    const assetPath = `/assets/buildings/${layout.assetName || type.toLowerCase() + '.png'}`;

    return (
        <motion.div 
            className="building-node group"
            onClick={onClick}
            whileHover={{ scale: 1.05, zIndex: 1000 }}
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${w}px`,
                height: `${h}px`,
                zIndex: Math.floor(layout.y),
                filter: isInvalid ? 'sepia(1) hue-rotate(-50deg) saturate(2)' : 'none',
                opacity: isInvalid ? 0.6 : 1,
                cursor: 'pointer',
                transform: rotation ? `rotate(${rotation}deg)` : 'none'
            }}
        >
            {isConstructing && (
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
                />
            )}
            
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {!isInvalid ? (
                    <TransparentImage 
                        src={assetPath}
                        alt={type}
                        removeColor={{ r: 10, g: 12, b: 16, tolerance: 40 }} // Tentar remover tons escuros do fundo
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
                background: isConstructing ? 'rgba(234, 179, 8, 0.9)' : 'rgba(0, 0, 0, 0.85)',
                color: isConstructing ? '#000' : '#fff',
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
                <span className={isConstructing ? 'opacity-80' : 'opacity-60'}>{type.replace(/_/g, ' ')}</span>
                <span className={`ml-2 ${isConstructing ? 'font-black' : 'text-cyan-400'}`}>
                    {isConstructing ? 'EM OBRA' : `LVL ${level}`}
                </span>
            </div>
        </motion.div>
    );
};
