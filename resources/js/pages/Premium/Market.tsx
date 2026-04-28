import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    ArrowRight, 
    Zap, 
    Trash2, 
    Plus,
    AlertCircle,
    Info,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Offer {
    id: number;
    vendedor: {
        id: number;
        username: string;
    };
    recurso_tipo: string;
    quantidade: number;
    preco_pp: number;
    created_at: string;
}

interface Props {
    offers: Offer[];
    myOffers: Offer[];
    bases: any[];
}

export default function PremiumMarket({ offers, myOffers, bases }: Props) {
    const [filterType, setFilterType] = useState<string>('all');
    
    const offerForm = useForm({
        base_id: bases[0]?.id || '',
        resource_type: 'suprimentos',
        amount: 1000,
        price_pp: 10
    });

    const buyForm = useForm({
        target_base_id: bases[0]?.id || ''
    });

    const handleCreateOffer = (e: React.FormEvent) => {
        e.preventDefault();
        offerForm.post(route('premium.market.store'), {
            onSuccess: () => {
                toast.success('Oferta colocada no mercado!');
                offerForm.reset('amount', 'price_pp');
            },
            onError: (errors: any) => toast.error(errors.error || 'Erro ao criar oferta')
        });
    };

    const handleBuy = (offerId: number) => {
        buyForm.post(route('premium.market.buy', offerId), {
            onSuccess: () => toast.success('Recursos adquiridos com sucesso!'),
            onError: (errors: any) => toast.error(errors.error || 'Erro na transação')
        });
    };

    const handleCancel = (offerId: number) => {
        if (!confirm('Deseja cancelar esta oferta? Os recursos serão devolvidos.')) return;
        router.delete(route('premium.market.destroy', offerId), {
            onSuccess: () => toast.success('Oferta cancelada.')
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Área Premium', href: '/premium' },
        { title: 'Mercado Premium', href: '/premium/market' },
    ];

    const filteredOffers = offers.filter(o => filterType === 'all' || o.recurso_tipo === filterType);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mercado Premium - Guerras Modernas" />
            
            <div className="tactical-crt-overlay" />

            <div className="p-6 max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                            <ShoppingBag className="w-8 h-8 text-amber-500" />
                            MERCADO_PREMIUM
                        </h1>
                        <p className="text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
                            Rede de Negócios Táticos Inter-Jogadores
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        <Filter size={14} className="text-neutral-600 ml-2" />
                        {['all', 'suprimentos', 'combustivel', 'municoes', 'metal', 'energia'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                                    filterType === type 
                                    ? 'bg-amber-500 text-black' 
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Lista de Ofertas */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {filteredOffers.length > 0 ? (
                                    filteredOffers.map(offer => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={offer.id}
                                            className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-amber-500/20 transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-500 border border-white/5">
                                                        <ShoppingBag size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-neutral-500 font-black uppercase block mb-0.5">Vendedor</span>
                                                        <span className="text-sm font-bold text-white">{offer.vendedor.username}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-neutral-500 font-black uppercase block mb-0.5">Preço</span>
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <span className="text-lg font-black text-amber-500">{offer.preco_pp}</span>
                                                        <Zap size={14} className="text-amber-500 fill-amber-500/20" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-black/60 rounded-xl p-4 border border-white/5 mb-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1">Recurso</span>
                                                        <span className="text-xs font-black text-white uppercase tracking-tighter">{offer.recurso_tipo}</span>
                                                    </div>
                                                    <ArrowRight size={16} className="text-neutral-700" />
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1">Quantidade</span>
                                                        <span className="text-xs font-black text-emerald-400">{offer.quantidade.toLocaleString()}x</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleBuy(offer.id)}
                                                className="w-full py-3 bg-white/5 hover:bg-amber-500 text-neutral-400 hover:text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-amber-500"
                                            >
                                                EXECUTAR COMPRA <ArrowUpRight size={14} />
                                            </button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl opacity-20">
                                        <Search size={40} className="mx-auto mb-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">Sem ofertas disponíveis no setor</span>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Lateral: Criar Oferta e Minhas Ofertas */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Formulário de Venda */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Plus size={80} />
                            </div>
                            
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                PUBLICAR_OFERTA
                            </h2>

                            <form onSubmit={handleCreateOffer} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1">Setor de Origem</label>
                                    <select 
                                        value={offerForm.data.base_id}
                                        onChange={e => offerForm.setData('base_id', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 transition-all outline-none"
                                    >
                                        {bases.map(b => (
                                            <option key={b.id} value={b.id}>{b.nome} ({b.coordenada_x}|{b.coordenada_y})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1">Recurso</label>
                                        <select 
                                            value={offerForm.data.resource_type}
                                            onChange={e => offerForm.setData('resource_type', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 outline-none"
                                        >
                                            {['suprimentos', 'combustivel', 'municoes', 'metal', 'energia'].map(t => (
                                                <option key={t} value={t}>{t.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1">Quantidade</label>
                                        <input 
                                            type="number"
                                            value={offerForm.data.amount}
                                            onChange={e => offerForm.setData('amount', parseInt(e.target.value))}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1">Preço em Pontos Premium</label>
                                    <div className="relative">
                                        <input 
                                            type="number"
                                            value={offerForm.data.price_pp}
                                            onChange={e => offerForm.setData('price_pp', parseInt(e.target.value))}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 outline-none pr-10"
                                        />
                                        <Zap className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500" size={14} />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={offerForm.processing}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                >
                                    REGISTAR OFERTA NA REDE
                                </button>
                            </form>
                        </div>

                        {/* Minhas Ofertas Ativas */}
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] px-2 flex items-center justify-between">
                                MINHAS_ATIVAS
                                <span className="bg-white/5 px-2 py-0.5 rounded text-neutral-700">{myOffers.length}</span>
                            </h2>
                            
                            <div className="space-y-2">
                                {myOffers.map(o => (
                                    <div key={o.id} className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">{o.quantidade.toLocaleString()}x {o.recurso_tipo}</span>
                                            <span className="text-[8px] text-neutral-600 font-bold uppercase">{o.preco_pp} PP</span>
                                        </div>
                                        <button 
                                            onClick={() => handleCancel(o.id)}
                                            className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Adicional */}
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex gap-4">
                            <Info className="text-amber-500 shrink-0" size={20} />
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Diretriz Operacional</span>
                                <p className="text-[10px] text-amber-500/60 leading-relaxed font-mono">
                                    As trocas no mercado premium são instantâneas. Ao cancelar uma oferta, os recursos são devolvidos à sua base principal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .tactical-crt-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
                                linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none;
                    z-index: 50;
                    opacity: 0.1;
                }
            `}</style>
        </AppLayout>
    );
}
