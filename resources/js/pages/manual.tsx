import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Book, Shield, Zap, Target } from 'lucide-react';

interface ManualProps {
    units: any;
    buildings: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Infopédia Militar', href: '/manual' },
];

export default function Manual({ units, buildings }: ManualProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Infopédia Militar - Manual do Oficial" />
            
            <div className="flex flex-1 flex-col gap-8 p-6 bg-neutral-950 text-white min-h-screen">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Book className="text-sky-500" size={32} />
                        Infopédia Militar
                    </h1>
                    <p className="text-neutral-500 text-sm uppercase font-bold tracking-widest">Dossiê de Inteligência sobre Ativos e Estruturas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SECÇÃO DE UNIDADES */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold uppercase tracking-tight text-sky-400 flex items-center gap-2">
                            <Target size={20} />
                            Divisões de Combate
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {Object.entries(units).map(([key, unit]: [string, any]) => (
                                <Card key={key} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-lg uppercase font-black tracking-tighter flex justify-between items-center">
                                            {unit.name}
                                            <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-1 rounded">ATIVO</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-neutral-400">
                                        <p className="mb-4 text-xs italic">"Unidade especializada em operações de {unit.name.toLowerCase()}."</p>
                                        <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold">
                                            <div className="flex items-center gap-2">
                                                <Zap className="text-orange-500" size={12} />
                                                Ataque: {unit.attack}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Shield className="text-green-500" size={12} />
                                                Defesa: {unit.defense_infantry}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* SECÇÃO DE EDIFÍCIOS */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold uppercase tracking-tight text-orange-400 flex items-center gap-2">
                            <Zap size={20} />
                            Infraestrutura de Base
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {Object.entries(buildings).map(([key, b]: [string, any]) => (
                                <Card key={key} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-lg uppercase font-black tracking-tighter">
                                            {b.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-neutral-400">
                                        <p className="text-xs">{b.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
