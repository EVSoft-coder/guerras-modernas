import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuildingLayout } from '@/config/buildingLayout';
import { TransparentImage } from '@/components/ui/TransparentImage';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    isConstructing?: boolean;
    onClick?: () => void;
}

export const BuildingNode = React.memo(({ type, level, layout, isConstructing, onClick }: BuildingNodeProps) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const assetPath = `/assets/buildings/${layout.assetName}`;

    return (
        <motion.div
            initial={{ opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, x: '-50%', y: '-50%' }}
            className="absolute cursor-pointer group building-node overflow-visible"
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
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
                                transition: 'opacity 0.5s ease-out'
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
 
                {/* Tactical HUD Label (Conditional Rendering for Performance) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, x: '-50%' }}
                            animate={{ opacity: 1, y: -16, x: '-50%' }}
                            exit={{ opacity: 0, y: 0, x: '-50%' }}
                            className="absolute bottom-full left-1/2 flex flex-col items-center pointer-events-none z-[999]"
                        >
                            <div className="relative bg-[#050608]/95 border border-white/10 rounded-lg shadow-[0_30px_70px_rgba(0,0,0,1)] backdrop-blur-2xl flex items-stretch overflow-hidden min-w-[200px]">
                                {/* Status Accent Line */}
                                <div className={`absolute top-0 left-0 w-full h-[1px] ${isConstructing ? 'bg-orange-500/50' : 'bg-cyan-500/30'}`} />
                                
                                {/* Left Side: Type Info */}
                                <div className="flex-1 px-5 py-3 flex flex-col justify-center border-r border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className={`w-1 h-1 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-cyan-500'}`} />
                                        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.3em] leading-none">ESTRUTURA</span>
                                    </div>
                                    <span className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                                        {type.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                {/* Right Side: Operational Level */}
                                <div className="bg-white/[0.05] px-6 py-3 flex flex-col items-center justify-center min-w-[90px]">
                                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1.5 leading-none text-center w-full">STATUS</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-[9px] font-black text-neutral-600 uppercase">LV</span>
                                        <span className="text-2xl font-black font-military-mono text-zinc-200 leading-none tracking-tighter">
                                            {level.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>

                                {isConstructing && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-950">
                                        <div className="h-full bg-orange-500 animate-pulse w-[40%]" />
                                    </div>
                                )}
                            </div>
                            <div className={`w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent ${isConstructing ? 'from-orange-500/40' : 'from-cyan-500/30'}`} />
                        </motion.div>
                    )}
                </AnimatePresence>

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
});
