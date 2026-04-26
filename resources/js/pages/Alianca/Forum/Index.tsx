import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MessageSquare, Plus, Calendar, User, ChevronRight, Zap } from 'lucide-react';
import { useToasts } from '@/components/game/ToastProvider';

interface Topico {
    id: number;
    titulo: string;
    jogador: { username: string };
    last_post_at: string;
    created_at: string;
}

export default function Index({ topicos, alianca }: { topicos: Topico[], alianca: any }) {
    const { addToast } = useToasts();
    const [showNew, setShowNew] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        titulo: '',
        conteudo: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/alianca/forum/topico', {
            onSuccess: () => {
                setShowNew(false);
                reset();
                addToast('Novo tópico estratégico aberto!', 'success');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Aliança', href: '/alianca' },
            { title: 'Fórum da Coligação', href: '/alianca/forum' }
        ]}>
            <Head title={`Fórum [${alianca.tag}]`} />
            
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header do Fórum */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-sky-500" />
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">ALLIANCE_INTEL_NETWORK</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Assembleia da <span className="text-sky-500">Coligação</span></h2>
                        <p className="text-neutral-500 text-xs font-mono mt-2 italic uppercase">[{alianca.tag}] Canal de Discussão Interno - Nível de Acesso: CONFIDENCIAL</p>
                    </div>
                    
                    <button 
                        onClick={() => setShowNew(!showNew)}
                        className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                        <Plus size={16} /> Abrir Novo Tópico
                    </button>
                </div>

                {/* Modal/Form Novo Tópico */}
                {showNew && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/60 border border-sky-500/30 rounded-[2rem] p-8 shadow-2xl"
                    >
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">Iniciar Novo Protocolo de Discussão</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">Título do Assunto</label>
                                <input 
                                    type="text" required
                                    value={data.titulo} onChange={e => setData('titulo', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500 transition-all font-bold"
                                    placeholder="Ex: Estratégia de Invasão ao Setor Norte"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">Mensagem Inicial</label>
                                <textarea 
                                    required rows={5}
                                    value={data.conteudo} onChange={e => setData('conteudo', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500 transition-all text-sm"
                                    placeholder="Descreve os detalhes da proposta ou informação..."
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-2">
                                <button 
                                    type="button" onClick={() => setShowNew(false)}
                                    className="px-6 py-3 text-neutral-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    disabled={processing}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Transmitindo...' : 'Publicar Protocolo'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Lista de Tópicos */}
                <div className="bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-white/5">
                        {topicos.length === 0 ? (
                            <div className="p-24 text-center">
                                <MessageSquare className="mx-auto text-neutral-800 mb-4" size={48} />
                                <h3 className="text-neutral-600 uppercase font-black text-xs tracking-widest">Nenhum debate activo nos arquivos da coligação.</h3>
                            </div>
                        ) : (
                            topicos.map((topico) => (
                                <Link 
                                    key={topico.id}
                                    href={`/alianca/forum/topico/${topico.id}`}
                                    className="group flex flex-col md:flex-row justify-between items-center p-6 hover:bg-white/[0.02] transition-all"
                                >
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-neutral-500 group-hover:text-sky-400 group-hover:border-sky-500/30 transition-all">
                                            <MessageSquare size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-sky-400 transition-colors">
                                                {topico.titulo}
                                            </h4>
                                            <div className="flex flex-wrap gap-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase">
                                                    <User size={10} className="text-neutral-700" /> {topico.jogador.username}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase">
                                                    <Calendar size={10} className="text-neutral-700" /> {new Date(topico.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-end">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[8px] font-black text-neutral-600 uppercase tracking-tighter">Última Transmissão</p>
                                            <p className="text-[10px] font-black text-neutral-400 uppercase">{new Date(topico.last_post_at).toLocaleString()}</p>
                                        </div>
                                        <ChevronRight className="text-neutral-800 group-hover:text-sky-500 transition-all" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Re-using motion components properly
import { motion } from 'framer-motion';
