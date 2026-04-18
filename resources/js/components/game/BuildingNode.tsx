import React, { useEffect, useRef } from 'react';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';
import { BUILDING_ASSETS } from '@/config/buildingAssets';

interface BuildingNodeProps {
    type: string;
    level: number;
    scale: number;
    isConstructing: boolean;
    name: string;
    onClick: () => void;
}

/**
 * BuildingNode — COMPONENTE DETERMINÍSTICO V12
 * Proibido: transform: translate, margins, percentages.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, 
    level, 
    isConstructing, 
    name, 
    onClick 
}) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!nodeRef.current) return;
        const style = window.getComputedStyle(nodeRef.current);
        const bg = style.backgroundColor;
        const pad = style.padding;

        if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            console.warn(`[QA ALERT] Building "${type}" detects invasive background: ${bg}`);
        }
        if (pad !== '0px') {
            console.warn(`[QA ALERT] Building "${type}" detects invasive padding: ${pad}`);
        }
    }, [type]);

    const layout = BUILDING_LAYOUT[type];
    if (!layout) return null;

    // CÁLCULO DE ANCORAGEM MÁSTER (V12.4 + V13 metadata)
    const assetConfig = BUILDING_ASSETS[type] || { width: 100, height: 100, anchor: 'bottom' };
    const width = assetConfig.width;
    const height = assetConfig.height;

    const left = layout.x - (width / 2);
    const top = layout.y - height; // Forçado para Bottom Alignment

    // Z-INDEX TÁTICO: BASEADO NO LIMITE INFERIOR (Y)
    const staticZ = Math.floor(layout.y);

    const [imgError, setImgError] = React.useState(false);

    // SELEÇÃO DE ASSET POR TIER (V20 — REPLICAÇÃO TRIBAL)
    let finalAssetName = layout.assetName;
    if (layout.tiers && !imgError) {
        // Encontrar o maior tier que o nível atual atingiu
        const activeTier = [...layout.tiers]
            .sort((a, b) => b.minLevel - a.minLevel)
            .find(t => level >= t.minLevel);
        
        if (activeTier) {
            finalAssetName = activeTier.assetName;
        }
    }

    const assetPath = finalAssetName 
        ? `/images/buildings/${finalAssetName}`
        : null;

    return (
        <div 
            id={`node-${type}`}
            ref={nodeRef}
            className="building-node"
            style={{ 
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: staticZ,
                cursor: 'pointer',
                pointerEvents: 'auto',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* INDICADOR DE CONSTRUÇÃO (ANDAIMES V20) */}
            {isConstructing && (
                <div style={{ 
                    position: 'absolute',
                    inset: '-10px',
                    border: '2px solid rgba(249,115,22,0.4)',
                    background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                    animation: 'pulse 2s infinite ease-in-out'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        fontSize: '8px',
                        color: '#f97316',
                        fontFamily: 'monospace',
                        fontWeight: 'black',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '1px 4px'
                    }}>CONST_MODE_ACTIVE</div>
                </div>
            )}

            {/* MARCADOR DE ASSENTAMENTO (DEBUG) */}
            <div style={{ 
                position: 'absolute',
                bottom: '0',
                left: '50%',
                width: '4px',
                height: '4px',
                background: '#00f',
                borderRadius: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                boxShadow: '0 0 4px #00f',
                opacity: 0.5
            }} />

            {assetPath && (
                <img 
                    src={assetPath} 
                    onError={() => setImgError(true)}
                    style={{ 
                        display: 'block',
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        mixBlendMode: 'screen',
                    }}
                    alt={name}
                />
            )}
        </div>
    );
};
