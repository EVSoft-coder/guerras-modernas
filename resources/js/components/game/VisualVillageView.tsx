import React from 'react';
import { Base } from '@/types';
import { BuildingNode } from './BuildingNode';
import { BUILDING_LAYOUT } from '@/config/buildingLayout';
import { LayoutCalibrator } from './LayoutCalibrator';

interface VillageViewProps {
    jogador: any;
    base: Base;
    onBuildingClick: (building: any) => void;
    gameConfig: any;
    buildingQueue: any[];
}

/**
 * VisualVillageView V97 — ESTADO FINAL DE PRODUÇÃO
 * Renderização pura e performática da base militar V22.
 */
export const VisualVillageView: React.FC<VillageViewProps> = ({ jogador, base, onBuildingClick, gameConfig, buildingQueue }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);
    const [showCalibrator, setShowCalibrator] = React.useState(false);
    const [currentLayout, setCurrentLayout] = React.useState(BUILDING_LAYOUT);

    const handleSaveLayout = (newLayout: any) => {
        setCurrentLayout(newLayout);
        setShowCalibrator(false);
        // Persistir no console para o desenvolvedor ver também
        console.log("NOVA CONFIGURAÇÃO TÁTICA:", JSON.stringify(newLayout, null, 4));
    };

    React.useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const parentWidth = containerRef.current.parentElement?.clientWidth || 0;
                if (parentWidth < 800) {
                    setScale(parentWidth / 800);
                } else {
                    setScale(1);
                }
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const getBuildingLevel = (type: string) => {
        const b = base.edificios?.find(e => (e.buildingType || e.tipo)?.toLowerCase() === type.toLowerCase());
        return b?.nivel || 0;
    };

    return (
        <div ref={containerRef} className="w-full flex flex-col items-center py-6 lg:py-12 bg-[#050608] overflow-hidden">
            <div 
                id="VillageCanvas"
                className="village-root shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-gray-900/50"
                style={{ 
                    position: 'relative', 
                    width: '800px', 
                    height: '600px', 
                    margin: '0 auto',
                    borderRadius: '12px',
                    backgroundColor: '#0a0c10',
                    overflow: 'visible',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    marginBottom: `-${600 * (1 - scale)}px`
                }}
            >
                {/* ... estilos e terreno ... */}
                <style>{`
                    .village-root {
                        all: initial;
                        position: relative;
                        display: block;
                        width: 800px;
                        height: 600px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        overflow: visible;
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
                    .building-node:hover {
                        filter: brightness(1.2) drop-shadow(0 0 10px rgba(0, 255, 255, 0.2)) !important;
                    }
                `}</style>

                <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <img 
                        src="/images/village/terrain_v30.png" 
                        style={{ width: '800px', height: '600px', objectFit: 'fill' }}
                        alt="Tactical Terrain V30"
                    />
                </div>

                <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                    {Object.entries(currentLayout).map(([type, layout]) => {
                        const b = base.edificios?.find(e => {
                            const eType = (e.buildingType || e.tipo)?.toLowerCase();
                            const lType = type.toLowerCase();
                            if (eType !== lType) return false;
                            
                            if (!e.pos_x || Number(e.pos_x) < 50) return true; 

                            return Number(e.pos_x) === layout.x && Number(e.pos_y) === layout.y;
                        });
                        const level = b?.nivel || 0;
                        const isConstructing = (buildingQueue || []).some(q => 
                            q.type === type && q.pos_x === layout.x && q.pos_y === layout.y
                        );
                        const config = gameConfig?.buildings?.[type];
                        
                        if (level === 0 && !isConstructing) return null;

                        return (
                            <BuildingNode
                                key={`${type}-${layout.x}-${layout.y}`}
                                type={type}
                                level={level}
                                layout={layout}
                                isConstructing={isConstructing}
                                onClick={() => onBuildingClick({ 
                                    ...b, 
                                    id: b?.id || null, 
                                    buildingType: type, 
                                    name: config?.name || type, 
                                    level,
                                    pos_x: layout.x,
                                    pos_y: layout.y
                                })}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
                    Sincronização Tática V30 - Operacional
                </span>
                {jogador?.username === 'admin' && (
                    <button 
                        onClick={() => setShowCalibrator(true)}
                        className="ml-4 px-2 py-0.5 border border-gray-800 hover:border-cyan-500/50 hover:text-cyan-400 text-[9px] text-gray-600 font-mono transition-all rounded uppercase"
                    >
                        [ Calibrar Layout ]
                    </button>
                )}
            </div>

            {showCalibrator && (
                <LayoutCalibrator 
                    onSave={handleSaveLayout}
                    onClose={() => setShowCalibrator(false)} 
                />
            )}
        </div>
    );
};
