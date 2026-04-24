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
        <div className="bg-black/30 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="px-5 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20">
                        <FlaskConical className="text-cyan-400" size={18} />
                    </div>
                    <div>
                        <h3 className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400">
                            Centro de Pesquisa & I&D
                        </h3>
                        {activeResearch && (
                            <div className="text-[9px] text-cyan-400/60 font-mono mt-0.5">
                                Pesquisa ativa: {technologies[activeResearch.tipo]?.name ?? activeResearch.tipo}
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
                        className="border-b border-cyan-500/10 bg-cyan-500/5"
                    >
                        <div className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Loader2 className="text-cyan-400 animate-spin" size={16} />
                                <div>
                                    <div className="text-xs text-white font-bold">
                                        {technologies[activeResearch.tipo]?.name} → L{activeResearch.nivel}
                                    </div>
                                    <div className="text-[10px] text-neutral-500">Em progresso...</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={12} className="text-neutral-500" />
                                <CountdownTimer targetDate={activeResearch.completado_em} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Technology List */}
            <div className="divide-y divide-white/[0.03]">
                {techList.map((tech) => {
                    const IconComponent = ICON_MAP[tech.icon] || FlaskConical;
                    const isMaxed = tech.currentLevel >= tech.maxLevel;
                    const isActive = activeResearch?.tipo === tech.key;
                    const affordable = !isMaxed && canAfford(tech.nextCost);
                    const isExpanded = expandedTech === tech.key;

                    return (
                        <div key={tech.key} className="group">
                            <button
                                onClick={() => setExpandedTech(isExpanded ? null : tech.key)}
                                className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-all duration-200"
                            >
                                {/* Icon */}
                                <div className={`p-2 rounded-xl border transition-all duration-300 ${
                                    isMaxed 
                                        ? 'bg-emerald-500/10 border-emerald-500/20' 
                                        : isActive 
                                            ? 'bg-cyan-500/10 border-cyan-500/20 animate-pulse' 
                                            : 'bg-white/5 border-white/10 group-hover:border-white/20'
                                }`}>
                                    <IconComponent size={16} className={
                                        isMaxed ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-white'
                                    } />
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white">{tech.name}</span>
                                        {isMaxed && <CheckCircle2 size={12} className="text-emerald-400" />}
                                    </div>
                                    <div className="text-[10px] text-neutral-500">
                                        L{tech.currentLevel}/{tech.maxLevel}
                                        {tech.bonusPerLevel > 0 && !isMaxed && (
                                            <span className="text-cyan-400/60 ml-2">
                                                (+{(tech.bonusPerLevel * 100).toFixed(0)}% por nível)
                                            </span>
                                        )}
                                        {tech.bonusPerLevel > 0 && tech.currentLevel > 0 && (
                                            <span className="text-emerald-400 ml-2">
                                                Total: +{(tech.bonusPerLevel * tech.currentLevel * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Level Bar */}
                                <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isMaxed ? 'bg-emerald-500' : 'bg-cyan-500'
                                        }`}
                                        style={{ width: `${(tech.currentLevel / tech.maxLevel) * 100}%` }}
                                    />
                                </div>

                                <ChevronRight size={14} className={`text-neutral-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {isExpanded && !isMaxed && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-4 pt-1 ml-12">
                                            <p className="text-[10px] text-neutral-500 mb-3">{tech.description}</p>
                                            
                                            {/* Costs */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {Object.entries(tech.nextCost).map(([res, amount]) => {
                                                    const enough = (resources[res] ?? 0) >= amount;
                                                    return (
                                                        <div key={res} className={`text-[9px] font-mono px-2 py-1 rounded-lg border ${
                                                            enough 
                                                                ? 'bg-white/5 border-white/10' 
                                                                : 'bg-red-500/10 border-red-500/20'
                                                        }`}>
                                                            <span className={RESOURCE_COLORS[res] || 'text-white'}>{RESOURCE_LABELS[res] || res}</span>
                                                            <span className={enough ? 'text-white ml-1' : 'text-red-400 ml-1'}>{amount.toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })}
                                                <div className="text-[9px] font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                                                    <Clock size={10} className="inline text-neutral-500 mr-1" />
                                                    <span className="text-neutral-300">{formatTime(tech.nextTime)}</span>
                                                </div>
                                            </div>

                                            {/* Reason / Button */}
                                            {tech.reason && !isActive ? (
                                                <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                                                    <Lock size={12} />
                                                    <span>{tech.reason}</span>
                                                </div>
                                            ) : !isActive ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleResearch(tech.key);
                                                    }}
                                                    disabled={!tech.canResearch || !affordable || isResearching}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                                        tech.canResearch && affordable
                                                            ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95'
                                                            : 'bg-white/5 text-neutral-600 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isResearching ? (
                                                        <Loader2 className="animate-spin inline mr-2" size={12} />
                                                    ) : null}
                                                    Investigar L{tech.currentLevel + 1}
                                                </button>
                                            ) : null}
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
