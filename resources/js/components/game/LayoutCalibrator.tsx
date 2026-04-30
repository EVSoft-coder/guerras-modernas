import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUILDING_LAYOUT as INITIAL_LAYOUT, REFERENCE_WIDTH, REFERENCE_HEIGHT, BuildingLayout } from '@/config/buildingLayout';
import { Button } from '@/components/ui/button';
import { Save, Move, Copy, Check, RotateCcw, X, Maximize2, RotateCw, Pipette, Sliders, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { TransparentImage } from '@/components/ui/TransparentImage';

interface LayoutCalibratorProps {
    onSave: (layout: Record<string, BuildingLayout>) => void;
    onClose: () => void;
}

/**
 * LayoutCalibrator — Ferramenta de Engenharia Militar V3.3 Pro.
 * Agora com "Tactical Asset Hub" para gestão de biblioteca de edifícios.
 */
export const LayoutCalibrator: React.FC<LayoutCalibratorProps> = ({ onSave, onClose }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState<Record<string, BuildingLayout>>(INITIAL_LAYOUT);
    const [copied, setCopied] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [isDropperActive, setIsDropperActive] = useState(false);
    const [viewMode, setViewMode] = useState<'PROPERTIES' | 'LIBRARY'>('PROPERTIES');

    const handleActivateDropper = async (type: string) => {
        // @ts-ignore - EyeDropper is a modern browser API
        if (window.EyeDropper) {
            // @ts-ignore
            const dropper = new window.EyeDropper();
            try {
                const result = await dropper.open();
                const hex = result.sRGBHex;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                
                setLayout(prev => ({
                    ...prev,
                    [type]: {
                        ...prev[type],
                        transparency: {
                            ...prev[type].transparency,
                            targetColor: { r, g, b },
                            tolerance: prev[type].transparency?.tolerance || 30
                        }
                    }
                }));
            } catch (e) {
                // Silently fail if user cancels
            }
        } else {
            setIsDropperActive(true);
        }
    };

    const handleSampleColor = async (e: React.MouseEvent, type: string) => {
        if (!isDropperActive) return;
        e.stopPropagation(); // Evita selecionar outro edifício
        
        const img = e.currentTarget as HTMLImageElement;
        const rect = img.getBoundingClientRect();
        
        // Coordenadas relativas ao elemento visual
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";
        tempImg.src = img.src;
        
        tempImg.onload = () => {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
            
            // Desenhar imagem no canvas para ler o pixel
            ctx.drawImage(tempImg, 0, 0);
            
            // Mapear coordenadas do click para as coordenadas internas da imagem
            // Nota: Isso ainda é afetado por rotação se não usarmos EyeDropper, 
            // mas o stopPropagation ajuda a garantir que o click chegue aqui.
            const rx = x / rect.width;
            const ry = y / rect.height;
            
            const px = Math.floor(rx * tempImg.width);
            const py = Math.floor(ry * tempImg.height);
            const data = ctx.getImageData(px, py, 1, 1).data;
            
            const color = { r: data[0], g: data[1], b: data[2] };
            
            setLayout(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    transparency: {
                        ...prev[type].transparency,
                        targetColor: color,
                        tolerance: prev[type].transparency?.tolerance || 30
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
            <div className="w-full max-w-[95vw] bg-[#0a0c10] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col h-[95vh]">
                
                {/* Header Tático */}
                <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <LayoutGrid className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold tracking-[0.2em] uppercase text-base">Calibrador de Layout V3.3 Pro</h2>
                            <p className="text-[11px] text-gray-500 font-mono flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></span>
                                TACTICAL ASSET HUB ATIVO: GESTÃO DE BIBLIOTECA E TRATAMENTO
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex bg-black/40 border border-gray-800 rounded-xl p-1 mr-4">
                            <button 
                                onClick={() => setViewMode('PROPERTIES')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${viewMode === 'PROPERTIES' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                PROPRIEDADES
                            </button>
                            <button 
                                onClick={() => setViewMode('LIBRARY')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${viewMode === 'LIBRARY' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                BIBLIOTECA
                            </button>
                        </div>

                        <Button 
                            variant="outline" 
                            size="default" 
                            onClick={copyToClipboard}
                            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:text-white transition-all px-6"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            COPIAR JSON
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
                    
                    {/* Painel de Propriedades ou Biblioteca (Esquerda) */}
                    <div className="w-80 border-r border-gray-800 bg-black/20 p-6 flex flex-col gap-8 overflow-y-auto">
                        <div className="space-y-2">
                            <h3 className="text-[10px] text-gray-600 uppercase font-black tracking-widest">
                                {viewMode === 'PROPERTIES' ? 'Painel de Engenharia' : 'Biblioteca de Assets'}
                            </h3>
                            <div className="h-px w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
                        </div>

                        {viewMode === 'PROPERTIES' ? (
                            selectedBuilding ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                                        <span className="text-[10px] text-cyan-500 font-mono uppercase block mb-1">Selecionado</span>
                                        <span className="text-white font-bold tracking-wider">{selected?.toUpperCase()}</span>
                                    </div>

                                    {/* TRATAMENTO DE IMAGEM */}
                                    <div className="space-y-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                                        <div className="flex items-center gap-2 text-purple-400">
                                            <Pipette className="w-4 h-4" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Tratamento de Imagem</span>
                                        </div>
                                        
                                        <Button
                                            onClick={() => handleActivateDropper(selected!)}
                                            className={`w-full text-[10px] h-9 tracking-widest transition-all ${
                                                isDropperActive 
                                                    ? 'bg-purple-600 text-white animate-pulse' 
                                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                            }`}
                                        >
                                            {isDropperActive ? 'CLIQUE NO FUNDO DO MAPA' : 'ATIVAR CONTA-GOTAS'}
                                        </Button>

                                        {selectedBuilding.transparency?.targetColor && (
                                            <div className="space-y-4 pt-2">
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
                                        )}
                                    </div>

                                    {/* Controlo de Tamanho */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-gray-500 uppercase">Largura</span>
                                            <span className="text-cyan-400">{selectedBuilding.w}px</span>
                                        </div>
                                        <input 
                                            type="range" min="40" max="600" step="1"
                                            value={selectedBuilding.w}
                                            onChange={(e) => updateProperty(selected!, 'w', parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-gray-500 uppercase">Altura</span>
                                            <span className="text-cyan-400">{selectedBuilding.h}px</span>
                                        </div>
                                        <input 
                                            type="range" min="40" max="600" step="1"
                                            value={selectedBuilding.h}
                                            onChange={(e) => updateProperty(selected!, 'h', parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                    </div>

                                    {/* Controlo de Rotação */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-gray-500 uppercase">Rotação</span>
                                            <span className="text-cyan-400">{selectedBuilding.rotation || 0}°</span>
                                        </div>
                                        <input 
                                            type="range" min="-180" max="180" step="1"
                                            value={selectedBuilding.rotation || 0}
                                            onChange={(e) => updateProperty(selected!, 'rotation', parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                    </div>

                                    {/* Controlo de Vivacidade e Brilho */}
                                    <div className="space-y-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                                        <div className="flex items-center gap-2 text-orange-400">
                                            <Sliders className="w-4 h-4" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Ajuste Visual</span>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-mono">
                                                <span className="text-gray-500 uppercase">Vivacidade</span>
                                                <span className="text-orange-400">{selectedBuilding.vividness || 1.0}x</span>
                                            </div>
                                            <input 
                                                type="range" min="1.0" max="3.0" step="0.1"
                                                value={selectedBuilding.vividness || 1.0}
                                                onChange={(e) => updateProperty(selected!, 'vividness', parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                            />
                                            
                                            <div className="flex justify-between text-[10px] font-mono">
                                                <span className="text-gray-500 uppercase">Brilho</span>
                                                <span className="text-orange-400">{selectedBuilding.brightness || 1.0}x</span>
                                            </div>
                                            <input 
                                                type="range" min="0.5" max="2.0" step="0.05"
                                                value={selectedBuilding.brightness || 1.0}
                                                onChange={(e) => updateProperty(selected!, 'brightness', parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                    <p className="text-[10px] text-gray-600 font-mono leading-relaxed uppercase">
                                        Selecione um edifício no mapa para ajustar propriedades
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(layout).map(([type, b]) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelected(type)}
                                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 group ${
                                            selected === type ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="w-full aspect-square rounded-lg bg-black/40 p-2 overflow-hidden">
                                            <img 
                                                src={`/assets/buildings/${b.assetName}`} 
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                                alt={type}
                                            />
                                        </div>
                                        <span className="text-[9px] text-gray-500 font-mono truncate w-full text-center group-hover:text-white">
                                            {type.toUpperCase()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Área do Canvas (Centro) */}
                    <div className="flex-1 relative bg-[#050608] flex items-center justify-center p-10 overflow-hidden bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:20px_20px]">
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
                                            tolerance={b.transparency?.tolerance || 30}
                                            onClick={(e) => handleSampleColor(e, type)}
                                            className={`w-full h-full object-contain transition-all ${
                                                selected === type ? 'drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] brightness-125' : 'drop-shadow-2xl'
                                            }`}
                                            style={{
                                                transform: `rotate(${b.rotation || 0}deg)`,
                                                pointerEvents: isDropperActive ? 'auto' : 'none',
                                                filter: `
                                                    ${b.vividness ? `saturate(${b.vividness})` : ''}
                                                    ${b.brightness ? `brightness(${b.brightness})` : ''}
                                                `.trim() || 'none'
                                            }}
                                            alt={type} 
                                        />
                                        
                                        {selected === type && (
                                            <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none animate-pulse ${isDropperActive ? 'border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}></div>
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
                            ENGINEERING: POSIÇÃO E ESCALA
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            ALPHA: TRATAMENTO DE IMAGEM
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            onClick={() => onSave(layout)}
                            className="bg-green-600 hover:bg-green-500 text-white font-black tracking-widest px-12 h-11 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                        >
                            SINCRONIZAR OPERAÇÃO FINAL
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
