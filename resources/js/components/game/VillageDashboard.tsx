import React, { useState, useEffect } from 'react';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ResourceBar } from '@/components/game/ResourceBar';
import { VisualVillageView } from '@/components/game/VisualVillageView';
import { BuildingModal } from '@/components/game/BuildingModal';
import { GarrisonPanel } from '@/components/game/GarrisonPanel';
import { ProductionQueue } from '@/components/game/ProductionQueue';
import { useToasts } from '@/components/game/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Zap } from 'lucide-react';
import { ArmyMovementPanel } from '@/components/game/ArmyMovementPanel';
import { gameStateService } from '@src/services/GameStateService';
import { eventBus, Events } from '@src/core/EventBus';
import { WorldMapView } from '@/components/game/WorldMapView';
import { Logger } from '@src/core/Logger';

import { useGameEntities } from '@/hooks/use-game-entities';
import { UnitQueue } from '@/components/game/UnitQueue';

const STABLE_EMPTY_ARRAY: any[] = [];

export function VillageDashboard({ 
    jogador, base: initialBase, bases: backendBases = STABLE_EMPTY_ARRAY, taxasPerSecond, gameConfig, 
    relatoriosGlobal, buildings = STABLE_EMPTY_ARRAY, population, resources, buildingQueue = STABLE_EMPTY_ARRAY,
    unitQueue = STABLE_EMPTY_ARRAY, units = STABLE_EMPTY_ARRAY, unitTypes = STABLE_EMPTY_ARRAY,
    ataquesRecebidos = STABLE_EMPTY_ARRAY, ataquesEnviados = STABLE_EMPTY_ARRAY,
    diplomaties = STABLE_EMPTY_ARRAY, myAllianceId
}: DashboardProps) {
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
    const foundBuilding = (buildings || []).find(b => b.id === selectedBuildingId || b.buildingType === selectedBuildingType);
    let currentBuilding: any = null;
    let fallbackLevel = 0;

    if (selectedBuildingType) {
        const buildDef = (gameConfig?.buildings || {})[selectedBuildingType];
        
        // Calcular Nível Real e Estado de Obra
        const dbLevel = selectedBuildingType === 'qg' ? Number(base.qg_nivel) : 
                       (selectedBuildingType === 'muralha' ? Number(base.muralha_nivel) : 
                       (foundBuilding?.nivel || 0));
        
        // Procurar na fila se existe QUALQUER entrada deste tipo
        const queueEntries = (buildingQueue || []).filter(q => q.type === selectedBuildingType);
        const isUpgradingNow = queueEntries.length > 0;
        const nextLevel = dbLevel + 1;

        if (selectedBuildingType === 'qg') {
            currentBuilding = { buildingType: 'qg', nome: 'Quartel General', nivel: dbLevel, nextLevel, isUpgradingNow, base: base };
            fallbackLevel = dbLevel;
        } else if (selectedBuildingType === 'muralha') {
            currentBuilding = { buildingType: 'muralha', nome: 'Perímetro Defensivo', nivel: dbLevel, nextLevel, isUpgradingNow, base: base };
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
    };

    const handleUpgrade = (buildingType: string) => {
        setIsUpgrading(true);
        eventBus.emit(Events.BUILDING_UPGRADE_REQUEST, {
            base_id: base.id,
            tipo: buildingType
        });
        setSelectedBuildingId(null);
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
                            </div>
                         </div>
                         <div className="text-[10px] text-neutral-700 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            SIGINT_NODE_{base?.id ?? 'N/A'}
                         </div>
                    </div>
                    
                    <ArmyMovementPanel ataquesEnviados={ataquesEnviados ?? []} ataquesRecebidos={ataquesRecebidos ?? []} gameConfig={gameConfig} />
                    
                    {gameMode === 'WORLD_MAP' ? (
                        <WorldMapView 
                        playerBase={base} 
                        troops={units.length > 0 ? units.map((u: any) => ({ tipo: u.type?.name, quantidade: u.quantity })) : (base?.tropas ?? [])} 
                        gameConfig={gameConfig} 
                        unitTypes={unitTypes}
                        diplomaties={diplomaties}
                        myAllianceId={myAllianceId}
                    />
                    ) : (
                        <VisualVillageView base={base} onBuildingClick={handleBuildingClick} gameConfig={gameConfig} buildingQueue={buildingQueue} />
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    <ProductionQueue 
                        construcoes={buildingQueue} 
                        treinos={unitQueue} 
                        gameConfig={gameConfig} 
                    />
                    <UnitQueue queue={unitQueue || STABLE_EMPTY_ARRAY} />
                    <GarrisonPanel 
                        tropas={units.length > 0 
                            ? units.map((u: any) => ({ tipo: u.type?.name, quantidade: u.quantity })) 
                            : (base?.tropas || []).map((t: any) => ({ tipo: t.unidade || t.tipo, quantidade: t.quantidade }))
                        } 
                        gameConfig={gameConfig} 
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
        </div>
    );
}
