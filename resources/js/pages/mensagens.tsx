import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Mail, MailOpen, Trash2, Send, Filter, CheckCheck } from 'lucide-react';
import { useToasts } from '@/components/game/ToastProvider';

interface MensagensProps {
    mensagens: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    naoLidas: number;
    filtroAtivo: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mensagens', href: '/mensagens' },
];

export default function Mensagens({ mensagens, naoLidas, filtroAtivo }: MensagensProps) {
    const { addToast } = useToasts();
    const [viewingMsg, setViewingMsg] = useState<any>(null);
    const [composing, setComposing] = useState(false);
    const [formData, setFormData] = useState({ destinatario: '', assunto: '', corpo: '' });
    const [isSending, setIsSending] = useState(false);

    const openMessage = (msg: any) => {
        setViewingMsg(msg);
        if (!msg.lida) {
            fetch(`/mensagens/${msg.id}`)
                .then(r => r.json())
                .then(() => {
                    // Update local state lightly
                    router.reload({ only: ['mensagens', 'naoLidas'] });
                });
        }
    };

    const deleteMessage = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Eliminar esta mensagem?')) return;
        router.delete(`/mensagens/${id}`, {
            onSuccess: () => {
                addToast('Mensagem eliminada.', 'info');
                if (viewingMsg?.id === id) setViewingMsg(null);
            }
        });
    };

    const markAllRead = () => {
        router.post('/mensagens/marcar-lidas', {}, {
            onSuccess: () => addToast('Todas marcadas como lidas.', 'success')
        });
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        router.post('/mensagens/enviar', formData, {
            onSuccess: () => {
                addToast('Mensagem enviada com sucesso!', 'success');
                setComposing(false);
                setFormData({ destinatario: '', assunto: '', corpo: '' });
            },
            onError: (err) => {
                addToast(Object.values(err)[0] as string || 'Erro ao enviar.', 'error');
            },
            onFinish: () => setIsSending(false)
        });
    };

    const changeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/mensagens', { tipo: e.target.value }, { preserveState: true });
    };

    const getIcon = (tipo: string, lida: boolean) => {
        if (!lida) return <Mail className="text-sky-400 fill-sky-400/20 animate-pulse" size={18} />;
        if (tipo === 'relatorio_ataque') return <MailOpen className="text-red-400" size={18} />;
        if (tipo === 'relatorio_defesa') return <MailOpen className="text-emerald-400" size={18} />;
        if (tipo === 'sistema') return <MailOpen className="text-amber-400" size={18} />;
        return <MailOpen className="text-neutral-500" size={18} />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Caixa de Mensagens" />

            <div className="flex flex-col md:flex-row gap-6 p-6 min-h-[calc(100vh-4rem)]">
                
                {/* LISTAGEM DE MENSAGENS */}
                <div className="flex-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Mail className="text-sky-500" />
                            <h2 className="font-black text-lg uppercase tracking-widest text-white">Comunicações</h2>
                            {naoLidas > 0 && (
                                <span className="bg-sky-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {naoLidas} NOVA{naoLidas > 1 ? 'S' : ''}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <select 
                                value={filtroAtivo}
                                onChange={changeFilter}
                                className="bg-black/50 border border-white/10 text-white text-xs p-2 rounded"
                            >
                                <option value="todas">Todas as Mensagens</option>
                                <option value="privada">Mensagens Privadas</option>
                                <option value="relatorio_ataque">Relatórios de Ofensiva</option>
                                <option value="relatorio_defesa">Relatórios de Defesa</option>
                                <option value="sistema">Comunicações do Sistema</option>
                            </select>
                            
                            <button onClick={markAllRead} className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition" title="Marcar todas como lidas">
                                <CheckCheck size={18} />
                            </button>
                            <button 
                                onClick={() => { setComposing(true); setViewingMsg(null); }}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase rounded flex items-center gap-2 transition"
                            >
                                <Send size={14} /> Nova Mensagem
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {mensagens.data.length === 0 ? (
                            <div className="p-8 text-center text-neutral-500 font-mono text-sm uppercase">
                                Nenhuma comunicação registada nesta frequência.
                            </div>
                        ) : (
                            mensagens.data.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    onClick={() => openMessage(msg)}
                                    className={`p-4 border-b border-white/5 flex items-center gap-4 cursor-pointer transition-colors
                                        ${viewingMsg?.id === msg.id ? 'bg-sky-900/30' : 'hover:bg-white/5'}
                                        ${!msg.lida ? 'bg-white/[0.02]' : ''}
                                    `}
                                >
                                    {getIcon(msg.tipo, msg.lida)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`font-bold truncate ${!msg.lida ? 'text-white' : 'text-neutral-400'}`}>
                                                {msg.remetente ? msg.remetente.username : 'COMANDO CENTRAL'}
                                            </span>
                                            <span className="text-[10px] text-neutral-500">{new Date(msg.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className={`text-sm truncate ${!msg.lida ? 'text-sky-100 font-medium' : 'text-neutral-500'}`}>
                                            {msg.assunto}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={(e) => deleteMessage(msg.id, e)}
                                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Paginação */}
                    {mensagens.last_page > 1 && (
                        <div className="p-4 border-t border-white/5 flex justify-center gap-2">
                            {mensagens.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-xs border rounded ${link.active ? 'bg-sky-500 text-black border-sky-500 font-bold' : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'} ${!link.url && 'opacity-50 pointer-events-none'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* PAINEL DE LEITURA / ESCRITA */}
                <div className="md:w-1/2 flex flex-col">
                    {composing ? (
                        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col">
                            <div className="p-4 bg-white/5 border-b border-white/10 font-bold text-sky-400 uppercase tracking-widest flex justify-between items-center">
                                <span>Nova Transmissão</span>
                                <button onClick={() => setComposing(false)} className="text-neutral-500 hover:text-white">✕</button>
                            </div>
                            <form onSubmit={handleSend} className="p-6 flex flex-col gap-4 flex-1">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">Destinatário (Username)</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.destinatario}
                                        onChange={e => setFormData({...formData, destinatario: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">Assunto</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.assunto}
                                        onChange={e => setFormData({...formData, assunto: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500" 
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-[10px] font-black uppercase text-neutral-500 mb-1">Mensagem</label>
                                    <textarea 
                                        required
                                        value={formData.corpo}
                                        onChange={e => setFormData({...formData, corpo: e.target.value})}
                                        className="w-full flex-1 bg-black/50 border border-white/10 rounded p-2 text-white font-mono text-sm resize-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[200px]" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSending}
                                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 disabled:opacity-50 transition"
                                >
                                    {isSending ? 'Transmitindo...' : <><Send size={18} /> Enviar Comunicação</>}
                                </button>
                            </form>
                        </div>
                    ) : viewingMsg ? (
                        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col">
                            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-white mb-1">{viewingMsg.assunto}</h3>
                                    <p className="text-xs text-neutral-400">
                                        De: <span className="text-sky-400 font-bold">{viewingMsg.remetente ? viewingMsg.remetente.username : 'COMANDO CENTRAL'}</span> • {new Date(viewingMsg.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={() => setViewingMsg(null)} className="text-neutral-500 hover:text-white">✕</button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 font-mono text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                {viewingMsg.corpo}
                            </div>
                            {viewingMsg.remetente && (
                                <div className="p-4 bg-black/20 border-t border-white/5">
                                    <button 
                                        onClick={() => {
                                            setFormData({ destinatario: viewingMsg.remetente.username, assunto: `RE: ${viewingMsg.assunto}`, corpo: `\n\n--- Mensagem Original ---\n${viewingMsg.corpo}` });
                                            setComposing(true);
                                        }}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase rounded flex items-center gap-2 transition"
                                    >
                                        <Send size={14} /> Responder
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-black/20 border border-white/5 rounded-xl flex-1 flex flex-col items-center justify-center text-neutral-600 p-8 text-center border-dashed">
                            <Mail size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-2 text-neutral-500">Terminal de Comunicações</h3>
                            <p className="text-sm">Selecione uma mensagem para ler ou inicie uma nova transmissão.</p>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
