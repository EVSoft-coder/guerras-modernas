import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT as INITIAL_LAYOUT, REFERENCE_WIDTH, REFERENCE_HEIGHT } from '@/config/buildingLayout';
import { Button } from '@/components/ui/button';
import { Save, Move, Copy, Check, RotateCcw, X } from 'lucide-react';

interface LayoutCalibratorProps {
    onClose: () => void;
}

/**
 * LayoutCalibrator — Ferramenta de Engenharia Militar V30.
 * Permite o reposicionamento visual dos edifícios no terreno.
 */
export const LayoutCalibrator: React.FC<LayoutCalibratorProps> = ({ onClose }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState<any>(INITIAL_LAYOUT);
    const [copied, setCopied] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const handleDragEnd = (buildingType: string, event: any, info: any) => {
        const b = layout[buildingType];
        if (!b) return;

        // info.offset contém o deslocamento total desde o início do drag
        const newX = Math.round(b.x + info.offset.x);
        const newY = Math.round(b.y + info.offset.y);
        
        setLayout({
            ...layout,
            [buildingType]: { ...b, x: newX, y: newY }
        });
        setSelected(null);
    };

    const copyToClipboard = () => {
        const json = JSON.stringify(layout, null, 4);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-6xl bg-[#0a0c10] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col h-[90vh]">
                <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Move className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold tracking-[0.2em] uppercase text-base">Calibrador de Layout V30</h2>
                            <p className="text-[11px] text-gray-500 font-mono flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></span>
                                ARRASTE OS EDIFÍCIOS PARA OS NOVOS PADS TÁCTICOS
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="default" 
                            onClick={copyToClipboard}
                            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:text-white transition-all px-6"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            COPIAR CONFIGURAÇÃO
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={onClose}
                            className="text-gray-500 hover:text-white hover:bg-red-500/10"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <div className="relative bg-[#050608] flex-1 flex items-center justify-center p-20 overflow-hidden bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:20px_20px]">
                    <div 
                        id="CalibrationCanvas"
                        ref={canvasRef}
                        className="relative shadow-[0_0_60px_rgba(0,0,0,0.5)] border-2 border-gray-800/50 rounded-sm"
                        style={{ 
                            width: `${REFERENCE_WIDTH}px`, 
                            height: `${REFERENCE_HEIGHT}px`,
                            backgroundColor: '#0a0c10',
                            backgroundImage: 'url(/images/village/terrain_v30.png)',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        {/* Overlay de Grelha Táctica */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 border border-cyan-500/10"></div>

                        {Object.entries(layout).map(([type, b]: [string, any]) => (
                            <motion.div
                                key={type}
                                drag
                                dragMomentum={false}
                                dragConstraints={canvasRef}
                                dragElastic={0}
                                animate={{ x: 0, y: 0 }}
                                onDragStart={() => setSelected(type)}
                                onDragEnd={(e, info) => handleDragEnd(type, e, info)}
                                className="absolute cursor-grab active:cursor-grabbing"
                                style={{
                                    left: b.x - (b.w / 2),
                                    top: b.y - (b.h / 2), 
                                    width: b.w,
                                    height: b.h,
                                    zIndex: selected === type ? 1000 : Math.floor(b.y)
                                }}
                            >
                                <div className={`relative w-full h-full transition-all duration-300 ${selected === type ? 'scale-125' : 'hover:scale-105'}`}>
                                    <img 
                                        src={`/assets/buildings/${b.assetName}`} 
                                        className={`w-full h-full object-contain pointer-events-none ${selected === type ? 'drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'drop-shadow-2xl'}`}
                                        alt={type} 
                                    />
                                    
                                    {/* Guia de Alinhamento */}
                                    {selected === type && (
                                        <div className="absolute inset-0 border-2 border-cyan-500 rounded-lg animate-pulse"></div>
                                    )}

                                    {/* Label Tático */}
                                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded border font-mono whitespace-nowrap pointer-events-none transition-all ${
                                        selected === type ? 'bg-cyan-500 text-black border-cyan-400 font-bold scale-110' : 'bg-black/90 text-cyan-400 border-cyan-500/30 text-[10px]'
                                    }`}>
                                        {type.toUpperCase()} [{b.x}, {b.y}]
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-800 bg-black/60 flex items-center justify-between">
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-gray-600 uppercase font-bold">Protocolo</span>
                            <span className="text-xs text-gray-400 font-mono italic">ENGINEERING_TOOL_V3.0</span>
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            <span className="text-[9px] text-gray-600 uppercase font-bold">Resolução Ativa</span>
                            <span className="text-xs text-gray-400 font-mono">800 X 600 PX</span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 text-[10px] text-gray-500 max-w-md text-right leading-relaxed italic">
                        Nota: Após posicionar todos os edifícios, clique em "Copiar Configuração" e atualize o ficheiro <span className="text-cyan-500 font-bold">buildingLayout.ts</span> com o novo JSON.
                    </div>
                </div>
            </div>
        </div>
    );
};
