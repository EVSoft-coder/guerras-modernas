import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT as INITIAL_LAYOUT, REFERENCE_WIDTH, REFERENCE_HEIGHT, BuildingLayout } from '@/config/buildingLayout';
import { Button } from '@/components/ui/button';
import { Save, Move, Copy, Check, RotateCcw, X, Maximize2, RotateCw, Pipette, Sliders } from 'lucide-react';
import { TransparentImage } from '@/components/ui/TransparentImage';

interface LayoutCalibratorProps {
    onSave: (layout: Record<string, BuildingLayout>) => void;
    onClose: () => void;
}

/**
 * LayoutCalibrator — Ferramenta de Engenharia Militar V3.2 Pro.
 * Agora com suporte a ferramenta de remoção de fundo (Dropper) em tempo real.
 */
export const LayoutCalibrator: React.FC<LayoutCalibratorProps> = ({ onSave, onClose }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState<Record<string, BuildingLayout>>(INITIAL_LAYOUT);
    const [copied, setCopied] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [isDropperActive, setIsDropperActive] = useState(false);

    const handleSampleColor = async (e: React.MouseEvent, type: string) => {
        if (!isDropperActive) return;
        
        const img = e.currentTarget as HTMLImageElement;
        const rect = img.getBoundingClientRect();
        
        // Calculate relative coordinates (0 to 1)
        const rx = (e.clientX - rect.left) / rect.width;
        const ry = (e.clientY - rect.top) / rect.height;
        
        // Create temporary canvas to sample
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";
        tempImg.src = img.src;
        
        tempImg.onload = () => {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
            ctx.drawImage(tempImg, 0, 0);
            
            const px = Math.floor(rx * tempImg.width);
            const py = Math.floor(ry * tempImg.height);
            const data = ctx.getImageData(px, py, 1, 1).data;
            
            const color = { r: data[0], g: data[1], b: data[2] };
            console.log("Sampled Color:", color);
            
            setLayout(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    transparency: {
                        ...prev[type].transparency,
                        targetColor: color,
                        tolerance: prev[type].transparency?.tolerance || 90
                    }
                }
            }));
            setIsDropperActive(false);
        };
    };

    const handleToleranceChange = (type: string, val: number) => {
        setLayout(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                transparency: {
                    ...prev[type].transparency,
                    tolerance: val
                }
            }
        }));
    };

    const handleDragEnd = (buildingType: string, event: any, info: any) => {
        const b = layout[buildingType];
        if (!b) return;

        const newX = Math.round(b.x + info.offset.x);
        const newY = Math.round(b.y + info.offset.y);
        
        setLayout({
            ...layout,
            [buildingType]: { ...b, x: newX, y: newY }
        });
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
                            <h2 className="text-white font-bold tracking-[0.2em] uppercase text-base">Calibrador de Layout V3.2 Pro</h2>
                            <p className="text-[11px] text-gray-500 font-mono flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></span>
                                MODO DE EDIÇÃO AVANÇADA: AGORA COM TRATAMENTO DE IMAGEM
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
                            <h3 className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Painel de Engenharia</h3>
                            <div className="h-px w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
                        </div>

                        {selectedBuilding ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                                    <span className="text-[10px] text-cyan-500 font-mono uppercase block mb-1">Selecionado</span>
                                    <span className="text-white font-bold tracking-wider">{selected?.toUpperCase()}</span>
                                </div>

                                {/* TRATAMENTO DE IMAGEM (NOVO) */}
                                <div className="space-y-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <Pipette className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Tratamento de Imagem</span>
                                    </div>
                                    
                                    <p className="text-[9px] text-gray-500 font-mono italic">
                                        Ative o conta-gotas e clique na cor do fundo que deseja remover.
                                    </p>

                                    <Button
                                        onClick={() => setIsDropperActive(!isDropperActive)}
                                        className={`w-full text-[10px] h-9 tracking-widest transition-all ${
                                            isDropperActive 
                                                ? 'bg-purple-600 text-white animate-pulse shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
                                                : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30'
                                        }`}
                                    >
                                        {isDropperActive ? 'A SELECIONAR COR NO MAPA...' : 'ATIVAR CONTA-GOTAS'}
                                    </Button>

                                    {selectedBuilding.transparency?.targetColor && (
                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] text-gray-500 uppercase">Cor Selecionada:</span>
                                                <div 
                                                    className="w-8 h-4 rounded border border-white/20 shadow-inner"
                                                    style={{ 
                                                        backgroundColor: `rgb(${selectedBuilding.transparency.targetColor.r}, ${selectedBuilding.transparency.targetColor.g}, ${selectedBuilding.transparency.targetColor.b})` 
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-mono">
                                                    <span className="text-gray-500 uppercase">Tolerância</span>
                                                    <span className="text-purple-400">{selectedBuilding.transparency.tolerance}</span>
                                                </div>
                                                <input 
                                                    type="range" min="10" max="255" step="1"
                                                    value={selectedBuilding.transparency.tolerance}
                                                    onChange={(e) => handleToleranceChange(selected!, parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                />
                                            </div>
                                        </div>
                                    )}
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
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center mb-4">
                                    <X className="w-5 h-5 text-gray-800" />
                                </div>
                                <p className="text-[11px] text-gray-600 font-mono leading-relaxed">
                                    SELECIONE UM EDIFÍCIO NO MAPA PARA ATIVAR O TRATAMENTO DE IMAGEM
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
                            {Object.entries(layout).map(([type, b]) => (
                                <motion.div
                                    key={type}
                                    drag={!isDropperActive}
                                    dragMomentum={false}
                                    dragConstraints={canvasRef}
                                    dragElastic={0}
                                    onDragStart={() => setSelected(type)}
                                    onDragEnd={(e, info) => handleDragEnd(type, e, info)}
                                    onClick={() => setSelected(type)}
                                    className={`absolute ${!isDropperActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'} ${selected === type ? 'z-[1000]' : ''}`}
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
                                            targetColor={b.transparency?.targetColor}
                                            tolerance={b.transparency?.tolerance || 90}
                                            onClick={(e) => handleSampleColor(e, type)}
                                            className={`w-full h-full object-contain transition-all ${
                                                selected === type ? 'drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] brightness-125' : 'drop-shadow-2xl'
                                            }`}
                                            style={{
                                                transform: `rotate(${b.rotation || 0}deg)`,
                                                pointerEvents: isDropperActive ? 'auto' : 'none'
                                            }}
                                            alt={type} 
                                        />
                                        
                                        {/* Overlay de Seleção */}
                                        {selected === type && !isDropperActive && (
                                            <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-lg pointer-events-none animate-pulse"></div>
                                        )}
                                        {isDropperActive && selected === type && (
                                            <div className="absolute inset-0 border-2 border-purple-500/50 rounded-lg pointer-events-none animate-pulse shadow-[0_0_15px_rgba(147,51,234,0.3)]"></div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Tático */}
                <div className="p-4 border-t border-gray-800 bg-black/40 flex items-center justify-between text-[10px] font-mono text-gray-600 px-8">
                    <div className="flex gap-8">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            POSIÇÃO: ARRASTE OS EDIFÍCIOS
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            IMAGEM: USE O CONTA-GOTAS PARA REMOVER O FUNDO
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            onClick={() => onSave(layout)}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold tracking-widest px-8"
                        >
                            SALVAR CONFIGURAÇÃO TÁTICA
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
