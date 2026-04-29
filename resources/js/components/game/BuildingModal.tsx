import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, Zap, Shield, Info, TrendingUp, AlertTriangle, ChevronRight, X, Loader2, Target as Sword, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logger } from '../../../../src/core/Logger';
import { getEvolutionLevelAsset, calculateBuildingCost, calculateConstructionTime, calculateResourceProduction, parseResourceValue } from '@/lib/game-utils';
import { getBuildingAsset, getUnitAsset } from '@/utils/assetMapper';
import { MarketPanel } from './MarketPanel';

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
    resources: any;
    nobleInfo?: any;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ 
    isOpen, onClose, building, gameConfig, 
    onUpgrade, onTrain, isUpgrading, isTraining, population, unitTypes, resources, nobleInfo
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
    const isBuilt = (building.nivel || 0) > 0;
    
    const [usePlaceholder, setUsePlaceholder] = useState(false);
    const [trainQty, setTrainQty] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

    const currentImage = usePlaceholder ? getBuildingAsset(building.buildingType, 'blueprint') : getBuildingAsset(building.buildingType, isBuilt ? getEvolutionLevelAsset(building.nivel) : 1);

    useEffect(() => {
        if (building) {
            setTrainQty(1);
            setSelectedUnit(null);
        }
        setUsePlaceholder(false);
    }, [building.buildingType, building.nivel]);

    const renderCost = (resourceType: string, baseAmount: number) => {
        if (!baseAmount) return null;
        const totalCost = calculateBuildingCost(baseAmount, building.nivel || 0);
        const playerAmount = parseResourceValue(resources?.[resourceType] || 0);
        const hasEnough = playerAmount >= totalCost;
        
        const resourceIcons: Record<string, string> = { 'suprimentos': '📦', 'combustivel': '⛽', 'municoes': '🚀', 'pessoal': '👤' };
        const resourceColors: Record<string, string> = { 'suprimentos': 'text-sky-400', 'combustivel': 'text-orange-400', 'municoes': 'text-red-400', 'pessoal': 'text-emerald-400' };

        return (
            <div key={resourceType} className={`flex items-center justify-between bg-black/40 p-4 rounded-3xl border ${hasEnough ? 'border-white/5' : 'border-red-500/30'} group transition-all hover:bg-white/[0.02]`}>
                <div className="flex items-center gap-3">
                    <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{resourceIcons[resourceType] || '💎'}</span>
                    <span className="text-[9px] uppercase text-neutral-500 font-black tracking-[0.2em]">{resourceType}</span>
                </div>
                <div className={`text-xs font-military-mono font-black ${hasEnough ? resourceColors[resourceType] : 'text-red-500'}`}>
                    {totalCost.toLocaleString()}
                </div>
            </div>
        );
    };

    const totalTime = calculateConstructionTime(config.time_base, building.nivel || 0);
    const timeFormatted = `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`;

    const canAfford = config.cost ? Object.entries(config.cost).every(([type, amount]) => {
        const cost = calculateBuildingCost(type === 'pessoal' ? 0 : amount as number, building.nivel || 0);
        return type === 'pessoal' ? (population?.available ?? 0) >= (amount as number) : parseResourceValue(resources?.[type] || 0) >= cost;
    }) : true;

    const tipoLower = building.buildingType?.toLowerCase();
    const isAcademy = tipoLower === 'academia_militar';
    const isMilitary = ['hq', 'quartel', 'aerodromo', 'radar_estrategico', 'fabrica_municoes'].includes(tipoLower);
    
    const availableUnits = isMilitary ? (unitTypes || []).filter((ut, index, self) => {
        // 1. Evitar duplicados
        const isDuplicate = self.findIndex(t => 
            (t.name.toLowerCase() === ut.name.toLowerCase()) || 
            (t.slug && ut.slug && t.slug === ut.slug)
        ) !== index;
        
        if (isDuplicate) return false;

        // 2. Unidade específica: Político (Nobre)
        // No Tribal Wars, ele é recrutado na Academia. 
        // Mas o USER pediu especificamente para ser no HQ se chegar a um certo nível.
        if (ut.name.toLowerCase().includes('politico')) {
            if (tipoLower !== 'hq') return false;
            // Verificar requisitos no config ou Hardcoded (HQ 20 + Academia 1)
            const hqLevel = building.buildingType === 'hq' ? building.nivel : 0;
            const academy = (building.base?.edificios || []).find((b: any) => b.buildingType === 'academia_militar');
            const academyLevel = academy?.nivel || 0;
            return hqLevel >= 20 && academyLevel >= 1;
        }

        // 3. Outras unidades (Quartel, Fábrica, etc.)
        if (ut.building_type) {
            if (ut.building_type === 'fabrica_municoes' && tipoLower === 'fabrica_municoes') return true;
            return ut.building_type === building.buildingType;
        }

        // 4. Fallback: Filtro por nome
        const k = ut.name.toLowerCase();
        if (tipoLower === 'quartel') return ['infantaria', 'sniper', 'engenheiro'].some(s => k.includes(s));
        if (tipoLower === 'fabrica_municoes') return ['blindado', 'tanque', 'artilharia', 'apc', 'veiculo'].some(s => k.includes(s));
        if (tipoLower === 'aerodromo') return ['helicoptero'].some(s => k.includes(s));
        if (tipoLower === 'radar_estrategico') return ['agente', 'espiao', 'drone'].some(s => k.includes(s));
        return false;
    }) : [];
    
    const isMarket = ['mercado', 'logistica', 'hub_de_comercio', 'armazem'].includes(tipoLower);

    useEffect(() => {
        if (isMilitary && availableUnits.length > 0 && !selectedUnit) setSelectedUnit(availableUnits[0].name);
    }, [building.buildingType, isMilitary, availableUnits]);

    const getImpactValue = (type: string, level: number) => {
        if (level <= 0) return 'Inativo';
        const typeLower = type.toLowerCase();
        
        // Produção de Recursos
        const prodConfig = gameConfig?.production?.[typeLower];
        if (prodConfig) {
            const val = calculateResourceProduction(prodConfig.base, level, prodConfig.factor);
            return `+${val.toLocaleString()}/h`;
        }

        // Casos Específicos
        switch (typeLower) {
            case 'hq':
                return `-${(level * 3)}% Tempo Const.`;
            case 'muralha':
                return `+${(level * 5)}% Bónus Def.`;
            case 'posto_recrutamento':
                return `-${(level * 2)}% Tempo Treino`;
            case 'centro_pesquisa':
                return `-${(level * 4)}% Tempo Pesq.`;
            case 'mercado':
                return `+${level} Comerciantes`;
            case 'parlamento':
                return `+${(level * 10)}% Influência`;
            default:
                return `Nível Operacional ${level}`;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] p-0 bg-transparent border-none overflow-hidden flex flex-col pointer-events-auto shadow-none">
                {/* Global Backdrop */}
                <div className="absolute inset-0 bg-[#050608]/95 backdrop-blur-3xl z-0 rounded-[3rem] border border-white/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-0 pointer-events-none rounded-[3rem]" />
                
                {/* Premium Header */}
                <DialogHeader className="relative z-10 px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] flex-row space-y-0">
                    <div className="flex items-center gap-8">
                        <div className={`p-5 rounded-[2rem] border-2 backdrop-blur-xl ${isBuilt ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                            {isBuilt ? <Shield size={32} /> : <Activity size={32} />}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4 mb-2">
                                <DialogTitle className="text-4xl font-black uppercase text-white tracking-tighter leading-none">
                                    {config.name}
                                </DialogTitle>
                                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                                    NÍVEL_{building.nivel?.toString().padStart(2, '0')}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isBuilt ? 'bg-sky-500' : 'bg-orange-500'}`} />
                                    {isBuilt ? 'Setor Operacional Ativo' : 'Pendente de Mobilização'}
                                </span>
                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">Protocolo_{tipoLower}_v3.9</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-3xl transition-all border border-transparent hover:border-white/10 group">
                        <X className="text-neutral-500 group-hover:text-white" size={32} />
                    </button>
                </DialogHeader>

                <div className="relative z-10 flex-1 overflow-hidden flex">
                    {/* Left Column: Visual & Intel */}
                    <div className="w-[450px] border-r border-white/5 p-12 space-y-12 overflow-y-auto custom-scrollbar bg-black/20">
                        <div className="relative aspect-square rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] group/img">
                            <img 
                                src={currentImage} 
                                className={`w-full h-full object-cover transition-all duration-1000 group-hover/img:scale-110 ${isBuilt ? '' : 'grayscale contrast-125 opacity-40'}`}
                                onError={() => setUsePlaceholder(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            
                            {/* Visual Level indicator */}
                            <div className="absolute bottom-8 right-8 flex flex-col items-end">
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-1">AUTH_LEVEL</span>
                                <span className="text-7xl font-black text-white font-military-mono italic tracking-tighter leading-none opacity-80">
                                    {(building.nivel || 0).toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Info size={16} className="text-sky-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Relatório de Operações</h3>
                            </div>
                            <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 shadow-inner">
                                <DialogDescription className="text-neutral-400 text-sm leading-relaxed font-medium">
                                    {config.description}
                                </DialogDescription>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp size={16} className="text-sky-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Impacto no Setor</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest block mb-1">ATUAL</span>
                                    <span className="text-sm font-black text-white">{getImpactValue(building.buildingType, building.nivel)}</span>
                                </div>
                                <div className="p-6 bg-sky-500/5 rounded-3xl border border-sky-500/10">
                                    <span className="text-[9px] font-black text-sky-500/60 uppercase tracking-widest block mb-1">PROX_NÍVEL</span>
                                    <span className="text-sm font-black text-sky-400">{getImpactValue(building.buildingType, nextLevel)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Operations & Actions */}
                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
                        {isMarket ? (
                            <MarketPanel resources={resources} building={building} gameConfig={gameConfig} />
                        ) : (
                            <>
                                {/* Upgrade Section */}
                                <div className="tactical-panel p-10 space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-8 bg-sky-500 rounded-full" />
                                            <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Engenharia e Expansão</h3>
                                        </div>
                                        <div className="flex items-center gap-4 px-6 py-3 bg-black/40 rounded-full border border-white/10 shadow-inner">
                                            <Clock size={16} className="text-sky-400" />
                                            <span className="text-sm font-black font-military-mono text-neutral-300">{timeFormatted}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {Object.entries(config.cost || {}).map(([type, amount]) => renderCost(type, amount as number))}
                                    </div>

                                    <Button 
                                        className={`w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 relative overflow-hidden group/btn ${canAfford && !isUpgrading ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-[0_20px_60px_-10px_rgba(14,165,233,0.4)]' : 'bg-white/5 text-neutral-700 border border-white/5 cursor-not-allowed opacity-50'}`}
                                        disabled={!canAfford || isUpgrading}
                                        onClick={() => onUpgrade(building.buildingType)}
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-4">
                                            {isUpgrading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Sincronizando Protocolos...
                                                </>
                                            ) : (
                                                <>
                                                    {canAfford ? 'Autorizar Mobilização Nível_' + nextLevel : 'Logística Crítica: Recursos Insuficientes'}
                                                    <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                        {canAfford && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />}
                                    </Button>
                                </div>

                                {/* Military Section */}
                                {isMilitary && (
                                    <div className="tactical-panel p-10 space-y-10 bg-emerald-500/[0.02] border-emerald-500/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                                            <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Centro de Mobilização Militar</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            {availableUnits.map(unit => (
                                                <button 
                                                    key={unit.id}
                                                    onClick={() => setSelectedUnit(unit.name)}
                                                    className={`p-6 rounded-[2.5rem] border transition-all duration-500 flex items-center gap-6 relative overflow-hidden group ${selectedUnit === unit.name ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_25px_50px_rgba(16,185,129,0.15)] scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}
                                                >
                                                    <div className="relative">
                                                        <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity ${selectedUnit === unit.name ? 'opacity-40 bg-emerald-500' : 'bg-white'}`} />
                                                        <img src={getUnitAsset(unit.name)} className="w-16 h-16 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" alt={unit.name} />
                                                    </div>
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="text-xs font-black uppercase text-white tracking-widest">{unit.name}</span>
                                                        <span className="text-[10px] font-black font-military-mono text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                                                            <Clock size={10} /> {unit.build_time}S
                                                        </span>
                                                    </div>
                                                    {selectedUnit === unit.name && (
                                                        <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {selectedUnit && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 20 }}
                                                    className="bg-black/60 p-10 rounded-[3rem] border border-white/5 space-y-8 relative overflow-hidden shadow-inner"
                                                >
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase font-black text-neutral-600 tracking-[0.5em] mb-2">QUOTA_DE_MOBILIZAÇÃO</span>
                                                            <div className="flex items-center gap-4">
                                                                <Sword size={24} className="text-emerald-500/40" />
                                                                <span className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest">SISTEMA_AGUARDANDO_QUANTIDADE</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <input 
                                                                type="number" 
                                                                value={trainQty} 
                                                                onChange={e => setTrainQty(Math.max(1, parseInt(e.target.value)))} 
                                                                className="bg-transparent border-none text-right font-military-mono text-emerald-400 font-black text-6xl w-48 focus:ring-0" 
                                                            />
                                                            <div className="h-1 w-full bg-emerald-500/20 rounded-full mt-2" />
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        onClick={() => onTrain(selectedUnit, trainQty)} 
                                                        disabled={isTraining} 
                                                        className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] shadow-[0_25px_60px_rgba(16,185,129,0.3)] active:scale-95 transition-all group/btn relative overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                                        <span className="relative z-10 flex items-center justify-center gap-6">
                                                            {isTraining ? <Loader2 size={24} className="animate-spin" /> : <Sword size={24} />}
                                                            CONFIRMAR_ORDEM_OPERACIONAL
                                                        </span>
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Academia Militar: Cunhagem de Moedas */}
                                {isAcademy && (
                                    <div className="tactical-panel p-10 space-y-10 bg-sky-500/[0.02] border-sky-500/10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-8 bg-sky-500 rounded-full" />
                                                <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Cunhagem de Moedas de Ouro</h3>
                                            </div>
                                            <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-white/10 shadow-inner">
                                                <Cpu size={16} className="text-sky-400" />
                                                <span className="text-xs font-black uppercase tracking-widest text-neutral-300">Moedas_Atuais: {nobleInfo?.moedas || 0}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
                                                    <p className="text-neutral-400 text-sm leading-relaxed">
                                                        As moedas de ouro são necessárias para aumentar a capacidade de treino de Líderes Políticos. 
                                                        Quanto mais moedas cunhar, mais slots de conquista terá disponíveis.
                                                    </p>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5">
                                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Capacidade Atual</span>
                                                        <span className="text-xl font-black text-white">{nobleInfo?.capacidade || 0} Líderes</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5">
                                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Em Uso / Ocupados</span>
                                                        <span className="text-xl font-black text-orange-500">{nobleInfo?.emUso || 0} Slots</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-6 bg-sky-500/10 rounded-3xl border border-sky-500/20">
                                                        <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Moedas p/ Próximo Slot</span>
                                                        <span className="text-xl font-black text-sky-400">{nobleInfo?.moedasParaProximo || 0} Moedas</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* Custos da Moeda (Fixos TW Style) */}
                                                    {[
                                                        { res: 'suprimentos', amount: 28000, icon: '📦' },
                                                        { res: 'combustivel', amount: 30000, icon: '⛽' },
                                                        { res: 'municoes', amount: 25000, icon: '🚀' }
                                                    ].map(cost => {
                                                        const playerAmount = parseResourceValue(resources?.[cost.res] || 0);
                                                        const hasEnough = playerAmount >= cost.amount;
                                                        return (
                                                            <div key={cost.res} className={`flex items-center justify-between bg-black/40 p-4 rounded-3xl border ${hasEnough ? 'border-white/5' : 'border-red-500/30'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm">{cost.icon}</span>
                                                                    <span className="text-[9px] uppercase text-neutral-500 font-black tracking-widest">{cost.res}</span>
                                                                </div>
                                                                <span className={`text-xs font-military-mono font-black ${hasEnough ? 'text-white' : 'text-red-500'}`}>
                                                                    {cost.amount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <Button 
                                                    onClick={() => router.post('/academy/mint', {})} 
                                                    className="w-full h-24 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] shadow-[0_25px_60px_rgba(14,165,233,0.3)] active:scale-95 transition-all group/btn relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                                    <span className="relative z-10 flex items-center justify-center gap-6">
                                                        <Zap size={24} />
                                                        CUNHAR_MOEDA_DE_OURO
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
