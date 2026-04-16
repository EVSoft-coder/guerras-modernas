import React, { useState, useEffect } from 'react';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ResourceBar } from '@/components/game/ResourceBar';
import { VillageView } from '@/components/game/VillageView';
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

export function VillageDashboard({ 
    jogador, base: initialBase, bases: backendBases = [], taxasPerSecond, gameConfig, 
    ataquesRecebidos, ataquesEnviados, relatoriosGlobal, populacao, // deprecated props
    buildings, population, resources, buildingQueue,
    unitQueue = [], units = [], unitTypes = []
}: DashboardProps & { 
    bases?: any[], 
    populacao?: any, 
    buildings?: any[], 
    population?: any, 
    resources?: any,
    buildingQueue?: any[],
    unitQueue?: any[],
    units?: any[],
    unitTypes?: any[],
    ataquesRecebidos?: any[],
    ataquesEnviados?: any[],
    relatoriosGlobal?: any[],
    taxasPerSecond?: Record<string, number>
}) {
    // 0. ECS ENGINE INTEGRATION - BARKING STATE
    const { globalState } = useGameEntities();

    // 1. DATA PROJECTOR — Usar props diretamente (estado gerido pelo parent dashboard.tsx)
    const currentBuildings = buildings || initialBase?.edificios || [];
    const currentResources = resources || initialBase?.recursos || {};
    const currentPopulation = population || populacao || null;

    const base = React.useMemo(() => {
        if (!initialBase) return null;
        return {
            ...initialBase,
            edificios: currentBuildings,
            recursos: currentResources
        };
    }, [initialBase, currentBuildings, currentResources]);

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
    const foundBuilding = (base.edificios || []).find(b => b.id === selectedBuildingId || b.buildingType === selectedBuildingType);
    let currentBuilding: any = null;
    let fallbackLevel = 0;

    if (selectedBuildingType) {
        const buildDef = (gameConfig?.buildings || {})[selectedBuildingType];
        
        // Calcular Nível Futuro (DB + Queue)
        const dbLevel = selectedBuildingType === 'qg' ? Number(base.qg_nivel) : 
                       (selectedBuildingType === 'muralha' ? Number(base.muralha_nivel) : 
                       (foundBuilding?.nivel || 0));
        
        const queueEntries = (buildingQueue || []).filter(q => (q.buildingType || q.type) === selectedBuildingType);
        const maxQueueLevel = queueEntries.length > 0 ? Math.max(...queueEntries.map(q => q.target_level)) : 0;
        const futureLevel = Math.max(dbLevel, maxQueueLevel);

        if (selectedBuildingType === 'qg') {
            currentBuilding = { buildingType: 'qg', nome: 'Quartel General', nivel: futureLevel, base: base };
            fallbackLevel = futureLevel;
        } else if (selectedBuildingType === 'muralha') {
            currentBuilding = { buildingType: 'muralha', nome: 'Perímetro Defensivo', nivel: futureLevel, base: base };
            fallbackLevel = futureLevel;
        } else if (foundBuilding) {
            currentBuilding = { ...foundBuilding, ...buildDef, nome: buildDef?.name || 'Estrutura', nivel: futureLevel, base: base };
            fallbackLevel = futureLevel;
        } else {
            currentBuilding = { 
                ...buildDef, 
                buildingType: selectedBuildingType, 
                nome: buildDef?.name || 'Projeto Padrão', 
                nivel: futureLevel,
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
        <div className="flex h-full flex-1 flex-col gap-10 p-8 bg-neutral-950 text-white min-h-screen relative overflow-hidden">
            {/* Background Decorativo Sutil */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-sky-500/10 blur-[200px] pointer-events-none animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-500/5 blur-[150px] pointer-events-none"></div>

            <Head title="Centro de Comando Tático" />
            <ResourceBar recursos={currentResources} taxasPerSecond={taxasPerSecond ?? {}} populacao={currentPopulation} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-4">
                         <div className="flex flex-col">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                                <Target className="text-orange-500 animate-pulse" size={28} />
                                CENTRAL: {base?.nome ?? 'Desconhecido'}
                                
                                {displayBases.length > 1 && (
                                    <div className="flex gap-2 ml-4 self-center">
                                        {displayBases.map(b => (
                                            <button 
                                                key={b.id}
                                                onClick={() => b.id !== base.id && router.get(`/base/switch/${b.id}`)}
                                                className={`
                                                    px-4 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-all
                                                    ${b.id === base.id ? 'bg-orange-500 border-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-black/40 border-white/10 text-neutral-500 hover:border-white/30 hover:text-white'}
                                                `}
                                            >
                                                {b.nome}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Sistemas On-line / Comando {displayBases.length > 1 ? 'Múltiplo' : 'Único'} Ativo</span>
                            </div>
                         </div>
                         <div className="text-[10px] text-neutral-700 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            SIGINT_NODE_{base?.id ?? 'N/A'}
                         </div>
                    </div>
                    
                    <ArmyMovementPanel ataquesEnviados={ataquesEnviados ?? []} ataquesRecebidos={ataquesRecebidos ?? []} gameConfig={gameConfig} />
                    
                    {gameMode === 'WORLD_MAP' ? (
                        <WorldMapView playerBase={base} troops={base?.tropas ?? []} gameConfig={gameConfig} />
                    ) : (
                        <VillageView base={base} onBuildingClick={handleBuildingClick} gameConfig={gameConfig} />
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    <ProductionQueue 
                        construcoes={buildingQueue || base?.buildingQueue || base?.construcoes || []} 
                        treinos={[]} 
                        gameConfig={gameConfig} 
                    />
                    <UnitQueue queue={unitQueue} />
                    <GarrisonPanel tropas={units.length > 0 ? units.map(u => ({ unidade: u.type?.name, quantidade: u.quantity })) : (base?.tropas ?? [])} gameConfig={gameConfig} />
                    
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
                population={currentPopulation}
                unitTypes={unitTypes}
            />
        </div>
    );
}
