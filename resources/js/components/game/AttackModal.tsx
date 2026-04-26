import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Zap, Shield, Sword, Search, Flag, Loader2, ChevronRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttackModalProps {
    isOpen: boolean;
    onClose: () => void;
    origemBase: any;
    destinoBase: any;
    tropasDisponiveis: any[];
    onEnviar: (params: { destino_id: number | null; destino_x?: number; destino_y?: number; tropas: Record<string, number>; tipo: string; general_id?: number | null }) => void;
    isSending: boolean;
    gameConfig: any;
    unitTypes?: any[];
    general?: any;
}

export const AttackModal: React.FC<AttackModalProps> = ({ 
    isOpen, onClose, origemBase, destinoBase, tropasDisponiveis, onEnviar, isSending, gameConfig, unitTypes, general 
}) => {
    const [selectedTropas, setSelectedTropas] = useState<Record<string, number>>({});
    const [missionType, setMissionType] = useState<string>('ataque');
    const [mobilizarGeneral, setMobilizarGeneral] = useState<boolean>(false);
    const [cargo, setCargo] = useState<Record<string, number>>({
        suprimentos: 0,
        combustivel: 0,
        municoes: 0,
        metal: 0,
        energia: 0
    });

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (isOpen && !hasInitialized) {
            const initial: Record<string, number> = {};
            tropasDisponiveis.forEach(t => {
                const ut = unitTypes?.find(u => u.name === t.tipo || u.name === t.unidade);
                if (ut) initial[ut.id] = 0;
            });
            setSelectedTropas(initial);
            setCargo({ suprimentos: 0, combustivel: 0, municoes: 0, metal: 0, energia: 0 });
            setMissionType('ataque');
            setMobilizarGeneral(false);
            setHasInitialized(true);
        } else if (!isOpen) {
            setHasInitialized(false);
        }
    }, [isOpen, tropasDisponiveis, unitTypes, hasInitialized]);

    const handleTropaChange = (unitId: string, value: number) => {
        setSelectedTropas(prev => ({ ...prev, [unitId]: value }));
    };

    const handleCargoChange = (res: string, value: number) => {
        setCargo(prev => ({ ...prev, [res]: value }));
    };

    const totalCargo = Object.values(cargo).reduce((a, b) => a + b, 0);
    const hasTropasSelected = Object.values(selectedTropas).some(v => v > 0);

    // Cálculos Tácticos
    const stats = useMemo(() => {
        if (!destinoBase || !origemBase || !unitTypes) return null;
        
        const dx = (destinoBase.coordenada_x || 0) - (origemBase.coordenada_x || 0);
        const dy = (destinoBase.coordenada_y || 0) - (origemBase.coordenada_y || 0);
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        // Encontrar unidade mais lenta
        let minSpeed = 999;
        let totalAttack = 0;
        let totalCapacity = 0;
        
        Object.entries(selectedTropas).forEach(([id, qtd]) => {
            if (qtd > 0) {
                const config = unitTypes.find(u => u.id === parseInt(id));
                if (config) {
                    if (config.speed < minSpeed) minSpeed = config.speed;
                    totalAttack += qtd * (config.attack || 0);
                    totalCapacity += qtd * (config.carry_capacity || 0);
                }
            }
        });

        if (minSpeed === 999) minSpeed = 1;

        // Formula igual ao GameService / MapService
        // No backend MapService: $seconds = (int) ceil($distance / $speed);
        // Mas aqui usamos a escala visual (distancia * 100)
        const seconds = Math.max(60, Math.ceil(distancia / (minSpeed * 0.01)));

        return {
            distancia: distancia.toFixed(1),
            tempo: Math.floor(seconds),
            ataque: totalAttack,
            capacidade: totalCapacity
        };
    }, [destinoBase, origemBase, selectedTropas, unitTypes]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-2xl overflow-hidden p-0 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                
                <DialogHeader className="p-6 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                            <Target className="text-red-500 animate-pulse" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Preparar Ofensiva Militar</DialogTitle>
                            <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold">
                                Alvo: <span className="text-white">{destinoBase?.nome || 'Coordenadas Remotas'}</span> [{destinoBase?.coordenada_x}:{destinoBase?.coordenada_y}]
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* TARGET INTEL (NOVO) */}
                    <div className="p-6 bg-red-950/20 border-r border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Search size={12} /> Target Intelligence
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="p-3 bg-black/40 rounded-xl border border-red-500/10">
                                <span className="text-[8px] text-neutral-500 uppercase font-black block mb-1">Status Operacional</span>
                                <div className="text-[10px] font-bold text-red-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    ALVO HOSTIL DETECTADO
                                </div>
                            </div>

                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <span className="text-[8px] text-neutral-500 uppercase font-black block mb-1">Contexto Geográfico</span>
                                <div className="text-[10px] font-mono text-white">
                                    Distância: <span className="text-sky-400">{stats?.distancia} KM</span>
                                </div>
                                <div className="text-[10px] font-mono text-white mt-1">
                                    Quadrante: <span className="text-sky-400">{destinoBase?.coordenada_x > 50 ? 'ESTE' : 'OESTE'} / {destinoBase?.coordenada_y > 50 ? 'SUL' : 'NORTE'}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <span className="text-[8px] text-neutral-500 uppercase font-black block mb-1">Defesas Estimadas</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <Shield size={12} className="text-neutral-500" />
                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full" style={{ width: '65%' }} />
                                    </div>
                                </div>
                                <span className="text-[8px] text-neutral-600 mt-1 block italic text-right">Dados Reais ocultos pelo Radar</span>
                            </div>
                        </div>
                    </div>

                    {/* SELECÇÃO DE TROPAS */}
                    <div className="p-6 border-r border-white/5 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar bg-white/[0.02]">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Sword size={12} /> Ordem de Batalha
                        </h4>
                        
                        {tropasDisponiveis.length === 0 ? (
                            <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                                <p className="text-[10px] text-neutral-600 uppercase">Guarnição Vazia</p>
                            </div>
                        ) : (
                            tropasDisponiveis.map(tropa => {
                                const utId = unitTypes?.find(u => u.name === tropa.tipo || u.name === tropa.unidade)?.id;
                                if (!utId) return null;

                                const unitName = (tropa.tipo || tropa.unidade || 'Desconhecida');
                                const isArmored = ['tanque', 'blindado', 'helicoptero'].some(s => unitName.toLowerCase().includes(s));
                                
                                return (
                                    <div key={utId} className="space-y-2 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-wide text-neutral-300 group-hover:text-sky-400 transition-colors">
                                                    {unitName.replace(/_/g, ' ')}
                                                </span>
                                                <span className={`text-[7px] font-black ${isArmored ? 'text-orange-500' : 'text-emerald-500'} uppercase`}>
                                                    {isArmored ? 'UNIT: ARMORED' : 'UNIT: INFANTRY'}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] bg-sky-500/10 border-sky-500/20 text-sky-400 font-mono">
                                                {selectedTropas[utId] || 0} / {tropa.quantidade}
                                            </Badge>
                                        </div>
                                        <input 
                                            type="range"
                                            min="0"
                                            max={tropa.quantidade}
                                            step="1"
                                            value={selectedTropas[utId] || 0}
                                            onChange={(e) => handleTropaChange(utId.toString(), parseInt(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* SUMÁRIO TÁCTICO E TIPO DE MISSÃO */}
                    <div className="p-6 bg-black/40 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* GENERAL SELECTION */}
                            {general && (
                                <div 
                                    onClick={() => setMobilizarGeneral(!mobilizarGeneral)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                        mobilizarGeneral 
                                        ? 'bg-sky-500/20 border-sky-500/50' 
                                        : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${mobilizarGeneral ? 'bg-sky-500 text-white' : 'bg-white/10 text-neutral-400'}`}>
                                                <Award size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-white">{general.nome}</div>
                                                <div className="text-[8px] font-bold text-sky-400 uppercase">Nível {general.nivel} - Alto Comando</div>
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                            mobilizarGeneral ? 'border-sky-500 bg-sky-500' : 'border-white/20'
                                        }`}>
                                            {mobilizarGeneral && <Zap size={10} className="text-white" />}
                                        </div>
                                    </div>
                                    {mobilizarGeneral && (
                                        <div className="mt-2 pt-2 border-t border-white/10">
                                            <div className="text-[7px] text-sky-300 font-bold uppercase tracking-widest">Bónus Activos:</div>
                                            <div className="grid grid-cols-2 gap-1 mt-1">
                                                {general.skills.map((s: any) => {
                                                    if (s.nivel <= 0) return null;
                                                    const labels: any = {
                                                        ofensiva: 'ATK',
                                                        defensiva: 'DEF',
                                                        logistica: 'VEL',
                                                        saque: 'CARGA'
                                                    };
                                                    if (!labels[s.skill_slug]) return null;
                                                    return (
                                                        <div key={s.id} className="text-[7px] text-neutral-400">
                                                            • {labels[s.skill_slug]}: +{s.nivel * (s.skill_slug === 'ofensiva' ? 3 : s.skill_slug === 'defensiva' ? 4 : s.skill_slug === 'logistica' ? 5 : 10)}%
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Protocolo de Operação</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'ataque', icon: <Sword size={14} />, label: 'SAQUE' },
                                        { id: 'espionagem', icon: <Search size={14} />, label: 'ESP' },
                                        { id: 'conquista', icon: <Flag size={14} />, label: 'CONQ' },
                                        { id: 'reforco', icon: <Shield size={14} />, label: 'APOIO' },
                                        { id: 'transporte', icon: <ShoppingCart size={14} />, label: 'TRANS' },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setMissionType(type.id)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                                missionType === type.id 
                                                ? 'bg-red-500/20 border-red-500/50 text-white' 
                                                : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white'
                                            }`}
                                        >
                                            {type.icon}
                                            <span className="text-[8px] font-black mt-1">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                                <h4 className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <Zap size={12} className="text-orange-500" /> Estimativa de Combate
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter block">Tempo de Viagem</span>
                                        <div className="flex items-center gap-2 text-white font-mono text-sm tracking-widest">
                                            <Clock size={12} className="text-neutral-500" />
                                            {formatTime(stats?.tempo || 0)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter block">Poder Ofensivo</span>
                                        <div className="flex items-center gap-2 text-red-400 font-mono text-sm tracking-widest">
                                            <Sword size={12} className="text-red-500/50" />
                                            {stats?.ataque.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter block">Capac. Saque</span>
                                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm tracking-widest">
                                            <Zap size={12} className="text-emerald-500/50" />
                                            {stats?.capacidade.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter block">Distância</span>
                                        <div className="flex items-center gap-2 text-neutral-400 font-mono text-sm tracking-widest">
                                            <Shield size={12} className="text-neutral-500/50" />
                                            {stats?.distancia} KM
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {missionType === 'transporte' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                    <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                                        <ShoppingCart size={12} className="text-sky-500" /> Carregamento de Recursos
                                    </h4>
                                    <div className="bg-black/60 p-4 rounded-xl border border-sky-500/10 space-y-3">
                                        {['suprimentos', 'combustivel', 'municoes', 'metal', 'energia'].map(res => (
                                            <div key={res} className="flex items-center justify-between gap-4">
                                                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest w-20">{res}</span>
                                                <input 
                                                    type="number" 
                                                    value={cargo[res]} 
                                                    onChange={e => handleCargoChange(res, parseInt(e.target.value))} 
                                                    className="bg-transparent border-b border-white/5 text-right font-military-mono text-[10px] text-white w-20 outline-none focus:border-sky-500/50"
                                                />
                                            </div>
                                        ))}
                                        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-[8px] font-black text-neutral-400 uppercase">Carga Total</span>
                                            <span className={`text-[10px] font-black font-military-mono ${totalCargo > (stats?.capacidade || 0) ? 'text-red-500' : 'text-sky-500'}`}>
                                                {totalCargo.toLocaleString()} / {stats?.capacidade.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="pt-6">
                            <Button 
                                className={`w-full py-6 font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 rounded-2xl ${
                                    hasTropasSelected 
                                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                }`}
                                disabled={!hasTropasSelected || isSending || (missionType === 'transporte' && totalCargo > (stats?.capacidade || 0))}
                                onClick={() => onEnviar({ 
                                    destino_id: destinoBase?.id || null, 
                                    destino_x: destinoBase?.coordenada_x, 
                                    destino_y: destinoBase?.coordenada_y, 
                                    tropas: selectedTropas, 
                                    tipo: missionType,
                                    general_id: mobilizarGeneral ? general?.id : null,
                                    ...cargo
                                })}
                            >
                                {isSending ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>{missionType === 'reforco' ? 'ENVIAR APOIO' : missionType === 'transporte' ? 'INICIAR COMBOIO' : 'AUTORIZAR INVASÃO'} <ChevronRight size={16} className="ml-2" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


