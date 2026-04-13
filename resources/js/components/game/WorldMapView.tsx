import React, { useState, useEffect, useMemo } from 'react';
import { Map as MapIcon, Target, Search, Crosshair, Navigation, Shield, User, Zap, Sword, ChevronRight, Home, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AttackModal } from './AttackModal';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useGameEntities } from '@/hooks/use-game-entities';
import { StrategyHUD } from './StrategyHUD';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BaseMap {
    id: number;
    nome: string;
    coordenada_x: number;
    coordenada_y: number;
    loyalty?: number;
    is_protected?: boolean;
    protection_until?: string;
    jogador_id: number | null;
    nivel?: number;
    jogador?: {
        id: number;
        username: string;
        nome?: string;
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
    const [selectedSector, setSelectedSector] = useState<{ x: number, y: number, base?: any } | null>(null);
    const [searchCoords, setSearchCoords] = useState({ x: '', y: '' });
    const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const { entities: gameEntities, globalState } = useGameEntities();

    const selectedEntityObj = useMemo(() => {
        return gameEntities.find(e => e.id === selectedUnit);
    }, [gameEntities, selectedUnit]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom(prev => Math.min(Math.max(prev + delta, 0.4), 2.5));
    };

    // TACTICAL REMOVAL: Chunk loading logic removed in favor of direct ECS Observation
    
    useEffect(() => {
        // RADAR TÁCTICO: Listeners de eventos de combate continuam activos via EventBus
        if ((window as any).eventBus) {
            const eb = (window as any).eventBus;
            
            const unsubCombat = eb.subscribe('COMBAT:RESULT', (payload: any) => {
                const { vitoria, losses, loot } = payload.data;
                if (vitoria) {
                    toast.success(`VITÓRIA MILITAR: Capturadas ${loot} unidades de recursos! Baixas: ${losses}`, {
                        icon: <Sword className="text-emerald-500" />
                    });
                } else {
                    toast.error(`DERROTA NO CAMPO: Forças repelidas com ${losses} baixas.`, {
                        icon: <ShieldAlert className="text-red-500" />
                    });
                }
            });

            const unsubConquered = eb.subscribe('VILLAGE:CONQUERED', (payload: any) => {
                toast.success("DOMÍNIO ABSOLUTO: Nova base anexada ao seu comando!", {
                    description: `Setor ${payload.data.villageId} agora sob sua soberania.`,
                    duration: 6000
                });
            });

            return () => {
                unsubCombat();
                unsubConquered();
            };
        }
    }, [center]);

    // SINGLE SOURCE OF TRUTH: All villages come from Entity Component System
    const visibleBases = useMemo(() => {
        return gameEntities.filter(e => e.type === 'VILLAGE' || e.type === 'village').map(e => ({
            id: e.id,
            nome: e.name || 'Setor Hostil',
            coordenada_x: e.x,
            coordenada_y: e.y,
            loyalty: e.loyalty,
            jogador_id: e.ownerId,
            is_protected: e.isProtected,
            protection_until: e.protectionUntil ? new Date(e.protectionUntil).toISOString() : undefined,
            jogador: e.ownerId ? { id: e.ownerId, username: e.ownerId === playerBase?.jogador_id ? 'VOCÊ' : `COMANDANTE_${e.ownerId}` } : undefined
        }));
    }, [gameEntities, playerBase]);

    const rebelBasesCount = useMemo(() => {
        return visibleBases.filter(b => !b.jogador_id).length;
    }, [visibleBases]);

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

    const { post, processing } = useForm();

    const handleSendAttack = (params: any) => {
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
        }

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

    const debugRebels = [
        { id: 9991, coordenada_x: (playerBase?.coordenada_x || center.x) + 2, coordenada_y: (playerBase?.coordenada_y || center.y) + 2, jogador_id: null, nome: 'REBELDE_A' },
        { id: 9992, coordenada_x: (playerBase?.coordenada_x || center.x) - 2, coordenada_y: (playerBase?.coordenada_y || center.y) - 1, jogador_id: null, nome: 'REBELDE_B' }
    ];

    const allBases = [...visibleBases, ...debugRebels];

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 h-full overflow-hidden">
            <div className="flex-1 bg-neutral-950 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative h-[700px]">
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center shadow-2xl pointer-events-auto">
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
                    <Button variant="outline" className="bg-black/80 backdrop-blur-xl border-white/10 rounded-2xl text-[10px] font-black uppercase pointer-events-auto" onClick={jumpToPlayer}>
                        <Navigation size={14} className="mr-2 text-sky-500" /> Minha Base
                    </Button>
                </div>

                <div 
                    className="relative w-full h-full overflow-auto bg-neutral-900 custom-scrollbar"
                    onWheel={handleWheel}
                >
                    <div 
                        className="relative transition-transform duration-200 ease-out"
                        style={{ 
                            width: `${20 * 80}px`, 
                            height: `${20 * 80}px`,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center'
                        }}
                    >
                        <TooltipProvider>
                            {Array.from({ length: 20 }).map((_, iy) => {
                                const y = center.y - 10 + iy;
                                return Array.from({ length: 20 }).map((_, ix) => {
                                    const x = center.x - 10 + ix;
                                    const baseAt = allBases.find(b => b.coordenada_x === x && b.coordenada_y === y);
                                    const isSelected = selectedSector?.x === x && selectedSector?.y === y;
                                    
                                    const isPlayer = baseAt?.jogador_id === playerBase?.jogador_id;
                                    const isRebel = baseAt && !baseAt.jogador_id;
                                    const isEnemy = baseAt && baseAt.jogador_id && baseAt.jogador_id !== playerBase?.jogador_id;

                                    return (
                                        <Tooltip key={`${x}-${y}`}>
                                            <TooltipTrigger asChild>
                                                <div 
                                                    className={`absolute border border-white/[0.05] transition-all cursor-crosshair group flex items-center justify-center
                                                        ${isSelected ? 'border-sky-500 z-10 bg-sky-500/10 shadow-[0_0_30px_rgba(14,165,233,0.4)] ring-2 ring-sky-500/50' : 'hover:bg-white/5'}
                                                        ${isPlayer ? 'bg-sky-500/10 border-sky-500/20' : ''}
                                                        ${isEnemy ? 'bg-red-500/10 border-red-500/20' : ''}
                                                        ${isRebel ? 'bg-red-600/20 border-red-600/40 z-[1000] opacity-100' : ''}
                                                    `}
                                                    onClick={() => setSelectedSector({ x, y, base: baseAt })}
                                                    style={{ left: ix * 80, top: iy * 80, width: 80, height: 80 }}
                                                >
                                                    <span className={`absolute top-1 left-1 text-[7px] font-mono transition-opacity ${isSelected ? 'text-sky-400 opacity-100' : 'text-neutral-700 opacity-40 group-hover:opacity-100'}`}>
                                                        {x.toString().padStart(2, '0')}:{y.toString().padStart(2, '0')}
                                                    </span>

                                                    {baseAt && (
                                                        <motion.div 
                                                            animate={isSelected ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                                                            transition={{ repeat: Infinity, duration: 3 }}
                                                            className={`p-3 rounded-xl border-2 shadow-2xl relative
                                                                ${isPlayer ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sky-500/20' : ''}
                                                                ${isEnemy ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/20' : ''}
                                                                ${isRebel ? 'bg-red-600/40 text-red-100 border-red-600/60 shadow-red-600/40' : ''}
                                                            `}
                                                        >
                                                            <Home size={24} />
                                                            {isSelected && (
                                                                <div className="absolute -inset-2 bg-sky-500/20 blur-xl rounded-full -z-10 animate-pulse" />
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-black/90 border-white/10 p-4 rounded-2xl shadow-2xl side-top">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Target size={12} className={isEnemy ? 'text-red-500' : (isRebel ? 'text-amber-500' : 'text-sky-500')} />
                                                        <span className="text-[10px] font-black uppercase text-white">
                                                            {isRebel ? 'REBELDE' : (baseAt?.nome || 'Sector Neutro')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 text-[8px] font-mono text-neutral-500">
                                                        <span>COORD: {x}:{y}</span>
                                                        <span>LOYALTY: {baseAt?.loyalty ?? 100}%</span>
                                                        {baseAt?.is_protected && (
                                                            <span className="text-yellow-400 font-black animate-pulse">UNDER_PROTECTION</span>
                                                        )}
                                                        <span>OWNER: {isRebel ? 'NEUTRAL_INSURGENT' : (baseAt?.jogador?.username || 'NONE')}</span>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })
                            })}
                        </TooltipProvider>

                        <div className="absolute inset-0 pointer-events-none z-30">
                            {gameEntities.map(e => (
                                <motion.div 
                                    key={`entity-${e.id}`}
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
                                    <div className="relative group cursor-pointer" onClick={() => setSelectedUnit(e.id)}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={`
                                                    relative w-10 h-10 rounded-xl border-2 rotate-45 flex items-center justify-center transition-all
                                                    ${e.type === 'Army' ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-sky-500/50 shadow-xl'}
                                                    ${selectedUnit === e.id ? 'bg-orange-500 border-white' : 'bg-black/80 hover:border-sky-400'}
                                                `}>
                                                    <div className="-rotate-45">
                                                        {e.type === 'Army' ? (
                                                            <Navigation size={18} className={`${selectedUnit === e.id ? 'text-black' : 'text-orange-400'} ${e.status === 'returning' ? 'rotate-180' : ''}`} />
                                                        ) : (
                                                            <Target size={18} className={selectedUnit === e.id ? 'text-black' : 'text-sky-400'} />
                                                        )}
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-black/90 border-white/10 p-3 rounded-xl shadow-2xl z-[100]">
                                                <div className="space-y-1">
                                                    <div className="text-[9px] font-black uppercase text-white flex items-center gap-2">
                                                        <Navigation size={10} className="text-orange-400" /> 
                                                        EXPE_ID: {e.id} | {e.status?.toUpperCase() || 'OPERACIONAL'}
                                                    </div>
                                                    {e.march && (
                                                        <div className="text-[8px] font-mono text-neutral-500">
                                                            ETA: {Math.max(0, Math.floor(e.march.remainingTime))}s |
                                                            DEST: {e.march.target.x}:{e.march.target.y}
                                                        </div>
                                                    )}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-6 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Scan Online</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="font-mono text-[10px] text-sky-400 tracking-tighter">
                        COORD_X: {center.x} | COORD_Y: {center.y} | BASES: {visibleBases.length} | REBELDES: {rebelBasesCount}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedSector && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed right-10 top-32 bottom-32 w-96 bg-neutral-950/90 backdrop-blur-2xl rounded-[3rem] border-2 border-white/5 p-8 shadow-2xl z-40 overflow-hidden flex flex-col pointer-events-auto"
                    >
                        <header className="mb-8">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                                {selectedSector.base?.nome || 'Sector Vazio'}
                            </h3>
                            <div className="flex items-center gap-2 text-neutral-500 font-mono text-sm">
                                <Crosshair size={14} /> <span className="text-sky-500">[{selectedSector.x}:{selectedSector.y}]</span>
                            </div>
                        </header>

                        <div className="flex-1 space-y-8 overflow-auto custom-scrollbar">
                            {selectedSector.base ? (
                                <div className="space-y-8">
                                    {/* LOYALTY TRACKER */}
                                    <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Territorial_Loyalty</span>
                                            <span className={`text-xs font-black ${(selectedSector.base?.loyalty ?? 100) < 30 ? 'text-red-500' : 'text-sky-400'}`}>
                                                {selectedSector.base?.loyalty ?? 100}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${selectedSector.base?.loyalty ?? 100}%` }}
                                                className={`h-full transition-all duration-1000 ${
                                                    (selectedSector.base?.loyalty ?? 100) < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                                                    (selectedSector.base?.loyalty ?? 100) < 60 ? 'bg-amber-500' : 'bg-sky-500'
                                                }`}
                                            />
                                        </div>
                                        <p className="text-[8px] text-neutral-500 font-mono leading-tight">
                                            { (selectedSector.base?.loyalty ?? 100) < 30 
                                                ? 'CRITICAL_INSTABILITY: High risk of capitulation detected.' 
                                                : 'Sovereignty status within operational parameters.' 
                                            }
                                        </p>
                                    </div>

                                    <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                                        <span className="text-[10px] text-neutral-500 uppercase font-black block tracking-widest">Commanding_Officer</span>
                                        <span className="text-xl font-black text-white tracking-tight">{selectedSector.base.jogador?.username || 'NEUTRAL_INSURGENT'}</span>
                                    </div>
                                    {selectedSector.base?.is_protected && selectedSector.base.protection_until && new Date(selectedSector.base.protection_until) > new Date() ? (
                                        <div className="py-8 text-center border-2 border-dashed border-yellow-500/30 rounded-3xl bg-yellow-500/5">
                                            <div className="flex flex-col items-center gap-2">
                                                <Shield className="text-yellow-500 animate-pulse" size={32} />
                                                <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">TACTICAL_TRUCE_ACTIVE</span>
                                                {selectedSector.base.protection_until && (
                                                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                                                        Remains: {new Date(selectedSector.base.protection_until).toLocaleTimeString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (!selectedSector.base?.jogador_id || selectedSector.base.jogador_id !== playerBase?.jogador_id) ? (
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
                                <Button 
                                    variant="outline"
                                    className="w-full border-2 border-white/5 py-8 rounded-3xl text-neutral-400 font-black uppercase"
                                    onClick={() => setIsAttackModalOpen(true)}
                                >
                                    DISPATCH_RECON
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedSector && (
                <AttackModal 
                    isOpen={isAttackModalOpen}
                    onClose={() => setIsAttackModalOpen(false)}
                    origemBase={playerBase}
                    destinoBase={selectedSector.base || { coordenada_x: selectedSector.x, coordenada_y: selectedSector.y, nome: 'Sector Neutro' }}
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
