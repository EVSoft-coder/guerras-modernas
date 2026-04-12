import React, { useState, useEffect, useMemo } from 'react';
import { Map as MapIcon, Target, Search, Crosshair, Navigation, Shield, User, Zap, Sword, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { AttackModal } from './AttackModal';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useGameEntities } from '@/hooks/use-game-entities';
import { StrategyHUD } from './StrategyHUD';

interface BaseMap {
    id: number;
    nome: string;
    coordenada_x: number;
    coordenada_y: number;
    qg_nivel: number;
    jogador?: {
        id: number;
        username: string;
        alianca?: { tag: string };
    };
}

interface WorldMapViewProps {
    playerBase?: any;
    troops?: any[];
    gameConfig?: any;
}

export function WorldMapView({ playerBase, troops = [], gameConfig }: WorldMapViewProps) {
    const [center, setCenter] = useState({ x: playerBase?.coordenada_x || 500, y: playerBase?.coordenada_y || 500 });
    const [loading, setLoading] = useState(false);
    const [selectedSector, setSelectedSector] = useState<{ x: number, y: number, base?: BaseMap } | null>(null);
    const [searchCoords, setSearchCoords] = useState({ x: '', y: '' });
    const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const { entities: gameEntities, globalState } = useGameEntities();

    const selectedEntityObj = useMemo(() => {
        return gameEntities.find(e => e.id === selectedUnit);
    }, [gameEntities, selectedUnit]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2));
        }
    };

    const RAIO = 5; // Visualizar 11x11
    
    const CHUNK_SIZE = 50;
    const [loadedChunks, setLoadedChunks] = useState<Record<string, BaseMap[]>>({});
    
    const fetchChunkData = async (cx: number, cy: number) => {
        const key = `${cx}-${cy}`;
        if (loadedChunks[key] || loading) return;

        setLoading(true);
        try {
            const response = await axios.get(`/api/mapa/chunk/${cx}/${cy}`);
            setLoadedChunks(prev => ({ ...prev, [key]: response.data.bases }));
        } catch (error) {
            console.error("Erro ao carregar mapa tático:", error);
            toast.error("Falha na sincronização de satélite.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const chunkX = Math.floor(center.x / CHUNK_SIZE);
        const chunkY = Math.floor(center.y / CHUNK_SIZE);
        fetchChunkData(chunkX, chunkY);
        
        // Pré-carregar adjacentes para transição suave
        const neighbors = [[-1,0],[1,0],[0,-1],[0,1]];
        neighbors.forEach(([dx, dy]) => {
            const nx = chunkX + dx;
            const ny = chunkY + dy;
            if (nx >= 0 && nx < 20 && ny >= 0 && ny < 20) {
                fetchChunkData(nx, ny);
            }
        });
    }, [center]);

    const visibleBases = useMemo(() => {
        return Object.values(loadedChunks).flat();
    }, [loadedChunks]);

    const sectors = useMemo(() => {
        const items = [];
        for (let y = center.y - RAIO; y <= center.y + RAIO; y++) {
            for (let x = center.x - RAIO; x <= center.x + RAIO; x++) {
                const baseAt = visibleBases.find(b => b.coordenada_x === x && b.coordenada_y === y);
                items.push({ x, y, base: baseAt });
            }
        }
        return items;
    }, [center, visibleBases]);

    const handleSearch = () => {
        const nx = parseInt(searchCoords.x);
        const ny = parseInt(searchCoords.y);
        if (!isNaN(nx) && !isNaN(ny)) {
            setCenter({ x: nx, y: ny });
            setSelectedSector({ x: nx, y: ny, base: visibleBases.find(b => b.coordenada_x === nx && b.coordenada_y === ny) });
        }
    };

    const jumpToPlayer = () => {
        if (playerBase) setCenter({ x: playerBase.coordenada_x, y: playerBase.coordenada_y });
    };

    // Form de Ataque
    const { post, processing } = useForm();

    const handleSendAttack = (params: any) => {
        // 1. Sinal tático para o motor ECS (Visualização em Tempo Real)
        if ((window as any).eventBus) {
            (window as any).eventBus.emit("ATTACK:LAUNCH", {
                timestamp: Date.now(),
                data: {
                    originX: playerBase.coordenada_x,
                    originY: playerBase.coordenada_y,
                    targetX: params.destino_x,
                    targetY: params.destino_y,
                    ownerId: playerBase.jogador_id,
                    troops: params.tropas
                }
            });
            console.log(`[SATCOM] Attack Signal Emitted to ${params.destino_x}:${params.destino_y}`);
        }

        // 2. Persistência de Comando (Backend)
        post((window as any).route('base.atacar', { ...params, origem_id: playerBase.id }), {
            onSuccess: () => {
                setIsAttackModalOpen(false);
                setSelectedSector(null);
                toast.success("Expedição Militar Lançada com Sucesso!");
            },
            onError: (errors: any) => {
                toast.error(Object.values(errors)[0] as string);
            }
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* GRID TÁCTICO */}
            <div className="flex-1 bg-neutral-950 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
                {/* Overlay de Navegação */}
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center shadow-2xl">
                        <Input 
                            className="w-16 bg-transparent border-none text-center font-mono text-sky-400 placeholder:text-neutral-700 focus-visible:ring-0" 
                            placeholder="X"
                            value={searchCoords.x}
                            onChange={e => setSearchCoords(prev => ({ ...prev, x: e.target.value }))}
                        />
                        <div className="w-px h-4 bg-white/10" />
                        <Input 
                            className="w-16 bg-transparent border-none text-center font-mono text-sky-400 placeholder:text-neutral-700 focus-visible:ring-0" 
                            placeholder="Y"
                            value={searchCoords.y}
                            onChange={e => setSearchCoords(prev => ({ ...prev, y: e.target.value }))}
                        />
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white" onClick={handleSearch}>
                            <Search size={16} />
                        </Button>
                    </div>
                    <Button variant="outline" className="bg-black/80 backdrop-blur-xl border-white/10 rounded-2xl text-[10px] font-black uppercase" onClick={jumpToPlayer}>
                        <Navigation size={14} className="mr-2 text-sky-500" /> Minha Base
                    </Button>
                </div>

                {/* Grid Container (Fixed 20x20 Map) */}
                <div 
                    className="relative overflow-auto bg-neutral-900 custom-scrollbar shadow-inner"
                    style={{ height: '600px' }} // Altura tática fixa para scroll
                    onWheel={handleWheel}
                >
                    <div 
                        className="relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] transition-transform duration-200 ease-out"
                        style={{ 
                            width: `${20 * 80}px`, 
                            height: `${20 * 80}px`,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top left'
                        }}
                    >
                        {/* Renderizar Grelha Táctica Profissional (20x20) */}
                        {Array.from({ length: 20 }).map((_, y) => (
                            Array.from({ length: 20 }).map((_, x) => (
                                <div 
                                    key={`${x}-${y}`}
                                    className={`absolute border border-white/[0.03] transition-all duration-1000 cursor-crosshair group/cell ${
                                        (globalState as any).revealedTiles?.includes(`${x},${y}`) 
                                            ? 'opacity-100 bg-sky-500/[0.02]' 
                                            : 'opacity-20 grayscale brightness-50'
                                    }`}
                                    onClick={() => {
                                        setSelectedSector({ x, y, base: visibleBases.find(b => b.coordenada_x === x && b.coordenada_y === y) });
                                        if (selectedUnit) {
                                            (window as any).eventBus.emit("UNIT:MOVE", {
                                                timestamp: Date.now(),
                                                data: { targetX: x, targetY: y }
                                            });
                                        }
                                    }}
                                    style={{
                                        left: x * 80,
                                        top: y * 80,
                                        width: 80,
                                        height: 80
                                    }}
                                >
                                    {(globalState as any).revealedTiles?.includes(`${x},${y}`) && (
                                        <span className="absolute top-1 left-1 text-[8px] text-neutral-800 font-mono group-hover/cell:text-neutral-500">
                                            {x.toString().padStart(2, '0')}:{y.toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                            ))
                        ))}

                        {/* ECS Entity Layer (Mobile Units) */}
                        <div className="absolute inset-0 pointer-events-none z-30">
                            {gameEntities.map(e => (
                                <motion.div 
                                    key={`entity-${e.id}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedUnit(e.id);
                                    }}
                                    style={{
                                        position: "absolute",
                                        left: e.x * 80,
                                        top: e.y * 80,
                                        width: 80,
                                        height: 80,
                                        pointerEvents: "auto"
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    <div className="relative group cursor-pointer">
                                        {/* Unit Halo */}
                                        <motion.div 
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className={`absolute -inset-2 rounded-full ${selectedUnit === e.id ? 'bg-yellow-500/30' : 'bg-sky-500/20'}`}
                                        />
                                        
                                        {/* Unit Icon Wrapper */}
                                        <div className={`
                                            relative w-10 h-10 rounded-xl border-2 rotate-45 flex items-center justify-center transition-all
                                            ${e.type === 'Army' ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-sky-500/50 shadow-xl'}
                                            ${selectedUnit === e.id ? 'bg-orange-500 border-white shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 'bg-black/80 hover:border-sky-400'}
                                        `}>
                                            <div className="-rotate-45">
                                                {e.type === 'Army' ? (
                                                    <Navigation 
                                                        size={18} 
                                                        className={`${selectedUnit === e.id ? 'text-black' : 'text-orange-400'} ${e.status === 'returning' ? 'rotate-180' : ''} transition-transform`} 
                                                    />
                                                ) : (
                                                    <Target size={18} className={selectedUnit === e.id ? 'text-black' : 'text-sky-400'} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Name Tag */}
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[7px] text-white font-black uppercase whitespace-nowrap tracking-widest">{e.type || 'STRIKER_V1'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Bar Bottom */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-6 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Scan Online</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="font-mono text-[10px] text-sky-400 tracking-tighter">
                        COORD_X: {center.x} | COORD_Y: {center.y}
                    </div>
                </div>
            </div>

            {/* PAINEL DE INTELIGÊNCIA FLUTUANTE (DIREITA) */}
            <AnimatePresence>
                {selectedSector && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed right-10 top-32 bottom-32 w-96 bg-neutral-950/90 backdrop-blur-2xl rounded-[3rem] border-2 border-white/5 p-8 shadow-2xl z-40 overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Target size={200} className="text-white" />
                        </div>

                        <header className="mb-8 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Sector_Inteligence</span>
                            </div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                                {selectedSector.base?.nome || 'Sector Vazio'}
                            </h3>
                            <div className="flex items-center gap-2 text-neutral-500 font-mono text-sm">
                                <Crosshair size={14} /> <span className="text-sky-500">[{selectedSector.x.toString().padStart(3,'0')}:{selectedSector.y.toString().padStart(3,'0')}]</span>
                            </div>
                        </header>

                        <div className="flex-1 space-y-8 relative z-10 overflow-auto custom-scrollbar pr-2">
                            {selectedSector.base ? (
                                <div className="space-y-8">
                                    <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 shadow-inner">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20">
                                                <User size={20} className="text-sky-400" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-neutral-500 uppercase font-black block tracking-widest">Commanding_Officer</span>
                                                <span className="text-xl font-black text-white tracking-tight">{selectedSector.base.jogador?.username}</span>
                                            </div>
                                        </div>
                                        {selectedSector.base.jogador?.alianca && (
                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                                                <Shield size={14} className="text-neutral-600" />
                                                <span className="text-[11px] font-black text-sky-400 uppercase tracking-tighter">
                                                    Allied_Command: {selectedSector.base.jogador.alianca.tag}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 group">
                                            <span className="text-[9px] text-neutral-600 uppercase font-black block mb-2">Defense_Protocols</span>
                                            <div className="flex items-center gap-2 text-red-500 group-hover:scale-105 transition-transform">
                                                <Shield size={14} />
                                                <span className="font-black text-xs">HARDENED</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 group">
                                            <span className="text-[9px] text-neutral-600 uppercase font-black block mb-2">Resource_Yield</span>
                                            <div className="flex items-center gap-2 text-emerald-500 group-hover:scale-105 transition-transform">
                                                <Zap size={14} />
                                                <span className="font-black text-xs">HARVESTABLE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedSector.base.jogador?.id !== playerBase?.jogador_id ? (
                                        <Button 
                                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-3xl shadow-xl shadow-red-600/20 active:scale-95 transition-all text-xs"
                                            onClick={() => setIsAttackModalOpen(true)}
                                        >
                                            ENGAGE_COMBAT_SEQUENCE
                                        </Button>
                                    ) : (
                                        <div className="py-6 text-center border-2 border-dashed border-sky-500/20 rounded-3xl bg-sky-500/5">
                                            <span className="text-xs font-black text-sky-400 uppercase tracking-widest">Friendly_Fire_Restricted</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="relative p-6 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 group hover:border-sky-500/30 transition-colors">
                                        <p className="text-xs text-neutral-500 font-medium leading-relaxed uppercase tracking-tight">
                                            Neutral Sector detected. Zero structural signals found. Military control recommended for territorial integrity.
                                        </p>
                                    </div>
                                    <Button 
                                        variant="outline"
                                        className="w-full border-2 border-white/5 hover:bg-white/5 text-neutral-400 hover:text-white font-black uppercase tracking-[0.2em] py-8 rounded-3xl transition-all text-xs"
                                        onClick={() => setIsAttackModalOpen(true)}
                                    >
                                        DISPATCH_RECON_UNIT
                                    </Button>
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-neutral-600 text-[10px] font-black uppercase hover:text-sky-500"
                                        onClick={() => setSelectedSector(null)}
                                    >
                                        ABORT_INTEL_SCAN
                                    </Button>
                                </div>
                            )}
                        </div>
                        
                        <footer className="mt-8 pt-6 border-t border-white/5 text-center">
                            <span className="text-[8px] font-mono text-neutral-700 tracking-[0.5em]">SYSTEMS_STABLE_V3.9.2</span>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DE ATAQUE */}
            {selectedSector && (
                <AttackModal 
                    isOpen={isAttackModalOpen}
                    onClose={() => setIsAttackModalOpen(false)}
                    origemBase={playerBase}
                    destinoBase={selectedSector.base || { 
                        coordenada_x: selectedSector.x, 
                        coordenada_y: selectedSector.y,
                        nome: 'Sector Neutro'
                    }}
                    tropasDisponiveis={troops}
                    gameConfig={gameConfig}
                    onEnviar={handleSendAttack}
                    isSending={processing}
                />
            )}

            <StrategyHUD 
                resources={globalState.resources}
                coordinates={center}
                selectedEntity={selectedEntityObj}
                miniMapData={gameEntities}
                villages={globalState.villages}
                onJump={(x, y) => setCenter({ x, y })}
            />
        </div>
    );
}


