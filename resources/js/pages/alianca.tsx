import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Shield, ShieldPlus, Users, Search, Target, MessageSquare, Send, Check, X, LogOut } from 'lucide-react';
import { useToasts } from '@/components/game/ToastProvider';

interface AliancaProps {
    temAlianca: boolean;
    jogador: any;
    alianca?: any;
    aliancas?: any[];
    pedidoPendente?: any;
    mensagens?: any[];
    convites?: any[];
    convitesEnviados?: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quartel-General da Aliança', href: '/alianca' },
];

export default function Alianca({ temAlianca, jogador, alianca, aliancas, pedidoPendente, mensagens, convites, convitesEnviados }: AliancaProps) {
    const { addToast } = useToasts();
    const [nomeCriar, setNomeCriar] = useState('');
    const [tagCriar, setTagCriar] = useState('');
    const [jogadorConvidar, setJogadorConvidar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Chat state
    const [chatMsg, setChatMsg] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [mensagens]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/alianca/store', { nome: nomeCriar, tag: tagCriar }, {
            onSuccess: () => addToast('Aliança fundada com sucesso!', 'success'),
            onError: (err) => addToast(Object.values(err)[0] as string || 'Erro ao criar aliança.', 'error'),
            onFinish: () => setIsSubmitting(false)
        });
    };

    const handleApply = (id: number) => {
        router.post('/alianca/pedir', { alianca_id: id }, {
            onSuccess: () => addToast('Pedido de adesão enviado!', 'success'),
            onError: (err) => addToast(Object.values(err)[0] as string || 'Erro ao enviar pedido.', 'error')
        });
    };

    const handleDecision = (pedidoId: number, decisao: 'aprovar' | 'rejeitar') => {
        router.post(`/alianca/decidir/${pedidoId}/${decisao}`, {}, {
            onSuccess: () => addToast('Decisão processada.', 'success')
        });
    };

    const handleLeave = () => {
        if (confirm('Tens a certeza que queres desertar desta aliança? O Alto Comando não perdoa facilmente.')) {
            router.post('/alianca/sair', {}, {
                onSuccess: () => addToast('Saíste da aliança.', 'info')
            });
        }
    };

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMsg.trim()) return;
        router.post('/alianca/chat/enviar', { mensagem: chatMsg }, {
            preserveScroll: true,
            onSuccess: () => setChatMsg(''),
        });
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!jogadorConvidar.trim()) return;
        router.post('/alianca/convidar', { jogador_nome: jogadorConvidar }, {
            onSuccess: () => {
                setJogadorConvidar('');
                addToast('Convite enviado!', 'success');
            },
            onError: (err) => addToast(Object.values(err)[0] as string || 'Erro ao convidar.', 'error')
        });
    };

    const handleDecisionConvite = (id: number, decisao: 'aceitar' | 'rejeitar') => {
        router.post(`/alianca/convites/${id}/${decisao}`, {}, {
            onSuccess: () => addToast('Convite processado.', 'success')
        });
    };

    if (!temAlianca) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Diplomacia" />
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[calc(100vh-4rem)]">
                    
                    {/* Fundar Aliança */}
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col h-fit">
                        <div className="bg-sky-900/40 p-4 border-b border-sky-500/30 flex items-center gap-3">
                            <ShieldPlus className="text-sky-400" />
                            <h2 className="font-black text-lg uppercase tracking-widest text-white">Fundar Coligação</h2>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
                            <p className="text-sm text-neutral-400 mb-2">
                                Estabelece uma nova super-potência militar. Define o nome e a TAG (sigla) da tua coligação.
                            </p>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">Nome da Aliança</label>
                                <input 
                                    type="text" required maxLength={100}
                                    value={nomeCriar} onChange={e => setNomeCriar(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-bold" 
                                    placeholder="Ex: Organização do Tratado..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">TAG (Max 10 chars)</label>
                                <input 
                                    type="text" required maxLength={10}
                                    value={tagCriar} onChange={e => setTagCriar(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-sky-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono uppercase" 
                                    placeholder="Ex: NATO"
                                />
                            </div>
                            <button 
                                disabled={isSubmitting}
                                className="mt-4 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest rounded transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'A Processar...' : 'Estabelecer Coligação'}
                            </button>
                        </form>
                    </div>

                    {/* Juntar-se a Aliança */}
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Search className="text-neutral-400" />
                                <h2 className="font-black text-lg uppercase tracking-widest text-white">Aliar-se</h2>
                            </div>
                        </div>
                        
                        {pedidoPendente && (
                            <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-center">
                                Tens um pedido pendente para a aliança ID #{pedidoPendente.alianca_id}. Aguarda decisão.
                            </div>
                        )}

                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Convites Recebidos */}
                            {convites && convites.length > 0 && (
                                <div className="mb-6 space-y-3">
                                    <h3 className="text-[10px] font-black uppercase text-sky-400 tracking-widest mb-2">Protocolos de Convite Recebidos</h3>
                                    {convites.map((c) => (
                                        <div key={c.id} className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-bold">[{c.alianca.tag}] {c.alianca.nome}</p>
                                                <p className="text-[10px] text-neutral-400 uppercase">Enviado por: {c.convidado_por?.username}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleDecisionConvite(c.id, 'aceitar')}
                                                    className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded transition"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDecisionConvite(c.id, 'rejeitar')}
                                                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {aliancas && aliancas.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-2">Coligações Ativas no Globo</h3>
                                    {aliancas.map((al) => (
                                        <div key={al.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">[{al.tag}] {al.nome}</h3>
                                                <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                                                    <Users size={12} /> {al.membros_count} membro(s)
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleApply(al.id)}
                                                disabled={!!pedidoPendente}
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded disabled:opacity-50 transition"
                                            >
                                                Pedir Adesão
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-neutral-500 py-12">
                                    <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                    Nenhuma aliança registada no globo.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // --- PAINEL DE ALIANÇA ATIVA ---
    const isFundador = alianca.fundador_id === jogador.id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Aliança [${alianca.tag}]`} />
            
            <div className="p-6 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-4rem)]">
                
                {/* COLUNA ESQUERDA: INFOS & MEMBROS */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Header Aliança */}
                    <div className="bg-gradient-to-r from-sky-900/60 to-black border border-sky-500/30 rounded-xl p-6 relative overflow-hidden">
                        <Shield className="absolute -right-4 -bottom-4 w-48 h-48 text-sky-500/10" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-1">
                                    <span className="text-sky-400">[{alianca.tag}]</span> {alianca.nome}
                                </h1>
                                <p className="text-sm text-neutral-400 flex items-center gap-2">
                                    <Target size={14} /> Fundador: <span className="text-white font-bold">{alianca.fundador?.username || 'Desconhecido'}</span>
                                </p>
                            </div>
                            <button 
                                onClick={handleLeave}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded text-xs font-bold uppercase transition"
                            >
                                <LogOut size={14} /> Desertar
                            </button>
                        </div>
                    </div>

                    {/* Gestão de Candidaturas & Convites (Apenas Fundador) */}
                    {isFundador && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl overflow-hidden">
                                <div className="bg-amber-500/10 p-3 border-b border-amber-500/20 text-amber-400 font-bold uppercase text-xs tracking-widest">
                                    Candidaturas Externas
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    {alianca.pedidos && alianca.pedidos.filter((p: any) => p.status === 'pendente').length > 0 ? (
                                        alianca.pedidos.filter((p: any) => p.status === 'pendente').map((pedido: any) => (
                                            <div key={pedido.id} className="flex items-center justify-between bg-black/40 p-3 border border-white/5 rounded">
                                                <div className="font-bold text-white text-sm">{pedido.jogador?.username}</div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleDecision(pedido.id, 'aprovar')}
                                                        className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded transition"
                                                        title="Aprovar"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDecision(pedido.id, 'rejeitar')}
                                                        className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition"
                                                        title="Rejeitar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-500 text-xs italic text-center py-4">Sem candidaturas pendentes.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl overflow-hidden">
                                <div className="bg-sky-500/10 p-3 border-b border-sky-500/20 text-sky-400 font-bold uppercase text-xs tracking-widest">
                                    Recrutamento Estratégico
                                </div>
                                <div className="p-4 space-y-4">
                                    <form onSubmit={handleInvite} className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={jogadorConvidar}
                                            onChange={e => setJogadorConvidar(e.target.value)}
                                            placeholder="Nome do Comandante..."
                                            className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white"
                                        />
                                        <button className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded text-xs font-bold uppercase transition">
                                            Convidar
                                        </button>
                                    </form>
                                    <div className="space-y-2">
                                        <h4 className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Convites Enviados</h4>
                                        {convitesEnviados && convitesEnviados.length > 0 ? (
                                            convitesEnviados.map((c) => (
                                                <div key={c.id} className="flex items-center justify-between bg-black/40 p-2 border border-white/5 rounded">
                                                    <span className="text-[10px] text-white font-bold">{c.jogador?.username}</span>
                                                    <span className="text-[9px] text-sky-400 font-mono uppercase px-2 py-0.5 bg-sky-500/10 rounded">Pendente</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-neutral-600 text-[9px] italic uppercase tracking-widest text-center py-2">Sem convites ativos.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Membros */}
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center gap-2">
                            <Users className="text-sky-400" size={18} />
                            <h3 className="font-black text-sm uppercase tracking-widest text-white">Efetivos Militares ({alianca.membros?.length})</h3>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <table className="w-full text-left text-sm text-neutral-400">
                                <thead>
                                    <tr className="border-b border-white/5 uppercase text-[10px] tracking-widest text-neutral-500">
                                        <th className="pb-2">Comandante</th>
                                        <th className="pb-2 text-right">Patente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alianca.membros?.map((membro: any) => (
                                        <tr key={membro.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                            <td className="py-3 font-bold text-white flex items-center gap-2">
                                                {membro.id === alianca.fundador_id && <Target size={14} className="text-amber-400" />}
                                                {membro.username}
                                            </td>
                                            <td className="py-3 text-right">
                                                {membro.id === alianca.fundador_id ? (
                                                    <span className="text-amber-400 text-xs uppercase font-bold">Líder Supremo</span>
                                                ) : (
                                                    <span className="text-neutral-500 text-xs uppercase">Oficial</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: CANAL DE COMUNICAÇÃO SEGURO */}
                <div className="flex-1 md:max-w-md bg-black/60 border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="bg-sky-900/20 p-4 border-b border-sky-500/20 flex items-center gap-3">
                        <MessageSquare className="text-sky-400" />
                        <div>
                            <h2 className="font-black text-sm uppercase tracking-widest text-white">Canal Seguro</h2>
                            <p className="text-[10px] text-sky-400 font-mono opacity-80">ENCRIPTADO E2E - REDE TÁTICA</p>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                        {mensagens && mensagens.length > 0 ? (
                            mensagens.map((msg: any) => {
                                const isMe = msg.jogador_id === jogador.id;
                                return (
                                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}>
                                        <span className={`text-[10px] mb-1 font-bold ${isMe ? 'text-right text-sky-400' : 'text-neutral-500'}`}>
                                            {isMe ? 'Eu' : msg.jogador?.username}
                                        </span>
                                        <div className={`p-3 rounded-lg text-sm ${isMe ? 'bg-sky-600 text-white rounded-br-none' : 'bg-white/10 text-neutral-200 rounded-bl-none border border-white/5'}`}>
                                            {msg.mensagem}
                                        </div>
                                        <span className={`text-[9px] text-neutral-600 mt-1 ${isMe ? 'text-right' : ''}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-center text-neutral-500 text-xs uppercase font-mono px-8">
                                O canal de comunicação encontra-se vazio. Inicia a coordenação militar.
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-black/40 border-t border-white/10">
                        <form onSubmit={handleSendChat} className="flex gap-2">
                            <input 
                                type="text"
                                value={chatMsg}
                                onChange={e => setChatMsg(e.target.value)}
                                placeholder="Transmitir mensagem..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500 focus:bg-white/10 transition"
                            />
                            <button 
                                type="submit"
                                disabled={!chatMsg.trim()}
                                className="p-3 bg-sky-600 hover:bg-sky-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-lg transition"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
