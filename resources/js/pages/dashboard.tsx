import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DashboardProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ResourceBar } from '@/components/game/ResourceBar';
import { VillageView } from '@/components/game/VillageView';
import { BuildingModal } from '@/components/game/BuildingModal';
import { GarrisonPanel } from '@/components/game/GarrisonPanel';
import { ConstructionQueue } from '@/components/game/ConstructionQueue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Zap, ShieldAlert } from 'lucide-react';

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
    // DIAGNÓSTICO DE CAMPO - VISÍVEL NO CONSOLE DO COMANDANTE
    console.log("DADOS_DASHBOARD:", { base, jogador, taxasPerSecond });

    const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
    const [isUpgrading, setIsUpgrading] = useState(false);

    // GATE DE SEGURANÇA: Se a base falhar, impedimos o colapso do React
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
        router.post('/base/upgrade', { edificio: tipo }, {
            onSuccess: () => {
                setSelectedBuilding(null);
                setIsUpgrading(false);
            },
            onError: (errors) => {
                console.error("FALHA NA TRANSMISSÃO:", errors);
                setIsUpgrading(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centro de Comando Tático" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 bg-neutral-950 text-white min-h-screen">
                {/* HUD SUPERIOR - RECURSOS */}
                <ResourceBar recursos={base.recursos} taxasPerSecond={taxasPerSecond} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                    {/* COLUNA ESQUERDA - VISTA DA BASE (8 COLUNAS) */}
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
                        
                        <VillageView base={base} onBuildingClick={handleBuildingClick} />
                        
                        {/* ALERTAS DE COMBATE */}
                        {(ataquesRecebidos?.length ?? 0) > 0 && (
                            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl flex items-center gap-4 animate-bounce">
                                <ShieldAlert className="text-red-500" size={32} />
                                <div>
                                    <h4 className="text-red-500 font-black uppercase text-sm">AMEAÇA DETETADA</h4>
                                    <p className="text-red-200/60 text-xs">Múltiplas assinaturas hostis a caminho da base. Ativar defesas!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COLUNA DIREITA - INTELIGÊNCIA & FILAS (4 COLUNAS) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* FILA DE CONSTRUÇÃO TÁTICA */}
                        <ConstructionQueue construcoes={base.construcoes} />

                        {/* PAINEL DE TROPAS (GUARNIÇÃO) */}
                        <GarrisonPanel tropas={base?.tropas ?? []} gameConfig={gameConfig} />

                        {/* FEED GLOBAL */}
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

                {/* MODAL DE EDIFÍCIO */}
                <BuildingModal 
                    isOpen={!!selectedBuilding} 
                    onClose={() => setSelectedBuilding(null)}
                    building={selectedBuilding}
                    gameConfig={gameConfig}
                    onUpgrade={handleUpgrade}
                    isUpgrading={isUpgrading}
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
