import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Skull, Calendar, ChevronRight, Share2, Users } from 'lucide-react';

interface Relatorio {
    id: number;
    atacante_id: number;
    defensor_id: number;
    vencedor_id: number;
    titulo: string;
    origem_nome: string;
    destino_nome: string;
    detalhes: any;
    created_at: string;
    partilhado_alianca: boolean;
    atacante: { nome: string };
    defensor: { nome: string };
}

export default function Index({ relatorios, relatoriosAlianca }: { relatorios: Relatorio[], relatoriosAlianca: Relatorio[] }) {
    const { auth }: any = usePage().props;
    const jogadorId = auth.user.jogador.id;
    const [tab, setTab] = useState<'meus' | 'alianca'>('meus');

    const calculateTotalLosses = (losses: any) => {
        return Object.values(losses || {}).reduce((acc: number, curr: any) => acc + (Number(curr) || 0), 0);
    };

    const currentRelatorios = tab === 'meus' ? relatorios : relatoriosAlianca;

    return (
        <AppLayout breadcrumbs={[{ title: 'Intel: Relatórios de Batalha', href: '/relatorios' }]}>
            <Head title="SITREP: Relatórios de Batalha" />
            
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header Táctico */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-sky-500" />
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">MILITARY_INTELLIGENCE</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Histórico de <span className="text-sky-500">Confrontos</span></h2>
                    </div>
                    
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        <button 
                            onClick={() => setTab('meus')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'meus' ? 'bg-sky-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            <Sword size={12} /> Os Meus Arquivos
                        </button>
                        <button 
                            onClick={() => setTab('alianca')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'alianca' ? 'bg-sky-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            <Users size={12} /> Inteligência da Coligação
                        </button>
                    </div>
                </div>

                {/* Lista de Relatórios */}
                <div className="grid grid-cols-1 gap-4">
                    {currentRelatorios.length === 0 ? (
                        <div className="bg-black/40 border border-dashed border-white/10 rounded-3xl p-24 text-center">
                            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="text-neutral-700" size={32} />
                            </div>
                            <h3 className="text-neutral-600 uppercase font-black text-xs tracking-widest">Nenhum registo de combate detetado.</h3>
                        </div>
                    ) : (
                        currentRelatorios.map((rel) => {
                            const isVitoria = rel.vencedor_id === (tab === 'meus' ? jogadorId : rel.atacante_id);
                            const totalLosses = calculateTotalLosses(rel.detalhes.perdas_atacante);
                            
                            return (
                                <Link 
                                    href={`/relatorios/${rel.id}`}
                                    key={rel.id}
                                    className="group relative bg-neutral-900/40 hover:bg-neutral-800/40 border border-white/5 hover:border-sky-500/30 rounded-[2rem] p-6 transition-all shadow-xl overflow-hidden block"
                                >
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${isVitoria ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className={`p-4 rounded-2xl border ${isVitoria ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                                {isVitoria ? <Sword size={24} /> : <Shield size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1 text-[10px] font-mono">
                                                    <Calendar size={10} className="text-neutral-500" />
                                                    <span className="text-neutral-500 uppercase">{new Date(rel.created_at).toLocaleString()}</span>
                                                    {rel.partilhado_alianca && <span className="text-sky-500 font-bold flex items-center gap-1 uppercase"> <Share2 size={10}/> SHARED_INTEL</span>}
                                                </div>
                                                <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                                    {rel.origem_nome} 
                                                    <ChevronRight size={14} className="text-neutral-700" /> 
                                                    {rel.destino_nome}
                                                </h4>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <Badge label="CASUALTIES" value={totalLosses} icon={<Skull size={10} />} color="text-red-400" />
                                                    <Badge label="MISSION" value={rel.titulo.split(':')[0]} color="text-neutral-400" />
                                                    {tab === 'alianca' && <Badge label="COMANDANTE" value={rel.atacante.nome} color="text-sky-400" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Loot / Resources */}
                                        <div className="bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6 shrink-0">
                                            {Object.entries(rel.detalhes.saque || {}).some(([_, v]) => (Number(v) || 0) > 0) ? (
                                                Object.entries(rel.detalhes.saque).map(([res, qty]: [string, any]) => {
                                                    if ((Number(qty) || 0) === 0) return null;
                                                    return (
                                                        <div key={res} className="flex flex-col items-end">
                                                            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-tighter">{res}</span>
                                                            <span className="text-xs font-bold text-white font-mono">+{Number(qty).toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-[10px] font-black text-neutral-700 uppercase italic">Apenas Reconhecimento</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

const Badge = ({ label, value, icon, color }: any) => (
    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
        {icon}
        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-tighter">{label}:</span>
        <span className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>{value}</span>
    </div>
);
