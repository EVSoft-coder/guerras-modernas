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
                    .village-root,
                    .village-root * {
                        all: unset;
                        box-sizing: border-box;
                        background: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .village-root {
                        position: relative;
                        display: block;
                        width: 800px;
                        height: 600px;
                    }
                    .village-root div {
                        position: absolute;
                    }
                    .village-root img {
                        display: block;
                        user-select: none;
                        background: transparent !important;
                    }
                    .village-root .building-node {
                        position: absolute !important;
                        padding: 0 !important;
                        cursor: pointer;
                        pointer-events: auto;
                    }
                `}</style>

                {/* CAMADA 1: background-layer */}
                <div 
                    id="background-layer" 
                    className="village-canvas"
                    style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                >
                    <img 
                        src="/assets/structures/v2/terrain_v12.png" 
                        className="village-bg"
                        style={{ 
                            width: '800px', 
                            height: '600px', 
                            objectFit: 'cover',
                            filter: 'brightness(0.9) contrast(1.2)'
                        }}
                        alt="Mapa Tático" 
                    />
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
                                scale={1}
                                isConstructing={isConstructing}
                                name={config?.name || type}
                                onClick={() => onBuildingClick({ id: type, buildingType: type, name: config?.name || type, level })}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
