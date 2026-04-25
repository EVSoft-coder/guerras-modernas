import React, { useState, useEffect } from 'react';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { ResourceBar } from '@/components/game/ResourceBar';
import { VisualVillageView } from '@/components/game/VisualVillageView';
import { BuildingModal } from '@/components/game/BuildingModal';
import { GarrisonPanel } from '@/components/game/GarrisonPanel';
import { ProductionQueue } from '@/components/game/ProductionQueue';
import { useToasts } from '@/components/game/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Zap, Shield, Globe, Book } from 'lucide-react';
import { ArmyMovementPanel } from '@/components/game/ArmyMovementPanel';
import { gameStateService } from '@src/services/GameStateService';
import { eventBus, Events } from '@src/core/EventBus';
import { WorldMapView } from '@/components/game/WorldMapView';
import { Logger } from '@src/core/Logger';
import { motion } from 'framer-motion';

import { useGameEntities } from '@/hooks/use-game-entities';
import { UnitQueue } from '@/components/game/UnitQueue';
import { ResearchPanel } from '@/components/game/ResearchPanel';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';

const STABLE_EMPTY_ARRAY: any[] = [];

export function VillageDashboard({ 
    jogador, base: initialBase, bases: backendBases = STABLE_EMPTY_ARRAY, taxasPerSecond, gameConfig, 
    relatoriosGlobal, buildings = STABLE_EMPTY_ARRAY, population, resources, buildingQueue = STABLE_EMPTY_ARRAY,
    unitQueue = STABLE_EMPTY_ARRAY, units = STABLE_EMPTY_ARRAY, unitTypes = STABLE_EMPTY_ARRAY,
    ataquesRecebidos = STABLE_EMPTY_ARRAY, ataquesEnviados = STABLE_EMPTY_ARRAY,
    diplomaties = STABLE_EMPTY_ARRAY, myAllianceId,
    research = null, researchBonuses = {}, researchConfig = null,
    activeEvents = []
}: DashboardProps & { research?: any; researchBonuses?: any; researchConfig?: any; activeEvents?: any[] }) {
    // 0. ECS ENGINE INTEGRATION
    const { globalState } = useGameEntities();

    // 1. DATA PROJECTOR — Usar props diretamente do backend (Passo 9)
    const base = React.useMemo(() => ({
        ...initialBase,
        edificios: buildings,
        recursos: resources,
        buildingQueue: buildingQueue,
        unitQueue: unitQueue
    }), [initialBase, buildings, resources, buildingQueue, unitQueue]);

    // Use logic villages from ECS instead of backend props for switcher
    const displayBases = (globalState.worldMapBases.length > 0 
        ? globalState.worldMapBases.filter(b => b.ownerId === jogador.id)
        : backendBases.map(b => ({ id: b.id, nome: b.nome }))) || [];

    const { addToast } = useToasts();
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [selectedBuildingType, setSelectedBuildingType] = useState<string | null>(null);
    const [selectedPos, setSelectedPos] = useState<{x: number, y: number} | null>(null);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [gameMode, setGameMode] = useState<'VILLAGE' | 'WORLD_MAP'>('VILLAGE');

    useEffect(() => {
        if (!base) return;
        if (ataquesEnviados) eventBus.emit(Events.LARAVEL_SYNC_ATTACKS, { data: { attacks: ataquesEnviados } });
        if (ataquesRecebidos) eventBus.emit(Events.LARAVEL_SYNC_ATTACKS, { data: { attacks: ataquesRecebidos } });

        const unsubArrived = eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
            const res = ev.data.result === 'VICTORY' ? 'VITÓRIA' : 'OPERACIONAL';
            addToast(`MISSÃO: Força de ataque atingiu o alvo com ${res}.`, 'success');
        });

        const unsubReturned = eventBus.subscribe(Events.ATTACK_RETURNED, (ev) => {
            addToast(`LOGÍSTICA: Coluna militar regressou à base. Saque capturado.`, 'info');
            router.reload({ only: ['base'] });
        });

        const unsubMode = eventBus.subscribe(Events.GAME_CHANGE_MODE, (ev) => {
            Logger.info(`MODE CHANGE [UI_SYNC]: ${ev.data.mode}`);
            setGameMode(ev.data.mode);
        });

        const unsubAlert = eventBus.subscribe(Events.UI_ALERT, (ev) => {
            addToast(ev.data.message, ev.data.type || 'error');
            setIsUpgrading(false);
            setIsTraining(false);
        });

        const unsubSuccess = eventBus.subscribe(Events.ACTION_SUCCESS, (ev) => {
            setIsUpgrading(false);
            setIsTraining(false);
            setSelectedBuildingId(null);
            setSelectedBuildingType(null);
        });

        return () => {
            unsubArrived();
            unsubReturned();
            unsubMode();
            unsubAlert();
            unsubSuccess();
        };
    }, [base, ataquesEnviados, ataquesRecebidos]);

    if (!base) return <div className="p-10 text-white uppercase font-mono">Connecting to Satellite...</div>;

    // Procura o edifício na base ou prepara um objeto Ghost baseado na config se necessário
    const foundBuilding = (buildings || []).find(b => {
        if (selectedBuildingId && b.id === selectedBuildingId) return true;
        if (selectedBuildingType && b.buildingType === selectedBuildingType) {
            // Se temos posição, tem de bater a posição também
            if (selectedPos) {
                return b.pos_x === selectedPos.x && b.pos_y === selectedPos.y;
            }
            return true;
        }
        return false;
    });
    let currentBuilding: any = null;
    let fallbackLevel = 0;

    if (selectedBuildingType) {
        const buildDef = (gameConfig?.buildings || {})[selectedBuildingType];
        
        // Calcular Nível Real e Estado de Obra
        const dbLevel = foundBuilding?.nivel || 0;
        
        // Procurar na fila se existe QUALQUER entrada deste tipo
        const queueEntries = (buildingQueue || []).filter(q => q.type === selectedBuildingType);
        const isUpgradingNow = queueEntries.length > 0;
        const nextLevel = dbLevel + 1;

        if (selectedBuildingType === 'hq') {
            currentBuilding = { buildingType: 'hq', nome: 'Centro de Comando (HQ)', nivel: dbLevel, nextLevel, isUpgradingNow, base: base };
            fallbackLevel = dbLevel;
        } else if (selectedBuildingType === 'muralha') {
            currentBuilding = { buildingType: 'muralha', nome: 'Perímetro Defensivo (Muralha)', nivel: dbLevel, nextLevel, isUpgradingNow, base: base };
            fallbackLevel = dbLevel;
        } else if (foundBuilding) {
            currentBuilding = { ...foundBuilding, ...buildDef, nome: buildDef?.name || 'Estrutura', nivel: dbLevel, nextLevel, isUpgradingNow, base: base };
            fallbackLevel = dbLevel;
        } else {
            currentBuilding = { 
                ...buildDef, 
                buildingType: selectedBuildingType, 
                nome: buildDef?.name || 'Projeto Padrão', 
                nivel: dbLevel,
                nextLevel,
                isUpgradingNow,
                base: base
            };
        }
    }

    const handleBuildingClick = (building: any) => {
        setSelectedBuildingId(building.id || null);
        setSelectedBuildingType(building.buildingType || null);
        setSelectedPos(building.pos_x !== undefined ? { x: building.pos_x, y: building.pos_y } : null);
    };

    const handleUpgrade = (buildingType: string) => {
        setIsUpgrading(true);
        eventBus.emit(Events.BUILDING_UPGRADE_REQUEST, {
            base_id: base.id,
            tipo: buildingType,
            pos_x: selectedPos?.x || 0,
            pos_y: selectedPos?.y || 0
        });
        setSelectedBuildingId(null);
        setSelectedPos(null);
        addToast('Pedido de atualização estrutural enviado ao Comando.', 'info');
    };

    const handleTrain = (unidade: string, quantidade: number) => {
        setIsTraining(true);
        
        // Encontrar o unit_type_id correspondente
        const unitType = unitTypes.find((ut: any) => 
            ut.name.toLowerCase().includes(unidade.toLowerCase())
        );

        if (!unitType) {
            addToast('SÉRIE DE DADOS CORROMPIDA: Unidade não mapeada no registo central.', 'error');
            setIsTraining(false);
            return;
        }

        router.post('/units/recruit', {
            unit_type_id: unitType.id,
            total_quantity: quantidade, // The new controller expects 'quantity'
            quantity: quantidade
        }, {
            onSuccess: () => {
                setIsTraining(false);
                addToast('Ordem de mobilização transmitida aos quartéis.', 'success');
            },
            onError: (err) => {
                setIsTraining(false);
                addToast(Object.values(err)[0] as string || 'Falha na mobilização.', 'error');
            }
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-10 p-8 bg-[#020406] text-white min-h-screen relative overflow-hidden font-sans">
            {/* TACTICAL ATMOSPHERE ENGINE */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[80%] h-[70%] bg-sky-500/10 blur-[180px] opacity-40 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-orange-500/5 blur-[150px] opacity-30" />
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                {/* SCANLINES */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                     style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 4px' }} />
            </div>

            <Head title="Centro de Comando Tático" />
            <ResourceBar recursos={resources} taxasPerSecond={taxasPerSecond ?? {}} populacao={population} />

            {activeEvents && activeEvents.length > 0 && (
                <div className="flex flex-col gap-2 relative z-10 px-4">
                    {activeEvents.map((evento: any) => (
                        <div key={evento.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30">
                                    <Globe className="text-yellow-500 animate-spin-slow" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-yellow-500 font-black uppercase tracking-widest text-sm">{evento.nome}</h4>
                                    <p className="text-neutral-300 text-xs mt-1">{evento.descricao}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-yellow-500/60 uppercase font-black tracking-widest">Multiplicador Ativo</span>
                                <span className="text-xl font-black text-yellow-400 font-mono">x{evento.multiplicador}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-4">
                         <div className="flex flex-col">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                                <div className="bg-orange-500/10 p-2 rounded-xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                    <Target className="text-orange-500 animate-pulse" size={32} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-orange-500/60 font-black tracking-[0.4em] mb-0.5">ESTAÇÃO_OPERACIONAL</span>
                                    {base?.nome ?? 'Desconhecido'}
                                </div>
                                
                                {displayBases.length > 1 && (
                                    <div className="flex gap-1.5 ml-6 self-center bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                                        {displayBases.map(b => (
                                            <button 
                                                key={b.id}
                                                onClick={() => b.id !== base.id && router.get(`/base/switch/${b.id}`)}
                                                className={`
                                                    px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-300
                                                    ${b.id === base.id ? 'bg-orange-500 border-orange-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5'}
                                                `}
                                            >
                                                {b.nome}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </h2>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Sistemas On-line</span>
                                </div>
                                
                                 {base?.loyalty !== undefined && (
                                      <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md">
                                         <div className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em]">Civil_Control:</div>
                                         <div className="w-32 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                             <motion.div 
                                                 initial={{ width: 0 }}
                                                 animate={{ width: `${base.loyalty}%` }}
                                                 className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
                                             />
                                         </div>
                                         <span className="text-[11px] text-white font-black font-mono tracking-tighter">{base.loyalty}%</span>
                                      </div>
                                 )}

                                 {(base?.is_protected || base?.isProtected) && (
                                     <div className="flex items-center gap-2 bg-sky-900/30 px-4 py-2 rounded-2xl border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)] backdrop-blur-md">
                                         <Shield className="text-sky-400 animate-pulse" size={14} />
                                         <span className="text-[10px] text-sky-400 font-black uppercase tracking-[0.2em]">Escudo Operacional</span>
                                     </div>
                                 )}
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <Link 
                                href="/manual"
                                className="text-[10px] text-neutral-500 hover:text-orange-400 font-black uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 transition-all"
                             >
                                <Book size={12} />
                                Manual Operacional
                             </Link>
                             <div className="text-[10px] text-neutral-700 font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                SIGINT_NODE_{base?.id ?? 'N/A'}
                             </div>
                         </div>
                    </div>
                    
                    <ArmyMovementPanel ataquesEnviados={ataquesEnviados ?? []} ataquesRecebidos={ataquesRecebidos ?? []} gameConfig={gameConfig} />
                    
                    {gameMode === 'WORLD_MAP' ? (
                        <WorldMapView 
                            playerBase={base} 
                            troops={units.length > 0 ? units.map((u: any) => {
                                const unitType = u.type || unitTypes.find((ut: any) => ut.id === u.unit_type_id);
                                return { tipo: unitType?.name || 'unidade', quantidade: u.quantity };
                            }) : (base?.tropas ?? [])} 
                            gameConfig={gameConfig} 
                            unitTypes={unitTypes}
                            diplomaties={diplomaties}
                            myAllianceId={myAllianceId}
                        />
                    ) : buildings.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-black/40 border-2 border-dashed border-orange-500/20 rounded-[2rem] backdrop-blur-xl p-10 text-center gap-6 animate-in fade-in zoom-in duration-500">
                             <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                                 <Zap className="text-orange-500 animate-pulse" size={40} />
                             </div>
                             <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Base não inicializada</h3>
                                <p className="text-xs text-neutral-500 font-medium max-w-xs mx-auto leading-relaxed">
                                    O setor militar detetado não possui infraestrutura operacional ativa no momento. É necessário realizar a mobilização inicial.
                                </p>
                             </div>
                             <button 
                                onClick={() => router.post('/base/bootstrap', { base_id: base.id })}
                                className="group relative px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95"
                             >
                                <span className="relative z-10 flex items-center gap-3">
                                    Mobilizar Estruturas Iniciais
                                    <Target size={18} />
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />
                             </button>
                        </div>
                    ) : (
                        <VisualVillageView base={base} onBuildingClick={handleBuildingClick} gameConfig={gameConfig} buildingQueue={buildingQueue} />
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    <ProductionQueue 
                        construcoes={buildingQueue} 
                        treinos={(unitQueue || []).map((t: any) => {
                            const unitType = t.unitType || unitTypes.find((ut: any) => ut.id === t.unit_type_id);
                            return { ...t, unitType: unitType };
                        })} 
                        gameConfig={gameConfig} 
                    />
                    <UnitQueue queue={unitQueue || STABLE_EMPTY_ARRAY} />
                    <GarrisonPanel 
                        tropas={units.length > 0 
                            ? units.map((u: any) => {
                                const unitType = u.type || unitTypes.find((ut: any) => ut.id === u.unit_type_id);
                                return { tipo: unitType?.name || 'unidade', quantidade: u.quantity };
                            }) 
                            : (base?.tropas || []).map((t: any) => ({ tipo: t.unidade || t.tipo, quantidade: t.quantidade }))
                        } 
                        gameConfig={gameConfig} 
                    />
                    <ResearchPanel 
                        research={research}
                        researchBonuses={researchBonuses}
                        baseId={base?.id}
                        resources={resources}
                    />
                    
                    <Card className="bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                        <CardHeader className="py-4 bg-white/[0.02] border-b border-white/5">
                            <CardTitle className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2">
                                <Target className="text-orange-500" size={16} />
                                Transmissões Globais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-6 min-h-[100px]">
                            <div className="space-y-4">
                                {(relatoriosGlobal ?? []).length > 0 ? (relatoriosGlobal ?? []).map((r: { id: number, created_at: string, atacante?: { username: string }, defensor?: { username: string } }) => (
                                    <div key={r.id} className="group/item relative pl-4 transition-all duration-300">
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-orange-500/20 group-hover/item:bg-orange-500 transition-colors"></div>
                                        <div className="text-[8px] text-neutral-600 font-black uppercase tracking-widest mb-1 group-hover/item:text-neutral-400 transition-colors">
                                            {new Date(r.created_at).toLocaleTimeString()}
                                        </div>
                                        <div className="text-[10px] text-neutral-400 group-hover/item:text-white transition-colors">
                                            Operação de <span className="text-orange-400 font-black">{r.atacante?.username}</span> interceptada em contra-partida com <span className="text-white font-bold">{r.defensor?.username}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 text-neutral-700 text-[10px] font-black uppercase tracking-widest opacity-30">
                                        Sem Atividade de Inteligência
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BuildingModal 
                isOpen={!!selectedBuildingType} 
                onClose={() => {
                    setSelectedBuildingId(null);
                    setSelectedBuildingType(null);
                    setIsUpgrading(false);
                    setIsTraining(false);
                }}
                building={currentBuilding}
                gameConfig={gameConfig}
                onUpgrade={handleUpgrade}
                onTrain={handleTrain}
                isUpgrading={isUpgrading}
                isTraining={isTraining}
                population={population}
                unitTypes={unitTypes}
            />
            <TutorialOverlay />
        </div>
    );
}
