import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Trophy, Users, Landmark, Zap, Shield, Crosshair, Sword, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RankingProps {
    jogadores: any[];
    aliancas: any[];
    tab: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Classificação Mundial', href: '/ranking' },
];

const MEDAL_STYLES = [
    'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    'bg-gradient-to-br from-slate-300 to-slate-400 text-black shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.3)]',
];

function StatBadge({ icon: Icon, value, label, color }: { icon: any; value: number | string; label: string; color: string }) {
    return (
        <div className="flex items-center gap-1.5 text-[9px] font-mono">
            <Icon size={10} className={color} />
            <span className="text-white font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
            <span className="text-neutral-600 uppercase">{label}</span>
        </div>
    );
}

export default function Ranking({ jogadores, aliancas, tab: initialTab }: RankingProps) {
    const [activeTab, setActiveTab] = useState<'jogadores' | 'aliancas'>(initialTab === 'aliancas' ? 'aliancas' : 'jogadores');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classificação Mundial - Elite Militar" />
            
            <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 bg-[#020406] text-white min-h-screen relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-amber-500/5 blur-[200px] opacity-50" />
                    <div className="absolute inset-0 opacity-[0.02]" 
                         style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
                </div>

                {/* Header */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-[10px] text-amber-500/60 font-black tracking-[0.4em] uppercase">Intel_Classificação</div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                                <Trophy className="text-amber-400" size={32} />
                            </div>
                            Elite Militar
                        </h1>
                        <p className="text-neutral-600 text-xs uppercase font-bold tracking-widest">Hierarquia de Poder e Influência Global</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        {(['jogadores', 'aliancas'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                                    activeTab === tab 
                                        ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]' 
                                        : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab === 'jogadores' ? '⚔️ Oficiais' : '🏴 Coligações'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'jogadores' ? (
                        <motion.div
                            key="jogadores"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative z-10"
                        >
                            <div className="bg-black/30 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] uppercase font-black tracking-widest text-neutral-500">
                                            <th className="p-4 w-16 text-center">Pos</th>
                                            <th className="p-4">Oficial / Coligação</th>
                                            <th className="p-4 text-center hidden md:table-cell">Bases</th>
                                            <th className="p-4 text-center hidden lg:table-cell">Tropas</th>
                                            <th className="p-4 text-center hidden lg:table-cell">Poder ATK</th>
                                            <th className="p-4 text-center hidden lg:table-cell">Poder DEF</th>
                                            <th className="p-4 text-right">Pontuação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {jogadores.map((j: any, index: number) => (
                                            <motion.tr 
                                                key={j.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-white/[0.03] transition-colors duration-200 group"
                                            >
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-mono text-xs font-black ${
                                                        index < 3 ? MEDAL_STYLES[index] : 'text-neutral-600 bg-white/5 border border-white/5'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors text-sm">
                                                            {j.username}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-500 flex items-center gap-1.5">
                                                            <Users size={10} />
                                                            {j.alianca?.nome || 'Sem Coligação'}
                                                            {j.alianca?.tag && <span className="text-amber-500/60">[{j.alianca.tag}]</span>}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center hidden md:table-cell">
                                                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono">
                                                        <Landmark size={12} className="text-neutral-600" />
                                                        <span className="text-neutral-300">{j.total_bases}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center hidden lg:table-cell">
                                                    <span className="text-xs font-mono text-neutral-400">{(j.total_units ?? 0).toLocaleString()}</span>
                                                </td>
                                                <td className="p-4 text-center hidden lg:table-cell">
                                                    <div className="flex items-center justify-center gap-1 text-xs font-mono text-red-400">
                                                        <Crosshair size={10} />
                                                        {(j.attack_power ?? 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center hidden lg:table-cell">
                                                    <div className="flex items-center justify-center gap-1 text-xs font-mono text-cyan-400">
                                                        <Shield size={10} />
                                                        {(j.defense_power ?? 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 font-mono font-black text-amber-400 text-sm">
                                                        <Zap size={14} />
                                                        {(j.pontos ?? 0).toLocaleString()}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {jogadores.length === 0 && (
                                    <div className="p-10 text-center text-neutral-700 text-xs uppercase tracking-widest">
                                        Sem dados de classificação disponíveis
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="aliancas"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative z-10"
                        >
                            <div className="bg-black/30 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] uppercase font-black tracking-widest text-neutral-500">
                                            <th className="p-4 w-16 text-center">Pos</th>
                                            <th className="p-4">Coligação</th>
                                            <th className="p-4 text-center">Membros</th>
                                            <th className="p-4 text-center hidden md:table-cell">Bases</th>
                                            <th className="p-4 text-right">Pontuação Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {(aliancas ?? []).map((a: any, index: number) => (
                                            <motion.tr 
                                                key={a.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-white/[0.03] transition-colors duration-200 group"
                                            >
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-mono text-xs font-black ${
                                                        index < 3 ? MEDAL_STYLES[index] : 'text-neutral-600 bg-white/5 border border-white/5'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors text-sm">
                                                            {a.nome}
                                                        </span>
                                                        {a.tag && (
                                                            <span className="text-[10px] text-amber-500/60 font-mono">[{a.tag}]</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono">
                                                        <Users size={12} className="text-neutral-600" />
                                                        <span className="text-neutral-300">{a.total_membros ?? 0}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center hidden md:table-cell">
                                                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono">
                                                        <Landmark size={12} className="text-neutral-600" />
                                                        <span className="text-neutral-300">{a.total_bases ?? 0}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 font-mono font-black text-amber-400 text-sm">
                                                        <Zap size={14} />
                                                        {(a.total_pontos ?? 0).toLocaleString()}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {(aliancas ?? []).length === 0 && (
                                    <div className="p-10 text-center text-neutral-700 text-xs uppercase tracking-widest">
                                        Sem coligações registadas
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
