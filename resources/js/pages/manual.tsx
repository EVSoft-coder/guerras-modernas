import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Book, ChevronLeft, Shield, Zap, Target, Globe, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface Section {
    title: string;
    content: string;
}

interface Props {
    sections: Section[];
}

export default function Manual({ sections }: Props) {
    const icons = [<Globe size={24} />, <Box size={24} />, <Shield size={24} />, <Target size={24} />, <Zap size={24} />];

    return (
        <div className="min-h-screen bg-[#020406] text-white p-8 font-sans relative overflow-hidden">
            {/* ATMOSPHERE */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[80%] h-[70%] bg-orange-500/5 blur-[180px] opacity-40" />
                <div className="absolute inset-0 opacity-[0.02]" 
                     style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <Head title="Manual Operacional" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Regressar ao Comando
                    </Link>
                    <div className="text-[10px] font-mono text-orange-500/50 bg-orange-500/5 px-4 py-1 rounded-full border border-orange-500/10">
                        DOC_ID: FIELD_MANUAL_v1.0
                    </div>
                </div>

                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                            <Book className="text-orange-500" size={32} />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Manual <span className="text-orange-500">Operacional</span></h1>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                        Este documento contém os protocolos de segurança e diretrizes estratégicas para todos os comandantes em campo. A leitura atenta é mandatória para garantir a sobrevivência e expansão no teatro de operações.
                    </p>
                </header>

                <div className="grid gap-6">
                    {sections.map((section, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-3xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="flex gap-6 items-start relative z-10">
                                <div className="text-orange-500/40 mt-1 bg-black/40 p-3 rounded-xl border border-white/5">
                                    {icons[index % icons.length]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3 flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-orange-500/30">0{index + 1}</span>
                                        {section.title}
                                    </h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <footer className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.5em]">
                        Guerras Modernas &copy; 2026 — Protocolo de Segurança Ativo
                    </p>
                </footer>
            </div>
        </div>
    );
}
