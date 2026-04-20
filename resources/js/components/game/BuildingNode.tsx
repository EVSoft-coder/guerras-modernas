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
 * BuildingNode V63 — ANCHOR SYSTEM
 * Calibração final de assentamento: Base do objeto toca o centro do pad.
 * Fórmula: left = x - w/2 | top = y - h
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    // MODO DIAGNÓSTICO ATIVO
    const DEBUG_MODE = true; 
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Dimensões do Objeto (80x80 para Placeholder)
    const objW = DEBUG_MODE ? 80 : layout.w;
    const objH = DEBUG_MODE ? 80 : (layout.h || layout.w);

    // CÁLCULO DE POSIÇÃO ABSOLUTA (Fase 6)
    const left = layout.x - (objW / 2);
    const top = layout.y - objH;

    useEffect(() => {
        if (DEBUG_MODE) return;
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
                left: `${left}px`,
                top: `${top}px`,
                width: `${objW}px`,
                height: `${objH}px`,
                zIndex: Math.floor(layout.y),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end', // Garante que o conteúdo toca o fundo
                justifyContent: 'center'
            }}
        >
            {DEBUG_MODE ? (
                /* FASE 6: ANCHOR SYSTEM (Placeholder Lime) */
                <div 
                    className="building-placeholder"
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 255, 0, 0.3)',
                        border: '2px solid lime',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'lime',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        boxShadow: '0 0 15px rgba(0,255,0,0.2)'
                    }}
                >
                    {type.toUpperCase()}
                </div>
            ) : (
                isValid === false ? (
                    <div style={{ width: '60%', height: '40%', background: 'rgba(50, 50, 50, 0.8)', border: '2px dashed #555', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '10px', fontWeight: 'bold' }}>
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
