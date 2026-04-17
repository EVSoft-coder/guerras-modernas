import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, Zap, Shield, Info, TrendingUp, AlertTriangle, ChevronRight, X, Loader2, Target as Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logger } from '../../../../src/core/Logger';
import { getEvolutionLevelAsset, calculateBuildingCost, calculateConstructionTime, calculateResourceProduction, parseResourceValue } from '@/lib/game-utils';
import { getBuildingAsset } from '@/utils/assetMapper';

interface BuildingModalProps {
    isOpen: boolean;
    onClose: () => void;
    building: any;
    gameConfig: any;
    onUpgrade: (buildingType: string) => void;
    onTrain: (unidade: string, quantidade: number) => void;
    isUpgrading: boolean;
    isTraining: boolean;
    population: any;
    unitTypes?: any[];
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ 
    isOpen, onClose, building, gameConfig, 
    onUpgrade, onTrain, isUpgrading, isTraining, population, unitTypes
}) => {
    if (!building) return null;

    const buildingsConfig = gameConfig?.buildings || {};
    const config = buildingsConfig[building.buildingType] || { 
        name: building.nome || 'Estrutura Desconhecida', 
        cost: {}, 
        time_base: 0, 
        description: 'Informação tática indisponível para este setor.' 
    };

    const nextLevel = (building.nivel || 0) + 1;
    
    const mapToAssetLevel = (lvl: number) => {
        return getEvolutionLevelAsset(lvl);
    };

    const currentTryLevel = mapToAssetLevel(building.nivel || 0);
    const [usePlaceholder, setUsePlaceholder] = useState(false);
    const [trainQty, setTrainQty] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    
    const isBuilt = (building.nivel || 0) > 0;
    const blueprintUrl = getBuildingAsset(building.buildingType, 'blueprint');
    const currentImage = usePlaceholder ? blueprintUrl : getBuildingAsset(building.buildingType, isBuilt ? currentTryLevel : 1);

    // Reset de estado quando o edifício muda
    useEffect(() => {
        if (building) {
            Logger.building('MODAL_OPEN', building);
            setTrainQty(1);
            setSelectedUnit(null);
        }
        setUsePlaceholder(false);
    }, [building.buildingType, building.nivel]);

    const renderCost = (resourceType: string, baseAmount: number) => {
        if (!baseAmount) return null;
        
        const scaling = gameConfig?.scaling || 1.5;
        const totalCost = calculateBuildingCost(baseAmount, building.nivel || 0, scaling);
        const playerAmount = parseResourceValue(building.base?.recursos?.[resourceType] || 0);
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

    // Bonus de produção tática removidos do frontend (devem vir do backend no futuro)
    const currentBonus = null;
    const nextBonus = null;
    
    // Cálculo de tempo real
    const constSpeed = gameConfig?.speed?.construction || 1;
    const totalTime = calculateConstructionTime(config.time_base, building.nivel || 0, constSpeed);
    const timeFormatted = `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`;

    // Verificar se tem todos os recursos para o upgrade
    const canAffordResources = config.cost ? Object.entries(config.cost).every(([type, amount]) => {
        const cost = calculateBuildingCost(type === 'pessoal' ? 0 : amount as number, building.nivel || 0, gameConfig?.scaling || 1.5);
        if (type === 'pessoal') return true; // Pessoal é verificado em separado (cap de população)
        return parseResourceValue(building.base?.recursos?.[type] || 0) >= cost;
    }) : true;

    const popCost = config.cost?.pessoal || 0;
    const hasPopulation = (population?.available ?? 0) >= popCost;
    
    const canAfford = canAffordResources && hasPopulation;

    const tipoLower = building.buildingType?.toLowerCase();
    const isMilitary = ['quartel', 'aerodromo'].includes(tipoLower);
    
    const isAvailable = (key: string) => {
        const k = key.toLowerCase();
        if (tipoLower === 'quartel') return ['infantaria', 'blindado', 'tanque', 'agente', 'politico'].some(s => k.includes(s));
        if (tipoLower === 'aerodromo') return ['helicoptero', 'drone'].some(s => k.includes(s));
        return false;
    };

    const availableUnits = isMilitary ? (unitTypes || []).filter(ut => isAvailable(ut.name)) : [];

    // Escolher a primeira unidade por defeito quando o modal abre num edifício militar
    useEffect(() => {
        if (isMilitary && availableUnits.length > 0 && !selectedUnit) {
            setSelectedUnit(availableUnits[0].name);
        }
    }, [building.buildingType, isMilitary, availableUnits]);

    const renderUnitCard = (unit: any) => {
        const isSelected = selectedUnit === unit.name;
        return (
            <motion.div 
                key={unit.id}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setSelectedUnit(unit.name)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                    isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
            >
                {isSelected && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500 text-black flex items-center justify-center rounded-bl-xl"><Sword size={12} /></div>}
                
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase text-white tracking-widest">{unit.name}</span>
                        <span className="text-[8px] text-neutral-500 font-bold uppercase">{unit.build_time}s Mobilização</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-white/5 mt-1">
                    <div className="flex flex-col">
                        <span className="text-[7px] text-neutral-600 font-black uppercase">Atk</span>
                        <span className="text-[10px] font-mono font-black text-red-500">{unit.attack}</span>
                    </div>
                    <div className="flex flex-col border-x border-white/5 px-2">
                        <span className="text-[7px] text-neutral-600 font-black uppercase">Def</span>
                        <span className="text-[10px] font-mono font-black text-sky-400">{unit.defense}</span>
                    </div>
                    <div className="flex flex-col pl-2">
                        <span className="text-[7px] text-neutral-600 font-black uppercase">Cap</span>
                        <span className="text-[10px] font-mono font-black text-orange-400">{unit.carry_capacity || 0}</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-2xl bg-neutral-950/95 border-white/10 text-white overflow-hidden backdrop-blur-2xl p-0 rounded-2xl md:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)] max-h-[95vh] flex flex-col">
                <DialogDescription className="sr-only">
                    Interface tática para gestão do edifício {building?.nome}. Permite análise de custos, bónus de produção e autorização de melhorias estruturais.
                </DialogDescription>
                <AnimatePresence mode="wait">
                    {!building.buildingType ? (
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
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></di                                 <Badge className={`absolute top-6 left-6 ${building.nivel === 0 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-sky-500/20 text-sky-400 border-sky-500/30'} font-black px-4 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md`}>
                                    <span className={`w-2 h-2 ${building.nivel === 0 ? 'bg-orange-400 shadow-[0_0_8px_#fb923c]' : 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'} rounded-full animate-pulse`}></span>
                                    {building.nivel === 0 ? 'STATUS: EM PLANEAMENTO' : 'STATUS: OPERACIONAL'}
                                </Badge>

                                <motion.div
                                    initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
                                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                    className="relative mt-8 md:mt-0 group"
                                >
                                    <div className="absolute inset-0 bg-sky-500/10 blur-[60px] md:blur-[100px] rounded-full animate-pulse group-hover:bg-sky-400/20 transition-all duration-700"></div>
                                    <img 
                                        src={currentImage} 
                                        className="w-56 h-56 md:w-72 md:h-72 object-contain relative z-10 drop-shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-transform duration-700 group-hover:scale-110" 
                                        alt="Preview"
                                        onError={() => {
                                            if (!usePlaceholder) {
                                                setUsePlaceholder(true);
                                            }
                                        }}
                                    />
                                </motion.div>

                                <div className="mt-12 w-full space-y-6 z-10">
                                    <div className="text-center relative">
                                        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] mb-2 opacity-50">Assinatura de Nível</h2>
                                        <div className="relative inline-block">
                                            <div className="text-8xl font-black text-white italic tracking-tighter leading-none select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                                {building.nivel || 0}
                                            </div>
                                            <div className="absolute -inset-2 bg-gradient-to-t from-sky-500/10 to-transparent blur-xl -z-10"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 justify-center">
                                        {[1,2,3,4,5,6,7,8,9,10].map(lvl => (
                                            <div 
                                                key={lvl} 
                                                className={`h-1 rounded-full transition-all duration-700 ${
                                                    lvl <= building.nivel 
                                                        ? (lvl <= 3 ? 'w-8 bg-sky-500 shadow-[0_0_10px_#0ea5e9]' : 'w-8 bg-emerald-500 shadow-[0_0_10px_#10b981]') 
                                                        : 'w-4 bg-white/5'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Lado Direito: Inteligência & Logística */}
                            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-neutral-900/30 backdrop-blur-md">
                                <DialogHeader className="mb-6 md:mb-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-[2px] bg-sky-500"></div>
                                            <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.3em]">{building.buildingType?.replace?.('_', ' ') ?? 'ESTRUTURA'}</span>
                                        </div>
                                        <DialogTitle className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                                            {config.name}
                                        </DialogTitle>
                                    </div>
                                </DialogHeader>

                                {/* Dossiê Tático */}
                                <div className="space-y-6 md:space-y-8 flex-1 overflow-y-auto md:pr-4 custom-scrollbar">
                                    <div className="relative">
                                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] group hover:border-sky-500/20 transition-colors">
                                            <div className="p-3 bg-sky-500/10 rounded-xl h-fit">
                                                <Info className="text-sky-500" size={18} />
                                            </div>
                                            <p className="text-[11px] md:text-xs text-neutral-400 leading-relaxed font-medium">
                                                {config.description}
                                            </p>
                                        </div>
                                        <div className="absolute -left-1 top-4 bottom-4 w-1 bg-sky-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
                                    </div>

                                    {/* Seção Militar / Recrutamento Premium */}
                                    {isMilitary ? (
                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-3">
                                                    <div className="p-1.5 bg-sky-500/20 rounded-md">
                                                        <Shield className="text-sky-500" size={12} />
                                                    </div> 
                                                    Mobilização de Ativos
                                                </h4>
                                                <div className="h-px bg-gradient-to-r from-sky-500/30 to-transparent mt-2"></div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {availableUnits.map(renderUnitCard)}
                                            </div>
                                            
                                            {selectedUnit && (
                                                <div className="bg-black/60 p-6 rounded-2xl space-y-5 border border-white/5 shadow-2xl relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Sword size={80} className="text-emerald-500" />
                                                    </div>

                                                    <div className="flex items-center justify-between relative z-10">
                                                        <span className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Contingente Operacional</span>
                                                        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                                                            <button 
                                                                onClick={() => setTrainQty(Math.max(1, trainQty - 10))} 
                                                                className="text-neutral-500 hover:text-sky-400 transition-colors font-black"
                                                            >-</button>
                                                            <input 
                                                                type="number" 
                                                                value={trainQty} 
                                                                onChange={(e) => setTrainQty(Math.max(1, parseInt(e.target.value) || 1))}
                                                                className="w-16 bg-transparent border-none focus:ring-0 p-0 text-center font-mono text-sm text-sky-400 font-bold"
                                                            />
                                                            <button 
                                                                onClick={() => setTrainQty(trainQty + 10)} 
                                                                className="text-neutral-500 hover:text-sky-400 transition-colors font-black"
                                                            >+</button>
                                                        </div>
                                                    </div>

                                                    <Button 
                                                        onClick={() => selectedUnit && onTrain(selectedUnit, trainQty)}
                                                        disabled={isTraining}
                                                        className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-[0_10px_20px_rgba(5,150,105,0.3)] flex items-center justify-center gap-3 transition-all active:scale-95 group"
                                                    >
                                                        {isTraining ? <Loader2 size={16} className="animate-spin" /> : <Sword size={16} className="group-hover:rotate-12 transition-transform" />}
                                                        {isTraining ? 'A RECRUTAR...' : 'AUTORIZAR MOBILIZAÇÃO'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-3">
                                                     <div className="p-1.5 bg-orange-500/20 rounded-md">
                                                        <Hammer className="text-orange-500" size={12} />
                                                    </div>
                                                    Logística de Expansão
                                                </h4>
                                                <Badge className="bg-orange-500/10 text-orange-500 border-none font-mono text-[10px] px-3 py-1">
                                                    <Clock size={10} className="mr-2 inline" /> ETA: {timeFormatted}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {config.cost ? Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount)) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="mt-8 md:mt-12">
                                    <Button 
                                        onClick={() => onUpgrade(building.buildingType)}
                                        disabled={isUpgrading || !canAfford}
                                        className={`w-full h-20 md:h-24 font-black uppercase tracking-[0.25em] py-8 rounded-2xl flex flex-col items-center justify-center gap-1 group transition-all shadow-2xl overflow-hidden relative ${
                                            canAfford 
                                                ? (building.nivel === 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40' : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/40') 
                                                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed border-none opacity-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 z-10">
                                            {isUpgrading && <Loader2 size={18} className="animate-spin" />}
                                            <span className="text-lg md:text-xl">
                                                {isUpgrading 
                                                     ? 'INICIALIZANDO...' 
                                                     : (canAfford 
                                                         ? (building.nivel === 0 ? 'CONSTRUIR AGORA' : `MODERNIZAR PARA LVL ${building.nivel + 1}`) 
                                                         : 'CAPACIDADE INSUFICIENTE'
                                                       )
                                                 }
                                            </span>
                                            {!isUpgrading && canAfford && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                        </div>
                                        {!canAfford && !isUpgrading && (
                                            <span className="text-[8px] opacity-60 tracking-widest z-10">
                                                {!hasPopulation ? 'AVISO: REQUISITO POPULACIONAL NÃO ATINGIDO' : 'ERRO: FALTA DE RECURSOS EM STOCK'}
                                            </span>
                                        )}
                                        
                                        {/* Efeito de brilho no hover */}
                                        {canAfford && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                        )}
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
