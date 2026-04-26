import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Target, Search, Crosshair, Navigation, Shield, Sword, Home, ShieldAlert, List, ChevronRight, ChevronLeft, User, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AttackModal } from './AttackModal';
import { toast } from 'sonner';
import { useGameEntities } from '@/hooks/use-game-entities';
import { StrategyHUD } from './StrategyHUD';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { eventBus, Events } from '@src/core/EventBus';
import { WorldMapEngine } from './WorldMapEngine';
import { Base } from '@/types';

interface WorldMapViewProps {
    playerBase?: Base;
    troops?: any[];
    gameConfig?: any;
    unitTypes?: any[];
    diplomaties?: any[];
    myAllianceId?: number | null;
}

const TILE_SIZE = 80;
const VIEWPORT_RANGE = 7; // Raio de tiles visuais (Total 15x15 aprox)

const getTerrain = (tx: number, ty: number) => {
    // World is now 1000x1000 (standard for global scale)
    if (ty < 0 || ty > 1000 || tx < 0 || tx > 1000) return 'water';
    if (ty < 3 || ty > 997 || tx < 3 || tx > 997) return 'water';
    
    // Deterministic Pseudo-Noise
    const noise = (Math.sin(tx * 0.12) + Math.cos(ty * 0.15) + Math.sin(tx * 0.3 + ty * 0.2)) / 3;
    
    if (noise > 0.53) return 'mountain';
    if (noise < -0.45) return 'desert';
    if (noise < -0.65) return 'water';
    
    return 'grass';
};

export function WorldMapView({ playerBase, troops = [], gameConfig, unitTypes, diplomaties = [], myAllianceId }: WorldMapViewProps) {
    const [center, setCenter] = useState({ x: playerBase?.coordenada_x || 50, y: playerBase?.coordenada_y || 50 });
    const [selectedSector, setSelectedSector] = useState<{ x: number, y: number, base?: any } | null>(null);
    const [searchCoords, setSearchCoords] = useState({ x: '', y: '' });
    const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const { entities: gameEntities, globalState } = useGameEntities();
    const allBases = globalState.worldMapBases;

    // Draggable State
    const mapRef = useRef<HTMLDivElement>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.min(Math.max(prev + delta, 0.4), 2.0));
    };

    const jumpTo = (x: number, y: number, base?: any) => {
        setCenter({ x, y });
        setSelectedSector({ x, y, base });
        setDragOffset({ x: 0, y: 0 }); // Reset drag after jump
    };

    const handleSearch = () => {
        const nx = parseInt(searchCoords.x);
        const ny = parseInt(searchCoords.y);
        if (!isNaN(nx) && !isNaN(ny)) jumpTo(nx, ny, allBases.find(b => b.coordenada_x === nx && b.coordenada_y === ny));
    };

    const jumpToPlayer = () => {
        if (playerBase) jumpTo(playerBase.coordenada_x, playerBase.coordenada_y, playerBase);
    };

    const handleSendAttack = (params: any) => {
        if (!playerBase) return;
        eventBus.emit(Events.ATTACK_LAUNCH, {
            originX: playerBase.coordenada_x,
            originY: playerBase.coordenada_y,
            targetX: params.destino_x,
            targetY: params.destino_y,
            ownerId: playerBase.ownerId,
            troops: params.tropas,
            backendParams: { ...params, origem_id: playerBase.id }
        });
        setIsAttackModalOpen(false);
        toast.success("ORDEM TRANSMITIDA: Tropas em movimento.");
    };

    // Render tiles based on center 
    const tilesToRender = useMemo(() => {
        const tiles = [];
        const startX = Math.floor(center.x - VIEWPORT_RANGE);
        const endX = Math.ceil(center.x + VIEWPORT_RANGE);
        const startY = Math.floor(center.y - VIEWPORT_RANGE);
        const endY = Math.ceil(center.y + VIEWPORT_RANGE);

        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                tiles.push({ x, y });
            }
        }
        return tiles;
    }, [center]);

    return (
        <div className="relative flex h-[800px] w-full gap-0 overflow-hidden rounded-[3rem] border border-white/10 bg-[#05080f] shadow-2xl">
            
            {/* MAP ENGINE (NEW CANVAS MOTOR V3.0) */}
            <div 
                ref={mapRef}
                className="absolute inset-0 z-0 overflow-hidden"
                onWheel={handleWheel}
            >
                <WorldMapEngine 
                    center={center}
                    zoom={zoom}
                    bases={allBases}
                    playerBase={playerBase}
                    myAllianceId={myAllianceId}
                    diplomaties={diplomaties}
                    onSectorClick={jumpTo}
                />
            </div>

            {/* FLOATING INTERFACE: SIDEBAR ESQUERDA (ALVOS) */}
            <div className={`absolute left-6 top-6 bottom-6 z-40 transition-all duration-500 flex gap-4 ${isSidebarOpen ? 'w-[320px]' : 'w-0'}`}>
                <div className={`flex-1 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Target size={18} className="text-orange-500" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Objetivos Táticos</h2>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">{allBases.length} NÓS</span>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar p-3 space-y-1">
                        {allBases.map(b => (
                            <button 
                                key={b.id}
                                onClick={() => jumpTo(b.coordenada_x, b.coordenada_y, b)}
                                className={`w-full group px-4 py-3 rounded-2xl border transition-all flex items-center justify-between
                                    ${selectedSector?.x === b.coordenada_x && selectedSector?.y === b.coordenada_y 
                                        ? 'bg-sky-500 border-sky-400 text-white' 
                                        : 'bg-white/5 border-transparent hover:bg-white/10 text-neutral-400 hover:text-white'}
                                `}
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-[10px] font-black uppercase truncate max-w-[120px]">{b.nome}</span>
                                    <span className="text-[8px] font-mono opacity-60">[{b.coordenada_x}:{b.coordenada_y}]</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!b.ownerId && <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-black">REBEL</span>}
                                    <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-black/40 border-t border-white/5">
                        <div className="flex gap-2">
                             <Input 
                                className="bg-white/5 border-white/10 h-8 text-[10px] uppercase font-black" 
                                placeholder="X" 
                                value={searchCoords.x} 
                                onChange={e => setSearchCoords(prev => ({...prev, x: e.target.value})) }
                             />
                             <Input 
                                className="bg-white/5 border-white/10 h-8 text-[10px] uppercase font-black" 
                                placeholder="Y" 
                                value={searchCoords.y} 
                                onChange={e => setSearchCoords(prev => ({...prev, y: e.target.value})) }
                             />
                             <Button size="icon" className="h-8 w-12 bg-sky-600 hover:bg-sky-500" onClick={handleSearch}>
                                <Search size={14} />
                             </Button>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="self-center bg-black/80 backdrop-blur-xl border border-white/10 w-8 h-12 rounded-xl flex items-center justify-center hover:bg-sky-600 transition-colors group"
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>

            {/* SECTOR INFOBAR (BOTTOM HUD) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-20 max-w-5xl pointer-events-none">
                <AnimatePresence>
                    {selectedSector && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="w-full bg-black/80 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between pointer-events-auto ring-1 ring-white/5"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl border-2 backdrop-blur-lg
                                    ${selectedSector.base?.ownerId === playerBase?.ownerId ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}
                                `}>
                                    <img src="/assets/structures/base.png" className="w-12 h-12 object-contain" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                            {selectedSector.base?.nome || 'Sector de Exploração'}
                                        </h3>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-sky-400 border border-white/5">
                                            [{selectedSector.x}:{selectedSector.y}]
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-neutral-500 tracking-[0.15em]">
                                        <div className="flex items-center gap-2">
                                            <Navigation size={12} className="text-orange-500" />
                                            Terrain: <span className="text-white">{getTerrain(selectedSector.x, selectedSector.y)}</span>
                                        </div>
                                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                                        <div className="flex items-center gap-2">
                                            <Shield size={12} className="text-sky-500" />
                                            Stability: <span className="text-white">{selectedSector.base?.loyalty ?? 100}%</span>
                                        </div>
                                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-neutral-400" />
                                            Intel: <span className="text-white">{selectedSector.base?.jogador?.username || 'NEUTRAL'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    variant="outline"
                                    className="border-white/10 hover:bg-white/10 text-[10px] font-black uppercase px-8 py-6 rounded-2xl text-neutral-400"
                                    onClick={() => setSelectedSector(null)}
                                >
                                    Fugir
                                </Button>
                                {(!selectedSector.base?.ownerId || selectedSector.base.ownerId !== playerBase?.ownerId) ? (
                                    <Button 
                                        className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-10 py-6 rounded-2xl shadow-xl shadow-red-600/30"
                                        onClick={() => setIsAttackModalOpen(true)}
                                    >
                                        <Sword className="mr-3" size={16} /> Lançar Assalto
                                    </Button>
                                ) : (
                                    <Button disabled className="bg-sky-600/20 text-sky-400 border-sky-500/20 text-[10px] font-black uppercase px-10 py-6 rounded-2xl">
                                        Zona Aliada
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* HUD STATUS INDICATOR */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-8 shadow-2xl pointer-events-auto">
                    <Button variant="ghost" size="sm" onClick={() => zoom > 0.5 && setZoom(z => z - 0.2)} className="text-neutral-400">-</Button>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] text-neutral-500 font-black uppercase tracking-widest mb-1">Satellite_Link_Active</span>
                        <div className="text-[10px] font-mono text-sky-400">MAGNIFICATION_LVL: {(zoom * 100).toFixed(0)}%</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => zoom < 1.8 && setZoom(z => z + 0.2)} className="text-neutral-400">+</Button>
                    <div className="w-px h-4 bg-white/10" />
                    <Button 
                        onClick={jumpToPlayer}
                        className="bg-sky-600/20 hover:bg-sky-600/40 text-sky-400 border border-sky-500/20 rounded-xl px-4 py-1.5 text-[9px] font-black uppercase"
                    >
                        Home Target
                    </Button>
                </div>
            </div>

            <AttackModal 
                isOpen={isAttackModalOpen}
                onClose={() => setIsAttackModalOpen(false)}
                origemBase={playerBase}
                destinoBase={selectedSector?.base || { coordenada_x: selectedSector?.x, coordenada_y: selectedSector?.y, nome: 'Sector Vazio' }}
                tropasDisponiveis={troops}
                gameConfig={gameConfig}
                unitTypes={unitTypes}
                onEnviar={handleSendAttack}
                isSending={false}
            />
        </div>
    );
}
