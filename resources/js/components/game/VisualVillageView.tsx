import React, { useState, useEffect } from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { BUILDING_LAYOUT, BUILDING_OFFSETS } from '@/config/buildingLayout';

interface VillageViewProps {
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

/**
 * VisualVillageView V96 — CALIBRAÇÃO TOTAL ALPHA
 * Permite arraste, rotação e gera configuração consolidada.
 */
export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    const [isCalibrationMode, setIsCalibrationMode] = useState(false);
    const [offsets, setOffsets] = useState<Record<string, { x: number, y: number, rotation?: number }>>(
        BUILDING_OFFSETS as any
    );

    const handleDrag = (id: string, deltaX: number, deltaY: number) => {
        setOffsets(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                x: (prev[id]?.x || 0) + deltaX,
                y: (prev[id]?.y || 0) + deltaY
            }
        }));
    };

    const handleRotate = (id: string, deltaDeg: number) => {
        setOffsets(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                rotation: ((prev[id]?.rotation || 0) + deltaDeg) % 360
            }
        }));
    };

    const saveCalibration = () => {
        console.log("=== NOVO BUILDING_OFFSETS VALIDAÇÃO V96 ===");
        console.log(JSON.stringify(offsets, null, 4));
        alert("Configuração V96 gerada na Console. Envia para o Antigravity!");
    };

    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        const b = base.edificios?.find(e => (e.buildingType || e.tipo)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div className="w-full flex flex-col items-center py-8 bg-[#050608]">
            <div className="mb-4 flex gap-4 z-[9999]">
                <button 
                    onClick={() => setIsCalibrationMode(!isCalibrationMode)}
                    className={`px-4 py-2 rounded font-bold text-sm transition-all shadow-lg ${
                        isCalibrationMode ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400' : 'bg-gray-800 text-gray-400'
                    }`}
                >
                    {isCalibrationMode ? '🟡 CALIBRAÇÃO ATIVA (CLIQUE DIR. = RODAR)' : '🔘 AJUSTAR BASE (V96)'}
                </button>
                {isCalibrationMode && (
                    <button 
                        onClick={saveCalibration}
                        className="px-4 py-2 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-500 shadow-lg"
                    >
                        💾 EXPORTAR CONFIG V96
                    </button>
                )}
            </div>

            <div 
                id="VillageCanvas"
                className="village-root shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-900"
                style={{ 
                    position: 'relative', 
                    width: '800px', 
                    height: '600px', 
                    margin: '0 auto',
                    borderRadius: '8px',
                    backgroundColor: '#0a0c10'
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
                    }
                    .village-root div {
                        position: absolute;
                    }
                    .village-root .building-node {
                        pointer-events: auto;
                    }
                    .is-dragging {
                        opacity: 0.6 !important;
                        filter: brightness(1.5) !important;
                    }
                `}</style>

                {/* CAMADA 1: TERRENO V22 */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <img 
                        src="/images/village/terrain_v22.png" 
                        style={{ width: '800px', height: '600px', objectFit: 'fill' }}
                        alt="Tactical Terrain V22"
                    />
                </div>

                {/* CAMADA 2: EDIFÍCIOS */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
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
                                isDraggable={isCalibrationMode}
                                onDrag={handleDrag}
                                onRotate={handleRotate}
                                offset={offsets[layout.id]}
                            />
                        );
                    })}
                </div>
            </div>

            {isCalibrationMode && (
                <p className="mt-4 text-xs text-gray-500 font-mono uppercase tracking-widest">
                    Manual: Mouse Esqu. (Arrastar) | Mouse Dir. (Rodar -45º) | Ctrl+Click (Rodar +45º)
                </p>
            )}
        </div>
    );
};
