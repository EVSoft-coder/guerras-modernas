import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Crosshair, Shield, Truck, Zap, Pickaxe, Warehouse, Eye, Plane, 
    FlaskConical, Lock, Clock, CheckCircle2, Loader2, ChevronRight 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
    crosshair: Crosshair,
    shield: Shield,
    truck: Truck,
    zap: Zap,
    pickaxe: Pickaxe,
    warehouse: Warehouse,
    eye: Eye,
    plane: Plane,
    beaker: FlaskConical,
};

interface Technology {
    key: string;
    name: string;
    description: string;
    icon: string;
    currentLevel: number;
    maxLevel: number;
    nextCost: Record<string, number>;
    nextTime: number;
    canResearch: boolean;
    reason: string | null;
    effect: string;
    bonusPerLevel: number;
}

interface ResearchPanelProps {
    research: {
        technologies: Record<string, Technology>;
        activeResearch: {
            tipo: string;
            nivel: number;
            completado_em: string;
        } | null;
    } | null;
    researchBonuses: Record<string, any>;
    baseId: number;
    resources: Record<string, number>;
}

const RESOURCE_LABELS: Record<string, string> = {
    suprimentos: 'SUP',
    combustivel: 'FUEL',
    municoes: 'MUN',
    metal: 'MTL',
    energia: 'NRG',
    pessoal: 'PSS',
};

const RESOURCE_COLORS: Record<string, string> = {
    suprimentos: 'text-emerald-400',
    combustivel: 'text-amber-400',
    municoes: 'text-red-400',
    metal: 'text-slate-300',
    energia: 'text-cyan-400',
    pessoal: 'text-orange-400',
};

function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [remaining, setRemaining] = useState('');

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const target = new Date(targetDate).getTime();
            const diff = Math.max(0, Math.floor((target - now) / 1000));
            setRemaining(formatTime(diff));
            if (diff <= 0) {
                router.reload();
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return <span className="font-mono text-orange-400 font-black">{remaining}</span>;
}

export function ResearchPanel({ research, researchBonuses, baseId, resources }: ResearchPanelProps) {
    const [isResearching, setIsResearching] = useState(false);
    const [expandedTech, setExpandedTech] = useState<string | null>(null);

    if (!research) return null;

    const { technologies, activeResearch } = research;
    const techList = Object.values(technologies);

    const handleResearch = (techKey: string) => {
        setIsResearching(true);
        router.post('/base/pesquisar', {
            base_id: baseId,
            tech: techKey,
        }, {
            onSuccess: () => setIsResearching(false),
            onError: () => setIsResearching(false),
        });
    };

    const canAfford = (costs: Record<string, number>): boolean => {
        return Object.entries(costs).every(([res, amount]) => (resources[res] ?? 0) >= amount);
    };

    return (
        <div className="tactical-glass border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            
            {/* Header */}
            <div className="px-6 py-5 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-cyan-500/10 p-2.5 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                        <FlaskConical className="text-cyan-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500">
                            Pesquisa_Desenvolvimento
                        </h3>
                        {activeResearch && (
                            <div className="text-[9px] text-cyan-400/50 font-military-mono mt-0.5 tracking-widest uppercase">
                                Ativo: {technologies[activeResearch.tipo]?.name ?? activeResearch.tipo}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Research Progress */}
            <AnimatePresence>
                {activeResearch && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-cyan-500/10 bg-cyan-500/[0.02] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 scanline-effect opacity-[0.1]" />
                        <div className="px-6 py-4 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="size-8 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
                                    <Loader2 className="text-cyan-400 animate-spin" size={14} />
                                </div>
                                <div>
                                    <div className="text-[11px] text-white font-black uppercase tracking-widest">
                                        {technologies[activeResearch.tipo]?.name} → <span className="text-cyan-400">L{activeResearch.nivel}</span>
                                    </div>
                                    <div className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mt-0.5">Sincronizando Dados...</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                                <Clock size={12} className="text-neutral-600" />
                                <CountdownTimer targetDate={activeResearch.completado_em} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Technology List */}
            <div className="divide-y divide-white/[0.02]">
                {techList.map((tech) => {
                    const IconComponent = ICON_MAP[tech.icon] || FlaskConical;
                    const isMaxed = tech.currentLevel >= tech.maxLevel;
                    const isActive = activeResearch?.tipo === tech.key;
                    const affordable = !isMaxed && canAfford(tech.nextCost);
                    const isExpanded = expandedTech === tech.key;

                    return (
                        <div key={tech.key} className="group relative">
                            <button
                                onClick={() => setExpandedTech(isExpanded ? null : tech.key)}
                                className={`w-full px-6 py-4 flex items-center gap-5 transition-all duration-500 relative overflow-hidden ${
                                    isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'
                                }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />}
                                
                                {/* Icon */}
                                <div className={`p-2.5 rounded-2xl border transition-all duration-500 ${
                                    isMaxed 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                        : isActive 
                                            ? 'bg-cyan-500/20 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] animate-pulse' 
                                            : 'bg-black/40 border-white/5 group-hover:border-white/10'
                                }`}>
                                    <IconComponent size={18} className={
                                        isMaxed ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-neutral-500 group-hover:text-white'
                                    } />
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">{tech.name}</span>
                                        {isMaxed && <CheckCircle2 size={12} className="text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-[9px] text-neutral-600 font-black font-military-mono">
                                            LVL_{tech.currentLevel.toString().padStart(2, '0')}/<span className="opacity-40">{tech.maxLevel.toString().padStart(2, '0')}</span>
                                        </div>
                                        {tech.bonusPerLevel > 0 && tech.currentLevel > 0 && (
                                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                                +{ (tech.bonusPerLevel * tech.currentLevel * 100).toFixed(0) }% EFF
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Level Bar */}
                                <div className="w-20 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                            isMaxed ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
                                        }`}
                                        style={{ width: `${(tech.currentLevel / tech.maxLevel) * 100}%` }}
                                    />
                                </div>

                                <ChevronRight size={14} className={`text-neutral-700 transition-transform duration-500 ${isExpanded ? 'rotate-90 text-cyan-500' : ''}`} />
                            </button>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {isExpanded && !isMaxed && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden bg-black/20"
                                    >
                                        <div className="px-6 pb-6 pt-2 ml-16 relative">
                                            <div className="absolute left-0 top-0 bottom-6 w-[1px] bg-white/5" />
                                            <p className="text-[10px] text-neutral-500 leading-relaxed max-w-md mb-5 font-medium">{tech.description}</p>
                                            
                                            {/* Costs */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {Object.entries(tech.nextCost).map(([res, amount]) => {
                                                    const enough = (resources[res] ?? 0) >= amount;
                                                    return (
                                                        <div key={res} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                                                            enough 
                                                                ? 'bg-white/[0.02] border-white/5' 
                                                                : 'bg-red-500/5 border-red-500/10'
                                                        }`}>
                                                            <span className={`text-[8px] font-black uppercase tracking-widest ${RESOURCE_COLORS[res] || 'text-white'}`}>{RESOURCE_LABELS[res] || res}</span>
                                                            <span className={`text-[11px] font-black font-military-mono ${enough ? 'text-white' : 'text-red-500/80'}`}>{amount.toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })}
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                                                    <Clock size={12} className="text-neutral-600" />
                                                    <span className="text-[11px] font-black font-military-mono text-neutral-400">{formatTime(tech.nextTime)}</span>
                                                </div>
                                            </div>

                                            {/* Action Area */}
                                            <div className="flex items-center gap-4">
                                                {tech.reason && !isActive ? (
                                                    <div className="flex items-center gap-3 bg-red-500/5 px-4 py-2.5 rounded-2xl border border-red-500/10 text-[10px] font-black text-red-500/60 uppercase tracking-widest">
                                                        <Lock size={14} className="animate-pulse" />
                                                        <span>{tech.reason}</span>
                                                    </div>
                                                ) : !isActive ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResearch(tech.key);
                                                        }}
                                                        disabled={!tech.canResearch || !affordable || isResearching}
                                                        className={`group/btn relative px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${
                                                            tech.canResearch && affordable
                                                                ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95'
                                                                : 'bg-white/5 text-neutral-600 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <span className="relative z-10 flex items-center gap-3">
                                                            {isResearching ? (
                                                                <Loader2 className="animate-spin" size={14} />
                                                            ) : <Zap size={14} />}
                                                            Efetuar_Pesquisa_L{tech.currentLevel + 1}
                                                        </span>
                                                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-3 bg-cyan-500/10 px-5 py-3 rounded-2xl border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                                                        <Activity size={14} className="animate-pulse" />
                                                        Operação em Curso
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
