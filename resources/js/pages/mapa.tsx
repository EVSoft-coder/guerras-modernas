import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Radio, Crosshair, Map as MapIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Target } from 'lucide-react';
import { AttackModal } from '@/components/game/AttackModal';
import { router } from '@inertiajs/react';
import { useToasts } from '@/components/game/ToastProvider';
import { gameStateService } from '../../../src/services/GameStateService';

interface MapaProps {
    bases: any[];
    x: number;
    y: number;
    raio: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mapa Tático', href: '/mapa' },
];

export default function Mapa({ bases, x, y, raio, origemBase, gameConfig }: any) {
    const { addToast } = useToasts();
    const [selectedTarget, setSelectedTarget] = React.useState<any>(null);
    const [isSending, setIsSending] = React.useState(false);
    const [jumpX, setJumpX] = React.useState(x);
    const [jumpY, setJumpY] = React.useState(y);
    const [entities, setEntities] = React.useState(gameStateService.getGameState());

    React.useEffect(() => {
        let frameId: number;
        const sync = () => {
            setEntities([...gameStateService.getGameState()]);
            frameId = requestAnimationFrame(sync);
        };
        frameId = requestAnimationFrame(sync);
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Inject config for the modal's internal stats engine
    if (typeof window !== 'undefined') {
        (window as any).gameConfig = gameConfig;
    }
    // Gerar a grelha de visualização
    const grid = [];
    for (let iy = y - raio; iy <= y + raio; iy++) {
        const row = [];
        for (let ix = x - raio; ix <= x + raio; ix++) {
            const base = bases.find(b => b.coordenada_x === ix && b.coordenada_y === iy);
            row.push({ x: ix, y: iy, base });
        }
        grid.push(row);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Setor [${x}:${y}] - Mapa Tático`} />
            
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <MapIcon className="text-sky-500" size={24} />
                            Setor Operacional [{x}:{y}]
                        </h1>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Vigilância de Satélite em Tempo Real</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                            <input 
                                type="number" 
                                value={jumpX} 
                                onChange={(e) => setJumpX(parseInt(e.target.value))}
                                className="w-12 bg-transparent text-center text-xs font-bold border-none focus:ring-0" 
                            />
                            <span className="text-neutral-600">:</span>
                            <input 
                                type="number" 
                                value={jumpY} 
                                onChange={(e) => setJumpY(parseInt(e.target.value))}
                                className="w-12 bg-transparent text-center text-xs font-bold border-none focus:ring-0" 
                            />
                            <button 
                                onClick={() => router.get(`/mapa?x=${jumpX}&y=${jumpY}`)}
                                className="p-2 hover:bg-sky-500/20 text-sky-500 rounded transition-colors"
                            >
                                <Search size={14} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                            <Link href={`/mapa?x=${x}&y=${y-5}`} className="p-2 hover:bg-white/10 rounded transition-colors"><ChevronUp size={16} /></Link>
                            <Link href={`/mapa?x=${x}&y=${y+5}`} className="p-2 hover:bg-white/10 rounded transition-colors"><ChevronDown size={16} /></Link>
                            <Link href={`/mapa?x=${x-5}&y=${y}`} className="p-2 hover:bg-white/10 rounded transition-colors"><ChevronLeft size={16} /></Link>
                            <Link href={`/mapa?x=${x+5}&y=${y}`} className="p-2 hover:bg-white/10 rounded transition-colors"><ChevronRight size={16} /></Link>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="grid gap-1 bg-black/20 p-2 rounded-xl border border-white/10 shadow-2xl overflow-auto max-w-full max-h-[70vh]">
                        {grid.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1">
                                {row.map((cell, cellIndex) => (
                                    <div 
                                        key={`${cell.x}-${cell.y}`}
                                        onClick={() => cell.base && cell.base.jogador_id !== origemBase?.jogador_id && setSelectedTarget(cell.base)}
                                        className={`w-12 h-12 md:w-16 md:h-16 border rounded flex flex-col items-center justify-center relative transition-all duration-300 group cursor-pointer
                                            ${cell.base ? (cell.base.jogador_id === origemBase?.jogador_id ? 'bg-green-500/20 border-green-500/40 hover:bg-green-500/40' : 'bg-red-500/10 border-red-500/40 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]') : 'bg-white/5 border-white/5 hover:border-white/20'}
                                            ${cell.x === x && cell.y === y ? 'border-orange-500/60 ring-1 ring-orange-500/40' : ''}
                                        `}
                                    >
                                        <span className="text-[8px] text-neutral-600 absolute top-1 left-1">{cell.x}:{cell.y}</span>
                                        {cell.base ? (
                                            <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                                                <Radio size={16} className={cell.base.jogador_id === 1 ? 'text-green-500' : 'text-red-500'} />
                                                <span className="text-[8px] font-bold uppercase truncate w-full text-center px-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 absolute -bottom-8 rounded z-10">
                                                    {cell.base.nome}
                                                </span>
                                            </div>
                                        ) : (
                                            <Crosshair size={12} className="text-neutral-800 opacity-20 group-hover:opacity-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* MONITOR TÁCTICO ECS */}
                <div className="mt-auto bg-black/60 p-4 border-t border-sky-500/30 font-mono text-xs">
                    <h3 className="text-sky-500 font-black mb-2 uppercase tracking-widest flex items-center gap-2">
                        <Target size={12} /> Telemetria de Unidades ECS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {entities.map(ent => (
                            <div key={ent.id} className="bg-white/5 p-2 rounded border border-white/5 hover:border-sky-500/50 transition-colors">
                                <span className="text-sky-400 font-bold">ENT_{ent.id}</span>
                                <div className="text-[10px] text-neutral-400">
                                    X: <span className="text-white">{Math.round(ent.x)}</span> | 
                                    Y: <span className="text-white">{Math.round(ent.y)}</span>
                                </div>
                            </div>
                        ))}
                        {entities.length === 0 && (
                            <div className="col-span-full py-4 text-center text-neutral-600 animate-pulse">
                                AGUARDANDO SINCRONIZAÇÃO COM O MOTOR NUCLEAR...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AttackModal 
                isOpen={!!selectedTarget}
                onClose={() => setSelectedTarget(null)}
                origemBase={origemBase}
                destinoBase={selectedTarget}
                tropasDisponiveis={origemBase?.tropas || []}
                isSending={isSending}
                onEnviar={(params) => {
                    setIsSending(true);
                    router.post('/base/atacar', params, {
                        onSuccess: () => {
                            addToast('ORDEM DE MARCHA CONFIRMADA!', 'success');
                            setSelectedTarget(null);
                            setIsSending(false);
                            router.visit('/dashboard');
                        },
                        onError: (e: any) => {
                            addToast(e.error || 'FALHA NA TRANSMISSÃO', 'error');
                            setIsSending(false);
                        }
                    });
                }}
            />
        </AppLayout>
    );
}
