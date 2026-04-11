import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ResourceBar } from '@/components/game/ResourceBar';
import { VillageView } from '@/components/game/VillageView';
import { BuildingModal } from '@/components/game/BuildingModal';
import { GarrisonPanel } from '@/components/game/GarrisonPanel';
import { ProductionQueue } from '@/components/game/ProductionQueue';
import { useToasts } from '@/components/game/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Zap, ShieldAlert, Crosshair } from 'lucide-react';
import { ArmyMovementPanel } from '@/components/game/ArmyMovementPanel';
import { gameStateService } from '../../../src/services/GameStateService';
import { eventBus, Events } from '../../../src/core/EventBus';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Comando',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    jogador, base, taxasPerSecond, gameConfig, 
    ataquesRecebidos, ataquesEnviados, relatoriosGlobal 
}: DashboardProps) {
    const { addToast } = useToasts();
    const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
 
    // AUTO-REFRESH TÁTICO & ECS BRIDGE
    useEffect(() => {
        // Alimenta o motor ECS com os ataques vindos do Laravel
        if (ataquesEnviados) gameStateService.syncAttacks(ataquesEnviados);
        if (ataquesRecebidos) gameStateService.syncAttacks(ataquesRecebidos);

        // Feedback de Combate em Tempo Real
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
        }, 15000); // 15 segundos para loop tático

        return () => {
            clearInterval(interval);
            unsubArrived();
            unsubReturned();
        };
    }, [base, ataquesEnviados, ataquesRecebidos]);

    if (!base) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-1 items-center justify-center bg-black min-h-screen">
                    <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
                        <Zap className="mx-auto text-orange-500 animate-pulse mb-4" size={48} />
                        <h2 className="text-xl font-black uppercase tracking-widest text-white">Sinal Interrompido</h2>
                        <p className="text-neutral-500 text-xs mt-2 uppercase">A estabelecer ligação com o satélite militar...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const handleBuildingClick = (building: any) => {
        setSelectedBuilding(building);
    };

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
        router.post('/base/treinar', { 
            base_id: base.id, 
            unidade, 
            quantidade 
        }, {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centro de Comando Tático" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 bg-neutral-950 text-white min-h-screen">
                <ResourceBar recursos={base.recursos} taxasPerSecond={taxasPerSecond || []} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <div className="flex justify-between items-center px-2">
                             <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                                <Zap className="text-orange-500 animate-pulse" size={24} />
                                Setor Operacional: {base.nome}
                             </h2>
                             <div className="text-[10px] text-neutral-500 font-mono">
                                 UID: {base.id} // STATUS: OPERACIONAL
                             </div>
                        </div>
                        
                        <ArmyMovementPanel 
                            ataquesEnviados={ataquesEnviados || []} 
                            ataquesRecebidos={ataquesRecebidos || []} 
                        />

                        <VillageView base={base} onBuildingClick={handleBuildingClick} />
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <ProductionQueue 
                            construcoes={base.construcoes || []} 
                            treinos={base.treinos || []} 
                        />

                        <GarrisonPanel tropas={base?.tropas ?? []} gameConfig={gameConfig} />

                        <OrderPanel title="Inteligência Global" icon={<Target className="text-orange-500" size={18} />}>
                            <div className="space-y-3">
                                {(relatoriosGlobal ?? []).map((r, i) => (
                                    <div key={i} className="text-[10px] border-l-2 border-orange-500/30 pl-3 py-1">
                                        <div className="text-neutral-400 font-bold uppercase">{r.created_at}</div>
                                        <div className="text-white">Op: <span className="text-orange-400">{r.atacante?.username}</span> contra <span className="text-neutral-400">{r.defensor?.username}</span></div>
                                    </div>
                                ))}
                            </div>
                        </OrderPanel>
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
        </AppLayout>
    );
}

const OrderPanel = ({ title, icon, children }: any) => (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm overflow-hidden">
        <CardHeader className="py-3 bg-white/5 border-b border-white/5">
            <CardTitle className="text-xs uppercase font-black tracking-widest text-neutral-400 flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
            {children}
        </CardContent>
    </Card>
);
