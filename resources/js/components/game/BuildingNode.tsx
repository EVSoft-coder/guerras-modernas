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

                {/* Tactical HUD Context Modal (Hover) */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-16 z-50">
                    <div className={`relative px-8 py-5 rounded-2xl border-2 backdrop-blur-3xl shadow-[0_50px_120px_rgba(0,0,0,1)] flex flex-col items-center min-w-[220px] transition-all duration-500 ${
                        isConstructing 
                            ? 'bg-orange-500/30 border-orange-500/50' 
                            : 'bg-[#020406]/95 border-cyan-500/30 group-hover:border-cyan-500/60'
                    }`}>
                        {/* Corner Accents (Military Style) */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 rounded-br-lg" />

                        {/* System Identifier */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`} />
                            <span className="text-[9px] text-neutral-500 font-black uppercase tracking-[0.5em] leading-none">
                                SEC_ID: {type.substring(0, 3).toUpperCase()}
                            </span>
                        </div>

                        {/* Building Name (Large & Legible) */}
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1 filter drop-shadow-lg">
                            {type.replace('_', ' ')}
                        </h3>

                        <div className="w-full h-[1px] bg-white/10 my-2" />

                        {/* Level (Extra Large) */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">NÍVEL</span>
                            <span className="text-[32px] font-black font-military-mono leading-none tracking-tighter text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                                {level.toString().padStart(2, '0')}
                            </span>
                        </div>

                        {isConstructing && (
                            <div className="mt-4 py-2 px-5 bg-orange-500/20 rounded-xl border border-orange-500/40 animate-pulse">
                                <span className="text-[10px] font-black font-military-mono leading-none tracking-[0.2em] text-orange-400">
                                    UPGRADING_SYSTEM...
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Tactical Connector */}
                    <div className={`w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent transition-all duration-500 group-hover:h-12 ${
                        isConstructing ? 'from-orange-500/40' : 'group-hover:from-cyan-500/60'
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
