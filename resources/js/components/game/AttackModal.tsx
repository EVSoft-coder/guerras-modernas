import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Zap, Shield, Sword, Search, Flag, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttackModalProps {
    isOpen: boolean;
    onClose: () => void;
    origemBase: any;
    destinoBase: any;
    tropasDisponiveis: any[];
    onEnviar: (params: { destino_id: number | null; destino_x?: number; destino_y?: number; tropas: Record<string, number>; tipo: string }) => void;
    isSending: boolean;
    gameConfig: any;
}

export const AttackModal: React.FC<AttackModalProps> = ({ 
    isOpen, onClose, origemBase, destinoBase, tropasDisponiveis, onEnviar, isSending, gameConfig 
}) => {
    const [selectedTropas, setSelectedTropas] = useState<Record<string, number>>({});
    const [missionType, setMissionType] = useState<string>('ataque');

    // Inicializar tropas selecionadas se vazio
    useMemo(() => {
        if (isOpen) {
            const initial: Record<string, number> = {};
            tropasDisponiveis.forEach(t => {
                initial[t.unidade] = 0;
            });
            setSelectedTropas(initial);
            setMissionType('ataque');
        }
    }, [isOpen]);

    const handleTropaChange = (unidade: string, value: number) => {
        setSelectedTropas(prev => ({ ...prev, [unidade]: value }));
    };

    const hasTropasSelected = Object.values(selectedTropas).some(v => v > 0);

    // Cálculos Tácticos
    const stats = useMemo(() => {
        if (!destinoBase || !origemBase) return null;
        
        const dx = destinoBase.coordenada_x - origemBase.coordenada_x;
        const dy = destinoBase.coordenada_y - origemBase.coordenada_y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        // Encontrar unidade mais lenta
        let minSpeed = 999;
        let totalAttack = 0;
        let totalCapacity = 0;
        
        Object.entries(selectedTropas).forEach(([unidade, qtd]) => {
            if (qtd > 0) {
                const config = gameConfig?.units?.[unidade] || {};
                if (config.speed < minSpeed) minSpeed = config.speed;
                totalAttack += qtd * (config.attack || 0);
                totalCapacity += qtd * (config.capacity || 0);
            }
        });

        if (minSpeed === 999) minSpeed = 10;

        // Formula igual ao GameService
        const speedTravel = gameConfig?.speed?.travel || 1;
        const segundos = Math.max(30, (distancia * 100) / (minSpeed * speedTravel));

        return {
            distancia: distancia.toFixed(1),
            tempo: Math.floor(segundos),
            ataque: totalAttack,
            capacidade: totalCapacity
        };
    }, [destinoBase, origemBase, selectedTropas]);

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
                                const isArmored = ['tanque_combate', 'blindado_apc', 'helicoptero_ataque'].includes(tropa.unidade);
                                return (
                                    <div key={tropa.unidade} className="space-y-2 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-wide text-neutral-300 group-hover:text-sky-400 transition-colors">
                                                    {(tropa.unidade || 'Desconhecida').replace(/_/g, ' ')}
                                                </span>
                                                <span className={`text-[7px] font-black ${isArmored ? 'text-orange-500' : 'text-emerald-500'} uppercase`}>
                                                    {isArmored ? 'UNIT: ARMORED' : 'UNIT: INFANTRY'}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] bg-sky-500/10 border-sky-500/20 text-sky-400 font-mono">
                                                {selectedTropas[tropa.unidade] || 0} / {tropa.quantidade}
                                            </Badge>
                                        </div>
                                        <input 
                                            type="range"
                                            min="0"
                                            max={tropa.quantidade}
                                            step="1"
                                            value={selectedTropas[tropa.unidade] || 0}
                                            onChange={(e) => handleTropaChange(tropa.unidade, parseInt(e.target.value))}
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
                            <div>
                                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Protocolo de Operação</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'ataque', icon: <Sword size={14} />, label: 'SAQUE' },
                                        { id: 'espionagem', icon: <Search size={14} />, label: 'ESP' },
                                        { id: 'conquista', icon: <Flag size={14} />, label: 'CONQ' },
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
                        </div>

                        <div className="pt-6">
                            <Button 
                                className={`w-full py-6 font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 rounded-2xl ${
                                    hasTropasSelected 
                                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                }`}
                                disabled={!hasTropasSelected || isSending}
                                onClick={() => onEnviar({ 
                                    destino_id: destinoBase?.id || null, 
                                    destino_x: destinoBase?.coordenada_x, 
                                    destino_y: destinoBase?.coordenada_y, 
                                    tropas: selectedTropas, 
                                    tipo: missionType 
                                })}
                            >
                                {isSending ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>AUTORIZAR INVASÃO <ChevronRight size={16} className="ml-2" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


