import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Send, User, Calendar, ChevronLeft, Zap, MessageSquare } from 'lucide-react';
import { useToasts } from '@/components/game/ToastProvider';

interface Post {
    id: number;
    conteudo: string;
    created_at: string;
    jogador: { username: string, avatar?: string };
}

interface Topico {
    id: number;
    titulo: string;
    jogador: { username: string };
    posts: Post[];
    alianca: { tag: string };
}

export default function Show({ topico }: { topico: Topico }) {
    const { addToast } = useToasts();
    const { auth }: any = usePage().props;
    
    const { data, setData, post, processing, reset } = useForm({
        conteudo: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/alianca/forum/topico/${topico.id}/post`, {
            onSuccess: () => {
                reset();
                addToast('Transmissão enviada com sucesso.', 'success');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Aliança', href: '/alianca' },
            { title: 'Fórum', href: '/alianca/forum' },
            { title: topico.titulo, href: `/alianca/forum/topico/${topico.id}` }
        ]}>
            <Head title={topico.titulo} />
            
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header do Tópico */}
                <div className="space-y-4">
                    <Link 
                        href="/alianca/forum"
                        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                        <ChevronLeft size={16} /> Voltar à Assembleia
                    </Link>
                    
                    <div className="bg-neutral-900/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <MessageSquare size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-sky-500" />
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">ALLIANCE_PROTOCOL_{topico.id}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                                {topico.titulo}
                            </h2>
                            <div className="flex items-center gap-4 mt-4">
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-sky-400 border border-white/5">TAG: {topico.alianca.tag}</span>
                                <span className="text-neutral-600 font-mono text-[10px] uppercase">Lançado por: <span className="text-neutral-400">{topico.jogador.username}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-6">
                    {topico.posts.map((post, idx) => {
                        const isMe = post.jogador.username === auth.user.name;
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={post.id}
                                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar/User Info Side */}
                                <div className="hidden md:flex flex-col items-center gap-2 shrink-0 pt-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                        {post.jogador.username[0].toUpperCase()}
                                    </div>
                                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-tighter w-16 text-center truncate">{post.jogador.username}</span>
                                </div>

                                {/* Content Side */}
                                <div className={`flex-1 space-y-2 ${isMe ? 'items-end' : ''}`}>
                                    <div className={`p-6 rounded-[2rem] border transition-all ${isMe ? 'bg-sky-600/10 border-sky-500/20 text-sky-100 rounded-tr-none' : 'bg-neutral-900/40 border-white/5 text-neutral-300 rounded-tl-none'}`}>
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <User size={12} className={isMe ? 'text-sky-400' : 'text-neutral-600'} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-sky-400' : 'text-neutral-500'}`}>{post.jogador.username}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-mono">
                                                <Calendar size={10} /> {new Date(post.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                            {post.conteudo}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Resposta Form */}
                <div className="bg-neutral-900/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                        <Send size={18} className="text-sky-500" /> Adicionar Transmissão
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea 
                            required rows={4}
                            value={data.conteudo} onChange={e => setData('conteudo', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-sky-500 transition-all text-sm outline-none shadow-inner"
                            placeholder="Escreve a tua contribuição para este debate..."
                        />
                        <div className="flex justify-end">
                            <button 
                                disabled={processing}
                                className="flex items-center gap-3 px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50 group"
                            >
                                {processing ? 'Transmitindo...' : 'Enviar Mensagem'}
                                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
