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

export function VillageDashboard({ 
    jogador, base, taxasPerSecond, gameConfig, 
    ataquesRecebidos, ataquesEnviados, relatoriosGlobal 
}: DashboardProps) {
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

        const hasActiveActions = 
            (base?.construcoes?.length ?? 0) > 0 || 
            (base?.treinos?.length ?? 0) > 0 || 
            (ataquesEnviados?.length ?? 0) > 0 || 
            (ataquesRecebidos?.length ?? 0) > 0;

        let isSyncing = false;
        const interval = setInterval(() => {
            // Só sincroniza se houver ações ativas, o documento estiver visível e não houver outro sync em curso
            if (hasActiveActions && document.visibilityState === 'visible' && !isSyncing) {
                isSyncing = true;
                router.reload({ 
                    only: ['base', 'ataquesEnviados', 'ataquesRecebidos', 'relatoriosGlobal'],
                    onFinish: () => { isSyncing = false; }
                });
            }
        }, 15000);

        const unsubMode = eventBus.subscribe(Events.GAME_CHANGE_MODE, (ev) => {
            console.log("MODE CHANGE RECEIVED:", ev.data.mode);
            setGameMode(ev.data.mode);
        });

        return () => {
            clearInterval(interval);
            unsubArrived();
            unsubReturned();
            unsubMode();
        };
    }, [base, ataquesEnviados, ataquesRecebidos]);

    if (!base) return <div className="p-10 text-white uppercase font-mono">Connecting to Satellite...</div>;

    // Encontrar o edifício atualizado na base (Cálculo derivado garantindo reatividade)
    const currentBuilding = selectedBuildingType === 'qg' 
        ? { tipo: 'qg', nome: 'Quartel General', nivel: Number(base.qg_nivel), base: base }
        : (base.edificios || []).find(b => b.id === selectedBuildingId || b.tipo === selectedBuildingType);

    const handleBuildingClick = (building: any) => {
        console.log("CLICK_CAPTURE:", building.tipo, "LVL:", building.nivel);
        setSelectedBuildingId(building.id || null);
        setSelectedBuildingType(building.tipo || null);
    };

    const handleUpgrade = (tipo: string) => {
        setIsUpgrading(true);
        router.post('/base/upgrade', { base_id: base.id, tipo: tipo }, {
            onSuccess: () => {
                addToast(`ORDEM DE ENGENHARIA CONFIRMADA: Upgrade de ${tipo.replace(/_/g, ' ')} iniciado.`, 'success');
                setIsUpgrading(false);
            },
            onError: (errors: any) => {
                const errorMsg = Object.values(errors).flat().join(' | ');
                addToast(`FALHA NA TRANSMISSÃO: ${errorMsg || 'Erro estrutural detetado.'}`, 'error');
                setIsUpgrading(false);
            }
        });
    };

    const handleTrain = (unidade: string, quantidade: number) => {
        setIsTraining(true);
        router.post('/base/treinar', { base_id: base.id, unidade, quantidade }, {
            onSuccess: () => {
                addToast(`MOBILIZAÇÃO INICIADA: Recrutamento de ${quantidade}x ${unidade.replace(/_/g, ' ')} em curso.`, 'military');
                setIsTraining(false);
            },
            onError: (errors: any) => {
                const errorMsg = Object.values(errors).flat().join(' | ');
                addToast(`FALHA NO RECRUTAMENTO: ${errorMsg || 'Candidatos insuficientes.'}`, 'error');
                setIsTraining(false);
            }
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-10 p-8 bg-neutral-950 text-white min-h-screen relative overflow-hidden">
            {/* Background Decorativo Sutil */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-sky-500/10 blur-[200px] pointer-events-none animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-500/5 blur-[150px] pointer-events-none"></div>

            <Head title="Centro de Comando Tático" />
            <ResourceBar recursos={base?.recursos ?? {}} taxasPerSecond={taxasPerSecond ?? {}} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-4">
                         <div className="flex flex-col">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                                <Target className="text-orange-500 animate-pulse" size={28} />
                                CENTRAL: {base?.nome ?? 'Desconhecido'}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Sistemas On-line / Encriptação Ativa</span>
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
                    <ProductionQueue construcoes={base.construcoes || []} treinos={base.treinos || []} gameConfig={gameConfig} />
                    <GarrisonPanel tropas={base?.tropas ?? []} gameConfig={gameConfig} />
                    
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
                                {(relatoriosGlobal ?? []).length > 0 ? (relatoriosGlobal ?? []).map((r: any, i: number) => (
                                    <div key={i} className="group/item relative pl-4 transition-all duration-300">
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
                }}
                building={currentBuilding}
                gameConfig={gameConfig}
                onUpgrade={handleUpgrade}
                onTrain={handleTrain}
                isUpgrading={isUpgrading}
                isTraining={isTraining}
            />
        </div>
    );
}
