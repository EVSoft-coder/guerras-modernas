import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Skull, Calendar, ChevronRight } from 'lucide-react';

interface Relatorio {
    id: number;
    atacante_id: number;
    defensor_id: number;
    vitoria: boolean;
    dados: {
        losses: number;
        loot: Record<string, number>;
        units_at_impact?: Record<string, number>;
    };
    created_at: string;
    atacante: { nome: string };
    defensor: { nome: string };
}

export default function Index({ relatorios }: { relatorios: Relatorio[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Intel: Relatórios de Batalha', href: '/relatorios' }]}>
            <Head title="SITREP: Relatórios de Batalha" />
            
            <div className="max-w-5xl mx-auto p-8 space-y-8">
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
                <div className="space-y-4">
                    {relatorios.length === 0 ? (
                        <div className="bg-black/40 border border-dashed border-white/10 rounded-3xl p-12 text-center text-neutral-600 uppercase font-black text-xs tracking-widest">
                            Nenhum registo de combate detetado nos arquivos.
                        </div>
                    ) : (
                        relatorios.map((rel, idx) => (
                            <motion.div 
                                key={rel.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-neutral-900/40 hover:bg-neutral-800/40 border border-white/5 hover:border-sky-500/30 rounded-[2rem] p-6 transition-all shadow-xl overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full ${rel.vitoria ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl border ${rel.vitoria ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                            {rel.vitoria ? <Sword size={24} /> : <Shield size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1 text-[10px] font-mono">
                                                <Calendar size={10} className="text-neutral-500" />
                                                <span className="text-neutral-500 uppercase">{new Date(rel.created_at).toLocaleString()}</span>
                                            </div>
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                                {rel.atacante.nome} 
                                                <ChevronRight size={14} className="text-neutral-700" /> 
                                                {rel.defensor.nome}
                                            </h4>
                                            <div className="flex gap-4 mt-2">
                                                <Badge label="CASUALTIES" value={rel.dados.losses} icon={<Skull size={10} />} color="text-red-400" />
                                                <Badge label="STATUS" value={rel.vitoria ? 'VICTORY' : 'DEFEAT'} color={rel.vitoria ? 'text-emerald-400' : 'text-red-400'} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loot / Resources */}
                                    <div className="bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6">
                                        {Object.entries(rel.dados.loot || {}).length > 0 ? (
                                            Object.entries(rel.dados.loot).map(([res, qty]) => (
                                                <div key={res} className="flex flex-col items-end">
                                                    <span className="text-[8px] font-black text-neutral-600 uppercase tracking-tighter">{res}</span>
                                                    <span className="text-xs font-bold text-white font-mono">+{qty}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-[10px] font-black text-neutral-700 uppercase italic">Nenhum espólio capturado</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

const Badge = ({ label, value, icon, color }: any) => (
    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
        {icon}
        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-tighter">{label}:</span>
        <span className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>{value}</span>
    </div>
);
