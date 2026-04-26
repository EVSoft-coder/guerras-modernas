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
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-bottom-12">
                    {/* Header Pill: Building Name */}
                    <div className={`px-4 py-1 rounded-t-xl border-x border-t backdrop-blur-md transition-colors duration-500 ${
                        isConstructing ? 'bg-orange-500/10 border-orange-500/30' : 'bg-black/90 border-white/10 group-hover:border-cyan-500/30'
                    }`}>
                        <span className="text-[8px] text-neutral-500 font-black uppercase tracking-[0.4em] leading-none whitespace-nowrap">
                            {type.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Main Container: Level & Status */}
                    <div className={`px-6 py-3 rounded-b-2xl border-x border-b backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,1)] flex flex-col items-center min-w-[130px] transition-all duration-500 ${
                        isConstructing 
                            ? 'bg-orange-500/20 border-orange-500/40' 
                            : 'bg-black/95 border-white/10 group-hover:border-cyan-500/50'
                    }`}>
                        <div className="relative">
                            <span className="text-[20px] font-black font-military-mono leading-none tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                LVL_{level.toString().padStart(2, '0')}
                            </span>
                            <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isConstructing ? 'bg-orange-500 animate-pulse' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`} />
                        </div>

                        {isConstructing && (
                            <div className="mt-2 flex items-center gap-1.5 py-1 px-2 bg-orange-500/10 rounded border border-orange-500/20">
                                <span className="text-[7px] font-black font-military-mono leading-none tracking-[0.2em] text-orange-400">
                                    OPER_CONSTRUCTION
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Tactical Connector */}
                    <div className={`w-[1px] h-6 bg-gradient-to-b from-white/20 to-transparent transition-all duration-500 group-hover:h-8 ${
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
