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

export const VisualVillageView: React.FC<VillageViewProps> = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
    // ESTADO DE CALIBRAÇÃO V88
    const [isCalibrationMode, setIsCalibrationMode] = useState(false);
    const [offsets, setOffsets] = useState<Record<string, { x: number, y: number }>>(BUILDING_OFFSETS);

    const handleDrag = (id: string, deltaX: number, deltaY: number) => {
        setOffsets(prev => ({
            ...prev,
            [id]: {
                x: (prev[id]?.x || 0) + deltaX,
                y: (prev[id]?.y || 0) + deltaY
            }
        }));
    };

    const saveCalibration = () => {
        console.log("=== NOVO BUILDING_OFFSETS VALIDAÇÃO ===");
        console.log(JSON.stringify(offsets, null, 4));
        alert("Configuração gerada na Console (F12). Envia para o Antigravity!");
    };

    const getBuildingLevel = (type: string) => {
        if (type === 'qg') return base.qg_nivel || 0;
        if (type === 'muralha') return base.muralha_nivel || 0;
        const b = base.edificios?.find(e => (e.buildingType || e.tipo)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div className="w-full flex flex-col items-center py-8 bg-[#050608]">
            {/* PAINEL DE CONTROLO DE CALIBRAÇÃO (TEMP) */}
            <div className="mb-4 flex gap-4 z-[9999]">
                <button 
                    onClick={() => setIsCalibrationMode(!isCalibrationMode)}
                    className={`px-4 py-2 rounded font-bold text-sm transition-all ${
                        isCalibrationMode ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-400'
                    }`}
                >
                    {isCalibrationMode ? '🟡 MODO DRAG ATIVO' : '🔘 ATIVAR CALIBRAÇÃO'}
                </button>
                {isCalibrationMode && (
                    <button 
                        onClick={saveCalibration}
                        className="px-4 py-2 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-500"
                    >
                        💾 GERAR CONFIG (CONSOLE)
                    </button>
                )}
            </div>

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
                    .is-dragging {
                        opacity: 0.8 !important;
                        z-index: 9999 !important;
                    }
                `}</style>

                    {/* CAMADA 1: background-layer (TERRENO NÚ V21) */}
                    <div 
                        id="background-layer" 
                        className="village-canvas"
                        style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            zIndex: 1,
                            background: '#0a0c10', 
                        }}
                    >
                        <img 
                            src="/images/village/terrain_v21.png" 
                            style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '800px',
                                height: '600px',
                                objectFit: 'fill',
                                pointerEvents: 'none',
                                opacity: 1,
                            }}
                            alt="Village Terrain Naked V21"
                        />
                    </div>

                    {/* CAMADA 1.5: PADS-LAYER (FUSÃO DINÂMICA) */}
                    <div id="pads-layer" style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
                        {Object.entries(BUILDING_LAYOUT).map(([type, layout]) => {
                            const level = getBuildingLevel(type);
                            const isConstructing = (buildingQueue || []).some(q => q.type === type);
                            if (level === 0 && !isConstructing) return null;

                            // Métrica Isométrica V58
                            let w = 140;
                            let h = 80;
                            
                            if (type === 'qg') {
                                w = 220; // Solicitado Fase 2
                                h = 130; // Solicitado Fase 2
                            } else if (type === 'aerodromo' || type === 'muralha') {
                                w = 180;
                                h = 100;
                            }

                            return (
                                <div 
                                    key={`pad-${type}`}
                                    style={{
                                        position: 'absolute',
                                        left: `${layout.x}px`,
                                        top: `${layout.y}px`,
                                        width: `${w}px`,
                                        height: `${h}px`,
                                        background: 'rgba(0, 0, 0, 0.25)', 
                                        backdropFilter: 'blur(2px)',       
                                        WebkitBackdropFilter: 'blur(2px)',
                                        borderRadius: '50%',
                                        transform: 'translate(-50%, -50%) rotate(-15deg)', // ROTAÇÃO V57
                                        border: '1px solid rgba(255,255,255,0.05)', 
                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 2px 10px rgba(0,0,0,0.4)',
                                    }}
                                />
                            );
                        })}
                    </div>

                {/* CAMADA 2: buildings-layer (STACKING ISOMÉTRICO) */}
                <div 
                    id="buildings-layer"
                    className="buildings-layer"
                    style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        zIndex: 10, // Camada acima dos pads
                        isolation: 'auto', 
                        pointerEvents: 'none' 
                    }}
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
                                isDraggable={isCalibrationMode}
                                onDrag={handleDrag}
                                offset={offsets[layout.id]}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
