import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Clock, 
    Crown, 
    Rocket, 
    ShieldCheck, 
    Users, 
    CreditCard, 
    Plus,
    Activity,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    jogador: any;
    prices: {
        reduce_time: number;
        premium_30: number;
    };
}

export default function PremiumIndex({ jogador, prices }: Props) {
    const buyForm = useForm({ amount: 1000 });
    const activateForm = useForm({ days: 30 });

    const handleBuyPoints = () => {
        buyForm.post(route('premium.buy'), {
            onSuccess: () => toast.success('Pontos Premium creditados!'),
        });
    };

    const handleActivate = (days: number) => {
        activateForm.setData('days', days);
        activateForm.post(route('premium.activate'), {
            onSuccess: () => toast.success('Conta Premium ativada!'),
            onError: (errors: any) => toast.error(Object.values(errors)[0] as string),
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Área Premium', href: '/premium' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Área Premium - Guerras Modernas" />
            
            <div className="tactical-crt-overlay" />

            <div className="p-6 max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Header Premium */}
                <div className="bg-black/60 border border-amber-500/20 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown size={120} className="text-amber-500" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
                                <Crown className="w-10 h-10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                                ÁREA PREMIUM
                            </h1>
                            <p className="text-amber-500/60 font-mono text-sm tracking-widest uppercase">
                                Upgrade tático e vantagens de comando avançado
                            </p>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col items-center min-w-[200px]">
                            <span className="text-[10px] text-amber-500 font-black uppercase tracking-tighter">Saldo Atual</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-black text-white">{jogador.pontos_premium}</span>
                                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                            </div>
                            <button 
                                onClick={handleBuyPoints}
                                className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                            >
                                <Plus size={14} /> ADQUIRIR PONTOS
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vantagem 1: Redução de Tempo */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                            <Clock size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">REDUÇÃO DE TEMPO</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Corta o tempo restante de qualquer construção ou recrutamento pela metade instantaneamente.
                            </p>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-sm font-mono text-blue-400">{prices.reduce_time} PP / uso</span>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <CheckCircle2 size={12} className="text-blue-500" /> Ativo na Fila
                            </div>
                        </div>
                    </div>

                    {/* Vantagem 2: Conta Premium */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -z-10" />
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-white">CONTA PREMIUM</h3>
                                        {jogador.e_premium && (
                                            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Ativa</span>
                                        )}
                                    </div>
                                    <p className="text-gray-300">
                                        Acesso total às ferramentas de elite para jogadores que gerem grandes impérios.
                                    </p>
                                </div>

                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <BenefitItem icon={<Rocket className="w-4 h-4" />} text="+20% Produção de Recursos" />
                                    <BenefitItem icon={<Users className="w-4 h-4" />} text="Overviews Massivos (Command Center)" />
                                    <BenefitItem icon={<Plus className="w-4 h-4" />} text="Fila de Construção Alargada (+5)" />
                                    <BenefitItem icon={<Activity className="w-4 h-4" />} text="Estatísticas e Gráficos de Evolução" />
                                    <BenefitItem icon={<ShieldCheck className="w-4 h-4" />} text="Avisos de Ataque Via Notificação" />
                                    <BenefitItem icon={<CreditCard className="w-4 h-4" />} text="Sem Publicidade / Layout Clean" />
                                </ul>
                            </div>

                            <div className="w-full md:w-[250px] bg-black/40 border border-amber-500/20 p-6 rounded-xl flex flex-col justify-center gap-6">
                                <div className="text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Plano Mensal</span>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-4xl font-black text-white">{prices.premium_30}</span>
                                        <span className="text-sm font-bold text-amber-500">PP</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleActivate(30)}
                                    disabled={activateForm.processing}
                                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50"
                                >
                                    ATIVAR 30 DIAS
                                </button>
                                {jogador.premium_until && (
                                    <p className="text-[10px] text-center text-gray-500 font-mono italic">
                                        Válido até: {new Date(jogador.premium_until).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ / Info Adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-xs font-mono uppercase tracking-widest">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        [!] Os Pontos Premium não podem ser trocados por recursos entre jogadores nesta fase.
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                        [!] Ativar a Conta Premium renova automaticamente as vantagens táticas por 30 ciclos solares.
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
                    opacity: 0.15;
                }
            `}</style>
        </AppLayout>
    );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <li className="flex items-center gap-3 text-sm text-gray-400 group">
            <div className="text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            {text}
        </li>
    );
}
