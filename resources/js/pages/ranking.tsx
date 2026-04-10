import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Trophy, Users, Landmark, Zap } from 'lucide-react';

interface RankingProps {
    jogadores: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Classificação Mundial', href: '/ranking' },
];

export default function Ranking({ jogadores }: RankingProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classificação Mundial - Elite Militar" />
            
            <div className="flex flex-1 flex-col gap-8 p-6 bg-neutral-950 text-white min-h-screen">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Trophy className="text-orange-500" size={32} />
                        Elite Militar
                    </h1>
                    <p className="text-neutral-500 text-sm uppercase font-bold tracking-widest">Hierarquia de Poder e Influência Global</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-neutral-500">
                                <th className="p-4 w-16 text-center">Pos</th>
                                <th className="p-4">Oficial / Coligação</th>
                                <th className="p-4 text-center">Bases</th>
                                <th className="p-4 text-right">Pontuação Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {jogadores.map((j, index) => (
                                <tr key={j.id} className="hover:bg-white/5 transition-colors duration-200 group">
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs ${
                                            index === 0 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
                                            index === 1 ? 'bg-neutral-300/20 text-neutral-300 border border-neutral-300/30' :
                                            index === 2 ? 'bg-amber-700/20 text-amber-700 border border-amber-700/30' :
                                            'text-neutral-500'
                                        }`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-black uppercase tracking-tight text-white group-hover:text-sky-400 transition-colors">
                                                {j.username}
                                            </span>
                                            <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                                                <Users size={10} />
                                                {j.alianca?.nome || 'Sem Coligação'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs font-mono">
                                            <Landmark size={12} className="text-neutral-600" />
                                            {j.total_bases}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 font-mono font-bold text-sky-500">
                                            <Zap size={14} />
                                            {j.pontos.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
