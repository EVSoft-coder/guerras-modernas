import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeftRight, TrendingUp, Clock, User, Plus, X, Loader2, Check, Send, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

interface MarketOffer {
    id: number;
    base_id: number;
    offered_resource: string;
    offered_amount: number;
    requested_resource: string;
    requested_amount: number;
    status: string;
    base: {
        id: number;
        nome: string;
        jogador: {
            name: string;
        }
    };
    created_at: string;
}

interface MarketPanelProps {
    baseId: number;
    resources: any;
    building?: any;
}

export const MarketPanel: React.FC<MarketPanelProps> = ({ baseId, resources, building }) => {
    const [activeTab, setActiveTab] = useState<'offers' | 'logistics'>('offers');
    const [offers, setOffers] = useState<MarketOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [movements, setMovements] = useState<any[]>([]);
    
    // Trading Form state
    const [offeredRes, setOfferedRes] = useState('suprimentos');
    const [offeredAmount, setOfferedAmount] = useState(1000);
    const [requestedRes, setRequestedRes] = useState('combustivel');
    const [requestedAmount, setRequestedAmount] = useState(1000);

    // Logistics Form state
    const [targetX, setTargetX] = useState('');
    const [targetY, setTargetY] = useState('');
    const [logisticsResources, setLogisticsResources] = useState({
        suprimentos: 0,
        combustivel: 0,
        municoes: 0,
        metal: 0
    });

    const resourceOptions = ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia'];
    const logisticsOptions = ['suprimentos', 'combustivel', 'municoes', 'metal'];

    const merchantsTotal = building?.nivel || 0;
    const capacityTotal = merchantsTotal * 1000;
    const currentPayload = Object.values(logisticsResources).reduce((a, b) => a + b, 0);
    const merchantsNeeded = Math.ceil(currentPayload / 1000);

    const fetchOffers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/market');
            setOffers(response.data);
        } catch (error) {
            console.error("Erro ao carregar mercado:", error);
            toast.error("Erro ao carregar Hub de Trocas.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMovements = async () => {
        try {
            const response = await axios.get(`/market/movements?base_id=${baseId}`);
            setMovements(response.data);
        } catch (error) {
            console.error('Erro ao carregar movimentos logísticos');
        }
    };

    useEffect(() => {
        fetchOffers();
        fetchMovements();
    }, [baseId]);

    const handleCreateOffer = async () => {
        if (offeredAmount <= 0 || requestedAmount <= 0) return;
        
        setIsActionLoading(true);
        try {
            await axios.post('/market/offer', {
                base_id: baseId,
                offered_resource: offeredRes,
                offered_amount: offeredAmount,
                requested_resource: requestedRes,
                requested_amount: requestedAmount
            });
            toast.success("Oferta publicada no Hub Global.");
            setShowCreateForm(false);
            fetchOffers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao criar oferta.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleSendResources = async () => {
        if (!targetX || !targetY || currentPayload <= 0) {
            toast.error("Preenche o destino e as quantidades.");
            return;
        }

        if (merchantsNeeded > merchantsTotal) {
            toast.error("Comerciantes insuficientes para esta carga.");
            return;
        }

        setIsActionLoading(true);
        try {
            await axios.post('/market/send', {
                origin_id: baseId,
                target_x: parseInt(targetX),
                target_y: parseInt(targetY),
                ...logisticsResources
            });
            toast.success("Comboio logístico despachado.");
            fetchMovements();
            setLogisticsResources({ suprimentos: 0, combustivel: 0, municoes: 0, metal: 0 });
            setTargetX('');
            setTargetY('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao enviar recursos.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAcceptOffer = async (offerId: number) => {
        setIsActionLoading(true);
        try {
            await axios.post(`/market/accept/${offerId}`, { base_id: baseId });
            toast.success("Troca concluída com sucesso.");
            fetchOffers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao aceitar oferta.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleCancelOffer = async (offerId: number) => {
        setIsActionLoading(true);
        try {
            await axios.post(`/market/cancel/${offerId}`);
            toast.success("Oferta removida.");
            fetchOffers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao cancelar oferta.");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* TABS SELECTOR */}
            <div className="flex gap-4 p-2 bg-black/40 border border-white/5 rounded-2xl w-fit">
                <button 
                    onClick={() => setActiveTab('offers')}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'offers' ? 'bg-sky-500 text-black shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'text-neutral-500 hover:text-white'}`}
                >
                    Hub_Trocas
                </button>
                <button 
                    onClick={() => setActiveTab('logistics')}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logistics' ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-neutral-500 hover:text-white'}`}
                >
                    Logística_Direta
                </button>
            </div>

            {activeTab === 'offers' ? (
                <>
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase text-sky-500 tracking-[0.5em] flex items-center gap-4">
                            <div className="w-10 h-[1px] bg-sky-500/30" />
                            Ordens_Mercantis_Ativas
                            <div className="flex-1 h-[1px] bg-white/[0.03]" />
                        </h4>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20 rounded-xl px-6 h-10 text-[9px] font-black tracking-widest uppercase"
                        >
                            {showCreateForm ? <X size={14} className="mr-2" /> : <Plus size={14} className="mr-2" />}
                            {showCreateForm ? 'FECHAR_TERMINAL' : 'NOVA_ORDEM_TROCA'}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showCreateForm && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-10 relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* OFFER SIDE */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Enviar_Recursos</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {resourceOptions.map(res => (
                                                    <button 
                                                        key={res} 
                                                        onClick={() => setOfferedRes(res)}
                                                        className={`p-4 rounded-2xl border text-[10px] font-black uppercase transition-all ${offeredRes === res ? 'bg-sky-500/20 border-sky-500/40 text-sky-400' : 'bg-black/40 border-white/5 text-neutral-600 hover:border-white/10'}`}
                                                    >
                                                        {res}
                                                    </button>
                                                ))}
                                            </div>
                                            <input 
                                                type="number" 
                                                value={offeredAmount} 
                                                onChange={e => setOfferedAmount(parseInt(e.target.value))} 
                                                className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 text-2xl font-black text-white focus:border-sky-500/50 outline-none font-military-mono"
                                            />
                                        </div>

                                        {/* REQUEST SIDE */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Receber_Recursos</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {resourceOptions.map(res => (
                                                    <button 
                                                        key={res} 
                                                        onClick={() => setRequestedRes(res)}
                                                        className={`p-4 rounded-2xl border text-[10px] font-black uppercase transition-all ${requestedRes === res ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-black/40 border-white/5 text-neutral-600 hover:border-white/10'}`}
                                                    >
                                                        {res}
                                                    </button>
                                                ))}
                                            </div>
                                            <input 
                                                type="number" 
                                                value={requestedAmount} 
                                                onChange={e => setRequestedAmount(parseInt(e.target.value))} 
                                                className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 text-2xl font-black text-white focus:border-emerald-500/50 outline-none font-military-mono"
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleCreateOffer}
                                        disabled={isActionLoading}
                                        className="w-full h-20 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_60px_rgba(14,165,233,0.2)]"
                                    >
                                        {isActionLoading ? <Loader2 className="animate-spin mr-3" /> : <ShoppingCart className="mr-3" />}
                                        PUBLICAR_ORDEM_NO_HUB
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <Loader2 className="animate-spin mb-4" size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando_Dados_Mercado...</span>
                            </div>
                        ) : offers.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-white/5 rounded-[2.5rem] opacity-30">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Sem_Ordens_Ativas_No_Setor</span>
                            </div>
                        ) : (
                            offers.map(offer => (
                                <motion.div 
                                    key={offer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-black/40 border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-white/[0.02] transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-500/30" />
                                    
                                    <div className="flex items-center gap-8 flex-1">
                                        <div className="flex flex-col items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 min-w-[120px]">
                                            <span className="text-[8px] font-black text-neutral-600 uppercase mb-2 tracking-widest">Oferece</span>
                                            <span className="text-xl font-black text-white font-military-mono">{offer.offered_amount.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-sky-400 uppercase mt-1 tracking-widest">{offer.offered_resource}</span>
                                        </div>

                                        <div className="p-4 rounded-full bg-white/5">
                                            <ArrowLeftRight className="text-neutral-600 group-hover:text-sky-500 transition-colors" size={20} />
                                        </div>

                                        <div className="flex flex-col items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 min-w-[120px]">
                                            <span className="text-[8px] font-black text-neutral-600 uppercase mb-2 tracking-widest">Solicita</span>
                                            <span className="text-xl font-black text-white font-military-mono">{offer.requested_amount.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-emerald-400 uppercase mt-1 tracking-widest">{offer.requested_resource}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User size={12} className="text-neutral-600" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{offer.base.jogador.name}</span>
                                            </div>
                                            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Base: {offer.base.nome}</span>
                                        </div>

                                        {offer.base_id === baseId ? (
                                            <Button 
                                                onClick={() => handleCancelOffer(offer.id)}
                                                disabled={isActionLoading}
                                                variant="ghost"
                                                className="h-14 px-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5"
                                            >
                                                CANCELAR
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={() => handleAcceptOffer(offer.id)}
                                                disabled={isActionLoading}
                                                className="h-14 px-8 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-widest rounded-2xl shadow-lg"
                                            >
                                                {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} className="mr-3" />}
                                                ACEITAR_TROCA
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.5em] flex items-center gap-4">
                            <div className="w-10 h-[1px] bg-emerald-500/30" />
                            Terminal_Logístico_de_Despacho
                            <div className="flex-1 h-[1px] bg-white/[0.03]" />
                        </h4>
                        
                        <div className="flex items-center gap-6 bg-white/[0.03] border border-white/5 px-6 py-3 rounded-2xl">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Comerciantes</span>
                                <span className={`text-[12px] font-black uppercase ${merchantsNeeded > merchantsTotal ? 'text-red-500' : 'text-white'}`}>
                                    {merchantsNeeded} / {merchantsTotal}
                                </span>
                            </div>
                            <Truck className={merchantsNeeded > merchantsTotal ? 'text-red-500 animate-pulse' : 'text-emerald-500'} size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* DESTINATION */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Destino_Tático</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase ml-2">Coord_X</label>
                                    <input 
                                        type="number" 
                                        value={targetX}
                                        onChange={e => setTargetX(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white font-black font-military-mono outline-none focus:border-emerald-500/30"
                                        placeholder="000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase ml-2">Coord_Y</label>
                                    <input 
                                        type="number" 
                                        value={targetY}
                                        onChange={e => setTargetY(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white font-black font-military-mono outline-none focus:border-emerald-500/30"
                                        placeholder="000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* QUANTITIES */}
                        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <Truck size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Carga_Útil_Logística</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {logisticsOptions.map(res => (
                                    <div key={res} className="space-y-2">
                                        <label className="text-[8px] font-black text-neutral-600 uppercase ml-2">{res}</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={logisticsResources[res as keyof typeof logisticsResources]}
                                                onChange={e => setLogisticsResources({
                                                    ...logisticsResources,
                                                    [res]: Math.max(0, parseInt(e.target.value) || 0)
                                                })}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl p-4 pr-10 text-white font-black font-military-mono outline-none focus:border-emerald-500/30"
                                            />
                                            <button 
                                                onClick={() => setLogisticsResources({
                                                    ...logisticsResources,
                                                    [res]: resources?.[res] || 0
                                                })}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-emerald-500/40 hover:text-emerald-500"
                                            >
                                                MAX
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button 
                            onClick={handleSendResources}
                            disabled={isActionLoading || merchantsNeeded > merchantsTotal || currentPayload <= 0}
                            className="flex-1 h-20 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_60px_rgba(16,185,129,0.2)] disabled:opacity-30"
                        >
                            {isActionLoading ? <Loader2 className="animate-spin mr-3" /> : <Send className="mr-3" />}
                            DESPACHAR_COMBOIO_LOGÍSTICO
                        </Button>
                        
                        {merchantsNeeded > merchantsTotal && (
                            <div className="flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 animate-pulse">
                                <AlertTriangle size={20} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Capacidade_Excedida</span>
                            </div>
                        )}
                    </div>

                    {/* RECENT MOVEMENTS (LOGISTICS ONLY) */}
                    <div className="space-y-4">
                        <h5 className="text-[8px] font-black uppercase text-neutral-600 tracking-[0.3em] ml-2">Transportes_Ativos</h5>
                        <div className="space-y-3">
                            {movements.length === 0 ? (
                                <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl opacity-20">
                                    <span className="text-[8px] font-black uppercase tracking-widest">Sem_Movimentos_Registados</span>
                                </div>
                            ) : (
                                movements.map((mov) => (
                                    <div key={mov.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                                <Truck size={16} className="text-emerald-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                    {mov.origin_id === baseId ? `PARA: ${mov.target?.nome}` : `DE: ${mov.origin?.nome}`}
                                                </span>
                                                <div className="flex gap-4 mt-1">
                                                    {['suprimentos', 'combustivel', 'municoes', 'metal'].map(res => {
                                                        const val = mov[`loot_${res}`];
                                                        if (!val || val <= 0) return null;
                                                        return (
                                                            <span key={res} className="text-[8px] font-black text-neutral-500 uppercase tracking-tighter">
                                                                {res[0].toUpperCase()}: {val.toLocaleString()}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 text-emerald-500 font-military-mono text-[10px] font-black">
                                                <Clock size={12} />
                                                <span>{new Date(mov.arrival_time).toLocaleTimeString()}</span>
                                            </div>
                                            <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest mt-1">Status: EM_TRANSITO</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
