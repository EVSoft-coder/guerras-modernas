import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Radio, Crosshair, Map as MapIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Target } from 'lucide-react';
import { AttackModal } from '@/components/game/AttackModal';
import { router } from '@inertiajs/react';
import { useToasts } from '@/components/game/ToastProvider';
import { gameStateService } from '../../../src/services/GameStateService';
import { eventBus, Events } from '../../../src/core/EventBus';

interface MapaProps {
    bases: any[];
    x: number;
    y: number;
    raio: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mapa TÃ¡tico', href: '/mapa' },
];

const MapLegend = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-tighter">{label}</span>
    </div>
);

export default function Mapa({ bases, x, y, raio, origemBase, gameConfig, ataquesEnviados, ataquesRecebidos, diplomacia, userAliancaId, auth, general }: any) {
    const { addToast } = useToasts();
    const [selectedTarget, setSelectedTarget] = React.useState<any>(null);
    const [isSending, setIsSending] = React.useState(false);
    const [jumpX, setJumpX] = React.useState(x);
    const [jumpY, setJumpY] = React.useState(y);
    const [entities, setEntities] = React.useState(gameStateService.getGameState());

    React.useEffect(() => {
        // Sincronizar ataques com o motor ECS
        if (ataquesEnviados) gameStateService.syncAttacks(ataquesEnviados);
        if (ataquesRecebidos) gameStateService.syncAttacks(ataquesRecebidos);

        // Feedback de Combate em Tempo Real
        const unsubArrived = eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
            const res = ev.data.result === 'VICTORY' ? 'VITÃ“RIA' : 'MISSÃƒO CONCLUÃ DA';
            addToast(`OFENSIVA: ${res} em [${ev.data.targetId || 'Sector'}]. Saque iniciado.`, 'success');
        });

        const unsubReturned = eventBus.subscribe(Events.ATTACK_RETURNED, (ev) => {
            addToast(`LOGÃ STICA: Tropas regressaram com recursos capturados.`, 'info');
            router.reload({ only: ['origemBase'] });
        });

        let frameId: number;
        const sync = () => {
            setEntities([...gameStateService.getGameState()]);
            frameId = requestAnimationFrame(sync);
        };
        frameId = requestAnimationFrame(sync);
        
        return () => {
            cancelAnimationFrame(frameId);
            unsubArrived();
            unsubReturned();
        };
    }, [ataquesEnviados, ataquesRecebidos]);

    // Inject config for the modal's internal stats engine
    if (typeof window !== 'undefined') {
        (window as any).gameConfig = gameConfig;
    }
    // Gerar a grelha de visualizaÃ§Ã£o
    const grid = [];
    for (let iy = y - raio; iy <= y + raio; iy++) {
        const row = [];
        for (let ix = x - raio; ix <= x + raio; ix++) {
            const base = bases.find((b: any) => b.coordenada_x === ix && b.coordenada_y === iy);
            row.push({ x: ix, y: iy, base });
        }
        grid.push(row);
    }

    const getDiplomacyStatus = (targetAliancaId: number | null) => {
        if (!targetAliancaId || !userAliancaId) return null;
        if (targetAliancaId === userAliancaId) return 'OWN_ALLY';
        
        const relation = diplomacia.find((d: any) => d.alvo_alianca_id === targetAliancaId);
        return relation?.tipo || null;
    };

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
                        <div className="flex items-center gap-4">
                            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Vigilância de Satélite em Tempo Real</p>
                            <div className="flex gap-3">
                                <MapLegend color="bg-emerald-500" label="Próprio" />
                                <MapLegend color="bg-sky-500" label="Aliado" />
                                <MapLegend color="bg-teal-400" label="PNA" />
                                <MapLegend color="bg-red-500" label="Inimigo" />
                            </div>
                        </div>
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
                    <div className="grid gap-[2px] bg-black/20 p-2 rounded-xl border border-white/10 shadow-2xl overflow-auto max-w-full max-h-[75vh]">
                        {grid.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-[2px]">
                                {row.map((cell, cellIndex) => {
                                    const isOwn = cell.base && cell.base.jogador_id === auth.user.jogador.id;
                                    const isNpc = cell.base?.is_npc;
                                    const isCenter = cell.x === x && cell.y === y;
                                    const isSelected = selectedTarget?.coordenada_x === cell.x && selectedTarget?.coordenada_y === cell.y;
                                    
                                    const diploStatus = cell.base?.jogador?.alianca_id ? getDiplomacyStatus(cell.base.jogador.alianca_id) : null;

                                    let cellClass = 'bg-white/[0.03] border-white/[0.04] hover:border-white/20';
                                    if (cell.base) {
                                        if (isOwn) cellClass = 'bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/40';
                                        else if (isNpc) cellClass = 'bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/30';
                                        else {
                                            switch(diploStatus) {
                                                case 'OWN_ALLY':
                                                case 'aliado':
                                                    cellClass = 'bg-sky-500/20 border-sky-500/40 hover:bg-sky-500/40';
                                                    break;
                                                case 'pna':
                                                    cellClass = 'bg-teal-400/20 border-teal-400/40 hover:bg-teal-400/40';
                                                    break;
                                                case 'inimigo':
                                                    cellClass = 'bg-red-600/30 border-red-500/50 hover:bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
                                                    break;
                                                default:
                                                    cellClass = 'bg-red-500/10 border-red-500/40 hover:bg-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.15)]';
                                            }
                                        }
                                    }

                                    return (
                                        <div 
                                            key={`${cell.x}-${cell.y}`}
                                            onClick={() => {
                                                if (isOwn) return;
                                                setSelectedTarget(cell.base || { nome: `Setor [${cell.x}:${cell.y}]`, coordenada_x: cell.x, coordenada_y: cell.y, id: null });
                                            }}
                                            title={cell.base ? `${cell.base.nome} [${cell.x}:${cell.y}]${isNpc ? ' (NPC)' : ''}` : `${cell.x}:${cell.y}`}
                                            className={`w-8 h-8 md:w-10 md:h-10 border rounded-sm flex items-center justify-center relative transition-all duration-200 group cursor-pointer
                                                ${cellClass}
                                                ${isCenter ? 'border-orange-500/60 ring-1 ring-orange-500/40' : ''}
                                                ${isSelected ? 'ring-2 ring-sky-500 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : ''}
                                            `}
                                        >
                                            <span className="text-[6px] text-neutral-700 absolute top-0 left-0.5 hidden md:block">{cell.x}:{cell.y}</span>
                                            {cell.base ? (
                                                <div className="flex items-center justify-center">
                                                    {isNpc ? (
                                                        <Crosshair size={12} className="text-amber-500" />
                                                    ) : isOwn ? (
                                                        <Radio size={12} className="text-emerald-400" />
                                                    ) : (
                                                        <Radio size={12} className={diploStatus === 'aliado' || diploStatus === 'OWN_ALLY' ? 'text-sky-400' : diploStatus === 'pna' ? 'text-teal-400' : 'text-red-500'} />
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* MONITOR TÃ CTICO ECS */}
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
                                <button 
                                    onClick={() => {
                                        eventBus.emit(Events.BUILDING_REQUEST as any, {
                                            entityId: ent.id,
                                            timestamp: Date.now(),
                                            data: { buildingType: 'MINE' }
                                        });
                                    }}
                                    className="mt-2 w-full py-1 bg-sky-600/40 hover:bg-sky-500 text-[8px] font-black uppercase rounded transition-colors border border-sky-400/30"
                                >
                                    Construir MINE
                                </button>
                                {ent.march && (
                                    <div className="mt-2 bg-red-500/10 p-1 border border-red-500/20 rounded">
                                        <div className="flex justify-between items-center text-[7px] font-black uppercase">
                                            <span className="text-red-400">EM MOVIMENTO</span>
                                            <span className="text-white">{Math.round(ent.march.remainingTime)}s</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {entities.length === 0 && (
                            <div className="col-span-full py-4 text-center text-neutral-600 animate-pulse">
                                AGUARDANDO SINCRONIZAÃ‡ÃƒO COM O MOTOR NUCLEAR...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AttackModal 
                isOpen={!!selectedTarget}
                onClose={() => setSelectedTarget(null)}
                gameConfig={gameConfig}
                origemBase={origemBase}
                destinoBase={selectedTarget}
                tropasDisponiveis={origemBase?.tropas || []}
                isSending={isSending}
                general={general}
                onEnviar={(params) => {
                    setIsSending(true);
                    const payload = {
                        ...params,
                        origem_id: origemBase?.id,
                        destino_id: selectedTarget?.id,
                        destino_x: selectedTarget?.coordenada_x,
                        destino_y: selectedTarget?.coordenada_y
                    };
                    
                    router.post('/base/atacar', payload, {
                        onSuccess: () => {
                            addToast('ORDEM DE MARCHA CONFIRMADA!', 'success');
                            setSelectedTarget(null);
                            setIsSending(false);
                            router.reload({ only: ['ataquesEnviados'] });
                        },
                        onError: (e: any) => {
                            addToast(e.error || 'FALHA NA TRANSMISSÃƒO', 'error');
                            setIsSending(false);
                        }
                    });
                }}
            />
        </AppLayout>
    );
}
