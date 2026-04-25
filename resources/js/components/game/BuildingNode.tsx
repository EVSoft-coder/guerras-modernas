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
            initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            whileHover={{ scale: 1.05 }}
            className="absolute cursor-pointer group building-node"
            style={{
                left: `${layout.x}px`,
                top: `${layout.y}px`,
                width: `${layout.w}px`,
                height: `${layout.h}px`,
                rotate: `${layout.rotation || 0}deg`,
                zIndex: Math.floor(layout.y),
                pointerEvents: 'auto'
            }}
            onClick={onClick}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {!isInvalid ? (
                    <div className="relative w-full h-full">
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
                                filter: isConstructing ? 'brightness(0.3) contrast(1.5) saturate(0)' : 'none',
                                opacity: isConstructing ? 0.6 : 1,
                                transition: 'all 0.5s ease-out'
                            }}
                            onError={() => setIsInvalid(true)}
                        />
                        {/* Persistent Tactical Aura */}
                        <div className={`absolute inset-0 rounded-full blur-[30px] opacity-0 group-hover:opacity-20 transition-all duration-700 ${isConstructing ? 'bg-orange-500' : 'bg-cyan-500'}`} />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-900/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                        <span className="text-[7px] text-red-500 font-black uppercase tracking-[0.2em] font-military-mono">Signal_Lost</span>
                    </div>
                )}

                {/* Tactical HUD Label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500 group-hover:-bottom-8">
                    <div className={`px-3 py-1 rounded-lg border backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center min-w-[80px] transition-all duration-500 ${
                        isConstructing 
                            ? 'bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/40' 
                            : 'bg-black/60 border-white/5 group-hover:border-cyan-500/30'
                    }`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <div className={`w-1 h-1 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'}`} />
                            <span className="text-[7px] text-neutral-500 font-black uppercase tracking-[0.3em] leading-none whitespace-nowrap">
                                {type.replace('_', ' ')}
                            </span>
                        </div>
                        <span className={`text-[11px] font-black font-military-mono leading-none tracking-tighter ${
                            isConstructing ? 'text-orange-400' : 'text-white group-hover:text-cyan-400'
                        }`}>
                            {isConstructing ? 'UNDER_CONST' : `LVL_${level.toString().padStart(2, '0')}`}
                        </span>
                    </div>
                    
                    {/* Perspective Line */}
                    <div className={`w-[1px] h-4 bg-gradient-to-b from-white/10 to-transparent transition-all duration-500 group-hover:h-6 ${
                        isConstructing ? 'from-orange-500/20' : 'group-hover:from-cyan-500/40'
                    }`} />
                </div>

                {/* Efeito de Obra Hi-Tech */}
                {isConstructing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
                         <div className="w-full h-full border border-orange-500/20 rounded-2xl animate-pulse overflow-hidden bg-orange-500/[0.03] backdrop-blur-[2px]">
                            <div className="absolute inset-0 opacity-[0.05]" 
                                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f97316, #f97316 2px, transparent 2px, transparent 10px)' }}></div>
                            <div className="absolute inset-0 scanline-effect opacity-10" />
                            <div className="absolute top-2 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                         </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
