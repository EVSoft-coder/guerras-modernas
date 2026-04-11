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
    const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [gameMode, setGameMode] = useState<'VILLAGE' | 'WORLD_MAP'>('VILLAGE');

    useEffect(() => {
        if (!base) return;
        if (ataquesEnviados) gameStateService.syncAttacks(ataquesEnviados);
        if (ataquesRecebidos) gameStateService.syncAttacks(ataquesRecebidos);

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

        const interval = setInterval(() => {
            if (hasActiveActions) {
                router.reload({ only: ['base', 'ataquesEnviados', 'ataquesRecebidos', 'relatoriosGlobal'] });
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

    const handleBuildingClick = (building: any) => setSelectedBuilding(building);

    const handleUpgrade = (tipo: string) => {
        setIsUpgrading(true);
        router.post('/base/upgrade', { base_id: base.id, tipo: tipo }, {
            onSuccess: () => {
                addToast(`ORDEM DE ENGENHARIA CONFIRMADA: Upgrade de ${tipo.replace(/_/g, ' ')} iniciado.`, 'success');
                setSelectedBuilding(null);
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
                setSelectedBuilding(null);
            },
            onError: (errors: any) => {
                const errorMsg = Object.values(errors).flat().join(' | ');
                addToast(`FALHA NO RECRUTAMENTO: ${errorMsg || 'Candidatos insuficientes.'}`, 'error');
                setIsTraining(false);
            }
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 bg-neutral-950 text-white min-h-screen">
            <Head title="Centro de Comando Tático" />
            <ResourceBar recursos={base?.recursos ?? {}} taxasPerSecond={taxasPerSecond ?? {}} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                         <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                            <Zap className="text-orange-500 animate-pulse" size={24} />
                            Setor Operacional: {base?.nome ?? 'Setor Desconhecido'}
                         </h2>
                         <div className="text-[10px] text-neutral-500 font-mono">UID: {base?.id ?? 'N/A'}</div>
                    </div>
                    
                    <ArmyMovementPanel ataquesEnviados={ataquesEnviados ?? []} ataquesRecebidos={ataquesRecebidos ?? []} gameConfig={gameConfig} />
                    
                    {gameMode === 'WORLD_MAP' ? (
                        <WorldMapView playerBase={base} troops={base?.tropas ?? []} gameConfig={gameConfig} />
                    ) : (
                        <VillageView base={base} onBuildingClick={handleBuildingClick} gameConfig={gameConfig} />
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <ProductionQueue construcoes={base.construcoes || []} treinos={base.treinos || []} gameConfig={gameConfig} />
                    <GarrisonPanel tropas={base?.tropas ?? []} gameConfig={gameConfig} />
                    
                    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                        <CardHeader className="py-3 bg-white/5 border-b border-white/5">
                            <CardTitle className="text-xs uppercase font-black tracking-widest text-neutral-400 flex items-center gap-2">
                                <Target className="text-orange-500" size={18} /> Inteligência Global
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4">
                            <div className="space-y-3">
                                {(relatoriosGlobal ?? []).map((r: any, i: number) => (
                                    <div key={i} className="text-[10px] border-l-2 border-orange-500/30 pl-3 py-1">
                                        <div className="text-neutral-400 font-bold uppercase">{r.created_at}</div>
                                        <div className="text-white">Op: <span className="text-orange-400">{r.atacante?.username}</span> vs {r.defensor?.username}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BuildingModal 
                isOpen={!!selectedBuilding} 
                onClose={() => setSelectedBuilding(null)}
                building={selectedBuilding}
                gameConfig={gameConfig}
                onUpgrade={handleUpgrade}
                onTrain={handleTrain}
                isUpgrading={isUpgrading}
                isTraining={isTraining}
            />
        </div>
    );
}
