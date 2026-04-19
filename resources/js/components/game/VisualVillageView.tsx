import React, { useState, useRef, useEffect } from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    
    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        const b = base.edificios?.find(e => (e.buildingType || e.tipo)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div className="w-full flex justify-center py-8 bg-[#050608]">
            <div 
                id="VillageCanvas"
                className="village-root"
                style={{ 
                    position: 'relative', 
                    width: '800px', 
                    height: '600px', 
                    margin: '0 auto',
                    overflow: 'hidden',
                }}
            >
                <style>{`
                    .village-root {
                        all: initial;
                        position: relative;
                        display: block;
                        width: 800px;
                        height: 600px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        overflow: hidden;
                    }
                    .village-root * {
                        box-sizing: border-box;
                        background: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .village-root div {
                        position: absolute;
                    }
                    .village-root img {
                        display: block;
                        user-select: none;
                        background: transparent !important;
                        pointer-events: none;
                    }
                    .village-root .building-node {
                        position: absolute !important;
                        padding: 0 !important;
                        cursor: pointer;
                        pointer-events: auto;
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                `}</style>

                    {/* CAMADA 1: background-layer (SOLO PROCEDURAL V31) */}
                    <div 
                        id="background-layer" 
                        className="village-canvas"
                        style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            zIndex: 1,
                            background: '#1a1c20', 
                        }}
                    >
                        {/* TEXTURA DE AREIA BASE */}
                        <img 
                            src="/images/village/terrain_v13.png" 
                            style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '800px',
                                height: '600px',
                                objectFit: 'cover',
                                pointerEvents: 'none',
                                opacity: 0.4,
                                filter: 'grayscale(0.5) contrast(1.2)'
                            }}
                            alt="Sand Texture"
                        />

                        {/* SLOTS DE BETÃO AUTO-GENERADOS (Para TODOS os edifícios) */}
                        {Object.entries(BUILDING_LAYOUT).map(([type, layout]) => {
                             const level = getBuildingLevel(type);
                             const isConstructing = (buildingQueue || []).some(q => q.type === type);
                             // Apenas mostrar slot se o edifício existir ou estiver em construção
                             if (level === 0 && !isConstructing) return null;

                             return (
                                <div 
                                    key={`pad-${type}`}
                                    style={{
                                        position: 'absolute',
                                        left: `${layout.x}px`,
                                        top: `${layout.y}px`,
                                        width: `${layout.w * 1.1}px`,
                                        height: `${layout.w * 0.6}px`,
                                        background: 'radial-gradient(ellipse at center, #333 0%, #222 50%, transparent 70%)',
                                        border: '2px solid rgba(255,255,255,0.05)',
                                        borderRadius: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4)',
                                        zIndex: 1,
                                        opacity: 0.8
                                    }}
                                >
                                    {/* Detalhe de textura de betão no pad */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: '10%',
                                        border: '1px solid rgba(255,255,255,0.03)',
                                        borderRadius: '50%',
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                                    }} />
                                </div>
                             );
                        })}
                    </div>

                {/* CAMADA 2: buildings-layer */}
                <div 
                    id="buildings-layer"
                    className="buildings-layer"
                    style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                >
                    {Object.entries(BUILDING_LAYOUT).map(([type, layout]) => {
                        const level = getBuildingLevel(type);
                        const isConstructing = (buildingQueue || []).some(q => q.type === type);
                        const config = gameConfig?.buildings?.[type];
                        
                        if (level === 0 && !isConstructing) return null;

                        return (
                            <BuildingNode
                                key={type}
                                type={type}
                                level={level}
                                layout={layout}
                                isConstructing={isConstructing}
                                onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
