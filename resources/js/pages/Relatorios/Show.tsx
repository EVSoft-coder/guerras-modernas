import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Sword, Shield, Zap, Skull, Calendar, ChevronLeft, 
    Target, TrendingUp, TrendingDown, Info, BarChart3,
    Trophy, XCircle, Share2
} from 'lucide-react';
import { usePage, router } from '@inertiajs/react';

interface Relatorio {
    id: number;
    atacante_id: number;
    defensor_id: number;
    vencedor_id: number;
    titulo: string;
    origem_nome: string;
    destino_nome: string;
    detalhes: {
        attacker_units: any[];
        defender_units: any[];
        saque: Record<string, number>;
        stats: {
            luck: number;
            moral: number;
            wall_bonus: number;
            night_bonus: number;
            is_night: boolean;
            attack_power: number;
            defense_power: number;
            attacker_research_bonus: number;
            defender_research_bonus: number;
        };
        coords: string;
    };
    created_at: string;
    atacante: { nome: string };
    defensor: { nome: string };
}

export default function Show({ relatorio }: { relatorio: Relatorio }) {
    const { auth }: any = usePage().props;
    const isAtacante = relatorio.atacante_id === auth.user?.id;
    const isVitoria = relatorio.vencedor_id === auth.user?.id;
    const canShare = isAtacante || relatorio.defensor_id === auth.user?.id;
    const det = relatorio.detalhes;

    const handleShare = () => {
        router.post(`/relatorios/${relatorio.id}/partilhar`);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Relatórios', href: '/relatorios' },
            { title: `SITREP: ${relatorio.id}`, href: `/relatorios/${relatorio.id}` }
        ]}>
            <Head title={`Relatório de Batalha #${relatorio.id}`} />
            
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link 
                        href="/relatorios" 
                        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                        <ChevronLeft size={16} /> Arquivos Centrais
                    </Link>

                    <div className="flex items-center gap-3">
                        {canShare && (
                            <button 
                                onClick={handleShare}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${relatorio.partilhado_alianca ? 'bg-sky-600 text-white' : 'bg-white/5 text-neutral-500 hover:text-white border border-white/5'}`}
                            >
                                <Share2 size={14} /> {relatorio.partilhado_alianca ? 'Partilhado' : 'Partilhar'}
                            </button>
                        )}
                        
                        <Link 
                            href={`/mapa?target_id=${isAtacante ? det.target_base_id : det.origin_base_id}&target_coord=${det.coords}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                            <Sword size={14} /> {isAtacante ? 'Atacar Novamente' : 'Lançar Contra-Ataque'}
                        </Link>
                    </div>
                </div>

                {/* Título e Status */}
                <div className="bg-neutral-900/60 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
                    <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none`}>
                        {isVitoria ? <Trophy size={160} /> : <Skull size={160} />}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isVitoria ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                    {isVitoria ? 'Missão Concluída' : 'Falha na Operação'}
                                </span>
                                <span className="text-neutral-600 font-mono text-xs">ID: {relatorio.id}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                {relatorio.titulo}
                            </h1>
                            <p className="text-neutral-500 font-mono text-xs flex items-center gap-2">
                                <Calendar size={12} /> {new Date(relatorio.created_at).toLocaleString()} | Setor {det.coords}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-neutral-600 uppercase">Resultado Táctico</p>
                                <p className={`text-3xl font-black uppercase ${isVitoria ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {isVitoria ? '+ VITÓRIA' : '- DERROTA'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna 1: Relatório de Forças (Atacante) */}
                    <div className="space-y-6">
                        <BattleForceCard 
                            title="Desdobramento Ofensivo" 
                            actor={relatorio.atacante.nome}
                            base={relatorio.origem_nome}
                            units={det.attacker_units}
                            color="sky"
                            icon={<Sword size={18} />}
                        />
                    </div>

                    {/* Coluna 2: Sumário Técnico (Mecanismos de Combate) */}
                    <div className="space-y-6">
                        <div className="bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 space-y-6">
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={14} className="text-sky-500" /> Analítica de Combate
                            </h3>

                            <div className="space-y-4">
                                <StatRow 
                                    label="Probabilidade de Sorte" 
                                    value={`${(det.stats.luck * 100).toFixed(1)}%`}
                                    desc="Modificador aleatório de impacto"
                                    color={det.stats.luck >= 0 ? 'text-emerald-400' : 'text-red-400'}
                                    icon={det.stats.luck >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                />
                                <StatRow 
                                    label="Moral da Tropa" 
                                    value={`${det.stats.moral}%`}
                                    desc="Eficiência baseada no porte do alvo"
                                    color={det.stats.moral >= 100 ? 'text-emerald-400' : 'text-orange-400'}
                                    icon={<Zap size={12} />}
                                />
                                <StatRow 
                                    label="Defesa de Perímetro" 
                                    value={`+${(det.stats.wall_bonus * 100).toFixed(0)}%`}
                                    desc="Vantagem táctica da muralha"
                                    color="text-white"
                                    icon={<Shield size={12} />}
                                />
                                <StatRow 
                                    label="Bónus Noturno" 
                                    value={det.stats.is_night ? '+100%' : 'Inativo'}
                                    desc="Operações sob cobertura da escuridão"
                                    color={det.stats.is_night ? 'text-indigo-400' : 'text-neutral-600'}
                                    icon={<Info size={12} />}
                                />
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] font-black text-neutral-500 uppercase">Força Atacante Total</div>
                                        <div className="text-lg font-black text-white">{Math.round(det.stats.attack_power).toLocaleString()}</div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] font-black text-neutral-500 uppercase">Resistência Defensiva</div>
                                        <div className="text-lg font-black text-red-500">{Math.round(det.stats.defense_power).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Saque */}
                        <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-[2rem] p-6">
                            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Zap size={14} /> Espólio Capturado
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(det.saque).map(([res, qty]) => (
                                    <div key={res} className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                                        <span className="text-[8px] font-black text-neutral-500 uppercase mb-1">{res}</span>
                                        <span className="text-xs font-bold text-white">{qty.toLocaleString()}</span>
                                    </div>
                                ))}
                                {Object.values(det.saque).every(v => v === 0) && (
                                    <div className="col-span-3 py-4 text-center text-neutral-600 text-[10px] font-black uppercase italic">
                                        Transmissão: Zero recursos capturados
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coluna 3: Relatório de Forças (Defensor) */}
                    <div className="space-y-6">
                        <BattleForceCard 
                            title="Guarnição Defensiva" 
                            actor={relatorio.defensor ? relatorio.defensor.nome : 'FORÇAS LOCAIS'}
                            base={relatorio.destino_nome}
                            units={det.defender_units}
                            color="red"
                            icon={<Shield size={18} />}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const BattleForceCard = ({ title, actor, base, units, color, icon }: any) => (
    <div className="bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 space-y-4">
        <div className="flex justify-between items-start">
            <div className="space-y-1">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    {icon} {title}
                </h3>
                <p className="text-sm font-black text-white uppercase">{actor}</p>
                <p className="text-[10px] text-neutral-600 font-mono uppercase">{base}</p>
            </div>
        </div>

        <div className="space-y-2">
            <div className="grid grid-cols-4 px-2 py-1 text-[8px] font-black text-neutral-700 uppercase">
                <div className="col-span-2">Unidade</div>
                <div className="text-center">Total</div>
                <div className="text-center">Perdas</div>
            </div>
            {units.map((unit: any) => {
                const qty = unit.quantity + (unit.losses || 0);
                const loss = unit.losses || 0;
                
                return (
                    <div key={unit.name} className="grid grid-cols-4 items-center bg-black/40 p-2 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                        <div className="col-span-2 text-[10px] font-bold text-neutral-300 uppercase truncate">
                            {unit.name.replace(/_/g, ' ')}
                        </div>
                        <div className="text-center text-[11px] font-mono font-bold text-white">
                            {qty}
                        </div>
                        <div className={`text-center text-[11px] font-mono font-bold ${loss > 0 ? 'text-red-500' : 'text-neutral-700'}`}>
                            -{loss}
                        </div>
                    </div>
                );
            })}
            {units.length === 0 && (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-600 text-[10px] font-black uppercase tracking-widest">
                    Sem registo de tropas
                </div>
            )}
        </div>
    </div>
);

const StatRow = ({ label, value, desc, color, icon }: any) => (
    <div className="flex items-center justify-between group">
        <div className="space-y-0.5">
            <div className="flex items-center gap-2">
                {icon && <span className="text-neutral-500">{icon}</span>}
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">{label}</span>
            </div>
            <p className="text-[8px] text-neutral-700 uppercase font-bold">{desc}</p>
        </div>
        <div className={`text-sm font-black font-mono ${color}`}>{value}</div>
    </div>
);
