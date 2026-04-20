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
 * BuildingNode V62 — PLACEHOLDER CONTROLADO
 * Modo de diagnóstico para validação de layout independente de assets.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    // FASE 5: ATIVAR VISÃO DE RAIO-X
    const DEBUG_MODE = true; 
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Métrica Isométrica V60
    const w = layout.w;
    const h = layout.h || layout.w;
    const exactLeft = layout.x - (w / 2);
    const exactTop = layout.y - h;

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = `/images/buildings/${layout.assetName}`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) { setIsValid(true); return; }
            canvas.width = 10; canvas.height = 10;
            ctx.drawImage(img, 0, 0, 10, 10, 0, 0, 10, 10);
            const pixel = ctx.getImageData(0, 0, 1, 1).data;
            setIsValid(pixel[3] !== 255);
        };
        img.onerror = () => setIsValid(false);
    }, [layout.assetName]);

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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
            }}
        >
            {/* FASE 5: PLACEHOLDER CONTROLADO (VISÃO DE GRELHA) */}
            {DEBUG_MODE ? (
                <div 
                    className="building-placeholder"
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(0, 255, 0, 0.3)',
                        border: '2px solid lime',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'lime',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    {type.toUpperCase()}
                </div>
            ) : (
                isValid === false ? (
                    <div style={{ width: '60%', height: '40%', background: 'rgba(50, 50, 50, 0.8)', border: '2px dashed #555', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '10px', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                        Invalid Asset
                    </div>
                ) : (
                    <img 
                        src={`/images/buildings/${layout.assetName}`}
                        alt={type}
                        style={{ height: '100%', width: 'auto', maxWidth: '100%', display: isValid === null ? 'none' : 'block', objectFit: 'contain', objectPosition: 'bottom center', filter: isConstructing ? 'grayscale(0.8) opacity(0.7)' : 'none', pointerEvents: 'none' }}
                    />
                )
            )}
        </div>
    );
};

export default BuildingNode;
