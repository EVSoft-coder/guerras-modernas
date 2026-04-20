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
 * BuildingNode V61 — ESCUDO DE FIDELIDADE
 * Sistema de bloqueio de assets inválidos com placeholder temporário.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    const DEBUG_MODE = false;
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Métrica Isométrica V60
    const w = layout.w;
    const h = layout.h || layout.w;
    const exactLeft = layout.x - (w / 2);
    const exactTop = layout.y - h;

    // SENTINELA DE RUNTIME V61: Border Audit via Canvas
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = `/images/buildings/${layout.assetName}`;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) { setIsValid(true); return; }
            
            canvas.width = 10;
            canvas.height = 10;
            // Desenha apenas o canto superior esquerdo (ponto crítico de checkerboard/bg)
            ctx.drawImage(img, 0, 0, 10, 10, 0, 0, 10, 10);
            const pixel = ctx.getImageData(0, 0, 1, 1).data;
            
            // Se o alpha for 255 (opaco) no canto, o asset é INVÁLIDO (tem fundo)
            const isOpaque = pixel[3] === 255;
            setIsValid(!isOpaque);
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
                justifyContent: 'center',
                overflow: 'visible'
            }}
        >
            {/* PONTO DE DIAGNÓSTICO (DEBUG) */}
            {DEBUG_MODE && (
                <div style={{ position: 'absolute', bottom: 0, left: '50%', width: 6, height: 6, background: 'red', borderRadius: '50%', transform: 'translate(-50%, 50%)', zIndex: 9999 }} />
            )}

            {isValid === false ? (
                /* PLACEHOLDER SIMPLES (Fase 4) */
                <div style={{
                    width: '60%',
                    height: '40%',
                    background: 'rgba(50, 50, 50, 0.8)',
                    border: '2px dashed #555',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(4px)'
                }}>
                    Invalid Asset
                </div>
            ) : (
                /* ASSET VALIDADO OU EM CARREGAMENTO */
                <img 
                    src={`/images/buildings/${layout.assetName}`}
                    alt={type}
                    style={{
                        height: '100%',     
                        width: 'auto',       
                        maxWidth: '100%',
                        display: isValid === null ? 'none' : 'block', // Esconde até validar
                        objectFit: 'contain',
                        objectPosition: 'bottom center',
                        filter: isConstructing ? 'grayscale(0.8) opacity(0.7)' : 'none',
                        pointerEvents: 'none'
                    }}
                />
            )}
        </div>
    );
};

export default BuildingNode;
