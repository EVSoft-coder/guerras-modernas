import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Skull, Calendar, ChevronRight } from 'lucide-react';

interface Relatorio {
    id: number;
    atacante_id: number;
    defensor_id: number;
    vencedor_id: number;
    titulo: string;
    origem_nome: string;
    destino_nome: string;
    detalhes: {
        perdas_atacante: Record<string, number>;
        saque: Record<string, number>;
        coords: string;
    };
    created_at: string;
    atacante: { nome: string };
    defensor: { nome: string };
}

export default function Index({ relatorios }: { relatorios: Relatorio[] }) {
    const { auth }: any = usePage().props;
    const jogadorId = auth.user.jogador.id;

    const calculateTotalLosses = (losses: Record<string, number>) => {
        return Object.values(losses || {}).reduce((acc, curr) => acc + curr, 0);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Intel: Relatórios de Batalha', href: '/relatorios' }]}>
            <Head title="SITREP: Relatórios de Batalha" />
            
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header Táctico */}
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-sky-500" />
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">MILITARY_INTELLIGENCE</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Histórico de <span className="text-sky-500">Confrontos</span></h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-neutral-600 uppercase">Archive_Status: <span className="text-emerald-500">SECURE</span></span>
                    </div>
                </div>

                {/* Lista de Relatórios */}
                <div className="grid grid-cols-1 gap-4">
                    {relatorios.length === 0 ? (
                        <div className="bg-black/40 border border-dashed border-white/10 rounded-3xl p-12 text-center text-neutral-600 uppercase font-black text-xs tracking-widest">
                            Nenhum registo de combate detetado nos arquivos.
                        </div>
                    ) : (
                        relatorios.map((rel, idx) => {
                            const isVitoria = rel.vencedor_id === jogadorId;
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
                                                    <span className="text-neutral-700">|</span>
                                                    <span className="text-sky-500 font-bold">SETOR {rel.detalhes.coords}</span>
                                                </div>
                                                <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                                    {rel.origem_nome} 
                                                    <ChevronRight size={14} className="text-neutral-700" /> 
                                                    {rel.destino_nome}
                                                </h4>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <Badge label="CASUALTIES" value={totalLosses} icon={<Skull size={10} />} color="text-red-400" />
                                                    <Badge label="STATUS" value={isVitoria ? 'VICTORY' : 'DEFEAT'} color={isVitoria ? 'text-emerald-400' : 'text-red-400'} />
                                                    <Badge label="MISSION" value={rel.titulo.split(':')[0]} color="text-neutral-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Loot / Resources */}
                                        <div className="bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6 shrink-0">
                                            {Object.entries(rel.detalhes.saque || {}).some(([_, v]) => v > 0) ? (
                                                Object.entries(rel.detalhes.saque).map(([res, qty]) => {
                                                    if (qty === 0) return null;
                                                    return (
                                                        <div key={res} className="flex flex-col items-end">
                                                            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-tighter">{res}</span>
                                                            <span className="text-xs font-bold text-white font-mono">+{qty.toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-[10px] font-black text-neutral-700 uppercase italic">Reconhecimento apenas</span>
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
