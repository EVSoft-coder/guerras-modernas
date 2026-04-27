import React from 'react';
import { Shield, Search, Package, Home, Sword, Zap, BarChart3, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpyReportProps {
    report: {
        base_id: number;
        base_name: string;
        timestamp: string;
        resources: Record<string, number>;
        buildings?: { tipo: string; nivel: number }[];
        units?: { name: string; quantity: number }[];
    };
}

export const SpyReport: React.FC<SpyReportProps> = ({ report }) => {
    const hasBuildings = report.buildings && report.buildings.length > 0;
    const hasUnits = report.units && report.units.length > 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* CABEÇALHO TÁCTICO */}
            <div className="flex items-center justify-between border-b border-sky-500/30 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/20 rounded-lg border border-sky-500/30">
                        <Search className="text-sky-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sky-400 font-black text-sm uppercase tracking-widest">Relatório de Inteligência</h4>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">Setor: {report.base_name} (#{report.base_id})</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-neutral-500 block mb-1">DATA DA INFILTRAÇÃO</span>
                    <span className="text-xs font-mono text-white">{new Date(report.timestamp).toLocaleString()}</span>
                </div>
            </div>

            {/* RECURSOS DETECTADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                    <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <Package size={12} className="text-amber-500" /> Reservas de Recursos
                    </h5>
                    
                    <div className="space-y-3">
                        {Object.entries(report.resources).map(([res, val]) => (
                            <div key={res} className="space-y-1">
                                <div className="flex justify-between text-[9px] uppercase font-bold">
                                    <span className="text-neutral-500">{res}</span>
                                    <span className="text-white font-mono">{val.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (val / 5000) * 100)}%` }}
                                        className={`h-full ${res === 'suprimentos' ? 'bg-emerald-500' : res === 'combustivel' ? 'bg-orange-500' : 'bg-sky-500'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ESTATÍSTICAS RÁPIDAS */}
                <div className="p-4 bg-sky-950/20 rounded-xl border border-sky-500/10 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-sky-500/10 rounded-full border border-sky-500/20">
                            <BarChart3 className="text-sky-500" size={24} />
                        </div>
                        <div>
                            <span className="text-[8px] text-sky-400 font-black uppercase">Grau de Infiltração</span>
                            <div className="text-xl font-black text-white">
                                {hasUnits ? 'TOTAL (NÍVEL 3)' : hasBuildings ? 'AVANÇADO (NÍVEL 2)' : 'BÁSICO (NÍVEL 1)'}
                            </div>
                        </div>
                    </div>
                    <p className="text-[9px] text-neutral-500 italic leading-relaxed">
                        A profundidade dos dados obtidos depende do número de espiões que sobreviveram à missão e da capacidade de contra-espionagem do alvo.
                    </p>
                </div>
            </div>

            {/* EDIFÍCIOS DETECTADOS */}
            {hasBuildings ? (
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                    <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <Home size={12} className="text-sky-400" /> Estruturas e Infraestrutura
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {report.buildings?.map((b, i) => (
                            <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between group hover:border-sky-500/30 transition-colors">
                                <span className="text-[9px] text-neutral-400 uppercase font-black truncate mr-2">
                                    {(b.type || 'ESTRUTURA_DESCONHECIDA').replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                                    LVL {b.nivel}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 border border-dashed border-white/5 rounded-xl text-center py-6">
                    <Shield className="mx-auto text-neutral-700 mb-2" size={24} />
                    <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">
                        Dados de Infraestrutura Ocultos <br/> 
                        <span className="text-[8px] opacity-50">É necessário maior rácio de sobrevivência para mapear edifícios.</span>
                    </p>
                </div>
            )}

            {/* TROPAS DETECTADAS */}
            {hasUnits ? (
                <div className="p-4 bg-red-950/20 rounded-xl border border-red-500/20 space-y-4">
                    <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                        <Target size={12} /> Guarnição e Defesas Ativas
                    </h5>
                    <div className="space-y-2">
                        {report.units?.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Sword size={14} className="text-red-500" />
                                    <span className="text-[10px] font-black text-neutral-300 uppercase tracking-tighter">
                                        {(u.name || 'UNIDADE_DESCONHECIDA').replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <span className="text-sm font-mono text-white font-black">
                                    {u.quantity.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 border border-dashed border-white/5 rounded-xl text-center py-6">
                    <Target className="mx-auto text-neutral-700 mb-2 opacity-30" size={24} />
                    <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">
                        Análise de Guarnição Indisponível <br/> 
                        <span className="text-[8px] opacity-50">Dados interceptados pelo sistema de radar inimigo.</span>
                    </p>
                </div>
            )}
        </div>
    );
};
