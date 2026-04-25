import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT as INITIAL_LAYOUT, REFERENCE_WIDTH, REFERENCE_HEIGHT } from '@/config/buildingLayout';
import { Button } from '@/components/ui/button';
import { TransparentImage } from '@/components/ui/TransparentImage';
import { Save, Move, Copy, Check, RotateCcw, X, Maximize2, RotateCw } from 'lucide-react';

interface LayoutCalibratorProps {
    onClose: () => void;
}

/**
 * LayoutCalibrator — Ferramenta de Engenharia Militar V3.1 Pro.
 * Agora com suporte a redimensionamento e rotação tática.
 */
export const LayoutCalibrator: React.FC<LayoutCalibratorProps> = ({ onClose }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState<any>(INITIAL_LAYOUT);
    const [copied, setCopied] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const handleDragEnd = (buildingType: string, event: any, info: any) => {
        const b = layout[buildingType];
        if (!b) return;

        const newX = Math.round(b.x + info.offset.x);
        const newY = Math.round(b.y + info.offset.y);
        
        setLayout({
            ...layout,
            [buildingType]: { ...b, x: newX, y: newY }
        });
        // Não resetamos selected aqui para permitir edição de escala/rotação após o drag
    };

    const updateProperty = (buildingType: string, prop: string, value: number) => {
        const b = layout[buildingType];
        if (!b) return;

        setLayout({
            ...layout,
            [buildingType]: { ...b, [prop]: value }
        });
    };

    const copyToClipboard = () => {
        const json = JSON.stringify(layout, null, 4);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedBuilding = selected ? layout[selected] : null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-7xl bg-[#0a0c10] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col h-[95vh]">
                
                {/* Header Tático */}
                <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Move className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold tracking-[0.2em] uppercase text-base">Calibrador de Layout V3.1 Pro</h2>
                            <p className="text-[11px] text-gray-500 font-mono flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></span>
                                MODO DE EDIÇÃO AVANÇADA ATIVO: POSIÇÃO, ESCALA E ROTAÇÃO
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

                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Painel de Propriedades (Esquerda) */}
                    <div className="w-80 border-r border-gray-800 bg-black/20 p-6 flex flex-col gap-8 overflow-y-auto">
                        <div className="space-y-2">
                            <h3 className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Painel de Controlo</h3>
                            <div className="h-px w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
                        </div>

                        {selectedBuilding ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                                    <span className="text-[10px] text-cyan-500 font-mono uppercase block mb-1">Selecionado</span>
                                    <span className="text-white font-bold tracking-wider">{selected?.toUpperCase()}</span>
                                </div>

                                {/* Controlo de Tamanho */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Maximize2 className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Dimensões (W/H)</span>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono">
                                                <span className="text-gray-500">LARGURA</span>
                                                <span className="text-cyan-400">{selectedBuilding.w}px</span>
                                            </div>
                                            <input 
                                                type="range" min="40" max="600" step="1"
                                                value={selectedBuilding.w}
                                                onChange={(e) => updateProperty(selected!, 'w', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono">
                                                <span className="text-gray-500">ALTURA</span>
                                                <span className="text-cyan-400">{selectedBuilding.h}px</span>
                                            </div>
                                            <input 
                                                type="range" min="40" max="600" step="1"
                                                value={selectedBuilding.h}
                                                onChange={(e) => updateProperty(selected!, 'h', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Controlo de Orientação */}
                                <div className="space-y-4 pt-4 border-t border-gray-800/50">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <RotateCw className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Orientação Tática</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-gray-500">ROTAÇÃO</span>
                                            <span className="text-cyan-400">{selectedBuilding.rotation || 0}°</span>
                                        </div>
                                        <input 
                                            type="range" min="-180" max="180" step="1"
                                            value={selectedBuilding.rotation || 0}
                                            onChange={(e) => updateProperty(selected!, 'rotation', parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-800/50 flex flex-col gap-2">
                                    <div className="flex justify-between text-[9px] font-mono text-gray-600 uppercase">
                                        <span>Coord X: {selectedBuilding.x}</span>
                                        <span>Coord Y: {selectedBuilding.y}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center mb-4">
                                    <X className="w-5 h-5 text-gray-800" />
                                </div>
                                <p className="text-[11px] text-gray-600 font-mono leading-relaxed">
                                    SELECIONE UM EDIFÍCIO NO MAPA PARA ATIVAR O PAINEL DE ENGENHARIA
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Área do Canvas (Direita) */}
                    <div className="flex-1 relative bg-[#050608] flex items-center justify-center p-20 overflow-hidden bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:20px_20px]">
                        <div 
                            id="CalibrationCanvas"
                            ref={canvasRef}
                            className="relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border-2 border-gray-800 rounded-sm overflow-hidden"
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
                                    onClick={() => setSelected(type)}
                                    className={`absolute cursor-grab active:cursor-grabbing ${selected === type ? 'z-[1000]' : ''}`}
                                    style={{
                                        left: b.x - (b.w / 2),
                                        top: b.y - (b.h / 2), 
                                        width: b.w,
                                        height: b.h,
                                        zIndex: selected === type ? 1000 : Math.floor(b.y)
                                    }}
                                >
                                    <div className={`relative w-full h-full transition-transform duration-300 ${selected === type ? 'scale-110' : 'hover:scale-105'}`}>
                                    <TransparentImage 
                                        src={`/assets/buildings/${b.assetName}`} 
                                        removeColor={{ r: 10, g: 12, b: 16, tolerance: 50 }}
                                        className={`w-full h-full object-contain pointer-events-none transition-all ${
                                            selected === type ? 'drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] brightness-125' : 'drop-shadow-2xl grayscale-[0.2]'
                                        }`}
                                        style={{
                                            transform: `rotate(${b.rotation || 0}deg)`
                                        }}
                                        alt={type} 
                                    />
                                        
                                        {/* Guia de Alinhamento */}
                                        {selected === type && (
                                            <>
                                                <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-lg animate-pulse"></div>
                                                <div className="absolute -inset-8 border border-cyan-500/10 rounded-full pointer-events-none"></div>
                                            </>
                                        )}

                                        {/* Label Tático */}
                                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded border font-mono whitespace-nowrap pointer-events-none transition-all ${
                                            selected === type ? 'bg-cyan-500 text-black border-cyan-400 font-bold scale-110' : 'bg-black/90 text-cyan-400 border-cyan-500/30 text-[9px] opacity-40'
                                        }`}>
                                            {type.toUpperCase()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-800 bg-black/60 flex items-center justify-between px-8">
                    <div className="flex gap-12">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-gray-600 uppercase font-bold">Protocolo</span>
                            <span className="text-xs text-gray-400 font-mono italic">ENGINEERING_TOOL_V3.1_PRO</span>
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            <span className="text-[9px] text-gray-600 uppercase font-bold">Unidades</span>
                            <span className="text-xs text-gray-400 font-mono italic">{Object.keys(layout).length} ESTRUTURAS</span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 px-6 py-3 rounded-xl border border-gray-800 text-[11px] text-gray-500 max-w-xl text-right leading-relaxed italic">
                        Clique num edifício para ajustar o seu <span className="text-cyan-500">tamanho</span> e <span className="text-cyan-500">orientação</span>.
                    </div>
                </div>
            </div>
        </div>
    );
};
