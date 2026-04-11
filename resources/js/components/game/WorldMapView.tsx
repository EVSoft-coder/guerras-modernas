import React, { useState, useEffect, useMemo } from 'react';
import { Map as MapIcon, Target, Search, Crosshair, Navigation, Shield, User, Zap, Sword, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { AttackModal } from './AttackModal';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

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
    const [bases, setBases] = useState<BaseMap[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSector, setSelectedSector] = useState<{ x: number, y: number, base?: BaseMap } | null>(null);
    const [searchCoords, setSearchCoords] = useState({ x: '', y: '' });
    const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);

    const RAIO = 5; // Visualizar 11x11
    
    const fetchMapData = async (cx: number, cy: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/mapa/data?x=${cx}&y=${cy}&raio=${RAIO + 2}`);
            setBases(response.data.bases);
        } catch (error) {
            console.error("Erro ao carregar mapa tático:", error);
            toast.error("Falha na sincronização de satélite.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMapData(center.x, center.y);
    }, [center]);

    const sectors = useMemo(() => {
        const items = [];
        for (let y = center.y - RAIO; y <= center.y + RAIO; y++) {
            for (let x = center.x - RAIO; x <= center.x + RAIO; x++) {
                const baseAt = bases.find(b => b.coordenada_x === x && b.coordenada_y === y);
                items.push({ x, y, base: baseAt });
            }
        }
        return items;
    }, [center, bases]);

    const handleSearch = () => {
        const nx = parseInt(searchCoords.x);
        const ny = parseInt(searchCoords.y);
        if (!isNaN(nx) && !isNaN(ny)) {
            setCenter({ x: nx, y: ny });
            setSelectedSector({ x: nx, y: ny, base: bases.find(b => b.coordenada_x === nx && b.coordenada_y === ny) });
        }
    };

    const jumpToPlayer = () => {
        if (playerBase) setCenter({ x: playerBase.coordenada_x, y: playerBase.coordenada_y });
    };

    // Form de Ataque
    const { post, processing } = useForm();

    const handleSendAttack = (params: any) => {
        post(route('base.atacar', { ...params, origem_id: playerBase.id }), {
            onSuccess: () => {
                setIsAttackModalOpen(false);
                setSelectedSector(null);
            },
            onError: (errors) => {
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

                {/* Grid */}
                <div className="aspect-square w-full grid grid-cols-11 grid-rows-11 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    {sectors.map((sector, idx) => (
                        <motion.div 
                            key={`${sector.x}-${sector.y}`}
                            whileHover={{ backgroundColor: 'rgba(56, 189, 248, 0.05)' }}
                            className={`border-[0.5px] border-white/5 flex items-center justify-center relative cursor-crosshair transition-all duration-300
                                ${selectedSector?.x === sector.x && selectedSector?.y === sector.y ? 'bg-sky-500/10 border-sky-500/40 ring-1 ring-inset ring-sky-500/20' : ''}
                            `}
                            onClick={() => setSelectedSector(sector)}
                        >
                            {/* Coordenadas HUD (Canto) */}
                            {idx === 0 && (
                                <span className="absolute top-1 left-2 text-[8px] font-mono text-neutral-600">
                                    GRID_{sector.x}:{sector.y}
                                </span>
                            )}

                            {/* Conteúdo do Sector */}
                            {sector.base ? (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`relative p-2 rounded-xl transition-all duration-500 ${
                                        sector.base.jogador?.id === playerBase?.jogador_id 
                                        ? 'bg-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                                        : 'bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:scale-110'
                                    }`}
                                >
                                    <Shield size={20} className={sector.base.jogador?.id === playerBase?.jogador_id ? 'text-sky-400' : 'text-red-500'} />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full border border-white/20 flex items-center justify-center">
                                        <span className="text-[7px] font-black text-white">{sector.base.qg_nivel}</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                            )}

                            {/* Radar Ping (Animação) */}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                                    <div className="w-full h-full bg-sky-500/5 animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    ))}
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

            {/* PAINEL DE INTELIGÊNCIA (DIREITA) */}
            <div className="w-full lg:w-80 space-y-4">
                <AnimatePresence mode="wait">
                    {selectedSector ? (
                        <motion.div 
                            key="selected"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-neutral-900 rounded-[2rem] border border-white/10 p-6 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Target size={80} className="text-red-500" />
                            </div>

                            <header className="mb-6">
                                <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1 block">Sector Seleccionado</span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {selectedSector.base?.nome || 'Sector Vazio'}
                                </h3>
                                <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs mt-1">
                                    <Crosshair size={12} /> [{selectedSector.x}:{selectedSector.y}]
                                </div>
                            </header>

                            {selectedSector.base ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <User size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Comandante</span>
                                                <span className="text-sm font-black text-white">{selectedSector.base.jogador?.username}</span>
                                            </div>
                                        </div>
                                        {selectedSector.base.jogador?.alianca && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-neutral-500 font-black">ALI</span>
                                                <span className="text-[10px] font-black text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                                                    {selectedSector.base.jogador.alianca.tag}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-[8px] text-neutral-500 uppercase font-black block mb-1">Defesa</span>
                                            <div className="flex items-center gap-2 text-red-500">
                                                <Shield size={12} />
                                                <span className="font-mono text-xs">DETECTADA</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-[8px] text-neutral-500 uppercase font-black block mb-1">Recursos</span>
                                            <div className="flex items-center gap-2 text-emerald-500">
                                                <Zap size={12} />
                                                <span className="font-mono text-xs">VULNERÁVEL</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedSector.base.jogador?.id !== playerBase?.jogador_id ? (
                                        <Button 
                                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl group"
                                            onClick={() => setIsAttackModalOpen(true)}
                                        >
                                            ORDEM DE ATAQUE <Sword size={16} className="ml-2 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    ) : (
                                        <div className="py-4 text-center border border-dashed border-sky-500/30 rounded-2xl bg-sky-500/5">
                                            <span className="text-[10px] font-black text-sky-400 uppercase">Zona de Controlo Aliada</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-xs text-neutral-500 italic leading-relaxed">
                                        Este sector não contém infraestruturas permanentes. Operações militares aqui resultariam apenas em controlo territorial sem ganho imediato de recursos.
                                    </p>
                                    <Button 
                                        variant="outline"
                                        className="w-full border-white/10 hover:bg-neutral-800 text-neutral-400 font-black uppercase tracking-widest py-6 rounded-2xl"
                                        onClick={() => setIsAttackModalOpen(true)}
                                    >
                                        ENVIAR RECONHECIMENTO <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center p-8 bg-neutral-900/50 rounded-[2rem] border border-dashed border-white/10 text-center"
                        >
                            <MapIcon className="text-neutral-700 mb-4" size={48} />
                            <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Aguardando Selecção</h4>
                            <p className="text-[9px] text-neutral-700 uppercase mt-2">Clica numa zona do grid para obter inteligência táctica.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
        </div>
    );
}
鼓鼓 [failed_replace_file_content_reminder]
