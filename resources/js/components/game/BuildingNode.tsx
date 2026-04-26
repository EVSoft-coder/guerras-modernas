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

                {/* Tactical HUD Label (High Contrast & No Overlap) */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-4 z-50">
                    <div className="bg-black border border-white/20 rounded shadow-[0_20px_50px_rgba(0,0,0,1)] min-w-[150px]">
                        {/* Area 1: Nome */}
                        <div className="px-4 py-2 border-b border-white/10 text-center">
                            <span className="text-[13px] font-black text-white uppercase tracking-wider block">
                                {type.replace('_', ' ')}
                            </span>
                        </div>
                        
                        {/* Area 2: Nível */}
                        <div className="px-4 py-2 flex items-center justify-center gap-3 bg-white/[0.03]">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NÍVEL</span>
                            <span className="text-2xl font-black font-military-mono text-zinc-300">
                                {level.toString().padStart(2, '0')}
                            </span>
                        </div>

                        {isConstructing && (
                            <div className="bg-orange-500/10 py-1 border-t border-orange-500/20 text-center">
                                <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest animate-pulse">
                                    CONSTRUINDO
                                </span>
                            </div>
                        )}
                    </div>
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
