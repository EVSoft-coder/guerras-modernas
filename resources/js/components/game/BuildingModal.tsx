import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, Zap, Shield, Info, TrendingUp, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvolutionLevelAsset, calculateBuildingCost, calculateConstructionTime, calculateResourceProduction } from '@/lib/game-utils';

interface BuildingModalProps {
    isOpen: boolean;
    onClose: () => void;
    building: any;
    gameConfig: any;
    onUpgrade: (tipo: string) => void;
    isUpgrading: boolean;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ isOpen, onClose, building, gameConfig, onUpgrade, isUpgrading }) => {
    if (!building) return null;

    const buildingsConfig = gameConfig?.buildings || {};
    const config = buildingsConfig[building.tipo] || { 
        name: building.nome || 'Estrutura Desconhecida', 
        cost: {}, 
        time_base: 0, 
        description: 'Informação tática indisponível para este setor.' 
    };

    const nextLevel = (building.nivel || 0) + 1;
    
    const [currentTryLevel, setCurrentTryLevel] = useState(getEvolutionLevelAsset(building.nivel || 0));
    const [usePlaceholder, setUsePlaceholder] = useState(false);
    
    // Caminho da imagem de resiliência absoluta
    const blueprintUrl = "/images/building_blueprint_placeholder.png";
    const currentImage = usePlaceholder ? blueprintUrl : `/images/edificios/${building.tipo}/lvl_${currentTryLevel}.png`;

    // Reset de estado quando o edifício muda
    useEffect(() => {
        setCurrentTryLevel(getEvolutionLevelAsset(building.nivel || 0));
        setUsePlaceholder(false);
    }, [building.tipo, building.nivel]);

    const renderCost = (resourceType: string, baseAmount: number) => {
        if (!baseAmount) return null;
        
        const scaling = gameConfig?.scaling || 1.5;
        const totalCost = calculateBuildingCost(baseAmount, nextLevel, scaling);
        const playerAmount = building.base?.recursos?.[resourceType] || 0;
        const hasEnough = playerAmount >= totalCost;
        
        const resourceIcons: Record<string, string> = {
            'suprimentos': '📦',
            'combustivel': '⛽',
            'municoes': '🚀',
            'pessoal': '👤'
        };
        const resourceColors: Record<string, string> = {
            'suprimentos': 'text-sky-400',
            'combustivel': 'text-orange-400',
            'municoes': 'text-red-400',
            'pessoal': 'text-emerald-400'
        };

        return (
            <motion.div 
                key={resourceType}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between bg-black/40 p-3 rounded-xl border ${hasEnough ? 'border-white/5' : 'border-red-500/30'} group`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg group-hover:scale-110 transition-transform">{resourceIcons[resourceType] || '💎'}</span>
                    <span className="text-[9px] uppercase text-neutral-500 font-black tracking-widest">{resourceType}</span>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-mono font-black ${hasEnough ? resourceColors[resourceType] || 'text-sky-400' : 'text-red-500'}`}>
                        {totalCost.toLocaleString()}
                    </div>
                </div>
            </motion.div>
        );
    };

    // Obter bónus de produção
    const getProductionBonus = (lvl: number) => {
        const resKey = {
            'mina_suprimentos': 'suprimentos',
            'refinaria': 'combustivel',
            'fabrica_municoes': 'municoes',
            'posto_recrutamento': 'pessoal'
        }[building.tipo as string];

        if (!resKey) return null;

        const baseProd = gameConfig?.production?.[resKey] || 10;
        const speed = gameConfig?.speed?.resources || 1;
        const scaling = gameConfig?.scaling || 1.5;

        return calculateResourceProduction(baseProd, lvl, speed, scaling);
    };

    const currentBonus = getProductionBonus(building.nivel || 0);
    const nextBonus = getProductionBonus(nextLevel);
    
    // Cálculo de tempo real
    const constSpeed = gameConfig?.speed?.construction || 1;
    const totalTime = calculateConstructionTime(config.time_base, nextLevel, constSpeed);
    const timeFormatted = `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`;

    // Verificar se tem todos os recursos para o upgrade
    const canAfford = config.cost ? Object.entries(config.cost).every(([type, amount]: any) => {
        const cost = calculateBuildingCost(amount, nextLevel, gameConfig?.scaling || 1.5);
        return (building.base?.recursos?.[type] || 0) >= cost;
    }) : true;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-2xl bg-neutral-950/95 border-white/10 text-white overflow-hidden backdrop-blur-2xl p-0 rounded-2xl md:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)] max-h-[95vh] flex flex-col">
                <DialogDescription className="sr-only">
                    Interface tática para gestão do edifício {building?.nome}. Permite análise de custos, bónus de produção e autorização de melhorias estruturais.
                </DialogDescription>
                <AnimatePresence mode="wait">
                    {!building.tipo ? (
                        <div className="p-12 text-center space-y-4">
                            <AlertTriangle className="mx-auto text-orange-500 animate-pulse" size={48} />
                            <h3 className="text-xl font-black uppercase tracking-tighter">Erro de Telemetria</h3>
                            <p className="text-neutral-500 text-[10px] uppercase">Assinatura do edifício não reconhecida.</p>
                            <Button onClick={onClose} variant="outline" className="mt-4">Fechar</Button>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden"
                        >
                            {/* Lado Esquerdo: Visual & Status */}
                            <div className="w-full md:w-1/2 relative bg-gradient-to-br from-neutral-900 to-black p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                                <button 
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-neutral-500 hover:text-white md:hidden z-50 p-2"
                                >
                                    <X size={24} />
                                </button>
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                
                                <Badge className="absolute top-6 left-6 bg-sky-500/10 text-sky-400 border-sky-500/20 font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-2xl">
                                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                                    STATUS: OPERACIONAL
                                </Badge>

                                <motion.div
                                    initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
                                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                    className="relative mt-8 md:mt-0"
                                >
                                    <div className="absolute inset-0 bg-sky-500/20 blur-[40px] md:blur-[60px] rounded-full animate-pulse"></div>
                                    <img 
                                        src={currentImage} 
                                        className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(14,165,233,0.5)]" 
                                        alt="Preview"
                                        onError={() => {
                                            if (usePlaceholder) return;
                                            
                                            // Fallback Seguro
                                            if (currentTryLevel > 1) {
                                                setCurrentTryLevel(1);
                                            } else {
                                                setUsePlaceholder(true);
                                            }
                                        }}
                                    />
                                </motion.div>

                                <div className="mt-8 w-full space-y-4 z-10">
                                    <div className="text-center">
                                        <h2 className="text-sm font-black text-neutral-500 uppercase tracking-[0.3em]">Nível Estrutural</h2>
                                        <div className="text-6xl font-black text-white italic drop-shadow-lg">{building.nivel || 0}</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 justify-center">
                                        {[1,2,3,4,5,6].map(lvl => (
                                            <div key={lvl} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${lvl <= building.nivel ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Lado Direito: Inteligência & Logística */}
                            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-neutral-900/50">
                                <DialogHeader className="mb-4 md:mb-6">
                                    <div className="space-y-1">
                                        <DialogTitle className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                                            {config.name}
                                        </DialogTitle>
                                        <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Shield size={10} /> Setor de {building.tipo?.replace?.('_', ' ')?.toUpperCase?.() ?? 'ESTRUTURA'}
                                        </p>
                                    </div>
                                </DialogHeader>

                                {/* Dossiê Tático */}
                                <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto md:pr-2 custom-scrollbar">
                                    <div className="bg-black/40 p-5 rounded-2xl border-l-4 border-sky-600 flex gap-4 shadow-xl">
                                        <Info className="text-sky-500 shrink-0" size={16} />
                                        <p className="text-[10px] md:text-xs text-neutral-300 leading-relaxed italic">
                                            {config.description}
                                        </p>
                                    </div>

                                    {/* Comparativos de Inteligência */}
                                    {currentBonus && (
                                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                                            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 space-y-1">
                                                <span className="text-[8px] md:text-[9px] font-black text-neutral-500 uppercase tracking-widest">Capacidade Atual</span>
                                                <div className="text-sm md:text-xl font-mono font-black text-white">{currentBonus.toLocaleString()}/h</div>
                                            </div>
                                            <div className="bg-sky-600/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-sky-500/30 space-y-1">
                                                <span className="text-[8px] md:text-[9px] font-black text-sky-400 uppercase tracking-widest">Nível Seguinte</span>
                                                <div className="text-sm md:text-xl font-mono font-black text-sky-400 flex items-center gap-1">
                                                    <TrendingUp size={14} md:size={16} /> {nextBonus?.toLocaleString()}/h
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Para edifícios não produtores (Quartel, etc) mostrar um bónus tático genérico */}
                                    {!currentBonus && (
                                        <div className="grid grid-cols-1 gap-3 md:gap-4">
                                            <div className="bg-orange-600/10 p-4 rounded-2xl border border-orange-500/20 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block">Potencial Estratégico</span>
                                                    <span className="text-xs text-neutral-400">Desbloqueia novas tecnologias e unidades de elite.</span>
                                                </div>
                                                <Zap className="text-orange-500" size={24} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Logística de Recursos */}
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <h4 className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-2">
                                                <Hammer size={10} md:size={12} className="text-orange-500" /> Logística de Campanha
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-orange-500 uppercase font-mono">
                                                <Clock size={10} md:size={12} /> {timeFormatted}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 md:gap-3">
                                            {config.cost ? Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount)) : null}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-6 md:mt-8">
                                    <Button 
                                        onClick={() => onUpgrade(building.tipo)}
                                        disabled={isUpgrading || !canAfford}
                                        className={`w-full font-black uppercase tracking-[0.15em] md:tracking-[0.2em] py-6 md:py-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 group transition-all shadow-2xl ${
                                            canAfford 
                                                ? 'bg-sky-600 hover:bg-sky-500 text-white border-t border-white/20 shadow-sky-900/40' 
                                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border-none'
                                        }`}
                                    >
                                        <span className="text-base md:text-xl group-hover:translate-x-1 transition-transform">
                                            {isUpgrading ? 'AUTORIZANDO...' : (canAfford ? 'MELHORAR ESTRUTURA' : 'RECURSOS INSUFICIENTES')}
                                        </span>
                                        {!isUpgrading && canAfford && <ChevronRight className="group-hover:translate-x-2 transition-transform" size={16} md:size={20} />}
                                        {!canAfford && !isUpgrading && <AlertTriangle size={16} />}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};
