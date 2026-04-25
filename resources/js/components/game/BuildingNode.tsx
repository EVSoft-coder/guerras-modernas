import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BuildingLayout } from '@/config/buildingLayout';
import { TransparentImage } from '@/components/ui/TransparentImage';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    isConstructing?: boolean;
    onClick?: () => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({ type, level, layout, isConstructing, onClick }) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const assetPath = `/assets/buildings/${layout.assetName}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute cursor-pointer group building-node"
            style={{
                left: `${(layout.x / 800) * 100}%`,
                top: `${(layout.y / 600) * 100}%`,
                width: `${(layout.w / 800) * 100}%`,
                height: `${(layout.h / 600) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${layout.rotation || 0}deg)`,
                zIndex: Math.floor(layout.y),
                pointerEvents: 'auto'
            }}
            onClick={onClick}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {!isInvalid ? (
                    <TransparentImage 
                        src={assetPath}
                        alt={type}
                        targetColor={layout.transparency?.targetColor}
                        tolerance={layout.transparency?.tolerance || 30}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            filter: isConstructing ? 'brightness(0.4) contrast(1.3)' : 'none',
                            opacity: isConstructing ? 0.7 : 1
                        }}
                        onError={() => setIsInvalid(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-900/20 border border-red-500/50 rounded-lg">
                        <span className="text-[8px] text-red-500 font-black uppercase tracking-tighter">DATA_ERROR</span>
                    </div>
                )}

                {/* HUD de Nível */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow-xl flex flex-col items-center">
                        <span className="text-[8px] text-neutral-500 font-black uppercase tracking-widest leading-none mb-0.5">
                            {type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-black font-mono leading-none">
                            LVL {level}
                        </span>
                    </div>
                    {/* Indicador de Seleção */}
                    <div className="w-1 h-1 rounded-full bg-cyan-500 mt-1 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                </div>

                {/* Efeito de Obra */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-full h-full border border-orange-500/30 rounded-lg animate-pulse overflow-hidden bg-orange-500/5">
                            <div className="absolute inset-0 opacity-20" 
                                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f97316, #f97316 10px, transparent 10px, transparent 20px)' }}></div>
                         </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
